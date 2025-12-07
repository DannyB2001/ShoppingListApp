import dataStore from "../dataStore.js";
import { assertId, buildDtoOut, cloneDeep } from "../utils.js";

function findList(dtoIn) {
  assertId(dtoIn, "shoppingList/get");
  const list = dataStore.shoppingLists.find((item) => item.id === dtoIn.id);
  if (!list) {
    throw new Error(`shoppingList ${dtoIn.id} not found`);
  }
  return list;
}

export async function listShoppingLists(dtoIn = {}) {
  return buildDtoOut({
    shoppingLists: cloneDeep(
      dataStore.shoppingLists.filter((list) =>
        dtoIn.includeArchived ? true : !list.isArchived
      )
    ),
  });
}

export async function getShoppingList(dtoIn) {
  const list = findList(dtoIn);
  return buildDtoOut({ shoppingList: cloneDeep(list) });
}

export async function createShoppingList(dtoIn) {
  assertId(dtoIn, "shoppingList/create");
  const owner = dataStore.owners.find((user) => user.id === dtoIn.ownerId);
  if (!owner) {
    throw new Error(`owner ${dtoIn.ownerId} not found`);
  }
  if (dataStore.shoppingLists.some((list) => list.id === dtoIn.id)) {
    throw new Error(`shoppingList ${dtoIn.id} already exists`);
  }
  const newList = {
    id: dtoIn.id,
    name: dtoIn.name ?? "New Shopping List",
    ownerId: dtoIn.ownerId,
    items: dtoIn.items ? cloneDeep(dtoIn.items) : [],
    members:
      dtoIn.members && dtoIn.members.length
        ? cloneDeep(dtoIn.members)
        : [{ id: owner.id, name: owner.name, isOwner: true }],
    isArchived: Boolean(dtoIn.isArchived),
  };
  dataStore.shoppingLists.push(newList);
  return buildDtoOut({ shoppingList: cloneDeep(newList) });
}

export async function updateShoppingList(dtoIn) {
  const list = findList(dtoIn);
  if (dtoIn.name) list.name = dtoIn.name;
  if (typeof dtoIn.isArchived === "boolean") list.isArchived = dtoIn.isArchived;
  if (dtoIn.ownerId) {
    list.ownerId = dtoIn.ownerId;
    const existingOwner = list.members.find((m) => m.isOwner);
    if (existingOwner) {
      existingOwner.id = dtoIn.ownerId;
      const ownerUser = dataStore.owners.find((user) => user.id === dtoIn.ownerId);
      existingOwner.name = ownerUser ? ownerUser.name : existingOwner.name;
    }
  }
  return buildDtoOut({ shoppingList: cloneDeep(list) });
}

export async function deleteShoppingList(dtoIn) {
  const list = findList(dtoIn);
  dataStore.shoppingLists = dataStore.shoppingLists.filter((item) => item.id !== list.id);
  return buildDtoOut({ removedId: list.id });
}

export async function archiveShoppingList(dtoIn) {
  const list = findList(dtoIn);
  list.isArchived = true;
  return buildDtoOut({ shoppingList: cloneDeep(list) });
}

export async function addItemToShoppingList(dtoIn) {
  const list = findList(dtoIn);
  const itemId = dtoIn.itemId ?? `item-${Date.now()}`;
  const newItem = { id: itemId, name: dtoIn.name ?? "New Item", isResolved: false };
  list.items.push(newItem);
  return buildDtoOut({ shoppingList: cloneDeep(list), item: cloneDeep(newItem) });
}

export async function updateItemInShoppingList(dtoIn) {
  const list = findList(dtoIn);
  const item = list.items.find((entry) => entry.id === dtoIn.itemId);
  if (!item) {
    throw new Error(`item ${dtoIn.itemId} not found in list ${dtoIn.id}`);
  }
  if (dtoIn.name) item.name = dtoIn.name;
  if (typeof dtoIn.isResolved === "boolean") item.isResolved = dtoIn.isResolved;
  return buildDtoOut({ shoppingList: cloneDeep(list), item: cloneDeep(item) });
}

export async function removeItemFromShoppingList(dtoIn) {
  const list = findList(dtoIn);
  const exists = list.items.some((entry) => entry.id === dtoIn.itemId);
  list.items = list.items.filter((entry) => entry.id !== dtoIn.itemId);
  if (!exists) {
    throw new Error(`item ${dtoIn.itemId} not found in list ${dtoIn.id}`);
  }
  return buildDtoOut({ shoppingList: cloneDeep(list), removedItemId: dtoIn.itemId });
}

export async function toggleItemResolution(dtoIn) {
  const list = findList(dtoIn);
  const item = list.items.find((entry) => entry.id === dtoIn.itemId);
  if (!item) {
    throw new Error(`item ${dtoIn.itemId} not found in list ${dtoIn.id}`);
  }
  item.isResolved = !item.isResolved;
  return buildDtoOut({ shoppingList: cloneDeep(list), item: cloneDeep(item) });
}

export async function assignMember(dtoIn) {
  const list = findList(dtoIn);
  const member = dataStore.members.find((m) => m.id === dtoIn.memberId);
  if (!member) {
    throw new Error(`member ${dtoIn.memberId} not found`);
  }
  const alreadyAssigned = list.members.some((m) => m.id === member.id);
  if (!alreadyAssigned) {
    list.members.push({
      id: member.id,
      name: member.name,
      isOwner: Boolean(dtoIn.isOwner),
    });
  }
  return buildDtoOut({ shoppingList: cloneDeep(list) });
}

export async function removeMember(dtoIn) {
  const list = findList(dtoIn);
  list.members = list.members.filter((member) => member.id !== dtoIn.memberId);
  return buildDtoOut({ shoppingList: cloneDeep(list), removedMemberId: dtoIn.memberId });
}

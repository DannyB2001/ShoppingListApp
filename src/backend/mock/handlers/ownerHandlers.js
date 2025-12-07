import dataStore from "../dataStore.js";
import { assertId, buildDtoOut, cloneDeep } from "../utils.js";
import { listShoppingLists } from "./shoppingListHandlers.js";

export async function listOwners() {
  return buildDtoOut({ owners: cloneDeep(dataStore.owners) });
}

export async function getOwner(dtoIn) {
  assertId(dtoIn, "owner/get");
  const owner = dataStore.owners.find((item) => item.id === dtoIn.id);
  if (!owner) {
    throw new Error(`Vlastník ${dtoIn.id} nebyl nalezen`);
  }
  return buildDtoOut({ owner: cloneDeep(owner) });
}

export async function createOwner(dtoIn) {
  assertId(dtoIn, "owner/create");
  if (dataStore.owners.some((item) => item.id === dtoIn.id)) {
    throw new Error(`Vlastník ${dtoIn.id} již existuje`);
  }
  const newOwner = {
    id: dtoIn.id,
    name: dtoIn.name ?? "Nový vlastník",
    email: dtoIn.email ?? "",
  };
  dataStore.owners.push(newOwner);
  const memberRecord = {
    id: newOwner.id,
    name: newOwner.name,
    email: newOwner.email,
    isOwner: true,
  };
  dataStore.members.push(memberRecord);
  return buildDtoOut({ owner: cloneDeep(newOwner) });
}

export async function updateOwner(dtoIn) {
  const owner = dataStore.owners.find((item) => item.id === dtoIn.id);
  if (!owner) {
    throw new Error(`Vlastník ${dtoIn.id} nebyl nalezen`);
  }
  if (dtoIn.name) owner.name = dtoIn.name;
  if (dtoIn.email) owner.email = dtoIn.email;
  const member = dataStore.members.find((item) => item.id === dtoIn.id);
  if (member) {
    if (dtoIn.name) member.name = dtoIn.name;
    if (dtoIn.email) member.email = dtoIn.email;
  }
  dataStore.shoppingLists.forEach((list) => {
    if (list.ownerId === dtoIn.id && dtoIn.name) {
      const ownerMember = list.members.find((m) => m.isOwner);
      if (ownerMember) ownerMember.name = dtoIn.name;
    }
  });
  return buildDtoOut({ owner: cloneDeep(owner) });
}

export async function deleteOwner(dtoIn) {
  const owner = dataStore.owners.find((item) => item.id === dtoIn.id);
  if (!owner) {
    throw new Error(`Vlastník ${dtoIn.id} nebyl nalezen`);
  }
  dataStore.owners = dataStore.owners.filter((item) => item.id !== dtoIn.id);
  dataStore.members = dataStore.members.filter((item) => item.id !== dtoIn.id);
  dataStore.shoppingLists = dataStore.shoppingLists.filter((list) => list.ownerId !== dtoIn.id);
  return buildDtoOut({ removedOwnerId: dtoIn.id });
}

export async function getOwnerShoppingLists(dtoIn) {
  assertId(dtoIn, "owner/lists");
  const response = await listShoppingLists({ includeArchived: dtoIn.includeArchived });
  const lists = response.data.shoppingLists.filter(
    (list) => list.ownerId === dtoIn.id || list.members.some((member) => member.id === dtoIn.id)
  );
  return buildDtoOut({ shoppingLists: lists });
}

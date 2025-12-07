// src/services/listService.js
// Bridge between frontend and backend. Uses mock when VITE_USE_MOCK=true, otherwise calls backend server.

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:4000/api";

async function callBackend(endpoint, dtoIn = {}) {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dtoIn),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed for ${endpoint}`);
  }
  const payload = await response.json();
  if (payload.status !== "ok") {
    throw new Error(payload.error ?? `Backend error for ${endpoint}`);
  }
  return payload.data;
}

export async function getAllLists() {
  const data = await callBackend("shoppingList/list", { id: "list-all", includeArchived: true });
  return data.shoppingLists;
}

export async function getOwnerDashboardLists(ownerId) {
  const dtoIn = { id: ownerId, includeArchived: true };
  const data = await callBackend("owner/lists", dtoIn);
  return data.shoppingLists;
}

export async function getMemberDashboardLists(memberId) {
  const dtoIn = { id: memberId, excludeOwned: true };
  const data = await callBackend("member/lists", dtoIn);
  return data.shoppingLists;
}

export async function getListDetail(listId) {
  const dtoIn = { id: listId };
  const data = await callBackend("shoppingList/get", dtoIn);
  return data.shoppingList;
}

export async function createList({ id, name, ownerId, items = [], members = [], isArchived = false }) {
  const dtoIn = { id, name, ownerId, items, members, isArchived };
  const data = await callBackend("shoppingList/create", dtoIn);
  return data.shoppingList;
}

export async function updateListName({ id, name }) {
  const dtoIn = { id, name };
  const data = await callBackend("shoppingList/update", dtoIn);
  return data.shoppingList;
}

export async function setListArchived({ id, isArchived }) {
  if (isArchived) {
    const data = await callBackend("shoppingList/archive", { id });
    return data.shoppingList;
  }
  const data = await callBackend("shoppingList/update", { id, isArchived: false });
  return data.shoppingList;
}

export async function deleteList(id) {
  const dtoIn = { id };
  const data = await callBackend("shoppingList/delete", dtoIn);
  return data.removedId;
}

export async function removeMemberFromList({ id, memberId }) {
  const dtoIn = { id, memberId };
  const data = await callBackend("shoppingList/removeMember", dtoIn);
  return data.shoppingList;
}

export async function addMemberToList({ id, memberId, isOwner = false }) {
  const dtoIn = { id, memberId, isOwner };
  const data = await callBackend("shoppingList/assignMember", dtoIn);
  return data.shoppingList;
}

export async function createMember({ id, name, email = "", isOwner = false }) {
  const dtoIn = { id, name, email, isOwner };
  const data = await callBackend("member/create", dtoIn);
  return data.member;
}

export async function addItemToList({ id, name }) {
  const dtoIn = { id, name };
  const data = await callBackend("shoppingList/addItem", dtoIn);
  return data.shoppingList;
}

export async function updateItemInList({ id, itemId, name, isResolved }) {
  const dtoIn = { id, itemId, name, isResolved };
  const data = await callBackend("shoppingList/updateItem", dtoIn);
  return data.shoppingList;
}

export async function removeItemFromList({ id, itemId }) {
  const dtoIn = { id, itemId };
  const data = await callBackend("shoppingList/removeItem", dtoIn);
  return data.shoppingList;
}

import { mockServer } from "../mock/mockServer";

export async function listShoppingLists(dtoIn) {
  return mockServer.call("shoppingList/list", dtoIn);
}

export async function getShoppingList(dtoIn) {
  return mockServer.call("shoppingList/get", dtoIn);
}

export async function createShoppingList(dtoIn) {
  return mockServer.call("shoppingList/create", dtoIn);
}

export async function updateShoppingList(dtoIn) {
  return mockServer.call("shoppingList/update", dtoIn);
}

export async function deleteShoppingList(dtoIn) {
  return mockServer.call("shoppingList/delete", dtoIn);
}

export async function archiveShoppingList(dtoIn) {
  return mockServer.call("shoppingList/archive", dtoIn);
}

export async function addItemToShoppingList(dtoIn) {
  return mockServer.call("shoppingList/addItem", dtoIn);
}

export async function updateItemInShoppingList(dtoIn) {
  return mockServer.call("shoppingList/updateItem", dtoIn);
}

export async function removeItemFromShoppingList(dtoIn) {
  return mockServer.call("shoppingList/removeItem", dtoIn);
}

export async function toggleItemResolution(dtoIn) {
  return mockServer.call("shoppingList/toggleItem", dtoIn);
}

export async function assignMemberToShoppingList(dtoIn) {
  return mockServer.call("shoppingList/assignMember", dtoIn);
}

export async function removeMemberFromShoppingList(dtoIn) {
  return mockServer.call("shoppingList/removeMember", dtoIn);
}

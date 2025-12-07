import { mockServer } from "../mock/mockServer";

export async function listOwners(dtoIn) {
  return mockServer.call("owner/list", dtoIn);
}

export async function getOwner(dtoIn) {
  return mockServer.call("owner/get", dtoIn);
}

export async function createOwner(dtoIn) {
  return mockServer.call("owner/create", dtoIn);
}

export async function updateOwner(dtoIn) {
  return mockServer.call("owner/update", dtoIn);
}

export async function deleteOwner(dtoIn) {
  return mockServer.call("owner/delete", dtoIn);
}

export async function getOwnerShoppingLists(dtoIn) {
  return mockServer.call("owner/lists", dtoIn);
}

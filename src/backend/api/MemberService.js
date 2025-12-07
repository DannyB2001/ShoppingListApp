import { mockServer } from "../mock/mockServer";

export async function listMembers(dtoIn) {
  return mockServer.call("member/list", dtoIn);
}

export async function getMember(dtoIn) {
  return mockServer.call("member/get", dtoIn);
}

export async function createMember(dtoIn) {
  return mockServer.call("member/create", dtoIn);
}

export async function updateMember(dtoIn) {
  return mockServer.call("member/update", dtoIn);
}

export async function deleteMember(dtoIn) {
  return mockServer.call("member/delete", dtoIn);
}

export async function getMemberShoppingLists(dtoIn) {
  return mockServer.call("member/lists", dtoIn);
}

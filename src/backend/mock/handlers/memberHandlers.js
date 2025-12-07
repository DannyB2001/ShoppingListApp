import dataStore from "../dataStore.js";
import { assertId, buildDtoOut, cloneDeep } from "../utils.js";

export async function listMembers() {
  return buildDtoOut({ members: cloneDeep(dataStore.members) });
}

export async function getMember(dtoIn) {
  assertId(dtoIn, "member/get");
  const member = dataStore.members.find((item) => item.id === dtoIn.id);
  if (!member) {
    throw new Error(`member ${dtoIn.id} not found`);
  }
  return buildDtoOut({ member: cloneDeep(member) });
}

export async function createMember(dtoIn) {
  assertId(dtoIn, "member/create");
  if (dataStore.members.some((item) => item.id === dtoIn.id)) {
    throw new Error(`member ${dtoIn.id} already exists`);
  }
  const newMember = {
    id: dtoIn.id,
    name: dtoIn.name ?? "New Member",
    email: dtoIn.email ?? "",
    isOwner: Boolean(dtoIn.isOwner),
  };
  dataStore.members.push(newMember);
  return buildDtoOut({ member: cloneDeep(newMember) });
}

export async function updateMember(dtoIn) {
  const member = dataStore.members.find((item) => item.id === dtoIn.id);
  if (!member) {
    throw new Error(`member ${dtoIn.id} not found`);
  }
  if (dtoIn.name) member.name = dtoIn.name;
  if (dtoIn.email) member.email = dtoIn.email;
  if (typeof dtoIn.isOwner === "boolean") member.isOwner = dtoIn.isOwner;
  dataStore.shoppingLists.forEach((list) => {
    list.members = list.members.map((entry) =>
      entry.id === member.id
        ? {
            ...entry,
            name: dtoIn.name ?? entry.name,
            isOwner: typeof dtoIn.isOwner === "boolean" ? dtoIn.isOwner : entry.isOwner,
          }
        : entry
    );
  });
  return buildDtoOut({ member: cloneDeep(member) });
}

export async function deleteMember(dtoIn) {
  const member = dataStore.members.find((item) => item.id === dtoIn.id);
  if (!member) {
    throw new Error(`member ${dtoIn.id} not found`);
  }
  dataStore.members = dataStore.members.filter((item) => item.id !== dtoIn.id);
  dataStore.shoppingLists.forEach((list) => {
    list.members = list.members.filter((entry) => entry.id !== dtoIn.id);
  });
  return buildDtoOut({ removedMemberId: dtoIn.id });
}

export async function getMemberShoppingLists(dtoIn) {
  assertId(dtoIn, "member/lists");
  const lists = dataStore.shoppingLists.filter((list) =>
    list.members.some((member) => member.id === dtoIn.id)
  );
  const filtered = dtoIn.excludeOwned
    ? lists.filter((list) => list.ownerId !== dtoIn.id)
    : lists;
  return buildDtoOut({ shoppingLists: cloneDeep(filtered) });
}

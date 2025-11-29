// src/services/listService.js
// Jednoduchý mock "serveru" pro načítání seznamů

import {
  INITIAL_ITEMS,
  INITIAL_MEMBERS,
  INITIAL_SHOPPING_LIST,
} from "../data";

const MOCK_LISTS = [
  {
    ...INITIAL_SHOPPING_LIST,
    name: "Velký nákup",
    items: INITIAL_ITEMS,
    members: INITIAL_MEMBERS,
    isArchived: false,
  },
  {
    id: "list-2",
    name: "Narozeniny",
    ownerId: "user-1",
    items: [
      { id: "item-21", name: "Dort", isResolved: false },
      { id: "item-22", name: "Svíčky", isResolved: true },
    ],
    members: [
      { id: "user-1", name: "Daniel Brož", isOwner: true },
      { id: "user-3", name: "Bob", isOwner: false },
    ],
    isArchived: false,
  },
  {
    id: "list-3",
    name: "Víkend",
    ownerId: "user-3",
    items: [
      { id: "item-31", name: "Pivo", isResolved: false },
      { id: "item-32", name: "Uhlí", isResolved: false },
    ],
    members: [
      { id: "user-3", name: "Alice", isOwner: true },
      { id: "user-1", name: "Daniel Brož", isOwner: false },
    ],
    isArchived: false,
  },
  {
    id: "list-4",
    name: "Archivovaný seznam",
    ownerId: "user-1",
    items: [],
    members: [{ id: "user-1", name: "Daniel Brož", isOwner: true }],
    isArchived: true,
  },
];

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAllLists() {
  await delay();
  return structuredClone(MOCK_LISTS);
}

export async function getOwnerDashboardLists(ownerId) {
  await delay();
  return structuredClone(MOCK_LISTS).filter(
    (list) => list.ownerId === ownerId || list.members.some((m) => m.id === ownerId)
  );
}

export async function getMemberDashboardLists(memberId) {
  await delay();
  return structuredClone(MOCK_LISTS).filter(
    (list) => list.ownerId !== memberId && list.members.some((m) => m.id === memberId)
  );
}

export async function getListDetail(listId) {
  await delay();
  const list = structuredClone(MOCK_LISTS.find((l) => l.id === listId));
  if (!list) {
    throw new Error("Seznam nenalezen");
  }
  return list;
}

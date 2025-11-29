// src/services/listService.js
// Jednoduchý mock "serveru" pro načítání seznamů.
// Přepínač mocku: VITE_USE_MOCK=true (default). Při false je reálné API neimplementované.

import {
  INITIAL_ITEMS,
  INITIAL_MEMBERS,
  INITIAL_SHOPPING_LIST,
} from "../data";

const USE_MOCK =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_USE_MOCK === "true") ||
  import.meta.env.VITE_USE_MOCK === undefined; // default: mock zapnutý

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
  if (!USE_MOCK) {
    throw new Error("Reálné API není implementováno. Zapněte mock (VITE_USE_MOCK=true).");
  }
  await delay();
  return structuredClone(MOCK_LISTS);
}

export async function getOwnerDashboardLists(ownerId) {
  if (!USE_MOCK) {
    throw new Error("Reálné API není implementováno. Zapněte mock (VITE_USE_MOCK=true).");
  }
  await delay();
  return structuredClone(MOCK_LISTS).filter(
    (list) => list.ownerId === ownerId || list.members.some((m) => m.id === ownerId)
  );
}

export async function getMemberDashboardLists(memberId) {
  if (!USE_MOCK) {
    throw new Error("Reálné API není implementováno. Zapněte mock (VITE_USE_MOCK=true).");
  }
  await delay();
  return structuredClone(MOCK_LISTS).filter(
    (list) => list.ownerId !== memberId && list.members.some((m) => m.id === memberId)
  );
}

export async function getListDetail(listId) {
  if (!USE_MOCK) {
    throw new Error("Reálné API není implementováno. Zapněte mock (VITE_USE_MOCK=true).");
  }
  await delay();
  const list = structuredClone(MOCK_LISTS.find((l) => l.id === listId));
  if (!list) {
    throw new Error("Seznam nenalezen");
  }
  return list;
}

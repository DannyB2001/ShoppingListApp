// src/services/listService.js
// Bridge between frontend and backend. Uses mock when VITE_USE_MOCK=true, otherwise calls backend server.

import {
  INITIAL_ITEMS,
  INITIAL_MEMBERS,
  INITIAL_SHOPPING_LIST,
} from "../data";

const USE_MOCK = import.meta.env?.VITE_USE_MOCK === "true";
const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:4000/api";

const MOCK_LISTS = [
  {
    ...INITIAL_SHOPPING_LIST,
    name: "Velk�� n��kup",
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
      { id: "item-22", name: "Sv����ky", isResolved: true },
    ],
    members: [
      { id: "user-1", name: "Daniel Bro��", isOwner: true },
      { id: "user-3", name: "Bob", isOwner: false },
    ],
    isArchived: false,
  },
  {
    id: "list-3",
    name: "V��kend",
    ownerId: "user-3",
    items: [
      { id: "item-31", name: "Pivo", isResolved: false },
      { id: "item-32", name: "Uhl��", isResolved: false },
    ],
    members: [
      { id: "user-3", name: "Alice", isOwner: true },
      { id: "user-1", name: "Daniel Bro��", isOwner: false },
    ],
    isArchived: false,
  },
  {
    id: "list-4",
    name: "Archivovan�� seznam",
    ownerId: "user-1",
    items: [],
    members: [{ id: "user-1", name: "Daniel Bro��", isOwner: true }],
    isArchived: true,
  },
];

function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  if (USE_MOCK) {
    await delay();
    return structuredClone(MOCK_LISTS);
  }
  const data = await callBackend("shoppingList/list", { id: "list-all", includeArchived: true });
  return data.shoppingLists;
}

export async function getOwnerDashboardLists(ownerId) {
  if (USE_MOCK) {
    await delay();
    return structuredClone(MOCK_LISTS).filter(
      (list) => list.ownerId === ownerId || list.members.some((m) => m.id === ownerId)
    );
  }
  const dtoIn = { id: ownerId, includeArchived: true };
  const data = await callBackend("owner/lists", dtoIn);
  return data.shoppingLists;
}

export async function getMemberDashboardLists(memberId) {
  if (USE_MOCK) {
    await delay();
    return structuredClone(MOCK_LISTS).filter(
      (list) => list.ownerId !== memberId && list.members.some((m) => m.id === memberId)
    );
  }
  const dtoIn = { id: memberId, excludeOwned: true };
  const data = await callBackend("member/lists", dtoIn);
  return data.shoppingLists;
}

export async function getListDetail(listId) {
  if (USE_MOCK) {
    await delay();
    const list = structuredClone(MOCK_LISTS.find((l) => l.id === listId));
    if (!list) {
      throw new Error("Seznam nenalezen");
    }
    return list;
  }
  const dtoIn = { id: listId };
  const data = await callBackend("shoppingList/get", dtoIn);
  return data.shoppingList;
}

// src/data.js
export const INITIAL_SHOPPING_LIST = {
  id: "list-1",
  name: "Nákup na víkend",
  ownerId: "user-1",
};

export const INITIAL_MEMBERS = [
  { id: "user-1", name: "Daniel Brož", isOwner: true },
  { id: "user-2", name: "Alice", isOwner: false },
  { id: "user-3", name: "Bob", isOwner: false },
];

export const INITIAL_ITEMS = [
  { id: "item-1", name: "Mléko", isResolved: false },
  { id: "item-2", name: "Chléb", isResolved: true },
  { id: "item-3", name: "Máslo", isResolved: false },
];

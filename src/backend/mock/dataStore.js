const dataStore = {
  owners: [
    { id: "user-1", name: "Daniel Brown", email: "daniel@example.com" },
    { id: "user-2", name: "Alice Carter", email: "alice@example.com" },
  ],
  members: [
    { id: "user-1", name: "Daniel Brown", email: "daniel@example.com", isOwner: true },
    { id: "user-2", name: "Alice Carter", email: "alice@example.com", isOwner: true },
    { id: "user-3", name: "Bob Smith", email: "bob@example.com", isOwner: false },
  ],
  shoppingLists: [
    {
      id: "list-1",
      name: "Weekend Groceries",
      ownerId: "user-1",
      items: [
        { id: "item-1", name: "Milk", isResolved: false },
        { id: "item-2", name: "Bread", isResolved: true },
        { id: "item-3", name: "Butter", isResolved: false },
      ],
      members: [
        { id: "user-1", name: "Daniel Brown", isOwner: true },
        { id: "user-2", name: "Alice Carter", isOwner: false },
      ],
      isArchived: false,
    },
    {
      id: "list-2",
      name: "Birthday Party",
      ownerId: "user-2",
      items: [
        { id: "item-21", name: "Cake", isResolved: false },
        { id: "item-22", name: "Candles", isResolved: true },
      ],
      members: [
        { id: "user-2", name: "Alice Carter", isOwner: true },
        { id: "user-3", name: "Bob Smith", isOwner: false },
      ],
      isArchived: false,
    },
    {
      id: "list-3",
      name: "Archived Supplies",
      ownerId: "user-1",
      items: [{ id: "item-31", name: "Paper Towels", isResolved: true }],
      members: [{ id: "user-1", name: "Daniel Brown", isOwner: true }],
      isArchived: true,
    },
  ],
};

export default dataStore;

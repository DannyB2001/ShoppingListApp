const dataStore = {
  owners: [
    { id: "user-1", name: "Daniel Novák", email: "daniel@priklad.cz" },
    { id: "user-2", name: "Alice Černá", email: "alice@priklad.cz" },
    { id: "user-4", name: "Anežka Veselá", email: "anezka@priklad.cz" },
  ],
  members: [
    { id: "user-1", name: "Daniel Novák", email: "daniel@priklad.cz", isOwner: true },
    { id: "user-2", name: "Alice Černá", email: "alice@priklad.cz", isOwner: true },
    { id: "user-3", name: "Petr Svoboda", email: "petr@priklad.cz", isOwner: false },
    { id: "user-4", name: "Anežka Veselá", email: "anezka@priklad.cz", isOwner: true },
  ],
  shoppingLists: [
    {
      id: "list-1",
      name: "Nákup na víkend",
      ownerId: "user-1",
      items: [
        { id: "item-1", name: "Mléko", isResolved: false },
        { id: "item-2", name: "Chléb", isResolved: true },
        { id: "item-3", name: "Máslo", isResolved: false },
      ],
      members: [
        { id: "user-1", name: "Daniel Novák", isOwner: true },
        { id: "user-2", name: "Alice Černá", isOwner: false },
      ],
      isArchived: false,
    },
    {
      id: "list-2",
      name: "Narozeninová oslava",
      ownerId: "user-2",
      items: [
        { id: "item-21", name: "Dort", isResolved: false },
        { id: "item-22", name: "Svíčky", isResolved: true },
      ],
      members: [
        { id: "user-2", name: "Alice Černá", isOwner: true },
        { id: "user-3", name: "Petr Svoboda", isOwner: false },
      ],
      isArchived: false,
    },
    {
      id: "list-3",
      name: "Archivované zásoby",
      ownerId: "user-1",
      items: [{ id: "item-31", name: "Papírové utěrky", isResolved: true }],
      members: [{ id: "user-1", name: "Daniel Novák", isOwner: true }],
      isArchived: true,
    },
    {
      id: "list-4",
      name: "Oslava",
      ownerId: "user-4",
      items: [
        { id: "item-41", name: "Svíčky", isResolved: false },
        { id: "item-42", name: "Dort", isResolved: false },
        { id: "item-43", name: "Dárek", isResolved: false },
        { id: "item-44", name: "Hračka", isResolved: false },
      ],
      members: [
        { id: "user-4", name: "Anežka Veselá", isOwner: true },
        { id: "user-1", name: "Daniel Novák", isOwner: false },
      ],
      isArchived: false,
    },
  ],
};

export default dataStore;

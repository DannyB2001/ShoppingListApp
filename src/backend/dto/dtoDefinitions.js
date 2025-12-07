// ShoppingList endpoints
export const listShoppingListsDtoIn = {
  id: "user-1",
  includeArchived: false,
};

export const listShoppingListsDtoOut = {
  status: "ok",
  data: {
    shoppingLists: [],
  },
};

export const getShoppingListDtoIn = {
  id: "list-1",
};

export const getShoppingListDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
  },
};

export const createShoppingListDtoIn = {
  id: "list-99",
  name: "Nový nákupní seznam",
  ownerId: "user-1",
  members: [],
  items: [],
  isArchived: false,
};

export const createShoppingListDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
  },
};

export const updateShoppingListDtoIn = {
  id: "list-1",
  name: "Aktualizovaný název seznamu",
  isArchived: false,
  ownerId: "user-1",
};

export const updateShoppingListDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
  },
};

export const deleteShoppingListDtoIn = {
  id: "list-1",
};

export const deleteShoppingListDtoOut = {
  status: "ok",
  data: {
    removedId: "list-1",
  },
};

export const archiveShoppingListDtoIn = {
  id: "list-1",
};

export const archiveShoppingListDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
  },
};

export const addItemToShoppingListDtoIn = {
  id: "list-1",
  itemId: "item-100",
  name: "Rajčata",
};

export const addItemToShoppingListDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
    item: {},
  },
};

export const updateItemInShoppingListDtoIn = {
  id: "list-1",
  itemId: "item-1",
  name: "Plnotučné mléko",
  isResolved: true,
};

export const updateItemInShoppingListDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
    item: {},
  },
};

export const removeItemFromShoppingListDtoIn = {
  id: "list-1",
  itemId: "item-1",
};

export const removeItemFromShoppingListDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
    removedItemId: "item-1",
  },
};

export const toggleItemResolutionDtoIn = {
  id: "list-1",
  itemId: "item-2",
};

export const toggleItemResolutionDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
    item: {},
  },
};

export const assignMemberDtoIn = {
  id: "list-1",
  memberId: "user-3",
  isOwner: false,
};

export const assignMemberDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
  },
};

export const removeMemberDtoIn = {
  id: "list-1",
  memberId: "user-3",
};

export const removeMemberDtoOut = {
  status: "ok",
  data: {
    shoppingList: {},
    removedMemberId: "user-3",
  },
};

// Owner endpoints
export const listOwnersDtoIn = {
  id: "owner-list",
};

export const listOwnersDtoOut = {
  status: "ok",
  data: {
    owners: [],
  },
};

export const getOwnerDtoIn = {
  id: "user-1",
};

export const getOwnerDtoOut = {
  status: "ok",
  data: {
    owner: {},
  },
};

export const createOwnerDtoIn = {
  id: "user-9",
  name: "Jméno vlastníka",
  email: "vlastnik@priklad.cz",
};

export const createOwnerDtoOut = {
  status: "ok",
  data: {
    owner: {},
  },
};

export const updateOwnerDtoIn = {
  id: "user-1",
  name: "Aktualizovaný vlastník",
  email: "aktualizovany@priklad.cz",
};

export const updateOwnerDtoOut = {
  status: "ok",
  data: {
    owner: {},
  },
};

export const deleteOwnerDtoIn = {
  id: "user-1",
};

export const deleteOwnerDtoOut = {
  status: "ok",
  data: {
    removedOwnerId: "user-1",
  },
};

export const getOwnerShoppingListsDtoIn = {
  id: "user-1",
  includeArchived: true,
};

export const getOwnerShoppingListsDtoOut = {
  status: "ok",
  data: {
    shoppingLists: [],
  },
};

// Member endpoints
export const listMembersDtoIn = {
  id: "member-list",
};

export const listMembersDtoOut = {
  status: "ok",
  data: {
    members: [],
  },
};

export const getMemberDtoIn = {
  id: "user-2",
};

export const getMemberDtoOut = {
  status: "ok",
  data: {
    member: {},
  },
};

export const createMemberDtoIn = {
  id: "user-10",
  name: "Člen týmu",
  email: "clen@priklad.cz",
  isOwner: false,
};

export const createMemberDtoOut = {
  status: "ok",
  data: {
    member: {},
  },
};

export const updateMemberDtoIn = {
  id: "user-2",
  name: "Aktualizovaný člen",
  email: "aktualizovany-clen@priklad.cz",
  isOwner: false,
};

export const updateMemberDtoOut = {
  status: "ok",
  data: {
    member: {},
  },
};

export const deleteMemberDtoIn = {
  id: "user-2",
};

export const deleteMemberDtoOut = {
  status: "ok",
  data: {
    removedMemberId: "user-2",
  },
};

export const getMemberShoppingListsDtoIn = {
  id: "user-3",
  excludeOwned: true,
};

export const getMemberShoppingListsDtoOut = {
  status: "ok",
  data: {
    shoppingLists: [],
  },
};

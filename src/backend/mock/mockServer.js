import {
  archiveShoppingList,
  assignMember,
  createShoppingList,
  deleteShoppingList,
  getShoppingList,
  listShoppingLists,
  removeItemFromShoppingList,
  removeMember,
  toggleItemResolution,
  addItemToShoppingList,
  updateItemInShoppingList,
  updateShoppingList,
} from "./handlers/shoppingListHandlers.js";
import {
  createOwner,
  deleteOwner,
  getOwner,
  getOwnerShoppingLists,
  listOwners,
  updateOwner,
} from "./handlers/ownerHandlers.js";
import {
  createMember,
  deleteMember,
  getMember,
  getMemberShoppingLists,
  listMembers,
  updateMember,
} from "./handlers/memberHandlers.js";
import { delay } from "./utils.js";

const routes = {
  "shoppingList/list": listShoppingLists,
  "shoppingList/get": getShoppingList,
  "shoppingList/create": createShoppingList,
  "shoppingList/update": updateShoppingList,
  "shoppingList/delete": deleteShoppingList,
  "shoppingList/archive": archiveShoppingList,
  "shoppingList/addItem": addItemToShoppingList,
  "shoppingList/updateItem": updateItemInShoppingList,
  "shoppingList/removeItem": removeItemFromShoppingList,
  "shoppingList/toggleItem": toggleItemResolution,
  "shoppingList/assignMember": assignMember,
  "shoppingList/removeMember": removeMember,
  "owner/list": listOwners,
  "owner/get": getOwner,
  "owner/create": createOwner,
  "owner/update": updateOwner,
  "owner/delete": deleteOwner,
  "owner/lists": getOwnerShoppingLists,
  "member/list": listMembers,
  "member/get": getMember,
  "member/create": createMember,
  "member/update": updateMember,
  "member/delete": deleteMember,
  "member/lists": getMemberShoppingLists,
};

export const mockServer = {
  async call(endpoint, dtoIn = {}) {
    const handler = routes[endpoint];
    if (!handler) {
      throw new Error(`Unknown endpoint "${endpoint}"`);
    }
    await delay();
    return handler(dtoIn);
  },
};

// Example usage only; not wired to UI.
import {
  listShoppingLists,
  getShoppingList,
  createShoppingList,
  addItemToShoppingList,
  assignMemberToShoppingList,
} from "../api/ShoppingListService";
import { getOwnerShoppingLists } from "../api/OwnerService";
import { getMemberShoppingLists } from "../api/MemberService";

export async function loadOwnerDashboard(ownerId) {
  const dtoIn = { id: ownerId, includeArchived: false };
  const response = await getOwnerShoppingLists(dtoIn);
  return response.data.shoppingLists;
}

export async function loadMemberDashboard(memberId) {
  const dtoIn = { id: memberId, excludeOwned: true };
  const response = await getMemberShoppingLists(dtoIn);
  return response.data.shoppingLists;
}

export async function createListWithInitialItem() {
  const createDtoIn = { id: "list-temp", name: "Quick Run", ownerId: "user-1" };
  const created = await createShoppingList(createDtoIn);
  const newListId = created.data.shoppingList.id;
  const addItemDtoIn = { id: newListId, name: "Apples" };
  await addItemToShoppingList(addItemDtoIn);
  const getDtoIn = { id: newListId };
  const listDetail = await getShoppingList(getDtoIn);
  return listDetail.data.shoppingList;
}

export async function inviteMemberToList(listId, memberId) {
  const dtoIn = { id: listId, memberId };
  const response = await assignMemberToShoppingList(dtoIn);
  return response.data.shoppingList;
}

export async function fetchAllLists() {
  const dtoIn = { id: "user-1", includeArchived: true };
  const response = await listShoppingLists(dtoIn);
  return response.data.shoppingLists;
}

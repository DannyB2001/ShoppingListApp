// src/routes/ShoppingListDetailRoute.jsx
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  INITIAL_SHOPPING_LIST,
  INITIAL_MEMBERS,
  INITIAL_ITEMS,
} from "../data";
import ShoppingListDetail from "./components/ShoppingListDetail.jsx";

function ShoppingListDetailRoute() {
  const { listId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedList = location.state?.list;
  const demoLists = {
    "list-1": { ...INITIAL_SHOPPING_LIST, name: "Velky nakup" },
    "list-2": { ...INITIAL_SHOPPING_LIST, id: "list-2", name: "Narozeniny" },
    "list-3": { ...INITIAL_SHOPPING_LIST, id: "list-3", name: "Vikend" },
  };

  const [shoppingList, setShoppingList] = useState(
    passedList ??
      demoLists[listId] ?? { ...INITIAL_SHOPPING_LIST, id: listId ?? "list-1" }
  );
  function normalizeMembers(source) {
    if (!source || !source.length) {
      return INITIAL_MEMBERS;
    }
    // Elements are objects already
    if (typeof source[0] === "object") {
      return source.map((member) => ({
        id: member.id,
        name: member.name ?? member.id,
        isOwner: Boolean(member.isOwner || member.id === (passedList?.ownerId ?? "user-1")),
      }));
    }
    // Elements are identifiers (strings)
    return source.map((id, index) => ({
      id,
      name: `Uzivatel ${index + 1}`,
      isOwner: id === (passedList?.ownerId ?? "user-1"),
    }));
  }

  const initialMembers = passedList ? normalizeMembers(passedList.members ?? []) : INITIAL_MEMBERS;

  const [members, setMembers] = useState(initialMembers);
  const [items, setItems] = useState(passedList ? (passedList.items ?? []) : INITIAL_ITEMS);
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);

  const identity = { id: "user-1", name: "Daniel Brož" };

  if (listId !== shoppingList.id) {
    console.warn("Zadané ID seznamu neodpovídá dostupným datům.");
  }

  function handleRenameList(newName) {
    setShoppingList((prev) => ({ ...prev, name: newName }));
  }

  function handleAddMember(memberIdentity) {
    setMembers((prev) => {
      if (prev.some((member) => member.id === memberIdentity.id)) return prev;
      return [
        ...prev,
        {
          id: memberIdentity.id,
          name: memberIdentity.name,
          isOwner: false,
        },
      ];
    });
  }

  function handleRemoveMember(memberId) {
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
  }

  function handleAddItem(itemName) {
    const trimmed = itemName.trim();
    if (!trimmed) return;
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: trimmed,
        isResolved: false,
      },
    ]);
  }

  function handleEditItem(itemId, newName) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, name: trimmed } : item))
    );
  }

  function handleDeleteItem(itemId) {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function handleToggleItem(itemId, isResolved) {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isResolved } : item))
    );
  }

  function handleToggleFilter() {
    setShowUnresolvedOnly((prev) => !prev);
  }

  function handleShareList() {
    alert("Sdileni seznamu zatim neni pripravene.");
  }

  function handleBack() {
    navigate("/owner_dashboard");
  }

  return (
    <ShoppingListDetail
      shoppingList={shoppingList}
      members={members}
      items={items}
      identity={identity}
      showUnresolvedOnly={showUnresolvedOnly}
      mode="owner"
      onRenameList={handleRenameList}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      onAddItem={handleAddItem}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteItem}
      onToggleItem={handleToggleItem}
      onToggleFilter={handleToggleFilter}
      onShareList={handleShareList}
      onBack={handleBack}
    />
  );
}

export default ShoppingListDetailRoute;

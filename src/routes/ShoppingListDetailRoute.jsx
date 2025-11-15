// src/routes/ShoppingListDetailRoute.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  INITIAL_SHOPPING_LIST,
  INITIAL_MEMBERS,
  INITIAL_ITEMS,
} from "../data";
import ShoppingListDetail from "./components/ShoppingListDetail.jsx";

function ShoppingListDetailRoute() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [shoppingList, setShoppingList] = useState(INITIAL_SHOPPING_LIST);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [items, setItems] = useState(INITIAL_ITEMS);
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
    alert("Sdílení seznamu zatím není připravené.");
  }

  function handleBack() {
    navigate("/owner_list");
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

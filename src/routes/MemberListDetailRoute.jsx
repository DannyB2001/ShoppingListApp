// src/routes/MemberListDetailRoute.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  INITIAL_SHOPPING_LIST,
  INITIAL_MEMBERS,
  INITIAL_ITEMS,
} from "../data";
import ShoppingListDetail from "./components/ShoppingListDetail";
import { getListDetail } from "../services/listService";

function MemberListDetailRoute() {
  const { listId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const identity = { id: "user-2", name: "Alice" };

  const passedList = location.state?.list;

  function normalizeMembers(source) {
    if (!source || !source.length) {
      return INITIAL_MEMBERS;
    }
    if (typeof source[0] === "object") {
      return source.map((member) => ({
        id: member.id,
        name: member.name ?? member.id,
        isOwner: Boolean(member.isOwner || member.id === (passedList?.ownerId ?? "user-1")),
      }));
    }
    return source.map((id, index) => ({
      id,
      name: `Uživatel ${index + 1}`,
      isOwner: id === (passedList?.ownerId ?? "user-1"),
    }));
  }

  const [shoppingList, setShoppingList] = useState(null);
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);
  const [loadState, setLoadState] = useState({ status: "pending", error: null });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadState({ status: "pending", error: null });
      try {
        if (passedList) {
          setShoppingList(passedList);
          setMembers(normalizeMembers(passedList.members ?? []));
          setItems(passedList.items ?? []);
          setLoadState({ status: "ready", error: null });
          return;
        }
        const fromService = await getListDetail(listId);
        if (!cancelled) {
          setShoppingList(fromService);
          setMembers(normalizeMembers(fromService.members));
          setItems(fromService.items ?? INITIAL_ITEMS);
          setLoadState({ status: "ready", error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setLoadState({ status: "error", error: "Nepodařilo se načíst detail seznamu." });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [listId, passedList]);

  if (loadState.status === "pending" || !shoppingList) {
    return (
      <div className="page-root">
        <div className="page-card">
          <p className="row-label-muted">Načítám detail seznamu…</p>
        </div>
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="page-root">
        <div className="page-card">
          <p className="row-label-muted">{loadState.error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/member_dashboard")}
          >
            Zpět na přehled
          </button>
        </div>
      </div>
    );
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
    alert("Sdílení seznamu pro členy zatím není připraveno.");
  }

  function handleBack() {
    navigate("/member_dashboard");
  }

  function handleLeaveList() {
    setMembers((prev) => prev.filter((member) => member.id !== identity.id));
    navigate("/member_dashboard");
  }

  return (
    <ShoppingListDetail
      shoppingList={shoppingList}
      members={members}
      items={items}
      identity={identity}
      showUnresolvedOnly={showUnresolvedOnly}
      mode="member"
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
      onLeaveList={handleLeaveList}
    />
  );
}

export default MemberListDetailRoute;

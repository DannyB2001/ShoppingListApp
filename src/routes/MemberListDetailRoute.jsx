// src/routes/MemberListDetailRoute.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { INITIAL_MEMBERS } from "../data";
import ShoppingListDetail from "./components/ShoppingListDetail";
import {
  getListDetail,
  updateListName,
  addMemberToList,
  createMember,
  removeMemberFromList,
  addItemToList,
  updateItemInList,
  removeItemFromList,
} from "../services/listService";

function MemberListDetailRoute() {
  const { listId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const identity = { id: "user-1", name: "Daniel Novák" };

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
  const [actionError, setActionError] = useState(null);

  function applyListState(list) {
    setShoppingList(list);
    setMembers(normalizeMembers(list.members ?? []));
    setItems(list.items ?? []);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadState({ status: "pending", error: null });
      try {
        if (passedList) {
          applyListState(passedList);
          setLoadState({ status: "ready", error: null });
          return;
        }
        const fromService = await getListDetail(listId);
        if (!cancelled) {
          applyListState(fromService);
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
    const trimmed = newName.trim();
    if (!trimmed) return;
    setActionError(null);
    (async () => {
      try {
        const updated = await updateListName({ id: listId, name: trimmed });
        applyListState(updated);
      } catch (error) {
        setActionError("Přejmenování se nezdařilo.");
      }
    })();
  }

  function handleAddMember(memberIdentity) {
    const memberId = memberIdentity.id || `user-${Date.now()}`;
    const name = memberIdentity.name || memberId;
    setActionError(null);
    (async () => {
      try {
        try {
          await createMember({ id: memberId, name });
        } catch (error) {
          // pokud už existuje, pokračujeme dál
        }
        const updated = await addMemberToList({ id: listId, memberId, isOwner: false });
        applyListState(updated);
      } catch (error) {
        setActionError("Přidání člena se nezdařilo.");
      }
    })();
  }

  function handleRemoveMember(memberId) {
    setActionError(null);
    (async () => {
      try {
        const updated = await removeMemberFromList({ id: listId, memberId });
        applyListState(updated);
      } catch (error) {
        setActionError("Odebrání člena se nezdařilo.");
      }
    })();
  }

  function handleAddItem(itemName) {
    const trimmed = itemName.trim();
    if (!trimmed) return;
    setActionError(null);
    (async () => {
      try {
        const updated = await addItemToList({ id: listId, name: trimmed });
        applyListState(updated);
      } catch (error) {
        setActionError("Přidání položky se nezdařilo.");
      }
    })();
  }

  function handleEditItem(itemId, newName) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setActionError(null);
    (async () => {
      try {
        const updated = await updateItemInList({ id: listId, itemId, name: trimmed });
        applyListState(updated);
      } catch (error) {
        setActionError("Úprava položky se nezdařila.");
      }
    })();
  }

  function handleDeleteItem(itemId) {
    setActionError(null);
    (async () => {
      try {
        const updated = await removeItemFromList({ id: listId, itemId });
        applyListState(updated);
      } catch (error) {
        setActionError("Smazání položky se nezdařilo.");
      }
    })();
  }

  function handleToggleItem(itemId, isResolved) {
    setActionError(null);
    (async () => {
      try {
        const updated = await updateItemInList({ id: listId, itemId, isResolved });
        applyListState(updated);
      } catch (error) {
        setActionError("Aktualizace položky se nezdařila.");
      }
    })();
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
    setActionError(null);
    (async () => {
      try {
        await removeMemberFromList({ id: listId, memberId: identity.id });
        navigate("/member_dashboard");
      } catch (error) {
        setActionError("Odebrání ze seznamu se nezdařilo.");
      }
    })();
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
      errorMessage={actionError}
    />
  );
}

export default MemberListDetailRoute;

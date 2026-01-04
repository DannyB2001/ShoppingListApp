// src/routes/ShoppingListDetailRoute.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { INITIAL_MEMBERS } from "../data";
import ShoppingListDetail from "./components/ShoppingListDetail.jsx";
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
import { usePreferences } from "../context/PreferencesContext";

function ShoppingListDetailRoute() {
  const { t } = usePreferences();
  const { listId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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
      name: `User ${index + 1}`,
      isOwner: id === (passedList?.ownerId ?? "user-1"),
    }));
  }

  const [shoppingList, setShoppingList] = useState(null);
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);
  const [loadState, setLoadState] = useState({ status: "pending", error: null });

  const identity = { id: "user-1", name: "Daniel Novak" };

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
          setLoadState({ status: "error", error: t("detail.loadError") });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [listId, passedList, t]);

  if (loadState.status === "pending" || !shoppingList) {
    return (
      <div className="page-root">
        <div className="page-card">
          <p className="row-label-muted">{t("detail.loading")}</p>
        </div>
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="page-root">
        <div className="page-card">
          <p className="row-label-muted">{loadState.error}</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/owner_dashboard")}>
            {t("common.backToOverview")}
          </button>
        </div>
      </div>
    );
  }

  function handleRenameList(newName) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    updateListName({ id: listId, name: trimmed })
      .then((updated) => applyListState(updated))
      .catch(() => alert(t("detail.renameError")));
  }

  function handleAddMember(memberIdentity) {
    const memberId = memberIdentity.id || `user-${Date.now()}`;
    const name = memberIdentity.name || memberId;
    createMember({ id: memberId, name })
      .catch(() => Promise.resolve())
      .then(() => addMemberToList({ id: listId, memberId, isOwner: false }))
      .then((updated) => applyListState(updated))
      .catch(() => alert(t("detail.addMemberError")));
  }

  function handleRemoveMember(memberId) {
    removeMemberFromList({ id: listId, memberId })
      .then((updated) => applyListState(updated))
      .catch(() => alert(t("detail.removeMemberError")));
  }

  function handleAddItem(itemName) {
    const trimmed = itemName.trim();
    if (!trimmed) return;
    addItemToList({ id: listId, name: trimmed })
      .then((updated) => applyListState(updated))
      .catch(() => alert(t("detail.addItemError")));
  }

  function handleEditItem(itemId, newName) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    updateItemInList({ id: listId, itemId, name: trimmed })
      .then((updated) => applyListState(updated))
      .catch(() => alert(t("detail.editItemError")));
  }

  function handleDeleteItem(itemId) {
    removeItemFromList({ id: listId, itemId })
      .then((updated) => applyListState(updated))
      .catch(() => alert(t("detail.deleteItemError")));
  }

  function handleToggleItem(itemId, isResolved) {
    updateItemInList({ id: listId, itemId, isResolved })
      .then((updated) => applyListState(updated))
      .catch(() => alert(t("detail.updateItemError")));
  }

  function handleToggleFilter() {
    setShowUnresolvedOnly((prev) => !prev);
  }

  function handleShareList() {
    alert(t("detail.shareUnavailableOwner"));
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

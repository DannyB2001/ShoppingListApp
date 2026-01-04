// src/routes/components/ShoppingListDetail.jsx
import React from "react";
import EditableHeader from "./EditableHeader";
import MemberManagement from "./MemberManagement";
import ItemManagement from "./ItemManagement";
import DetailToolbar from "./DetailToolbar";
import AppToolbar from "./AppToolbar";
import ItemStatusChart from "./ItemStatusChart";
import { usePreferences } from "../../context/PreferencesContext";

function ShoppingListDetail({
  shoppingList,
  members,
  items,
  identity,
  showUnresolvedOnly,
  mode,
  errorMessage,
  onRenameList,
  onAddMember,
  onRemoveMember,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleItem,
  onToggleFilter,
  onShareList,
  onBack,
  onLeaveList,
}) {
  const { t } = usePreferences();
  const isOwner = shoppingList.ownerId === identity.id;

  const visibleItems = showUnresolvedOnly
    ? items.filter((it) => !it.isResolved)
    : items;
  const resolvedCount = items.filter((item) => item.isResolved).length;
  const unresolvedCount = items.length - resolvedCount;

  return (
    <div className="page-root">
      <div className="page-card">
        <AppToolbar />
        <div className="detail-hero">
          <div className="detail-hero-card">
            <EditableHeader
              listName={shoppingList.name}
              isInitialState={false}
              isOwner={mode === "owner" && isOwner}
              onRename={onRenameList}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">{t("items.eyebrow")}</div>
              <h2>{t("detail.statsTitle")}</h2>
            </div>
          </div>
          <ItemStatusChart
            resolvedCount={resolvedCount}
            unresolvedCount={unresolvedCount}
          />
        </section>

        <div className="detail-layout">
          <div className="detail-column detail-column--left">
            <MemberManagement
              members={members}
              currentUserId={identity.id}
              onAddMember={onAddMember}
              onRemoveMember={onRemoveMember}
              canLeave={mode === "member"}
              onLeave={() => onLeaveList && onLeaveList()}
            />
          </div>

          <div className="detail-column detail-column--right">
            <ItemManagement
              items={visibleItems}
              filterActive={showUnresolvedOnly}
              onToggleFilter={onToggleFilter}
              onAddItem={onAddItem}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onToggleItem={onToggleItem}
            />
          </div>
        </div>

        <DetailToolbar onBack={onBack} onShare={onShareList} />
      </div>
    </div>
  );
}

export default ShoppingListDetail;

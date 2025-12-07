// src/routes/components/ShoppingListDetail.jsx
import React from "react";
import EditableHeader from "./EditableHeader";
import MemberManagement from "./MemberManagement";
import ItemManagement from "./ItemManagement";
import DetailToolbar from "./DetailToolbar";

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
  const isOwner = shoppingList.ownerId === identity.id;

  const visibleItems = showUnresolvedOnly
    ? items.filter((it) => !it.isResolved)
    : items;

  return (
    <div className="page-root">
      <div className="page-card">
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

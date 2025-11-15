// src/routes/components/MemberManagement.jsx
import React, { useState } from "react";
import MemberList from "./MemberList";

function MemberManagement({
  members,
  currentUserId,
  onAddMember,
  onRemoveMember,
  canLeave,
  onLeave,
}) {
  const [newMemberName, setNewMemberName] = useState("");

  const isCurrentUserOwner = members.some(
    (member) => member.id === currentUserId && member.isOwner
  );

  function handleAddMemberSubmit(event) {
    event.preventDefault();
    const trimmedName = newMemberName.trim();
    if (!trimmedName) return;

    onAddMember({
      id: `user-${Date.now()}`,
      name: trimmedName,
    });
    setNewMemberName("");
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-eyebrow">Sdílený seznam</div>
          <h2>Členové seznamu</h2>
        </div>
        <span className="row-label-muted">{members.length} celkem</span>
      </div>

      <MemberList
        members={members}
        currentUserId={currentUserId}
        onRemoveMember={onRemoveMember}
        canManage={isCurrentUserOwner}
      />

      {isCurrentUserOwner && (
        <form className="detail-inline-form" onSubmit={handleAddMemberSubmit}>
          <input
            type="text"
            className="inline-input"
            placeholder="Jméno nebo e-mail"
            value={newMemberName}
            onChange={(event) => setNewMemberName(event.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newMemberName.trim()}
          >
            Pozvat člena
          </button>
        </form>
      )}

      {canLeave && !isCurrentUserOwner && (
        <div className="detail-inline-form">
          <button type="button" className="btn btn-danger" onClick={onLeave}>
            Odejít ze seznamu
          </button>
        </div>
      )}
    </section>
  );
}

export default MemberManagement;

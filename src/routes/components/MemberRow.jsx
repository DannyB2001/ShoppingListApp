// src/routes/components/MemberRow.jsx
import React from "react";

function MemberRow({ member, canBeRemoved, isCurrentUser, onRemove }) {
  return (
    <li className="row">
      <div className="row-main">
        <span className="item-name">{member.name}</span>
        {member.isOwner && <span className="badge badge-owner">Vlastník</span>}
        {isCurrentUser && <span className="badge badge-me">Ty</span>}
      </div>
      <div className="row-actions">
        {canBeRemoved && (
          <button type="button" className="btn btn-ghost" onClick={onRemove}>
            Odebrat
          </button>
        )}
      </div>
    </li>
  );
}

export default MemberRow;

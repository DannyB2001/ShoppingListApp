// src/routes/components/MemberRow.jsx
import React from "react";
import { usePreferences } from "../../context/PreferencesContext";

function MemberRow({ member, canBeRemoved, isCurrentUser, onRemove }) {
  const { t } = usePreferences();

  return (
    <li className="row">
      <div className="row-main">
        <span className="item-name">{member.name}</span>
        {member.isOwner && <span className="badge badge-owner">{t("members.ownerBadge")}</span>}
        {isCurrentUser && <span className="badge badge-me">{t("members.meBadge")}</span>}
      </div>
      <div className="row-actions">
        {canBeRemoved && (
          <button type="button" className="btn btn-ghost" onClick={onRemove}>
            {t("members.remove")}
          </button>
        )}
      </div>
    </li>
  );
}

export default MemberRow;

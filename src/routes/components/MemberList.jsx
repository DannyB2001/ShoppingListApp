// src/routes/components/MemberList.jsx
import React from "react";
import MemberRow from "./MemberRow";
import { usePreferences } from "../../context/PreferencesContext";

function MemberList({ members, currentUserId, onRemoveMember, canManage }) {
  const { t } = usePreferences();

  if (!members.length) {
    return <p className="row-label-muted">{t("members.empty")}</p>;
  }

  return (
    <ul className="detail-members-list">
      {members.map((member) => {
        const canBeRemoved = !member.isOwner && canManage;
        return (
          <MemberRow
            key={member.id}
            member={member}
            canBeRemoved={canBeRemoved}
            isCurrentUser={member.id === currentUserId}
            onRemove={() => onRemoveMember(member.id)}
          />
        );
      })}
    </ul>
  );
}

export default MemberList;

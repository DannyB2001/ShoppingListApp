// src/routes/components/EditableHeader.jsx
import React, { useEffect, useState } from "react";
import { usePreferences } from "../../context/PreferencesContext";

function EditableHeader({
  listName,
  initialValue,
  isInitialState,
  isOwner = true,
  onRename,
  onSave,
  level = 1,
}) {
  const { t } = usePreferences();
  const title = listName ?? initialValue ?? "";
  const action = onRename ?? onSave;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);

  useEffect(() => {
    setValue(title);
  }, [title]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setValue(title);
      setEditing(false);
      return;
    }
    if (action) {
      action(trimmedValue);
    }
    setEditing(false);
  }

  const TitleTag = `h${Math.min(Math.max(level, 1), 6)}`;
  const canEdit = isOwner && Boolean(action);

  return (
    <header className="detail-header">
      <div className="detail-title-block">
        {editing && canEdit ? (
          <form onSubmit={handleSubmit} className="title-edit-form">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="title-input"
              autoFocus
            />
            <button type="submit" className="btn btn-primary">
              {t("common.save")}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEditing(false);
                setValue(title);
              }}
            >
              {t("common.cancel")}
            </button>
          </form>
        ) : (
          <div className="title-row">
            <TitleTag className="title-text">{title}</TitleTag>
            {canEdit && (
              <button
                type="button"
                className="icon-button"
                onClick={() => setEditing(true)}
                aria-label={t("ownerLists.renameAria")}
              >
                {t("common.edit")}
              </button>
            )}
          </div>
        )}
        {isInitialState && (
          <div className="title-subtext">{t("ownerLists.newList")}</div>
        )}
      </div>
    </header>
  );
}

export default EditableHeader;

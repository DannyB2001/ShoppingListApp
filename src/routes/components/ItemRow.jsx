// src/routes/components/ItemRow.jsx
import React, { useEffect, useState } from "react";

function ItemRow({ item, onEdit, onDelete, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.name);

  useEffect(() => {
    setValue(item.name);
  }, [item.name]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setValue(item.name);
      setEditing(false);
      return;
    }
    onEdit(trimmedValue);
    setEditing(false);
  }

  function handleCancelEdit() {
    setValue(item.name);
    setEditing(false);
  }

  return (
    <li className="row">
      <div className="row-main">
        <input
          type="checkbox"
          checked={item.isResolved}
          onChange={(event) => onToggle(event.target.checked)}
        />

        {editing ? (
          <form className="row-edit-form" onSubmit={handleSubmit}>
            <input
              className="inline-input"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-small">
              Uložit
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={handleCancelEdit}
            >
              Zrušit
            </button>
          </form>
        ) : (
          <span
            className={`item-name${
              item.isResolved ? " item-name-resolved" : ""
            }`}
          >
            {item.name}
          </span>
        )}
      </div>

      {!editing && (
        <div className="row-actions">
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => setEditing(true)}
          >
            Upravit
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={onDelete}
          >
            Smazat
          </button>
        </div>
      )}
    </li>
  );
}

export default ItemRow;

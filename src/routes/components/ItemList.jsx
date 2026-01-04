// src/routes/components/ItemList.jsx
import React from "react";
import ItemRow from "./ItemRow";
import { usePreferences } from "../../context/PreferencesContext";

function ItemList({ items, onEdit, onDelete, onToggle }) {
  const { t } = usePreferences();

  if (!items.length) {
    return (
      <div className="detail-items-list">
        <p className="row-label-muted">{t("items.empty")}</p>
      </div>
    );
  }

  return (
    <ul className="detail-items-list">
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onEdit={(newName) => onEdit(item.id, newName)}
          onDelete={() => onDelete(item.id)}
          onToggle={(isResolved) => onToggle(item.id, isResolved)}
        />
      ))}
    </ul>
  );
}

export default ItemList;

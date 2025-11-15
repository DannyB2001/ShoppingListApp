// src/routes/components/ItemList.jsx
import React from "react";
import ItemRow from "./ItemRow";

function ItemList({ items, onEdit, onDelete, onToggle }) {
  if (!items.length) {
    return (
      <div className="detail-items-list">
        <p className="row-label-muted">Seznam je prázdný.</p>
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

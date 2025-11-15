// src/routes/components/ItemManagement.jsx
import React from "react";
import ItemFilter from "./ItemFilter";
import ItemList from "./ItemList";
import AddItemForm from "./AddItemForm";

function ItemManagement({
  items,
  filterActive,
  onToggleFilter,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleItem,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-eyebrow">Správa položek</div>
          <h2>Položky v seznamu</h2>
          <div className="row-label-muted">{items.length} zobrazených</div>
        </div>
        <ItemFilter filterActive={filterActive} onToggle={onToggleFilter} />
      </div>

      <ItemList
        items={items}
        onEdit={onEditItem}
        onDelete={onDeleteItem}
        onToggle={onToggleItem}
      />

      <AddItemForm onAdd={onAddItem} />
    </section>
  );
}

export default ItemManagement;

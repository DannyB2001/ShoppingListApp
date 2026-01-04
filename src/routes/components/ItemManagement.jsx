// src/routes/components/ItemManagement.jsx
import React from "react";
import ItemFilter from "./ItemFilter";
import ItemList from "./ItemList";
import AddItemForm from "./AddItemForm";
import { usePreferences } from "../../context/PreferencesContext";

function ItemManagement({
  items,
  filterActive,
  onToggleFilter,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleItem,
}) {
  const { t } = usePreferences();

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-eyebrow">{t("items.eyebrow")}</div>
          <h2>{t("items.title")}</h2>
          <div className="row-label-muted">{t("items.shown", { count: items.length })}</div>
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

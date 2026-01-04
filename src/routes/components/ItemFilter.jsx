// src/routes/components/ItemFilter.jsx
import React from "react";
import { usePreferences } from "../../context/PreferencesContext";

function ItemFilter({ filterActive, onToggle }) {
  const { t } = usePreferences();

  return (
    <button
      type="button"
      className={`btn ${filterActive ? "btn-primary" : "btn-ghost"}`}
      onClick={onToggle}
      aria-pressed={filterActive}
    >
      {filterActive ? t("items.showAll") : t("items.showUnresolved")}
    </button>
  );
}

export default ItemFilter;

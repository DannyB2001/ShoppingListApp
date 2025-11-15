// src/routes/components/ItemFilter.jsx
import React from "react";

function ItemFilter({ filterActive, onToggle }) {
  return (
    <button
      type="button"
      className={`btn ${filterActive ? "btn-primary" : "btn-ghost"}`}
      onClick={onToggle}
      aria-pressed={filterActive}
    >
      {filterActive ? "Zobrazit všechny položky" : "Jen nevyřešené"}
    </button>
  );
}

export default ItemFilter;

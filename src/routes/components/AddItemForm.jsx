// src/routes/components/AddItemForm.jsx
import React, { useState } from "react";

function AddItemForm({ onAdd }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    onAdd(trimmedValue);
    setValue("");
  }

  return (
    <form className="detail-inline-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="inline-input"
        value={value}
        placeholder="Co je potřeba dokoupit?"
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!value.trim()}
      >
        Přidat položku
      </button>
    </form>
  );
}

export default AddItemForm;

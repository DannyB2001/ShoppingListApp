// src/routes/components/AddItemForm.jsx
import React, { useState } from "react";
import { usePreferences } from "../../context/PreferencesContext";

function AddItemForm({ onAdd }) {
  const { t } = usePreferences();
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
        placeholder={t("items.addPlaceholder")}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!value.trim()}
      >
        {t("items.add")}
      </button>
    </form>
  );
}

export default AddItemForm;

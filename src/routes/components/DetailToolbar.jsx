// src/routes/components/DetailToolbar.jsx
import React from "react";

function DetailToolbar({ onBack, onShare }) {
  function handleCopyLink() {
    const url = window.location.href;
    if (!navigator?.clipboard) {
      alert("Tvůj prohlížeč nepodporuje kopírování do schránky.");
      return;
    }
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Odkaz zkopírován do schránky."))
      .catch(() => alert("Nepodařilo se zkopírovat odkaz."));
  }

  return (
    <footer className="detail-toolbar">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        {"<-"} Zpět na přehled
      </button>

      <div className="detail-toolbar-right">
        <button type="button" className="btn btn-ghost" onClick={onShare}>
          Sdílet seznam
        </button>
        <button type="button" className="btn btn-primary" onClick={handleCopyLink}>
          Kopírovat odkaz
        </button>
      </div>
    </footer>
  );
}

export default DetailToolbar;

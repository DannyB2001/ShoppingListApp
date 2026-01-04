// src/routes/components/DetailToolbar.jsx
import React from "react";
import { usePreferences } from "../../context/PreferencesContext";

function DetailToolbar({ onBack, onShare }) {
  const { t } = usePreferences();

  function handleCopyLink() {
    const url = window.location.href;
    if (!navigator?.clipboard) {
      alert(t("detail.copyUnsupported"));
      return;
    }
    navigator.clipboard
      .writeText(url)
      .then(() => alert(t("detail.copySuccess")))
      .catch(() => alert(t("detail.copyFail")));
  }

  return (
    <footer className="detail-toolbar">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        {"<-"} {t("common.backToOverview")}
      </button>

      <div className="detail-toolbar-right">
        <button type="button" className="btn btn-ghost" onClick={onShare}>
          {t("detail.shareList")}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleCopyLink}>
          {t("detail.copyLink")}
        </button>
      </div>
    </footer>
  );
}

export default DetailToolbar;

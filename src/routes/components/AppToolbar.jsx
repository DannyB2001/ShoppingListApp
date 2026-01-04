// src/routes/components/AppToolbar.jsx
import React from "react";
import { usePreferences } from "../../context/PreferencesContext";

function AppToolbar() {
  const { locale, setLocale, theme, setTheme, t } = usePreferences();

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="app-toolbar">
      <div className="app-toolbar-group">
        <span className="row-label-muted">{t("toolbar.language")}</span>
        <div className="segmented">
          <button
            type="button"
            className={`segmented-btn${locale === "cs" ? " is-active" : ""}`}
            onClick={() => setLocale("cs")}
            aria-pressed={locale === "cs"}
          >
            CZ
          </button>
          <button
            type="button"
            className={`segmented-btn${locale === "en" ? " is-active" : ""}`}
            onClick={() => setLocale("en")}
            aria-pressed={locale === "en"}
          >
            EN
          </button>
        </div>
      </div>
      <div className="app-toolbar-group">
        <span className="row-label-muted">{t("toolbar.theme")}</span>
        <button type="button" className="btn btn-ghost" onClick={toggleTheme}>
          {theme === "dark" ? t("toolbar.light") : t("toolbar.dark")}
        </button>
      </div>
    </div>
  );
}

export default AppToolbar;

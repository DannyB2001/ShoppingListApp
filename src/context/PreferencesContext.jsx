// src/context/PreferencesContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const PreferencesContext = createContext(null);

const THEME_STORAGE_KEY = "shoppinglist.theme";
const LOCALE_STORAGE_KEY = "shoppinglist.locale";

function resolveInitialTheme() {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

function resolveInitialLocale() {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "cs" || stored === "en") return stored;
  return "cs";
}

function interpolate(text, params) {
  if (!params) return text;
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replaceAll(`{${key}}`, String(value));
  }, text);
}

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState(resolveInitialTheme);
  const [locale, setLocale] = useState(resolveInitialLocale);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const t = useCallback(
    (key, params) => {
      const value = key
        .split(".")
        .reduce((acc, part) => (acc && acc[part] ? acc[part] : null), translations[locale]);
      if (typeof value === "string") {
        return interpolate(value, params);
      }
      return key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      locale,
      setLocale,
      t,
    }),
    [theme, locale, t]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}

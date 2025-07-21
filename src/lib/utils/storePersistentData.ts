/**
 * Stores a string value in multiple persistent storage layers: cookies, sessionStorage, and localStorage.
 *
 * This function attempts to persist the provided key-value pair in three different client-side storage systems:
 * 1. **Cookie** — with a max-age of 1 year.
 * 2. **sessionStorage** — scoped to the session/tab.
 * 3. **localStorage** — persists indefinitely (until explicitly removed).
 *
 * If executed in a non-browser environment (e.g., server-side rendering), the function exits early and does nothing.
 *
 * @param {string} key - The name under which the value will be stored.
 * @param {string} value - The string value to persist.
 *
 * @returns {void}
 */

export const storePersistentData = (key: string, value: string) => {
  if (typeof window === 'undefined') return;

  document.cookie = `${key}=${value}; max-age=31536000`;
  sessionStorage.setItem(key, value);
  localStorage.setItem(key, value);
};

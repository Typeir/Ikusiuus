/**
 * Retrieves a string value associated with a given key from persistent storage layers:
 * cookies, sessionStorage, and localStorage, in that order of priority.
 *
 * Lookup order:
 * 1. **Cookies** — returns the value if a matching cookie is found.
 * 2. **sessionStorage** — returns the value if present.
 * 3. **localStorage** — returns the value if present.
 *
 * If the function is called in a non-browser environment (e.g., server-side),
 * it exits early and returns `null`.
 *
 * @param {string} key - The key whose value should be retrieved from persistent storage.
 *
 * @returns {string | null} The retrieved value as a string, or `null` if not found or if outside the browser.
 */
export const fetchPersistentData = (key: string): string | null => {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`));
  if (cookies) return cookies.split('=')[1];

  const session = sessionStorage.getItem(key);
  if (session) return session;

  return localStorage.getItem(key);
};

/**
 * Converts a dash-separated string (e.g., kebab-case) to Title Case.
 * Collapses multiple dashes into a single space.
 *
 * Example:
 * - "iron-snail---warrior" → "Iron Snail Warrior"
 *
 * @param {string} str - The input string using dashes as separators.
 * @returns {string} The converted string in Title Case with normalized spacing.
 */
export const toTitleCase = (str: string) =>
  str.replace(/-+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

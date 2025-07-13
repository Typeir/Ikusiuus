/**
 * Converts a string to kebab-case.
 *
 * Example:
 *   "My Example String" -> "my-example-string"
 *
 * @param {string} str - The input string to convert.
 * @returns {string} The kebab-case formatted string.
 */
export const toKebabCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();

/**
 * Wraps a number around if it exceeds the given bounds.
 *
 * - If `val` is greater than `max`, returns `min`.
 * - If `val` is less than `min`, returns `max`.
 * - Otherwise, returns `val`.
 *
 * Useful for cyclic ranges (e.g., angle wrapping, index rotation).
 *
 * @param {number} val - The value to clamp circularly.
 * @param {number} min - The minimum bound of the range.
 * @param {number} max - The maximum bound of the range.
 *
 * @returns {number} The adjusted value, wrapped if outside bounds.
 */
export const circularClamp = (
  val: number,
  min: number,
  max: number
): number => {
  return val > max ? min : val < min ? max : val;
};

export const circularClamp = (val: number, min: number, max: number) => {
  return val > max ? min : val < min ? max : val;
};

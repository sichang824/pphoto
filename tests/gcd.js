
export const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const calcRatio = (w, h) => {
  const divisor = gcd(w, h);
  return `${w / divisor}/${h / divisor}`;
};

console.log(gcd(297, 420));
console.log(calcRatio(297, 420));

export const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const calcRatio = (w, h) => {
  const divisor = gcd(w, h);
  return `${w / divisor}/${h / divisor}`;
};

console.log(calcRatio(297, 420));
console.log(calcRatio(148, 210));
console.log(calcRatio(102, 152));
console.log("一寸", calcRatio(25, 35));
console.log("二寸", calcRatio(33, 48));
console.log("三寸", calcRatio(62, 85));
console.log("五寸", calcRatio(89, 127));
console.log("六寸", calcRatio(102, 152));
console.log("大六寸", calcRatio(114, 152));
console.log(calcRatio(127, 178));
console.log("八寸", calcRatio(152, 203));
console.log("A4", calcRatio(210, 297));
console.log("A3", calcRatio(297, 420));

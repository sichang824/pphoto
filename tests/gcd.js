export const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const calcRatio = (w, h) => {
  const divisor = gcd(w, h);
  return `${w / divisor}/${h / divisor}`;
};

console.log(calcRatio(297, 420));
console.log(calcRatio(148, 210));
console.log(calcRatio(102, 152));

// { name: "1:1", width: 102, height: 102, id: "1", imageRatio: "1/1", custom: false  },
// { name: "一寸", width: 25, height: 35, id: "2", imageRatio: "5/7", custom: false },
// { name: "二寸", width: 33, height: 48, id: "3", imageRatio: "33/48", custom: false },
// { name: "三寸", width: 62, height: 85, id: "4", imageRatio: "62/85", custom: false },
// { name: "五寸", width: 89, height: 127, id: "5", imageRatio: "89/127", custom: false },
// { name: "六寸", width: 102, height: 152, id: "6", imageRatio: "102/152", custom: false },
// { name: "大六寸", width: 114, height: 152, id: "7", imageRatio: "114/152", custom: false },
// { name: "七寸", width: 127, height: 178, id: "8", imageRatio: "127/178", custom: false },
// { name: "八寸", width: 152, height: 203, id: "9", imageRatio: "152/203", custom: false },
// { name: "A4", width: 210, height: 297, id: "10", imageRatio: "70/99", custom: false },
// { name: "A3", width: 297, height: 420, id: "11", imageRatio: "99/140", custom: false },

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

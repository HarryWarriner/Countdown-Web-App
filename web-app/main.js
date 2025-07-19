const smallNum = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
const bigNum = [25,50,75,100]
let outputNumbers =[]
let numBig = 2

function getRandomSmall() {
    randomSmall = smallNum[Math.floor(Math.random() * smallNum.length)];
    return randomSmall;
}
function getRandomBig() {
    randomBig = bigNum[Math.floor(Math.random() * bigNum.length)];
    return randomBig;
}

function getAimNum() {
    return Math.floor(Math.random() * (999 - 100) + 100);
}

for (let b = 0; b < numBig; b++) {
    outputNumbers.push(getRandomBig())
}
for (let i = 0; i < (6 - numBig); i++) {
  outputNumbers.push(getRandomSmall())
}

console.log("Aim:", getAimNum())
console.log("Numbers:", outputNumbers)
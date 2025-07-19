const smallNum = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
const bigNum = [25,50,75,100]
let outputNumbers =[]
let numBig = 2
let playerScore = 0

// Getting random numbers for game setup
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

// Picking an amount of big and amount of small numbers:

for (let b = 0; b < numBig; b++) {
    outputNumbers.push(getRandomBig());
}
for (let i = 0; i < (6 - numBig); i++) {
  outputNumbers.push(getRandomSmall());
}

goalValue = getAimNum();

// end game check, and score

if (playerValue === goalValue) {
    playerScore += 10
} else if(Maths.abs(playerValue - goalValue) <= 10){
    playerScore += 7
} else {
    
}




console.log("Aim:", goalValue)
console.log("Numbers:", outputNumbers)
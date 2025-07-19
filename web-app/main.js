const el = (id) => document.getElementById(id);

const goalNum = el("goalNumber");
const playNums = el("numbers");
const newRound = el("newRound");
const submitPlayerScore = el("Submit");
const score = el("score");
const playerResult = el("playerResult");



const smallNum = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
const bigNum = [25,50,75,100];
let outputNumbers =[];

let playerScore = 0;

var canSubmit;

canSubmit = false;
newRound.onclick = () => {
    const numBig = parseInt(el("numBig").value) || 3;
    console.log("New Round");
    outputNumbers = [];
    // Picking an amount of big and amount of small numbers:
    for (let b = 0; b < numBig; b++) {
        outputNumbers.push(getRandomBig());
    }
    for (let i = 0; i < (6 - numBig); i++) {
        outputNumbers.push(getRandomSmall());
    }

    goalValue = getAimNum();
    goalNum.innerHTML = goalValue;
    playNums.innerHTML = outputNumbers;
    canSubmit = true;
}
submitPlayerScore.onclick = () => {
    if (canSubmit === true){
    const playerValue = parseInt(el("playerResult").value);
    // end game check, and score
    if (playerValue === goalValue) {
        playerScore += 10
    } else if(Math.abs(playerValue - goalValue) <= 10){
        playerScore += 7
    };
    score.innerHTML = playerScore;
    canSubmit = false;
}

}

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

// time:

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


nextRound()









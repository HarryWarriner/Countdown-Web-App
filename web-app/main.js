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



const currentResultDisplay = el("currentResult");

let hasScored = false;
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
    hasScored = false;
    score.innerHTML = `Score: ${playerScore}`;
    goalValue = getAimNum();
    goalNum.innerHTML = goalValue;
    currentResult = null;
    currentResultDisplay.textContent = '';
    historyStack = [];
    originalNumbers = [...outputNumbers];
    renderNumbers();
    canSubmit = true;
}
// submitPlayerScore.onclick = () => {
//     if (canSubmit === true){
//     const playerValue = parseInt(el("playerResult").value);
//     // end game check, and score
//     if (playerValue === goalValue) {
//         playerScore += 10
//     } else if(Math.abs(playerValue - goalValue) <= 10){
//         playerScore += 7
//     };
//     score.innerHTML = playerScore;
//     canSubmit = false;
// }

// }

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



// operations:

let selectedNumbers = [];
let selectedOperator = null;
let currentResult = null;
let historyStack = [];
let originalNumbers = [];


el("plus").onclick = () => setOperator('+');
el("minus").onclick = () => setOperator('-');
el("multiply").onclick = () => setOperator('x');
el("divide").onclick = () => setOperator('/');

const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    'x': (a, b) => a * b,
    '/': (a, b) => b !== 0 ? a / b : null
};

function renderNumbers() {
    playNums.innerHTML = '';
    outputNumbers.forEach((num, idx) => {
    if (num !== null) {
        const btn = document.createElement('button');
        btn.textContent = num;
        btn.dataset.index = idx; // store original index
        btn.onclick = () => clickNumber(parseInt(btn.dataset.index));
        playNums.appendChild(btn);
    }
    });
}


function clickNumber(index) {
    if (selectedNumbers < 2) {
        selectedNumbers.push(index)
        highlightSelectedNumbers();
    }
    if (selectedNumbers.length === 2 && selectedOperator !== null){
        performOperation();
    }
}

function highlightSelectedNumbers() {
    const buttons = playNums.querySelectorAll('button');
    buttons.forEach((btn, idx) => {
    btn.style.backgroundColor = selectedNumbers.includes(idx) ? '#ddd' : '';
    });
}

function setOperator(op) {
    selectedOperator = op;
    if (selectedNumbers.length === 2) {
    performOperation();
    }
}
function performOperation() {
    const [firstIdx, secondIdx] = selectedNumbers;
    const a = outputNumbers[firstIdx];
    const b = outputNumbers[secondIdx];
    const result = operators[selectedOperator](a, b);

    if (result === null || isNaN(result) || result < 0 || !Number.isInteger(result)) {
    alert("Invalid operation: result must be a non-negative whole number.");
    resetSelection();
    return;
    }

    // Save to history before mutating
    historyStack.push({
    numbers: [...outputNumbers],
    currentResult: currentResult
    });

    outputNumbers[firstIdx] = result;
    outputNumbers[secondIdx] = null;
    currentResult = result;
    currentResultDisplay.textContent = result;

    if (!hasScored && canSubmit) {
        const diff = Math.abs(result - goalValue);
        if (diff === 0) {
            playerScore += 10;
            hasScored = true;
            score.innerHTML = `🎯 Exact! +10 points<br>Score: ${playerScore}`;
        } else if (diff <= 10) {
            playerScore += 7;
            hasScored = true;
            score.innerHTML = `⚡ Close! +7 points<br>Score: ${playerScore}`;
        }
    }


    resetSelection();
    renderNumbers();
}

function resetSelection() {
    selectedNumbers = [];
    selectedOperator = null;
}

el("undo").onclick = () => {
    if (historyStack.length === 0) {
    alert("Nothing to undo.");
    return;
    }

    const lastState = historyStack.pop();
    outputNumbers = [...lastState.numbers];
    currentResult = lastState.currentResult;
    currentResultDisplay.textContent = currentResult ?? '';
    resetSelection();
    renderNumbers();
};


el("reset").onclick = () => {
    outputNumbers = [...originalNumbers];
    historyStack = [];
    currentResult = null;
    currentResultDisplay.textContent = '';
    resetSelection();
    renderNumbers();
};

import Logic from './logic.js';

// Helper to get DOM element by ID
const el = (id) => document.getElementById(id);

// DOM Elements
const timerDisplay = el("timer");
const goalNum = el("goalNumber");
const playNums = el("numbers");
const newRound = el("newRound");
const errorMsg = el("errorMsg");
const solveExp = el("solveExp");
const scoreDisplay = el("score");
const currentResultDisplay = el("currentResult");
const submitBtn = el("submit")

const btnPlus = el("plus");
const btnMinus = el("minus");
const btnMultiply = el("multiply");
const btnDivide = el("divide");
const btnUndo = el("undo");
const btnReset = el("reset");

// Game state
let timerInterval = null;
let timeLeft = 30;
let outputNumbers = [];
let originalNumbers = [];
let selectedNumbers = [];
let selectedOperator = null;
let currentResult = null;
let historyStack = [];
let goalValue = null;
let playerScore = 0;
let hasScored = false;
let canSubmit = false;
let buttonIndexMap = [];


// Start new round
newRound.onclick = () => {
    const numBig = parseInt(el("numBig").value) || 3;
    outputNumbers = Logic.getRandomNumbers(numBig, Logic.smallNum, Logic.bigNum);

    originalNumbers = [...outputNumbers];
    goalValue = Logic.getAimNum();
    historyStack = [];
    selectedNumbers = [];
    selectedOperator = null;
    currentResult = null;
    canSubmit = true;
    hasScored = false;

    goalNum.textContent = goalValue;
    solveExp.innerHTML ='';
    errorMsg.innerHTML = '';
    currentResultDisplay.textContent = '';
    scoreDisplay.innerHTML = `Score: ${playerScore}`;

    console.log(originalNumbers);
    console.log(goalValue);

    renderNumbers();
    startTimer();
};

function startTimer() {
    clearInterval(timerInterval); // clear old timer if any
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "0";
            errorMsg.innerHTML = "Time's up!";
            submitScore();
            
        }
    }, 1000);
}


// Submit button
submitBtn.onclick =() => {
    submitScore();
}

// Operator buttons
btnPlus.onclick = () => setOperator('+');
btnMinus.onclick = () => setOperator('-');
btnMultiply.onclick = () => setOperator('x');
btnDivide.onclick = () => setOperator('/');

// Undo last step
btnUndo.onclick = () => {
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

// Reset round
btnReset.onclick = () => {
    outputNumbers = [...originalNumbers];
    historyStack = [];
    currentResult = null;
    currentResultDisplay.textContent = '';
    resetSelection();
    renderNumbers();
};

// Render buttons for number pool
function renderNumbers() {
    playNums.innerHTML = '';
    buttonIndexMap = [];

    let closestNum = null;
    let minDiff = Infinity;

    outputNumbers.forEach((num, idx) => {
        if (num !== null) {
            const btn = document.createElement('button');
            btn.textContent = num;
            const visibleIndex = buttonIndexMap.length;
            buttonIndexMap.push(idx);

            btn.dataset.visibleIndex = visibleIndex;
            btn.onclick = () => handleNumberClick(visibleIndex);
            playNums.appendChild(btn);

            // Update closest number
            const diff = Math.abs(num - goalValue);
            if (diff < minDiff) {
                closestNum = num;
                minDiff = diff;
            }
        }
    });

    // Always show the closest number
    currentResult = closestNum;
    currentResultDisplay.textContent = `${closestNum} (closest)`;
}


// When number button is clicked
function handleNumberClick(visibleIndex) {
    const realIndex = buttonIndexMap[visibleIndex];

    // Deselect
    if (selectedNumbers.includes(realIndex)) {
        selectedNumbers = selectedNumbers.filter(i => i !== realIndex);
        highlightSelection();
       
        return;
    }

    if (selectedNumbers.length < 2) {
        selectedNumbers.push(realIndex);
        highlightSelection();

     
    }

    if (selectedNumbers.length === 2 && selectedOperator) {
        performSelectedOperation();
    }
}

// Highlight selected buttons
function highlightSelection() {
    const buttons = playNums.querySelectorAll('button');
    buttons.forEach((btn, visibleIdx) => {
        const realIdx = buttonIndexMap[visibleIdx];
        btn.style.backgroundColor = selectedNumbers.includes(realIdx) ? '#ddd' : '';
    });
}


// Set operator
function setOperator(op) {
    selectedOperator = op;
    if (selectedNumbers.length === 2) {
        performSelectedOperation();
    }
}

// Run calculation
function performSelectedOperation() {
    const [firstIdx, secondIdx] = selectedNumbers;
    const a = outputNumbers[firstIdx];
    const b = outputNumbers[secondIdx];
    const result = Logic.performOperation(a, b, selectedOperator);
    errorMsg.innerHTML = '';

    if (result === null) {
        errorMsg.innerHTML = ' Invalid Operation, cant be negative or a fraction';
        resetSelection();
        return;
    }

    historyStack.push({
        numbers: [...outputNumbers],
        currentResult
    });

    outputNumbers[firstIdx] = result;
    outputNumbers[secondIdx] = null;

    // if (!hasScored && canSubmit) {
    //     const scoreEarned = Logic.calculateScore(result, goalValue);
    //     if (scoreEarned > 0) {
    //         playerScore += scoreEarned;
    //         hasScored = true;

    //         const msg = scoreEarned === 10
    //             ? `Exact! +10 points<br>Score: ${playerScore}`
    //             : `Close! +7 points<br>Score: ${playerScore}`;
    //         scoreDisplay.innerHTML = msg;
    //     }
    // }

    resetSelection();
    renderNumbers();
}

function submitScore() {
    if (!canSubmit || hasScored) return;

    if (currentResult === null) {
        scoreDisplay.innerHTML = `Please select a number.`;
        return;
    }

    const scoreEarned = Logic.calculateScore(currentResult, goalValue);
    if (scoreEarned > 0) {
        playerScore += scoreEarned;

        const msg = scoreEarned === 10
            ? `Exact! +10 points<br>Score: ${playerScore}`
            : `Close! +7 points<br>Score: ${playerScore}`;
        scoreDisplay.innerHTML = msg;
    } else {
        scoreDisplay.innerHTML = `Too far! No points<br>Score: ${playerScore}`;
    }
    canSubmit = false;
    console.log("HI")
    const  method = Logic.Solver(originalNumbers, goalValue);
    solveExp.innerHTML = `How To: ${method}`;

}

// Reset selected numbers and operator
function resetSelection() {
    selectedNumbers = [];
    selectedOperator = null;
}

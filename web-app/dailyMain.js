import Logic from './logic.js';
fetch('./assets/dailyGames.json')
  .then(res => res.json())
  .then(data => {
    console.log("Loaded game data:", data);

// Helper to get DOM element by ID
const el = (id) => document.getElementById(id);

// DOM Elements
const timerDisplay = el("timer");
const currentRound = el("round");
const goalNum = el("goalNumber");
const playNums = el("numbers");
const startGame = el("startGameBtn");
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
let timeLeft = 60;
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
let canNextRound = true;
let buttonIndexMap = [];
let round = 0;
let bestResultSoFar = null;
let nextTurnModalShow = true;


let today = new Date();
let date = today.toISOString().split('T')[0];
console.log("Today:", date);

startGame.onclick = () => {
   nextround()
};

// Start new round
newRound.onclick = () => {
   nextround()
};


function nextround() {
    if (round >= 10) {
            showEndRoundModal({
            title: "Game Over!",
            message: "Thanks for playing. Here's your final score:",
            score: playerScore,
            isGameOver: true
            });
        return;
    }

    if (canNextRound) {
        $("#endRoundModal").modal("hide");
        console.log("numBig");
        outputNumbers = data[date].outputNumbersArray[round];

        originalNumbers = [...outputNumbers];
        goalValue = data[date].goalValueArray[round];
        console.log("Output Numbers:", originalNumbers);
        console.log("Goal Number:", goalValue);
        historyStack = [];
        selectedNumbers = [];
        nextTurnModalShow = true;
        selectedOperator = null;
        currentResult = null;
        bestResultSoFar = null;
        canSubmit = true;
        hasScored = false;

        goalNum.textContent = goalValue;
        currentRound.innerHTML = `Round: ${round + 1}/10`;
        solveExp.innerHTML ='';
        errorMsg.innerHTML = '';
        currentResultDisplay.textContent = '';
        scoreDisplay.innerHTML = `Score: ${playerScore}`;

        console.log(originalNumbers);
        console.log(goalValue);
            
        renderNumbers();
        startTimer();
        // $("#timesUpModal").modal("hide");
        // $("#congratsModal").modal("hide");
        canNextRound = false;
    }
};

function startTimer() {
    clearInterval(timerInterval); // clear old timer if any
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "0";
            // errorMsg.innerHTML = "Time's up!";
            submitScore();

            if (nextTurnModalShow ){
                setTimeout(() => {
                    showEndRoundModal({
                        title: "Time's Up!",
                        message: "You ran out of time.",
                        score: playerScore
                    });
                }, 300);
                canNextRound = true;
            }
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
    // currentResultDisplay.textContent = '';
    resetSelection();
    renderNumbers();
};

function showEndRoundModal({ title, message, score, isGameOver = false }) {
    document.getElementById("endRoundTitle").textContent = title;
    document.getElementById("endRoundMessage").textContent = message;
    document.getElementById("endRoundScore").textContent = score;

    const nextBtn = document.getElementById("newRound");
    if (isGameOver) {
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "inline-block";
    }

    $("#endRoundModal").modal("show");
}



// Render buttons for number pool
function renderNumbers() {
    playNums.innerHTML = '';
    buttonIndexMap = [];

    // let closestNum = null;
    // let minDiff = Infinity;

    outputNumbers.forEach((num, idx) => {
        if (num !== null) {
            const btn = document.createElement('button');
            btn.textContent = num;
            const visibleIndex = buttonIndexMap.length;
            buttonIndexMap.push(idx);

            btn.dataset.visibleIndex = visibleIndex;
            btn.onclick = () => handleNumberClick(visibleIndex);
            playNums.appendChild(btn);

            // Update bestResultSoFar
            const diff = Math.abs(num - goalValue);
            if (bestResultSoFar === null || Math.abs(bestResultSoFar - goalValue) > diff) {
                bestResultSoFar = num;
            }
        }
    });

    // // Always show the closest number
    // currentResult = closestNum;
    // currentResultDisplay.textContent = `${closestNum} (closest)`;
    // Display the best result so far
    currentResult = bestResultSoFar;
    if (bestResultSoFar !== null) {
        currentResultDisplay.textContent = `Closest: ${bestResultSoFar} `;
    } else {
        currentResultDisplay.textContent = '';
    }
    highlightSelection();
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



    const diff = Math.abs(result - goalValue);
    if (bestResultSoFar === null || Math.abs(bestResultSoFar - goalValue) > diff) {
        bestResultSoFar = result;
    }

    // Check for exact match!
    if (result === goalValue && canSubmit && !hasScored) {
        playerScore += 10;
        hasScored = true;
        canSubmit = false;
        nextTurnModalShow = false;
        timeLeft = 0;
        round += 1;
        canNextRound = true;
        showEndRoundModal({
            title: "Congratulations!",
            message: "You hit the target exactly!",
            score: playerScore
        });

        

        const method = Logic.Solver(originalNumbers, goalValue);
        solveExp.innerHTML = `How To: ${method}`;
        resetSelection();
        renderNumbers();
        return; // don't continue to renderNumbers again
    }

    // Automatically select the newly created number
    // selectedNumbers = [firstIdx];
    // highlightSelection();

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
        errorMsg.innerHTML = `Please select a number.`;
        return;
    }

    const scoreEarned = Logic.calculateScore(currentResult, goalValue);
    if (scoreEarned > 0) {
        playerScore += scoreEarned;

        const msg = scoreEarned === 10
            ? `Exact! +10 points`
            : `Close! +7 points`;
        errorMsg.innerHTML = msg;
        scoreDisplay.innerHTML = `Score: ${playerScore}`;
    } else {
        errorMsg.innerHTML = `Too far! No points`;
        scoreDisplay.innerHTML = `Score: ${playerScore}`;
    }
    canSubmit = false;
    console.log("HI")
    const  method = Logic.Solver(originalNumbers, goalValue);
    solveExp.innerHTML = `How To: ${method}`;
    timeLeft = 0;
    // round += 1;
    if (round < 10) {
        round += 1;
    }


}

// Reset selected numbers and operator
function resetSelection() {
    selectedNumbers = [];
    selectedOperator = null;
}

  });
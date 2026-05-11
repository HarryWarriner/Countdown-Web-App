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

const continueUntimedBtn = el("continueUntimed");
const showAnswerBtn = el("showAnswerBtn");

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
let isUntimedPractice = false;

let roundsSummary = []; // { round, target, got, points }



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
    if (round >= 5) {
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
        console.log("Stored", roundsSummary);
        historyStack = [];
        selectedNumbers = [];
        nextTurnModalShow = true;
        selectedOperator = null;
        currentResult = null;
        bestResultSoFar = null;
        canSubmit = true;
        hasScored = false;
        isUntimedPractice = false;

        goalNum.textContent = goalValue;
        currentRound.textContent = `Round: ${round + 1}/5`;
        solveExp.textContent ='';
        errorMsg.textContent = '';
        currentResultDisplay.textContent = '';
        scoreDisplay.textContent = `${playerScore}`;

            
        renderNumbers();
        startTimer();
        // $("#timesUpModal").modal("hide");
        // $("#congratsModal").modal("hide");
        canNextRound = false;
    }
};

function endRound() {
  canSubmit = false;
  hasScored = true;
  stopTimer();
  if (round < 5) round += 1;
  canNextRound = true;
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function startTimer() {
    stopTimer();
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            stopTimer();

            submitScore(false); // score is recorded, but answer is hidden

            if (nextTurnModalShow) {
                setTimeout(() => {
                    showEndRoundModal({
                        title: "Time's Up!",
                        message: "Your score has been recorded. You can keep trying for fun, or reveal the answer and move on.",
                        score: playerScore,
                        showAnswer: false,
                        allowUntimed: true
                    });
                }, 300);
            }
        }
    }, 1000);
}


// Submit button
submitBtn.onclick = () => {
  if (isUntimedPractice) {
    showEndRoundModal({
      title: "Practice Finished",
      message: "Your score was already recorded when time ran out.",
      score: playerScore,
      showAnswer: true,
      allowUntimed: false
    });

    const method = Logic.Solver(originalNumbers, goalValue);
    solveExp.textContent = `How To: ${method}`;
    solveExp.style.display = "block";

    canNextRound = true;
    return;
  }

  if (!canSubmit || hasScored) return;

  stopTimer();
  submitScore(true);

  if (nextTurnModalShow) {
    showEndRoundModal({
      title: "End of Round",
      message: "You skipped the timer.",
      score: playerScore,
      showAnswer: true
    });

    canNextRound = true;
  }
};

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

continueUntimedBtn.onclick = () => {
  $("#endRoundModal").modal("hide");

  isUntimedPractice = true;
  canSubmit = false;
  hasScored = true;
  canNextRound = false;

  timerDisplay.textContent = "∞";
  errorMsg.textContent =
    "Practice mode: score already recorded. Press Skip / Submit Round when finished.";
};

showAnswerBtn.onclick = () => {
    const method = Logic.Solver(originalNumbers, goalValue);

    solveExp.textContent = `How To: ${method}`;
    solveExp.style.display = "block";

    showAnswerBtn.style.display = "none";
    continueUntimedBtn.style.display = "none";
    newRound.style.display = "inline-block";

    canNextRound = true;
};

function showEndRoundModal({
    title,
    message,
    score,
    isGameOver = false,
    showAnswer = true,
    allowUntimed = false
}) {
    document.getElementById("endRoundTitle").textContent = title;
    document.getElementById("endRoundMessage").textContent = message;
    document.getElementById("endRoundScore").textContent = score;

    const nextBtn = document.getElementById("newRound");
    const continueBtn = document.getElementById("continueUntimed");
    const showAnswerButton = document.getElementById("showAnswerBtn");
    const solve = document.getElementById("solveExp");
    const tableContainer = document.getElementById("summaryTableContainer");

    solve.textContent = '';
    solve.style.display = 'none';
    tableContainer.style.display = 'none';

    if (isGameOver) {
        nextBtn.style.display = "none";
        continueBtn.style.display = "none";
        showAnswerButton.style.display = "none";

        populateSummaryTable();
        tableContainer.style.display = 'block';
    } else if (allowUntimed) {
        nextBtn.style.display = "none";
        continueBtn.style.display = "inline-block";
        showAnswerButton.style.display = "inline-block";
    } else {
        nextBtn.style.display = "inline-block";
        continueBtn.style.display = "none";
        showAnswerButton.style.display = "none";

        if (showAnswer) {
            solve.style.display = 'block';
        }
    }

    $("#endRoundModal").modal("show");
}


// Render buttons for number pool
function renderNumbers() {
    playNums.textContent = '';
    buttonIndexMap = [];

    // let closestNum = null;
    // let minDiff = Infinity;

    outputNumbers.forEach((num, idx) => {
        if (num !== null) {
            const btn = document.createElement('button');
            btn.className = 'number-btn';
            btn.type = 'button';
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
        currentResultDisplay.textContent = ` ${bestResultSoFar} `;
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
        btn.classList.toggle('selected', selectedNumbers.includes(realIdx));
        btn.setAttribute('aria-pressed', selectedNumbers.includes(realIdx));
    });
}


// Set operator
function setOperator(op) {
  // Toggle off if clicking the same operator
  if (selectedOperator === op) {
    selectedOperator = null;
    updateOperatorButtonsHighlight();
    return;
  }

  // Select a new operator
  selectedOperator = op;
  updateOperatorButtonsHighlight();

  // If two numbers are already selected, perform immediately
  if (selectedNumbers.length === 2) {
    performSelectedOperation();
  }
}

const operatorButtons = { '+': btnPlus, '-': btnMinus, 'x': btnMultiply, '/': btnDivide };

function updateOperatorButtonsHighlight() {
  // clear all first
  Object.values(operatorButtons).forEach(btn => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });
  // highlight the active one (if any)
  if (selectedOperator) {
    const active = operatorButtons[selectedOperator];
    if (active) {
      active.classList.add('selected');
      active.setAttribute('aria-pressed', 'true');
    }
  }
}


// Run calculation
function performSelectedOperation() {
    const [firstIdx, secondIdx] = selectedNumbers;
    const a = outputNumbers[firstIdx];
    const b = outputNumbers[secondIdx];
    const result = Logic.performOperation(a, b, selectedOperator);
    errorMsg.textContent = '';

    if (result === null) {
        errorMsg.textContent = ' Invalid Operation, cant be negative or a fraction';
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
        stopTimer();

        roundsSummary.push({
            round: round + 1,
            target: goalValue,
            got: result,
            points: Math.max(0, Logic.calculateScore(result, goalValue))
        });

        showEndRoundModal({
            title: "Congratulations!",
            message: "You hit the target exactly!",
            score: playerScore
        });

        

        const method = Logic.Solver(originalNumbers, goalValue);
        solveExp.textContent = `How To: ${method}`;
        resetSelection();
        endRound();
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

function populateSummaryTable() {
  const tbody = document.querySelector('#summaryTable tbody');
  tbody.innerHTML = ''; // clear old rows

  roundsSummary.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r.round}</td>
      <td>${r.target}</td>
      <td>${r.got ?? ''}</td>
      <td>${r.points}</td>
    `;
    tbody.appendChild(row);
  });
}



function submitScore(showAnswer = true) {
    if (!canSubmit || hasScored) return;

    // if (currentResult === null) {
    //     errorMsg.innerHTML = `Please select a number.`;
    //     return;
    // }
    

    const scoreEarned = Logic.calculateScore(currentResult, goalValue);

    if (scoreEarned > 0) {
        playerScore += scoreEarned;

        const msg = scoreEarned === 10
            ? `Exact! +10 points`
            : `Close! +7 points`;
        errorMsg.textContent = msg;
        scoreDisplay.textContent = `${playerScore}`;
    } else {
        errorMsg.textContent = `Too far! No points`;
        scoreDisplay.textContent = `${playerScore}`;
    }
    canSubmit = false;
    console.log("HI")

    roundsSummary.push({
        round: round + 1,
        target: goalValue,
        got: currentResult, // this is your "Closest" value shown
        points: Math.max(0, scoreEarned)
    });
    if (showAnswer) {
        const method = Logic.Solver(originalNumbers, goalValue);
        solveExp.textContent = `How To: ${method}`;
    } else {
        solveExp.textContent = '';
    }

    timeLeft = 0;
    endRound();
}

// Reset selected numbers and operator
function resetSelection() {
    selectedNumbers = [];
    selectedOperator = null;
    updateOperatorButtonsHighlight();
}

  });
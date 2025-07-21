export const smallNum = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
export const bigNum = [25, 50, 75, 100];

// export function getRandomSmall() {
//     return smallNum[Math.floor(Math.random() * smallNum.length)];
// }

// export function getRandomBig() {
//     return bigNum[Math.floor(Math.random() * bigNum.length)];
// }



export function pickRandomAndRemove(array) {
    const index = Math.floor(Math.random() * array.length);
    return array.splice(index, 1)[0];
}

export function getRandomNumbers(numBig, smallSource, bigSource) {
    const availableSmall = [...smallSource];
    const availableBig = [...bigSource];
    const output = [];

    for (let b = 0; b < numBig; b++) {
        output.push(pickRandomAndRemove(availableBig));
    }
    for (let s = 0; s < (6 - numBig); s++) {
        output.push(pickRandomAndRemove(availableSmall));
    }

    return output;
}

export function getAimNum() {
    return Math.floor(Math.random() * (999 - 100) + 100);
}

export const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    'x': (a, b) => a * b,
    '/': (a, b) => b !== 0 && a % b === 0 ? a / b : null
};

export function performOperation(a, b, operator) {
    const result = operators[operator](a, b);
    if (result === null || isNaN(result) || result < 0 || !Number.isInteger(result)) {
        return null;
    }
    return result;
}

export function calculateScore(result, goal) {
    const diff = Math.abs(result - goal);
    if (diff === 0) return 10;
    if (diff <= 10) return 7;
    return 0;
}


export function Solver(numbers, target) {
    let bestSolution = null;
    let closestDiff = Infinity;

    function solve(nums, steps) {
        for (let i = 0; i < nums.length; i++) {
            for (let j = 0; j < nums.length; j++) {
                if (i === j) continue;

                let a = nums[i];
                let b = nums[j];

                let rest = nums.filter((_, k) => k !== i && k !== j);

                let operations = getValidOperations(a.value, b.value);
                for (let { op, result } of operations) {
                    let newStep = `(${a.expr} ${op} ${b.expr})`;
                    let newNums = rest.concat([{ value: result, expr: newStep }]);

                    if (result === target) {
                        bestSolution = newStep + " = " + result;
                        closestDiff = 0;
                        return; // Stop on exact match
                    } else if (Math.abs(result - target) < closestDiff) {
                        bestSolution = newStep + " = " + result;
                        closestDiff = Math.abs(result - target);
                    }

                    solve(newNums, steps.concat(newStep));
                }
            }
        }
    }

    function getValidOperations(a, b) {
        let results = [];

        results.push({ op: '+', result: a + b });
        results.push({ op: '*', result: a * b });

        if (a > b) results.push({ op: '-', result: a - b });
        else if (b > a) results.push({ op: '-', result: b - a });

        if (b !== 0 && a % b === 0) results.push({ op: '/', result: a / b });
        if (a !== 0 && b % a === 0) results.push({ op: '/', result: b / a });

        return results;
    }

    // Start by wrapping numbers with expressions
    let initial = numbers.map(n => ({ value: n, expr: n.toString() }));
    solve(initial, []);

    return bestSolution;
}

const Logic = {
    smallNum,
    bigNum,
    pickRandomAndRemove,
    getRandomNumbers,
    getAimNum,
    operators,
    performOperation,
    Solver,
    calculateScore
};

export default Logic;
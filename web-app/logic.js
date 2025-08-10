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


// export function Solver(numbers, target) {
//     let bestSolution = null;
//     let closestDiff = Infinity;

//     function solve(nums, steps) {
//         for (let i = 0; i < nums.length; i++) {
//             for (let j = 0; j < nums.length; j++) {
//                 if (i === j) continue;

//                 let a = nums[i];
//                 let b = nums[j];

//                 let rest = nums.filter((_, k) => k !== i && k !== j);

//                 let operations = getValidOperations(a.value, b.value);
//                 for (let { op, result } of operations) {
//                     let newStep = `(${a.expr} ${op} ${b.expr})`;
//                     let newNums = rest.concat([{ value: result, expr: newStep }]);

//                     if (result === target) {
//                         bestSolution = newStep + " = " + result;
//                         closestDiff = 0;
//                         return; // Stop on exact match
//                     } else if (Math.abs(result - target) < closestDiff) {
//                         bestSolution = newStep + " = " + result;
//                         closestDiff = Math.abs(result - target);
//                     }

//                     solve(newNums, steps.concat(newStep));
//                 }
//             }
//         }
//     }

//     function getValidOperations(a, b) {
//         let results = [];

//         results.push({ op: '+', result: a + b });
//         results.push({ op: '*', result: a * b });

//         if (a > b) results.push({ op: '-', result: a - b });
//         else if (b > a) results.push({ op: '-', result: b - a });

//         if (b !== 0 && a % b === 0) results.push({ op: '/', result: a / b });
//         if (a !== 0 && b % a === 0) results.push({ op: '/', result: b / a });

//         return results;
//     }

//     // Start by wrapping numbers with expressions
//     let initial = numbers.map(n => ({ value: n, expr: n.toString() }));
//     solve(initial, []);

//     return bestSolution;
// }

// export function Solver(numbers, target) {
//     let bestSolution = null;
//     let closestDiff = Infinity;

//     const seen = new Set();

//     function solve(nums) {
//         // Memoization key: sorted values
//         const key = nums.map(n => n.value).sort((a, b) => a - b).join(",");
//         if (seen.has(key)) return;
//         seen.add(key);

//         const len = nums.length;
//         if (len === 1) {
//             const only = nums[0];
//             const diff = Math.abs(only.value - target);
//             if (diff < closestDiff) {
//                 closestDiff = diff;
//                 bestSolution = `${only.expr} = ${only.value}`;
//             }
//             return;
//         }

//         for (let i = 0; i < len; i++) {
//             for (let j = 0; j < len; j++) {
//                 if (i === j) continue;

//                 const a = nums[i];
//                 const b = nums[j];
//                 const rest = nums.filter((_, k) => k !== i && k !== j);

//                 for (const { op, result } of getValidOperations(a.value, b.value)) {
//                     if (!Number.isFinite(result)) continue;

//                     const newExpr = `(${a.expr} ${op} ${b.expr})`;
//                     const newNums = rest.concat([{ value: result, expr: newExpr }]);

//                     if (result === target) {
//                         bestSolution = `${newExpr} = ${result}`;
//                         closestDiff = 0;
//                         return;
//                     }

//                     if (Math.abs(result - target) < closestDiff) {
//                         bestSolution = `${newExpr} = ${result}`;
//                         closestDiff = Math.abs(result - target);
//                     }

//                     solve(newNums);
//                     if (closestDiff === 0) return;
//                 }
//             }
//         }
//     }

//     function getValidOperations(a, b) {
//         const results = [];

//         // Addition and multiplication are commutative, so do only one order
//         if (a <= b) {
//             results.push({ op: '+', result: a + b });
//             results.push({ op: '*', result: a * b });
//         }

//         // Subtraction and division are not commutative, do both valid orders
//         if (a > b) results.push({ op: '-', result: a - b });
//         if (b > a) results.push({ op: '-', result: b - a });

//         if (b !== 0 && a % b === 0) results.push({ op: '/', result: a / b });
//         if (a !== 0 && b % a === 0) results.push({ op: '/', result: b / a });

//         return results;
//     }

//     const initial = numbers.map(n => ({ value: n, expr: n.toString() }));
//     solve(initial);

//     return bestSolution;
// }
export function Solver(numbers, target) {
  let bestSolution = null;
  let closestDiff = Infinity;
  let bestSteps = [];

  const seen = new Set();

  function solve(nums, steps) {
    const key = nums.map(n => n.value).sort((a, b) => a - b).join(",");
    if (seen.has(key)) return;
    seen.add(key);

    if (nums.length === 1) {
      const only = nums[0];
      const diff = Math.abs(only.value - target);
      if (diff < closestDiff) {
        closestDiff = diff;
        bestSolution = `${only.expr} = ${only.value}`;
        bestSteps = steps.slice();
      }
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue;

        const a = nums[i];
        const b = nums[j];
        const rest = nums.filter((_, k) => k !== i && k !== j);

        for (const { op, left, right, result } of getValidOperations(a.value, b.value)) {
          if (!Number.isFinite(result)) continue;

          const newStep = `${left} ${op} ${right} = ${result}`;
          const newNums = rest.concat([{ value: result, expr: result.toString() }]);
          const newSteps = steps.concat(newStep);

          if (result === target) {
            bestSolution = `${result}`;
            closestDiff = 0;
            bestSteps = newSteps;
            return;
          }

          if (Math.abs(result - target) < closestDiff) {
            bestSolution = `${result}`;
            closestDiff = Math.abs(result - target);
            bestSteps = newSteps;
          }

          solve(newNums, newSteps);
          if (closestDiff === 0) return;
        }
      }
    }
  }

  function getValidOperations(a, b) {
    const results = [];

    // Commutative: choose one ordering to reduce duplicates
    if (a <= b) {
      results.push({ op: '+', left: a, right: b, result: a + b });
      results.push({ op: '*', left: a, right: b, result: a * b });
    } else {
      results.push({ op: '+', left: b, right: a, result: a + b });
      results.push({ op: '*', left: b, right: a, result: a * b });
    }

    // Subtraction: only positive results, record correct left/right
    if (a > b) results.push({ op: '-', left: a, right: b, result: a - b });
    if (b > a) results.push({ op: '-', left: b, right: a, result: b - a });

    // Division: only exact integer results, record correct left/right
    if (b !== 0 && a % b === 0) results.push({ op: '/', left: a, right: b, result: a / b });
    if (a !== 0 && b % a === 0) results.push({ op: '/', left: b, right: a, result: b / a });

    return results;
  }

  const initial = numbers.map(n => ({ value: n, expr: n.toString() }));
  solve(initial, []);

  // Join with commas for inline display; use '<br>' if you want line breaks in HTML
  return bestSteps.join(', ');
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
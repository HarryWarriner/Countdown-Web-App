# Logic.js

## Daily Challenge
Based on the date, looks into a json file and takes the current data necessary.

## Solver

### V2:

- Uses **recursive backtracking** to explore all valid combinations of arithmetic operations.
- Adds **memorisation** using a `Set` to skip repeated states (based on sorted number values).
- Includes only **mathematically valid operations**, including:
  - Commutative: Addition (`+`), Multiplication (`*`)
  - Non-commutative: Subtraction (`-`), Division (`/`)
- Tracks and returns the **closest expression** to the target value.

Memorisation significantly improves the efficetcny. It still uses brute-force recursion. <br>

However, it means outputs can look like this: ((3 + 7) * ((2 - 10) + (50 - 8))) = 500, when it should just be 50 * 10 = 500


### V1:

Very heavy in compute and time, as it can do the same operation multiple times without realising it.

- Uses **recursive backtracking** to try all possible combinations of numbers and operations.
- Tracks how close each result is to the **target**, updating the best solution when a closer match is found.
- Applies only **valid arithmetic operations**, including:
  - Addition (`+`)
  - Subtraction (`-`) — only when it results in a positive number
  - Multiplication (`*`)
  - Division (`/`) — only when it results in an integer and avoids division by zero
- Returns a **string representation** of the best expression found (e.g., `(6 * 4) + 1 = 25`).


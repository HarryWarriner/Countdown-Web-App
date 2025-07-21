const Logic = require('../logic.js');
const fs = require('fs');

const path = 'test.json';

// Number of games per day
let numGames = 10;
let numIterations = 5;


// Load existing data 
let data = {};
if (fs.existsSync(path) && fs.statSync(path).size > 0) {
  data = JSON.parse(fs.readFileSync(path, 'utf8'));
}

// day:
function formatDate(date){
  return date.toISOString().split('T')[0];
}

// goal and output:


for (let i = 0; i < numIterations; i++){
  let date = new Date();
  date.setDate(date.getDate() + i);
  let formattedDate = formatDate(date);

  let goalValueArray = [];
  let outputNumbersArray = [];

  for (let j = 0; j < numGames; j++) {
    const numBig = Math.floor(Math.random() * 4);
    const outputNumbers = Logic.getRandomNumbers(numBig, Logic.smallNum, Logic.bigNum);
    const goalValue = Logic.getAimNum();
    goalValueArray.push(goalValue);
    outputNumbersArray.push(outputNumbers);
  }
  data[formattedDate] = {
    goalValueArray,
    outputNumbersArray
  }

}


//Save back to file
fs.writeFileSync(path, JSON.stringify(data, null, 2));

console.log("JSON file updated!");

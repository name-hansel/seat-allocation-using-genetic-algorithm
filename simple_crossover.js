function shuffleArray(array) {
  const returnArray = JSON.parse(JSON.stringify(array));
  for (var i = returnArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = returnArray[i];
    returnArray[i] = returnArray[j];
    returnArray[j] = temp;
  }
  return returnArray;
}

function generateBreakpoints(parentLength) {
  var breakPoint1 = Math.floor(Math.random() * (parentLength - 1));
  var breakPoint2 = Math.floor(Math.random() * (parentLength - breakPoint1 - 1)) + breakPoint1 + 1;
  return [breakPoint1, breakPoint2]
}

function isSeatEmpty(seat) {
  return seat.length === 0;
}

const parentOne = [[1], [2], [3], [4], [5], [6], [7], [8], [9], []]
const geneLength = parentOne.length

// If any empty seats, fill them 'EMPTY_NUMBER'
for (let i = 0, j = 1; i < geneLength; i++) {
  if (parentOne[i].length === 0) {
    parentOne[i][0] = `EMPTY_${j}`;
    j++;
  }
}

const parentTwo = shuffleArray(parentOne);
// const parentTwo = [[9], [3], [7], [8], [2], [6], [5], [1], [4]]

const offspring = parentOne.map(() => [])

// Generate breakpoints for random segment
const [x, y] = generateBreakpoints(geneLength);

const elementsInOffspring = {};
const elementMappingPTwo = {};

// Copy elements from P1 to offspring in x to y
for (let i = x; i <= y; i++) {
  offspring[i][0] = parentOne[i][0];
  elementsInOffspring[offspring[i][0]] = i;
}

// Get element and their position in parentTwo
for (let i = 0; i < geneLength; i++)
  elementMappingPTwo[parentTwo[i][0]] = i;

for (let i = x; i <= y; i++) {
  if (elementsInOffspring[parentTwo[i][0]]) {
    continue;
  }

  let j = i;
  while (j >= x && j <= y) {
    j = elementMappingPTwo[parentOne[j][0]];
  }
  offspring[j][0] = parentTwo[i][0];
  elementsInOffspring[offspring[j][0]] = j;
}

// Fill in the remaining genes from parentTwo
// Part one, before breakpoint x
// i = index in offspring
// j = index in parentTwo
let i = 0, j = 0;
while (i < x) {
  // Check if empty
  if (offspring[i].length !== 0) {
    i++;
    continue;
  }
  if (elementsInOffspring[parentTwo[j][0]]) {
    // Already present in offspring
    j++;
  } else {
    // Not present in offspring
    offspring[i][0] = parentTwo[j][0];
    elementsInOffspring[offspring[i][0]] = i;
    i++;
    j++;
  }
}

// Part two, after breakpoint x
// i = index in offspring
// j = index in parentTwo
i = y + 1;
while (i < geneLength) {
  // Check if empty
  if (offspring[i].length !== 0) {
    i++;
    continue;
  }
  if (elementsInOffspring[parentTwo[j][0]]) {
    // Already present in offspring
    j++;
  } else {
    // Not present in offspring
    offspring[i][0] = parentTwo[j][0];
    elementsInOffspring[offspring[i][0]] = i;
    i++;
    j++;
  }
}

console.log(parentOne)
console.log(parentTwo)
console.log(x, y)
console.log(offspring)
// console.log(elementsInOffspring);
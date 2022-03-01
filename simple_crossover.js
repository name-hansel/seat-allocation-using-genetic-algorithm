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

const parentOne = [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [], [], []]
const parentTwo = shuffleArray(parentOne)
const geneLength = parentOne.length
const offspring = parentOne.map(() => [])

const [b1, b2] = generateBreakpoints(parentOne.length)

const elementsAlreadyPresentInOffspring = {};
// var numberOfElementsInOffspring = 0;
var numberOfEmptySeats = 0;

// COPY GENES FROM BREAKPOINTS
for (let i = b1; i <= b2; i++) {
  offspring[i] = parentOne[i]
  // numberOfElementsInOffspring++;
  if (isSeatEmpty(parentOne[i])) numberOfEmptySeats++;
  else elementsAlreadyPresentInOffspring[parentOne[i][0]] = 1;
}

console.log(b1, b2)
console.log(parentOne)
console.log(parentTwo)
console.log(offspring)
// console.log(elementsAlreadyPresentInOffspring)
// console.log(numberOfElementsInOffspring)
// console.log(numberOfEmptySeats)

// Extract roll no.s from parent 2, not present in offspring
var index = (b2 + 1) % geneLength;
var elementsToPush = [];
do {
  if (elementsAlreadyPresentInOffspring[parentTwo[index]] !== 1)
    elementsToPush.push(parentTwo[index])
  index = (index + 1) % geneLength;
} while (index !== (b2 + 1) % geneLength);

var i = (b2 + 1) % geneLength;
var j = 0;
while (j < elementsToPush.length) {
  // Seat is not empty, simply add to offspring
  if (!isSeatEmpty(elementsToPush[j])) {
    offspring[i] = elementsToPush[j];
    j++;
    i = (i + 1) % geneLength;
    continue;
  }

  // Seat is empty, check number of empty seats in offspring
  if (numberOfEmptySeats < 3) {
    // Add empty seat to offspring
    numberOfEmptySeats++;
    offspring[i] = elementsToPush[j];
    j++;
    i = (i + 1) % geneLength;
    continue;
  } else {
    // Number of empty seats has exceeded
    j++;
  }
}

console.log(offspring)
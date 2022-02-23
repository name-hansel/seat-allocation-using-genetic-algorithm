function shuffleArray(array) {
  const returnArray = [...array]
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
var numberOfElementsInOffspring = 0;
var numberOfEmptySeats = 0;

// COPY GENES FROM BREAKPOINTS
for (let i = b1; i <= b2; i++) {
  offspring[i] = parentOne[i]
  numberOfElementsInOffspring++;
  if (isSeatEmpty(parentOne[i])) numberOfEmptySeats++;
  else elementsAlreadyPresentInOffspring[parentOne[i][0]] = 1;
}

console.log(parentOne)
console.log(parentTwo)
console.log(b1, b2)
console.log(offspring)
console.log(elementsAlreadyPresentInOffspring)
console.log(numberOfElementsInOffspring)
console.log(numberOfEmptySeats)

// COPY GENES OTHER THAN BREAKPOINT
var i = (b2 + 1) % geneLength;
var j = (b2 + 1) % geneLength;
// ! PROBLEM IN j variable
while (numberOfElementsInOffspring < geneLength) {
  // Seat already present in offspring
  if (!isSeatEmpty(parentTwo[j]) && elementsAlreadyPresentInOffspring[parentTwo[j][0]] === 1) {
    j = (j + 1) % geneLength;
    continue;
  }

  // Seat not present in offspring
  if (!isSeatEmpty(parentTwo[j]) && elementsAlreadyPresentInOffspring[parentTwo[j][0]] !== 1) {
    offspring[i] = parentTwo[j]
    numberOfElementsInOffspring++;
    i = (i + 1) % geneLength;
    j = (j + 1) % geneLength;
    elementsAlreadyPresentInOffspring[parentTwo[j][0]] = 1;
    continue;
  }

  // Seat is empty and number of empty seats is valid
  if (isSeatEmpty(parentTwo[j]) && numberOfEmptySeats >= 3) {
    j = (j + 1) % geneLength;
    continue;
  }

  if (isSeatEmpty(parentTwo[j]) && numberOfEmptySeats < 3) {
    numberOfEmptySeats++;
    numberOfElementsInOffspring++;
    offspring[i] = parentTwo[j]
    j = (j + 1) % geneLength;
    i = (i + 1) % geneLength;
    continue;
  }
  console.log("IMPOSSIBLE")
}

console.log(offspring)
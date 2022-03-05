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

const parentOne = [[1], [2], [3], [4], [5], [6], [7], [8], [], [], []]
const parentTwo = shuffleArray(parentOne)

const geneLength = parentOne.length
const emptySeats = 3;
const offspring = parentOne.map(() => [])

// Create object which contains seats already present in offspring
const elementsAlreadyPresentInOffspring = {};

// Keep track of number of empty seats in offspring
var numberOfEmptySeats = 0;

// Keep track of current parent
const parents = [parentOne, parentTwo];
var currentParent = 0;

// Gene position in parent
var j = 0;
var i = 0;

for (; i < geneLength; j = (j + 1) % geneLength) {
  parent = parents[currentParent];
  if (isSeatEmpty(parent[j])) {
    if (numberOfEmptySeats < emptySeats) {
      offspring[i] = parent[j];
      numberOfEmptySeats++;
      i++;
    }

  } else {
    if (elementsAlreadyPresentInOffspring[parent[j]] !== 1) {
      offspring[i] = parent[j];
      elementsAlreadyPresentInOffspring[parent[j]] = 1;
      i++;
    }
  }
  currentParent = (currentParent + 1) % 2;
}

console.log(offspring)

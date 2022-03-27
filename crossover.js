const { isSeatEmpty, initialiseChromosome, generateBreakpoints } = require("./utils")

function orderOneCrossover(parentOne, parentTwo, roomDetails, emptySeats) {
  const geneLength = parentOne.length;

  // Initialize offspring using room details 
  const offspring = initialiseChromosome(roomDetails)

  // Generate 2 breakpoints
  const [b1, b2] = generateBreakpoints(geneLength);

  // Create object which indicates which seats are already present in offspring
  const elementsAlreadyPresentInOffspring = {};

  // Keep track of number of empty seats in offspring
  var numberOfEmptySeats = 0;

  // Copy genes from parent 1 to offspring between breakpoints
  for (let i = b1; i <= b2; i++) {
    offspring[i][3] = parentOne[i][3];
    if (isSeatEmpty(parentOne[i])) numberOfEmptySeats++;
    else elementsAlreadyPresentInOffspring[parentOne[i][3][0]] = 1;
  }

  // Extract seats from parent 2 which are not present in offspring
  var index = (b2 + 1) % geneLength;
  var elementsToPush = [];
  do {
    // If seat is empty, simply push
    if (!isSeatEmpty(parentTwo[index])) {
      if (elementsAlreadyPresentInOffspring[parentTwo[index][3][0]] !== 1)
        elementsToPush.push(parentTwo[index])
    } else {
      elementsToPush.push(parentTwo[index])
    }
    index = (index + 1) % geneLength;
  } while (index !== (b2 + 1) % geneLength);

  var i = (b2 + 1) % geneLength;
  var j = 0;
  while (j < elementsToPush.length) {
    // Seat is not empty, simply add to offspring
    if (!isSeatEmpty(elementsToPush[j])) {
      offspring[i][3] = elementsToPush[j][3];
      j++;
      i = (i + 1) % geneLength;
      continue;
    }

    // Seat is empty, check number of empty seats in offspring
    if (numberOfEmptySeats < emptySeats) {
      // Add empty seat to offspring
      numberOfEmptySeats++;
      offspring[i][3] = elementsToPush[j][3];
      j++;
      i = (i + 1) % geneLength;
      continue;
    } else {
      // Number of empty seats has exceeded
      j++;
    }
  }

  return offspring
}

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

function alternatingCrossover(parentOne, parentTwo, emptySeats) {
  const geneLength = parentOne.length;

  // Initialize offspring using room details
  const offspring = parentOne.map((seat) => [seat[0], seat[1], seat[2], [null]]);

  // Create object which contains seats already present in offspring
  const elementsAlreadyPresentInOffspring = {};

  // Keep track of number of empty seats in offspring
  var numberOfEmptySeats = 0;

  const parents = [parentOne, parentTwo];
  var currentParent = 0;

  // Copy alternate genes (only legal seats)
  for (let i = 0; i < geneLength; i++, currentParent = (currentParent + 1) % 2) {
    parent = parents[currentParent];
    if (isSeatEmpty(parent[i])) {
      if (numberOfEmptySeats < emptySeats) {
        offspring[i][3] = parent[i][3];
        numberOfEmptySeats++;
      }
    } else {
      if (elementsAlreadyPresentInOffspring[parent[i][3][0]] !== 1) {
        offspring[i][3] = parent[i][3];
        elementsAlreadyPresentInOffspring[parent[i][3][0]] = 1;
      }
    }
  }

  // Get all elements not present in offspring
  const notPresentInOffspring = [];
  for (let i = 0; i < geneLength; i++) {
    if (isSeatEmpty(parentTwo[i])) continue;
    if (elementsAlreadyPresentInOffspring[parentTwo[i][3][0]] !== 1) {
      notPresentInOffspring.push(parentTwo[i][3]);
    }
  }

  // Get number of empty seats required
  if (numberOfEmptySeats < emptySeats) {
    const numberOfEmptySeatsReq = emptySeats - numberOfEmptySeats;
    for (let i = 1; i <= numberOfEmptySeatsReq; i++) notPresentInOffspring.push([]);
  }

  // const shuffledNotPresentInOffspring = shuffleArray(notPresentInOffspring);

  let j = 0;
  for (let i = 0; i < geneLength; i++) {
    if (isSeatEmpty(offspring[i])) continue;
    if (!isSeatEmpty(offspring[i]) && offspring[i][3][0] !== null) continue;
    offspring[i][3] = notPresentInOffspring[j];
    j++;
  }

  return offspring
}

// Partially mapped crossover (PMX)
function partiallyMappedCrossover(parentOne, parentTwo) {
  // Fill empty seats by 'EMPTY_NUMBER'
  for (let i = 0, j = 1; i < parentOne.length; i++) {
    if (parentOne[i][3].length === 0) {
      parentOne[i][3][0] = `EMPTY_${j}`
      j++;
    }
  }

  for (let i = 0, j = 1; i < parentOne.length; i++) {
    if (parentTwo[i][3].length === 0) {
      parentTwo[i][3][0] = `EMPTY_${j}`
      j++;
    }
  }

  const geneLength = parentOne.length;

  // Initialize offspring using room details
  const offspring = parentOne.map((seat) => [seat[0], seat[1], seat[2], []]);

  // Generate breakpoints for random segment
  const [x, y] = generateBreakpoints(geneLength);

  // Keep track of elements in offspring
  const elementsInOffspring = {};

  // Element and their index in parent two
  const elementMappingPTwo = {};

  // Copy elements from parent one to offspring in x to y
  for (let i = x; i <= y; i++) {
    offspring[i][3] = parentOne[i][3];
    elementsInOffspring[parentOne[i][3][0]] = i;
  }

  // Get element and their position in parentTwo
  for (let i = 0; i < geneLength; i++)
    elementMappingPTwo[parentTwo[i][3][0]] = i;

  // Crossover
  for (let i = x; i <= y; i++) {
    if (elementsInOffspring[parentTwo[i][3][0]] !== undefined) {
      continue;
    }

    let j = i;
    while (j >= x && j <= y) {
      j = elementMappingPTwo[parentOne[j][3][0]];
    }
    offspring[j][3] = parentTwo[i][3];
    elementsInOffspring[offspring[j][3][0]] = j;
  }

  // Fill in the remaining genes from parentTwo
  // Part one, before breakpoint x
  let offspringIndex = 0, parentTwoIndex = 0;
  while (offspringIndex < x) {
    // Gene is not empty
    if (offspring[offspringIndex][3].length !== 0) {
      offspringIndex++;
      continue;
    }
    if (elementsInOffspring[parentTwo[parentTwoIndex][3][0]] !== undefined) {
      // Already present in offspring
      parentTwoIndex++;
    } else {
      // Not present in offspring
      offspring[offspringIndex][3] = parentTwo[parentTwoIndex][3];
      elementsInOffspring[offspring[offspringIndex][3][0]] = offspringIndex;
      offspringIndex++;
      parentTwoIndex++;
    }
  }

  // Part two, after breakpoint x
  offspringIndex = y + 1;
  while (offspringIndex < geneLength) {
    // Check if empty
    if (offspring[offspringIndex][3].length !== 0) {
      offspringIndex++;
      continue;
    }
    if (elementsInOffspring[parentTwo[parentTwoIndex][3][0]] !== undefined) {
      // Already present in offspring
      parentTwoIndex++;
    } else {
      // Not present in offspring
      offspring[offspringIndex][3] = parentTwo[parentTwoIndex][3];
      elementsInOffspring[offspring[offspringIndex][3][0]] = offspringIndex;
      offspringIndex++;
      parentTwoIndex++;
    }
  }

  // Replace 'EMPTY_NUMBER' by empty array in array
  for (let i = 0; i < geneLength; i++) {
    if (parentOne[i][3].length === 1)
      parentOne[i][3] = [];
    if (parentTwo[i][3].length === 1)
      parentTwo[i][3] = [];
    if (offspring[i][3].length === 1)
      offspring[i][3] = [];
  }

  return offspring
}

module.exports = {
  orderOneCrossover,
  alternatingCrossover,
  partiallyMappedCrossover
}
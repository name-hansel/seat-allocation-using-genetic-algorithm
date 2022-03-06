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

function alternatingCrossover(parentOne, parentTwo, roomDetails, emptySeats) {
  const geneLength = parentOne.length;

  // Initialize offspring using room details
  const offspring = parentOne.map((seat) => [seat[0], seat[1], seat[2], [null]]);

  // Create object which contains seats already present in offspring
  const elementsAlreadyPresentInOffspring = {};

  // Keep track of number of empty seats in offspring
  var numberOfEmptySeats = 0;

  const parents = [parentOne, parentTwo];
  var currentParent = 0;

  // TODO write cleaner code.
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

  let i = 0, j = 0;
  while (i < geneLength) {
    if (isSeatEmpty(offspring[i])) {
      i++;
      continue;
    }

    if (offspring[i][3][0] !== null) {
      i++;
      continue;
    }
    if (isSeatEmpty(parentTwo[j])) {
      if (numberOfEmptySeats < emptySeats) {
        offspring[i][3] = parentTwo[j][3];
        i++;
        j++;
        continue;
      } else {
        j++;
        continue;
      }
    } else {
      if (elementsAlreadyPresentInOffspring[parentTwo[j][3][0]] === 1) {
        j++;
        continue;
      } else {
        offspring[i][3] = parentTwo[j][3];
        elementsAlreadyPresentInOffspring[parentTwo[j][3][0]] = 1;
        i++;
        j++;
        continue;
      }
    }
  }

  return offspring
}

// Partially mapped crossover
function partiallyMappedCrossover() {
  // https://github.com/dwdyer/watchmaker/blob/master/framework/src/java/main/org/uncommons/watchmaker/framework/operators/ListOrderCrossover.java

  // Generate 2 breakpoints
  const [breakPoint1, breakPoint2] = generateBreakpoints(parent1Length);

  // STACKOVERFLOW ANSWER
  // https://stackoverflow.com/questions/60320147/handling-duplicates-when-using-partially-matched-crossover-for-genetic-algorithm

  // Create mappings for both offspring to keep track of which students are already in it.
  // const offspring1Present = {};
  // const offspring2Present = {};
  // const mappingSystem = {};

  // Insert genes from parent 1 to offspring 1 between breakpoints
  // Insert genes from parent 2 to offspring 2 between breakpoints
  // for (let i = breakPoint1; i <= breakPoint2; i++) {
  //   // Exchange students between breakpoint section
  //   offspring1[i] = parent2[i];
  //   offspring2[i] = parent1[i];

  //   // Keep mapping between students of the two parents which belong to breakpoint section
  //   const studentInParent1 = parent1[i][3].length === 0 ? [] : parent1[i][3][0];
  //   const studentInParent2 = parent2[i][3].length === 0 ? [] : parent2[i][3][0];
  //   mappingSystem[studentInParent1] = studentInParent2
  //   mappingSystem[studentInParent2] = studentInParent1

  //   // Keep track of which student is already present in offspring
  //   if (offspring1[i][3].length !== 0) offspring1Present[offspring1[i][3][0]] = 1;
  //   if (offspring2[i][3].length !== 0) offspring2Present[offspring2[i][3][0]] = 1;
  // }

  // for (let i = 0; i < parent1Length; i++) {
  //   if (i >= breakPoint1 && i <= breakPoint2) continue;
  //   // If no conflicts, populate offspring1
  //   if (parent1[i][3].length !== 0 && offspring1Present[parent1[i][3][0]] === 1) {
  //     // Conflict as gene is already present in offspring
  //     var conflict = parent1[i][3][0];
  //     var mapping = mappingSystem[conflict];
  //     while (offspring1Present[mapping] === 1) {
  //       // Mapped element is also already present
  //       console.log(conflict, mapping)
  //       conflict = mapping;
  //       mapping = mappingSystem[conflict];
  //     }
  //     offspring1[i] = mapping;
  //     offspring1Present[mapping] = 1;
  //     continue;
  //   };
  //   offspring1[i] = parent1[i];
  // }
  // for (let i = 0; i < parent2Length; i++) {
  //   if (i >= breakPoint1 && i <= breakPoint2) continue;
  //   // Populate offspring2 in same way
  //   if (parent2[i][3].length !== 0 && offspring2Present[parent2[i][3][0]] === 1) continue;
  //   offspring2[i] = parent2[i];
  // }
}

module.exports = {
  orderOneCrossover,
  alternatingCrossover
}
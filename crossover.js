const { isSeatEmpty, initialiseChromosome, checkIfValidSolution } = require("./utils")

function generateBreakpoints(parentLength) {
  var breakPoint1 = Math.floor(Math.random() * (parentLength - 1));
  var breakPoint2 = Math.floor(Math.random() * (parentLength - breakPoint1 - 1)) + breakPoint1 + 1;
  return [breakPoint1, breakPoint2]
}

function orderOneCrossover(parentOne, parentTwo, roomDetails) {
  const geneLength = parentOne.length;
  const offspring = initialiseChromosome(roomDetails)

  // Generate 2 breakpoints
  const [breakPoint1, breakPoint2] = generateBreakpoints(geneLength);

  // Create object which indicates which seats are already present in offspring
  const offspringMapping = {};

  // Keep track of number of elements added to offspring
  var numberOfElementsInOffspring = 0;

  // Keep track of number of empty seats in offspring
  var numberOfEmptySeats = 0;

  // Copy genes from parent 1 to offspring between breakpoints
  for (let i = breakPoint1; i <= breakPoint2; i++) {
    offspring[i][3] = parentOne[i][3];
    numberOfElementsInOffspring++;
    if (isSeatEmpty(parentOne[i])) numberOfEmptySeats++;
    else offspringMapping[parentOne[i][3][0]] = 1;
  }

  // Copy genes at points other than breakpoints from parent 2 (if not already present in offspring)
  var i = (breakPoint2 + 1) % geneLength;  // Offspring
  var j = (breakPoint2 + 1) % geneLength;  // Parent 2
  while (numberOfElementsInOffspring < geneLength) {
    if (!isSeatEmpty(parentTwo[j]) && offspringMapping[parentTwo[j][3][0]] === 1) {
      // Seat already present
      j = (j + 1) % geneLength;
      continue;
    }

    if (!isSeatEmpty(parentTwo[j]) && offspringMapping[parentTwo[j][3][0]] !== 1) {
      // Seat copied from parent 2 to offspring
      offspring[i][3] = parentTwo[j][3];
      numberOfElementsInOffspring++;
      j = (j + 1) % geneLength;
      i = (i + 1) % geneLength;
      continue;
    }

    if (isSeatEmpty(parentTwo[j]) && numberOfEmptySeats >= 4) {
      // Parent contains empty seat, but already seats are present
      j = (j + 1) % geneLength;
      continue;
    } else if (isSeatEmpty(parentTwo[j]) && numberOfEmptySeats < 4) numberOfEmptySeats++;
    // Parent seat is not empty
    // Parent seat already present in offspring
    offspring[i][3] = parentTwo[j][3];
    numberOfElementsInOffspring++;
    j = (j + 1) % geneLength;
    i = (i + 1) % geneLength;
  }

  console.log(breakPoint1, breakPoint2)
  console.log(parentOne)
  console.log(parentTwo)
  console.log(offspring)
  console.log(offspringMapping)
  console.log("-----")
  if (!checkIfValidSolution(offspring)) {
    throw new Error();
  }

  // console.log(breakPoint1, breakPoint2)
  // console.log(numberOfEmptySeats)
  // console.log("--------")
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
  orderOneCrossover
}
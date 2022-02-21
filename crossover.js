const parent1 = [
  [0, 0, 0, ['PES01', 'AA']],
  [0, 0, 1, ['PES02', 'AA']],
  [0, 0, 2, ['PES03', 'AA']],
  [0, 0, 3, ['PES04', 'AA']],
  [0, 1, 0, ['PES05', 'AA']],
  [0, 1, 1, ['PES06', 'AA']],
  [0, 1, 2, ['PES07', 'AA']],
  [0, 1, 3, ['PES08', 'AA']],
  [0, 2, 0, ['PES09', 'AA']],
  [0, 2, 1, ['PES10', 'DSA']],
  [0, 2, 2, ['PES11', 'DSA']],
  [0, 2, 3, ['PES12', 'DSA']],
  [0, 3, 0, ['PES13', 'DSA']],
  [0, 3, 1, ['PES14', 'DSA']],
  [0, 3, 2, ['PES15', 'DSA']],
  [0, 3, 3, ['PES16', 'DSA']],
  [0, 4, 0, ['PES17', 'DSA']],
  [0, 4, 1, ['PES18', 'DSA']],
  [0, 4, 2, ['PES19', 'HM']],
  [0, 4, 3, ['PES20', 'HM']],
  [1, 0, 0, ['PES21', 'HM']],
  [1, 0, 1, ['PES22', 'HM']],
  [1, 0, 2, ['PES23', 'HM']],
  [1, 0, 3, ['PES24', 'HM']],
  [1, 0, 4, ['PES25', 'HM']],
  [1, 1, 0, ['PES26', 'HM']],
  [1, 1, 1, ['PES27', 'HM']],
  [1, 1, 2, ['PES28', 'EME']],
  [1, 1, 3, ['PES29', 'EME']],
  [1, 1, 4, ['PES30', 'EME']],
  [1, 2, 0, ['PES31', 'EME']],
  [1, 2, 1, ['PES32', 'EME']],
  [1, 2, 2, ['PES33', 'EME']],
  [1, 2, 3, ['PES34', 'EME']],
  [1, 2, 4, ['PES35', 'EME']],
  [1, 3, 0, ['PES36', 'EME']],
  [1, 3, 1, []],
  [1, 3, 2, []],
  [1, 3, 3, []],
  [1, 3, 4, []]
]
const parent1Length = parent1.length
const parent2 = [
  [0, 0, 0, ['PES32', 'EME']],
  [0, 0, 1, ['PES34', 'EME']],
  [0, 0, 2, ['PES18', 'DSA']],
  [0, 0, 3, ['PES02', 'AA']],
  [0, 1, 0, ['PES23', 'HM']],
  [0, 1, 1, []],
  [0, 1, 2, ['PES26', 'HM']],
  [0, 1, 3, ['PES19', 'HM']],
  [0, 2, 0, ['PES11', 'DSA']],
  [0, 2, 1, []],
  [0, 2, 2, ['PES13', 'DSA']],
  [0, 2, 3, ['PES21', 'HM']],
  [0, 3, 0, ['PES03', 'AA']],
  [0, 3, 1, ['PES08', 'AA']],
  [0, 3, 2, ['PES20', 'HM']],
  [0, 3, 3, ['PES35', 'EME']],
  [0, 4, 0, ['PES14', 'DSA']],
  [0, 4, 1, []],
  [0, 4, 2, ['PES29', 'EME']],
  [0, 4, 3, ['PES04', 'AA']],
  [1, 0, 0, ['PES06', 'AA']],
  [1, 0, 1, ['PES12', 'DSA']],
  [1, 0, 2, ['PES01', 'AA']],
  [1, 0, 3, ['PES17', 'DSA']],
  [1, 0, 4, ['PES36', 'EME']],
  [1, 1, 0, ['PES31', 'EME']],
  [1, 1, 1, ['PES24', 'HM']],
  [1, 1, 2, ['PES22', 'HM']],
  [1, 1, 3, ['PES16', 'DSA']],
  [1, 1, 4, ['PES15', 'DSA']],
  [1, 2, 0, ['PES07', 'AA']],
  [1, 2, 1, []],
  [1, 2, 2, ['PES09', 'AA']],
  [1, 2, 3, ['PES27', 'HM']],
  [1, 2, 4, ['PES05', 'AA']],
  [1, 3, 0, ['PES28', 'EME']],
  [1, 3, 1, ['PES30', 'EME']],
  [1, 3, 2, ['PES25', 'HM']],
  [1, 3, 3, ['PES33', 'EME']],
  [1, 3, 4, ['PES10', 'DSA']]
]
const parent2Length = parent2.length

const offspring1 = []
const offspring2 = []

function generateBreakpoints(parentLength) {
  var breakPoint1 = 0;
  var breakPoint2 = 0;
  while (breakPoint1 === breakPoint2) {
    breakPoint1 = Math.floor(Math.random() * (parentLength + 1));
    breakPoint2 = Math.floor(Math.random() * (parentLength + 1));
  }
  if (breakPoint1 > breakPoint2) [breakPoint1, breakPoint2] = [breakPoint2, breakPoint1]
  return [breakPoint1, breakPoint2]
}

for (let i = 0; i < parent1Length; i++) {
  offspring1[i] = [];
  offspring2[i] = [];
}

function contains(student, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][3].length !== 0 && student[3][0] === array[i][3][0]) return true;
  }
  return false;
}

function orderOneCrossover() {
  // https://www.rubicite.com/Tutorials/GeneticAlgorithms/CrossoverOperators/Order1CrossoverOperator.aspx

  // Generate 2 breakpoints
  const [breakPoint1, breakPoint2] = generateBreakpoints(parent1Length);

  // Create object which indicates which seats are already present in offspring
  const offspring1Mapping = {};

  // Copy genes from parent 1 to offspring 1 between breakpoints
  for (let i = breakPoint1; i <= breakPoint2; i++) {
    offspring1[i] = parent1[i];
    if (parent1[i][3].length !== 0) offspring1Mapping[parent1[i][3][0]] = 1;
  }

  // Copy genes at points other than breakpoints from parent 2 (if not already present in offspring)
  // ! Need to keep track of offspring position and parent position differently
  // ! Avoid breakpoint section in offspring
  for (let i = 0; i < parent1Length;) {
    // Already present, skip
    if (parent2[i][3].length !== 0 && offspring1Mapping[parent2[i][3][0]] === 1) {
      continue;
    };
    offspring1[i] = parent2[i];
    i++;
  }

  console.log(offspring1)
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

orderOneCrossover();

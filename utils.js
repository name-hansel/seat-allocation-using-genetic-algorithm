/**
 * Shuffles a chromosome and returns the shuffled chromosome
 * @param {array} chromosome Chromosome to be shuffled
 */
function shuffleChromosome(chromosome) {
  const returnChromosome = JSON.parse(JSON.stringify(chromosome));
  for (var i = returnChromosome.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = returnChromosome[i][3];
    returnChromosome[i][3] = returnChromosome[j][3];
    returnChromosome[j][3] = temp;
  }
  return returnChromosome;
}

/**
 * Shuffles a population and returns the shuffled population
 * @param {array} population Population to be shuffled
 */
function shuffleMatingPool(population) {
  const returnPopulation = JSON.parse(JSON.stringify(population));
  for (var i = returnPopulation.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = returnPopulation[i];
    returnPopulation[i] = returnPopulation[j];
    returnPopulation[j] = temp;
  }
  return returnPopulation;
}

/**
 * Calculates sum of elements in an array
 * @param {array} array Array whose sum is to be calculated
 */
function getArraySum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

/**
 * Returns an object containing dissimilarity-factor of each subject pair
 * @param {array} array 2D array containing similarity-factor for each subject pair
 */
function getSubjectDissimilarity(data) {
  const numberOfSubjects = data[0].length - 1;
  const subjectDissimilarityData = {};

  for (let i = 1; i <= numberOfSubjects; i++) {
    let subjectName = data[0][i];
    subjectDissimilarityData[subjectName] = {};
    for (let j = 1; j <= numberOfSubjects; j++) {
      let subjectName2 = data[j][0];
      subjectDissimilarityData[subjectName][subjectName2] = 1 - Number(data[i][j]);
    }
  }
  return subjectDissimilarityData;
}

/**
 * Calculates total number of seats in all rooms
 * @param {array} data Array containing another array which defines number of rows and columns in a room
 */
function getNumberOfSeats(data) {
  let numberOfSeats = 0;
  for (let i = 0; i < data.length; i++) {
    numberOfSeats += Number(data[i][0]) * Number(data[i][1])
  }
  return numberOfSeats
}

/**
 * Calculates distance between 2 seats
 * @param {array} v1 Array containing row and column number of seat 1
 * @param {array} v2 Array containing row and column number of seat 2
 */
function getDistanceBetweenNeighbours(v1, v2) {
  return Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2);
}

/**
 * Gets student details about a particular neighbour seat using room no., row no., and column no.
 * @param {array} chromosome Array containing data about all seats
 * @param {number} room Room number of seat
 * @param {number} row Row number of seat
 * @param {number} column Column number of seat
 */
function getNeighbourDetails(chromosome, room, row, column) {
  for (let i = 0; i < chromosome.length; i++) {
    if (chromosome[i][0] !== room) continue;
    if (chromosome[i][1] !== row) continue;
    if (chromosome[i][2] !== column) continue;
    return [room, row, column, chromosome[i][3]]
  }
}

/**
 * Checks if the seat the neighbour is in is valid depending on room dimensions and returns true or false
 * @param {array} neighbour Array containing neighbour row and column
 * @param {number} room Dimensions of a room
 */
function isValidNeighbour(neighbour, room) {
  // Check if neighbour row and column is valid
  // Neighbour is not a valid seat as 
  if (neighbour[0] === -1 || neighbour[1] === -1)
    return false
  // Neighbour is out of row and column of that room
  if (neighbour[0] + 1 > room[0] || neighbour[1] + 1 > room[1])
    return false
  return true
}

/**
 * Checks if the seat is empty and returns true if it is, and false if not
 * @param {array} seat Seat containing room no., row no., column no., and student details
 */
function isSeatEmpty(seat) {
  return seat[3].length === 0
}

/**
 * Checks if solution is valid on the basis of number of empty seats
 * @param {array} chromosome Solution to be checked
 */
function checkIfValidSolution(chromosome) {
  // Check number of empty seats
  const rollNumbers = []
  var numberOfEmptySeats = 0;
  for (let i = 0; i < chromosome.length; i++) {
    if (isSeatEmpty(chromosome[i])) numberOfEmptySeats++;
  }
  if (numberOfEmptySeats !== 4) {
    console.log("INVALID NO. OF EMPTY SEATS")
    return false
  }
  // Check if all roll numbers are present
  for (let i = 0; i < chromosome.length; i++) {
    rollNumbers.push(chromosome[i][3].length === 0 ? '' : chromosome[i][3][0])
  }

  rollNumbers.sort();
  console.log(rollNumbers)
  return true
}

/**
 * Initializes a chromosome with room no., row no., and column no.
 * @param {array} roomDetails
 */
function initialiseChromosome({ data }) {
  const chromosome = []
  for (let i = 0; i < data.length; i++) {
    const rows = Number(data[i][0]);
    const columns = Number(data[i][1]);

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        chromosome.push([i, row, column, []])
      }
    }
  }
  return chromosome;
}

/**
 * Returns two unique points lying between 0 and length of parent
 * @param {array} parentLength
 */
function generateBreakpoints(parentLength) {
  var breakPoint1 = Math.floor(Math.random() * (parentLength - 1));
  var breakPoint2 = Math.floor(Math.random() * (parentLength - breakPoint1 - 1)) + breakPoint1 + 1;
  return [breakPoint1, breakPoint2]
}

/**
 * Returns average fitness of a generation
 * @param {array} population
 * @param {number} POPULATION_SIZE
 */
function calculateAverageFitnessForGeneration(population, POPULATION_SIZE) {
  var totalGenerationFitness = 0;
  for (let i = 0; i < POPULATION_SIZE; i++)
    totalGenerationFitness += population[i].fitness;
  return totalGenerationFitness / POPULATION_SIZE;
}

function calculateMaximumFitnessForGeneration(population, POPULATION_SIZE) {
  var maxFitness = population[0].fitness;
  for (let i = 1; i < POPULATION_SIZE; i++) {
    if (population[i].fitness > maxFitness)
      maxFitness = population[i].fitness
  }
  return maxFitness
}

function getAverageNumberOfSubjectsPerRoom(chromosome, numberOfRooms) {
  // Get average number of subjects in each room
  var currentRoom = chromosome[0][0];
  const numberOfSubjectsInEachRoom = [];
  const subjectsInCurrentRoom = [];
  for (let i = 0; i < chromosome.length; i++) {
    if (chromosome[i][0] !== currentRoom) {
      // Get number of subjects in current room
      numberOfSubjectsInEachRoom.push(new Set(subjectsInCurrentRoom).size);

      // Set current room as new room
      currentRoom = chromosome[i][0];
      subjectsInCurrentRoom.length = 0;
    }
    subjectsInCurrentRoom.push(chromosome[i][3][1]);
  }

  const averageNumberOfSubjectsInEachRoom = getArraySum(numberOfSubjectsInEachRoom) / numberOfRooms;
  return averageNumberOfSubjectsInEachRoom;

}

function printLayout(chromosome, roomDetails) {
  let seat = 0;
  for (let room = 0; room < roomDetails.length; room++) {
    console.log(`Room No. ${room + 1}`)
    for (let row = 0; row < roomDetails[room][0]; row++) {
      for (let col = 0; col < roomDetails[room][1]; col++) {
        process.stdout.write(`${chromosome[seat][3][0]}: ${chromosome[seat][3][1]}\t\t`);
        seat++;
      }
      process.stdout.write("\n");
    }
    process.stdout.write("\n\n");
  }
}

function minimumFitness(fitness) {
  const length = fitness.length;
  var min = fitness[0];
  for (let i = 0; i < length; i++) {
    if (fitness[i] < min)
      min = fitness[i];
  }
  return min;
}


module.exports = {
  shuffleChromosome,
  getSubjectDissimilarity,
  getNumberOfSeats,
  getArraySum,
  getDistanceBetweenNeighbours,
  getNeighbourDetails,
  isValidNeighbour,
  isSeatEmpty,
  checkIfValidSolution,
  initialiseChromosome,
  shuffleMatingPool,
  generateBreakpoints,
  calculateAverageFitnessForGeneration,
  calculateMaximumFitnessForGeneration,
  getAverageNumberOfSubjectsPerRoom,
  printLayout,
  minimumFitness
}
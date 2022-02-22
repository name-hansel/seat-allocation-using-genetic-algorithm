/**
 * Shuffles an array in place
 * @param {array} array Array to be shuffled
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i][3];
    array[i][3] = array[j][3];
    array[j][3] = temp;
  }
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
 * @returns {object}
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
  return Math.sqrt(Math.pow((v1[0] - v2[0]), 2) + Math.pow((v1[1] - v2[1]), 2))
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
 * Checks if the seat the neighbour is in is valid depending on room dimensions
 * @param {array} neighbour Array containing neighbour row and column
 * @param {number} room Dimensions of a room
 * @returns {boolean}
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

function isSeatEmpty(seat) {
  if (seat[3].length === 0) return true
  return false
}

function checkIfValidSolution(chromosome) {
  const rollNumbers = [];
  console.log(chromosome)
  // Check if all roll no.s are present
  for (let i = 0; i < chromosome.length; i++) {
    rollNumbers.push(chromosome[i][3].length === 0 ? '' : chromosome[i][3][0])
  }

  console.log(rollNumbers.sort())
}

function initialiseChromosome(roomDetails) {
  const chromosome = []
  for (let i = 0; i < roomDetails.data.length; i++) {
    const rows = Number(roomDetails.data[i][0]);
    const columns = Number(roomDetails.data[i][1]);

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        chromosome.push([i, row, column, []])
      }
    }
  }
  return chromosome;
}

module.exports = {
  shuffleArray,
  getSubjectDissimilarity,
  getNumberOfSeats,
  getArraySum,
  getDistanceBetweenNeighbours,
  getNeighbourDetails,
  isValidNeighbour,
  isSeatEmpty,
  checkIfValidSolution,
  initialiseChromosome
}
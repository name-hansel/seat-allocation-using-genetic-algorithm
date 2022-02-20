function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i][3];
    array[i][3] = array[j][3];
    array[j][3] = temp;
  }
}

function getArraySum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

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

function getNumberOfSeats(data) {
  let numberOfSeats = 0;
  for (let i = 0; i < data.length; i++) {
    numberOfSeats += Number(data[i][0]) * Number(data[i][1])
  }
  return numberOfSeats
}

function getDistanceBetweenNeighbours(v1, v2) {
  return Math.sqrt(Math.pow((v1[0] - v2[0]), 2) + Math.pow((v1[1] - v2[1]), 2))
}

function getNeighbourDetails(chromosome, room, row, column) {
  for (let i = 0; i < chromosome.length; i++) {
    if (chromosome[i][0] !== room) continue;
    if (chromosome[i][1] !== row) continue;
    if (chromosome[i][2] !== column) continue;
    return [room, row, column, chromosome[i][3]]
  }
}

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

module.exports = {
  shuffleArray,
  getSubjectDissimilarity,
  getNumberOfSeats,
  getArraySum,
  getDistanceBetweenNeighbours,
  getNeighbourDetails,
  isValidNeighbour
}
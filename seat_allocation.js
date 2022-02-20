const fs = require("fs");
const Papa = require("papaparse");

const shuffleArray = require("./utils")

const POPULATION_SIZE = 1;
const GENERATION_LIMIT = 1;
// const mutationProbability = 0.03

// Read room details from csv file
// [ row, column ]
var csv = fs.readFileSync("room_details.csv");
const roomDetails = Papa.parse(csv.toString());

// Read student details from csv file
// [ roll_number, subject ]
csv = fs.readFileSync("student_details.csv");
const studentDetails = Papa.parse(csv.toString());
const numberOfStudents = studentDetails.data.length

const allotedSeats = [];

// Generate initial population
var studentIndexNumber = 0;
for (let i = 0; i < roomDetails.data.length; i++) {
  const rows = Number(roomDetails.data[i][0]);
  const columns = Number(roomDetails.data[i][1]);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      // If current student index is greater than number of students, we have more seats than students, so these seats are unoccupied
      if (studentIndexNumber >= numberOfStudents) allotedSeats.push([i, row, column, []])
      else allotedSeats.push([i, row, column, studentDetails.data[studentIndexNumber++]])
    }
  }
}

// Create population of chromosomes
// Population is set of possible solutions aka chromosomes
// A chromosome is a solution
// Chromosome contains genes
// Each gene is mapped to one seat and contains properties which define a seat (Room no., row, column, [ roll_number, subject ])
const population = []

// First solution is students arranged as ordered in list
population.push(allotedSeats)

for (let i = 0; i < POPULATION_SIZE - 1; i++) {
  // Make deep copy of initial solution
  const chromosome = JSON.parse(JSON.stringify(population[i]));
  // Shuffle student details and add to population
  shuffleArray(chromosome);
  population.push(chromosome);
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

function getNeighbourDetails(chromosome, room, row, column) {
  for (let i = 0; i < chromosome.length; i++) {
    if (chromosome[i][0] !== room) continue;
    if (chromosome[i][1] !== row) continue;
    if (chromosome[i][2] !== column) continue;
    return [room, row, column, chromosome[i][3]]
  }
}

function getDistanceBetweenNeighbours(v1, v2) {
  return Math.sqrt(Math.pow((v1[0] - v2[0]), 2) + Math.pow((v1[1] - v2[1]), 2))
}

function getArraySum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function fitnessValue(chromosome) {
  const fitnessForEachGene = chromosome.map(gene => {
    // Gene contains [room, row, column, [roll_number,student]]
    const room = gene[0];
    const currentRoomDimensions = roomDetails.data[room];
    const row = gene[1];
    const column = gene[2];
    const student = gene[3];

    // Get neighbours of a particular seat
    var neighbours = [[row - 1, column], [row, column - 1], [row, column + 1], [row + 1, column]];
    var validNeighbours = neighbours.filter(neighbour => isValidNeighbour(neighbour, currentRoomDimensions));

    // Get subject details of each neighbour
    validNeighbours = validNeighbours.map(neighbour => getNeighbourDetails(chromosome, room, neighbour[0], neighbour[1]));

    // Iterate through neighbours and calculate fitness for each neighbour
    const geneFitness = validNeighbours.map(neighbour => {
      // Calculate distance between each neighbour
      const distance = getDistanceBetweenNeighbours([row, column], [neighbour[1], neighbour[2]])
      // Calculate subject similarity
      const subjectDissimilarity = 1;
      const fitness = (distance * subjectDissimilarity) / Math.sqrt(Math.pow(Number(currentRoomDimensions[0]), 2) + Math.pow(Number(currentRoomDimensions[1]), 2))
      return fitness
    })
    return getArraySum(geneFitness)
  })
  return { solution: chromosome, fitness: getArraySum(fitnessForEachGene) }
}

currentGeneration = 1;
// Start iterating through generations
while (currentGeneration <= GENERATION_LIMIT) {
  // Calculate fitness of each chromosome (solution) in population and store
  const fitness = population.map(solution => fitnessValue(solution))

  // ! SELECTION
  // Send top 10% of weighted population (whose fitness has been calculated) as it is to next generation

  // Fill rest of the population using crossover and mutation
  // Select 2 parents for mating
  // Do crossover to create offspring
  // Mutate offspring (Keeping in mind mutationProbability)
  // If valid offsprings, add to population
  // Print best solution in current population
  // Check if current best is better
  currentGeneration++;
}

// Print best solution


// Fitness constraints - minimum number of rooms, all students allocated a seat, neighbouring not of same department
// https://github.com/foobar98/SeatingArrangment_GA/blob/master/seatArrangement.py
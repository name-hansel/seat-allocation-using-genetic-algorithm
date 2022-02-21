const fs = require("fs");
const Papa = require("papaparse");

const { shuffleArray, getSubjectDissimilarity, getNumberOfSeats, getArraySum, getDistanceBetweenNeighbours, getNeighbourDetails, isValidNeighbour } = require("./utils")
const { elitism } = require("./selection")

const POPULATION_SIZE = 10;
const GENERATION_LIMIT = 2;
// const mutationProbability = 0.03

// Read subject details from csv file
var csv = fs.readFileSync("subject_details.csv");
const subjectDetails = Papa.parse(csv.toString());
// Save subject dissimilarity data in an object
const subjectDissimilarityData = getSubjectDissimilarity(subjectDetails.data)

// Read room details from csv file
// [ row, column ]
csv = fs.readFileSync("room_details.csv");
const roomDetails = Papa.parse(csv.toString());
const numberOfSeats = getNumberOfSeats(roomDetails.data)

// Read student details from csv file
// [ roll_number, subject ]
csv = fs.readFileSync("student_details.csv");
const studentDetails = Papa.parse(csv.toString());
const numberOfStudents = studentDetails.data.length

if (numberOfSeats < numberOfStudents) {
  console.log("Insufficient number of seats");
  return;
}

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

// Create initial population by shuffling up first solution
for (let i = 0; i < POPULATION_SIZE - 1; i++) {
  // Make deep copy of initial solution
  const chromosome = JSON.parse(JSON.stringify(population[i]));
  // Shuffle student details and add to population
  shuffleArray(chromosome);
  population.push(chromosome);
}

function fitnessValue(chromosome) {
  const fitnessForEachGene = chromosome.map(gene => {
    // Gene contains [room, row, column, [roll_number,student]]
    const room = gene[0];
    const currentRoomDimensions = roomDetails.data[room];
    const row = gene[1];
    const column = gene[2];
    const student = gene[3];

    // Check if seat is unoccupied
    // TODO empty seat fitness
    if (student.length === 0) return 1;

    // Get neighbours of a particular seat
    var neighbours = [[row - 1, column], [row, column - 1], [row, column + 1], [row + 1, column]];
    var validNeighbours = neighbours.filter(neighbour => isValidNeighbour(neighbour, currentRoomDimensions));

    // Get subject details of each neighbour
    validNeighbours = validNeighbours.map(neighbour => getNeighbourDetails(chromosome, room, neighbour[0], neighbour[1]));

    // Iterate through neighbours and calculate fitness for each neighbour
    const geneFitness = validNeighbours.map(neighbour => {
      // Check if neighbour is empty
      // TODO empty seat fitness
      if (neighbour[3].length === 0) return 1;

      // Calculate distance between each neighbour
      const distance = getDistanceBetweenNeighbours([row, column], [neighbour[1], neighbour[2]])

      // Calculate subject similarity
      const subjectDissimilarity = subjectDissimilarityData[student[1]][neighbour[3][1]];

      // Calculate fitness
      const fitness = (distance * subjectDissimilarity) / Math.sqrt(Math.pow(Number(currentRoomDimensions[0]), 2) + Math.pow(Number(currentRoomDimensions[1]), 2))

      return fitness
    })
    return getArraySum(geneFitness)
  })
  return { solution: chromosome, fitness: getArraySum(fitnessForEachGene) / numberOfSeats }
}

currentGeneration = 1;
// Start iterating through generations
while (currentGeneration <= GENERATION_LIMIT) {
  // Calculate fitness of each chromosome (solution) in population and store
  const populationWithCalculatedFitness = population.map(solution => fitnessValue(solution))

  // Sort solutions in a population based on fitness
  populationWithCalculatedFitness.sort((a, b) => {
    return b.fitness - a.fitness;
  })

  // ! SELECTION (build mating pool)
  const newPopulation = elitism(populationWithCalculatedFitness, 20, POPULATION_SIZE);

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
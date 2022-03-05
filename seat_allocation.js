const fs = require("fs");
const Papa = require("papaparse");

const { shuffleChromosome, getSubjectDissimilarity, getNumberOfSeats, getArraySum, getDistanceBetweenNeighbours, getNeighbourDetails, isValidNeighbour, isSeatEmpty, shuffleMatingPool, calculateAverageFitnessForGeneration, printLayout, minimumFitness } = require("./utils");

const { elitismSelection, rouletteWheelSelection, tournamentSelection } = require("./selection");
const { orderOneCrossover, alternatingCrossover } = require("./crossover");
const { swapMutation, scrambleMutation, inversionMutation } = require("./mutation");

const POPULATION_SIZE = 1000;
const GENERATION_LIMIT = 300;
const MUTATION_RATE = 0.03;

// Read subject details from csv file
var csv = fs.readFileSync("subject_details.csv");
const subjectDetails = Papa.parse(csv.toString());

// Save subject dissimilarity data in an object
const subjectDissimilarityData = getSubjectDissimilarity(subjectDetails.data);

// Read room details from csv file
// [ row, column ]
csv = fs.readFileSync("room_details.csv");
const roomDetails = Papa.parse(csv.toString());
const numberOfSeats = getNumberOfSeats(roomDetails.data);

// Read student details from csv file
// [ roll_number, subject ]
csv = fs.readFileSync("student_details.csv");
const studentDetails = Papa.parse(csv.toString());
const numberOfStudents = studentDetails.data.length

const emptySeats = numberOfSeats - numberOfStudents;

if (emptySeats < 0) {
  throw new Error('Insufficient number of seats');
}

const graphPoints = [];
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

// A chromosome is a solution; chromosome contains genes
// Each gene is mapped to one seat and contains properties which define a seat (Room no., row, column, [ roll_number, subject ])
const population = []

// First solution is students arranged as ordered in list
population.push(allotedSeats)

// Create initial population by shuffling up first solution
for (let i = 0; i < POPULATION_SIZE - 1; i++) {
  // Make deep copy of initial solution
  const chromosome = JSON.parse(JSON.stringify(allotedSeats));

  // Shuffle student details and add to population
  const newChromosome = shuffleChromosome(chromosome);
  population.push(newChromosome);
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
    if (isSeatEmpty(gene)) return 0;

    // Get neighbours of a particular seat
    var neighbours = [[row - 1, column], [row, column - 1], [row, column + 1], [row + 1, column]];
    var validNeighbours = neighbours.filter(neighbour => isValidNeighbour(neighbour, currentRoomDimensions));

    // Get subject details of each neighbour
    validNeighbours = validNeighbours.map(neighbour => getNeighbourDetails(chromosome, room, neighbour[0], neighbour[1]));

    // Iterate through neighbours and calculate fitness for each neighbour
    const geneFitness = validNeighbours.map(neighbour => {
      // Check if neighbour is empty
      if (isSeatEmpty(neighbour)) return 0;

      // Calculate distance between each neighbour
      const distance = getDistanceBetweenNeighbours([row, column], [neighbour[1], neighbour[2]])

      // Calculate subject similarity
      const subjectDissimilarity = subjectDissimilarityData[student[1]][neighbour[3][1]];

      // Calculate fitness
      const fitness = Math.pow((distance * subjectDissimilarity), 2) / (Math.pow(Number(currentRoomDimensions[0]), 2) + Math.pow(Number(currentRoomDimensions[1]), 2));

      return fitness
    })

    // Get minimum fitness among the 4 neighbors
    // This fitness value will be considered for a seat/gene
    return minimumFitness(geneFitness);
    // return getArraySum(geneFitness);
  })

  // const avgNoOfSubjInEachRoom = getAverageNumberOfSubjectsPerRoom(chromosome, roomDetails.data.length);

  const fitness = Math.pow(getArraySum(fitnessForEachGene) / numberOfSeats, 2); // / Math.pow(avgNoOfSubjInEachRoom, 4);

  return { solution: chromosome, fitness }
}

currentGeneration = 1;
// Start iterating through generations
while (currentGeneration <= GENERATION_LIMIT) {
  console.log(`Generation: ${currentGeneration}`)

  // Calculate fitness of each chromosome (solution) in population and store
  const populationWithCalculatedFitness = population.map(solution => fitnessValue(solution))

  // Calculate average fitness for a generation and print it
  // const averageGenerationFitness = calculateAverageFitnessForGeneration(populationWithCalculatedFitness, POPULATION_SIZE)
  // console.log(`Generation: ${currentGeneration}\nAverage fitness: ${averageGenerationFitness}`)

  // Sort solutions in a population based on fitness
  populationWithCalculatedFitness.sort((a, b) => {
    return b.fitness - a.fitness;
  })

  // Add to graphPoints object
  graphPoints.push({
    generation: currentGeneration,
    fitness: populationWithCalculatedFitness[0].fitness
  })

  // Build a mating pool using any selection method
  // const [matingPool, nextPopulation] = elitismSelection(populationWithCalculatedFitness, 20, POPULATION_SIZE);
  // const [matingPool, nextPopulation] = rouletteWheelSelection(populationWithCalculatedFitness, 20, POPULATION_SIZE);
  const [matingPool, nextPopulation] = tournamentSelection(populationWithCalculatedFitness, 20, POPULATION_SIZE);

  // While next population is not full, keep generating offsprings using random parents from mating pool
  while (nextPopulation.length < POPULATION_SIZE) {
    // Create copy of mating pool to get random elements out of it
    const copyMatingPool = shuffleMatingPool(matingPool);

    // Crossover using first 2 elements of shuffled mating pool
    const offspringA = orderOneCrossover(copyMatingPool[0], copyMatingPool[1], roomDetails, emptySeats);
    const offspringB = orderOneCrossover(copyMatingPool[1], copyMatingPool[0], roomDetails, emptySeats);

    // Mutate offspring 1 and 2 here
    const mutatedOffspringA = swapMutation(offspringA, MUTATION_RATE);
    const mutatedOffspringB = swapMutation(offspringB, MUTATION_RATE);

    nextPopulation.push(mutatedOffspringA, mutatedOffspringB);
  }

  // Clear previous population
  population.length = 0

  // Add all offsprings to the population
  population.push(...nextPopulation);

  currentGeneration++;
}

const bestPopulation = population.map(solution => fitnessValue(solution))
bestPopulation.sort((a, b) => {
  return b.fitness - a.fitness;
})

var bestSolution = bestPopulation[0];
var maxFitness = bestSolution.fitness;
for (let i = 0; i < POPULATION_SIZE; i++) {
  if (bestPopulation[i].fitness > maxFitness)
    bestSolution = bestPopulation[i]
}

// console.log(bestSolution.solution);
console.log(bestSolution.fitness);
printLayout(bestSolution.solution, roomDetails.data);
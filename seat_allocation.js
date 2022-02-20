const fs = require("fs");
const Papa = require("papaparse");

const POPULATION_SIZE = 2;
const GENERATION_LIMIT = 3;
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

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i][3];
    array[i][3] = array[j][3];
    array[j][3] = temp;
  }
}

for (let i = 0; i < POPULATION_SIZE - 1; i++) {
  // Make deep copy of initial solution
  const chromosome = JSON.parse(JSON.stringify(population[i]));
  // Shuffle student details and add to population
  shuffleArray(chromosome);
  population.push(chromosome);
}

function fitnessValue(chromosome) {
  // Gene contains [room, row, column, [roll_number,student]]
  const fitnessForEachGene = chromosome.map(gene => {
    // Check with 4 neighbours
    // (Distance * subject dissimilarity)/root(row^2 + column^2)
    // TODO
    console.log(gene)
  })
}

currentGeneration = 1;
// Start iterating through generations
while (currentGeneration < GENERATION_LIMIT) {
  // Calculate fitness of each individual in population and store
  const fitness = population.map(solution => fitnessValue(solution))
  currentGeneration++;
  // Send top 10% of weighted population (whose fitness has been calculated) as it is to next generation
  // Fill rest of the population using crossover and mutation
  // Select 2 parents for mating
  // Do crossover to create offspring
  // Mutate offspring (Keeping in mind mutationProbability)
  // If valid offsprings, add to population
  // Print best solution in current population
  // Check if current best is better
}

// Print best solution


// Fitness constraints - minimum number of rooms, all students allocated a seat, neighbouring not of same department
// https://github.com/foobar98/SeatingArrangment_GA/blob/master/seatArrangement.py
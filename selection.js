/**
 * Creates mating pool and a part of new population based on the selection method of elitism, where a certain percentage of parents are simply carried onto the next generation, and only they are chosen to create offsprings
 * @param {array} population Current population using which the mating pool will be built
 * @param {aumber} percentageOfElite Percentage of fittest parents to carry forward
 * @param {number} POPULATION_SIZE Size of population
 */
function elitismSelection(population, percentageOfElite, POPULATION_SIZE) {
  const matingPool = [];
  const newPopulation = [];

  const numberOfParentsToCarryOver = parseInt((percentageOfElite / 100) * POPULATION_SIZE);

  // If number of parents is 1, increment by 1 since crossover needs atleast 2 parents
  if (numberOfParentsToCarryOver === 1) numberOfParentsToCarryOver++;

  // Add the elite parents to mating pool
  matingPool.push(...population.slice(0, numberOfParentsToCarryOver))

  // Add the elite parents to next population
  newPopulation.push(...population.slice(0, numberOfParentsToCarryOver))

  return [matingPool.map(gene => gene.solution), newPopulation.map(gene => gene.solution)];
}

/**
 * Creates mating pool by assigning probabilities to each solution which corresponds to their fitness value i.e., chromosomes with higher fitness value have a higher probability of being chosen
 * @param {array} population Current population using which the mating pool will be built
 * @param {aumber} sizeOfMatingPool Size of the mating pool which has to be generated
 * @param {number} POPULATION_SIZE Size of population
 */
function rouletteWheelSelection(population, sizeOfMatingPool, POPULATION_SIZE) {
  const matingPool = [];

  // Get total fitness of the entire population
  let totalFitnessOfPopulation = 0;
  for (let i = 0; i < POPULATION_SIZE; i++)
    totalFitnessOfPopulation += population[i].fitness;

  // Calculate probability for each chromosome in the population
  for (let i = 0; i < POPULATION_SIZE; i++) {
    population[i].probability = population[i].fitness / totalFitnessOfPopulation;
  }

  // Generate a random number (between 0 and 1) and if probability is greater than the number generated, add it to the mating pool
  // Do this until we get a mating pool of population size
  while (matingPool.length < sizeOfMatingPool) {
    const randomNumber = Math.floor(Math.random());
    for (let i = 0; i < POPULATION_SIZE && matingPool.length < sizeOfMatingPool; i++) {
      if (population[i].probability > randomNumber)
        matingPool.push(population[i]);
    }
  }

  return [matingPool.map(gene => gene.solution), []]
}

module.exports = {
  elitismSelection,
  rouletteWheelSelection
}
/**
 * Creates mating pool and a part of new population based on the selection method of elitism, where a certain percentage of parents are simply carried onto the next generation, and only they are chosen to create offsprings
 * @param {array} population Current population using which the mating pool will be built
 * @param {aumber} percentageOfElite Percentage of fittest parents to carry forward
 * @param {number} POPULATION_SIZE Size of population
 */
function elitismSelection(population, percentageOfElite, POPULATION_SIZE) {
  const matingPool = [];
  const newPopulation = [];

  var numberOfParentsToCarryOver = parseInt((percentageOfElite / 100) * population.length);

  // If number of parents is 1, increment by 1 since crossover needs atleast 2 parents
  if (numberOfParentsToCarryOver === 1) numberOfParentsToCarryOver++;

  // Add the elite parents to mating pool
  matingPool.push(...population.slice(0, numberOfParentsToCarryOver))

  // Add the elite parents to next population
  newPopulation.push(...population.slice(0, numberOfParentsToCarryOver))

  return [matingPool.map(gene => gene.solution), newPopulation.map(gene => gene.solution)];
}

module.exports = {
  elitismSelection
}
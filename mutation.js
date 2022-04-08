const { shuffleChromosome } = require("./utils")

/**
 * Returns two points lying between 0 and length of parent
 * @param {array} parentLength
 */
function generateMutationPoints(parentLength) {
  var indexA = Math.floor(Math.random() * (parentLength - 1));
  var indexB = Math.floor(Math.random() * (parentLength - 1));
  return [indexA, indexB]
}


function inverseChromosome(chromosome) {
  const invertedChromosome = JSON.parse(JSON.stringify(chromosome));
  const chromosomeLength = chromosome.length;

  for (let i = 0; i < chromosomeLength; i++) {
    invertedChromosome[chromosomeLength - 1 - i][3] = chromosome[i][3];
  }
  return invertedChromosome;
}

/**
 * Returns mutated chromosome
 * @param {array} chromosome
 * @param {number} mutationRate
 */
function swapMutation(chromosome, mutationRate) {
  const mutationChance = Math.random();

  // No mutation
  if (mutationRate < mutationChance)
    return chromosome;

  // Create copy of chromosome
  const copyChromosome = JSON.parse(JSON.stringify(chromosome));

  // Choose 2 points in chromosome
  const [indexA, indexB] = generateMutationPoints(copyChromosome.length);

  // Swap students at the two points
  var temp = copyChromosome[indexA][3];
  copyChromosome[indexA][3] = copyChromosome[indexB][3];
  copyChromosome[indexB][3] = temp;

  return copyChromosome;
}

/**
 * Returns mutated chromosome
 * @param {array} chromosome
 * @param {number} mutationRate
 */
function scrambleMutation(chromosome, mutationRate) {
  const mutationChance = Math.random();

  // No mutation
  if (mutationRate < mutationChance)
    return chromosome;

  // Create copy of chromosome
  const copyChromosome = JSON.parse(JSON.stringify(chromosome));

  // Choose 2 points in chromosome
  var [indexA, indexB] = generateMutationPoints(copyChromosome.length);
  if (indexA > indexB)
    [indexB, indexA] = [indexA, indexB];

  // Scramble elements between the mutation points
  const scrambledChromosome = shuffleChromosome(copyChromosome.slice(indexA, indexB + 1));

  // Return unscrambled and scrambled elements as a chromosome in order
  return [
    ...copyChromosome.slice(0, indexA),
    ...scrambledChromosome,
    ...copyChromosome.slice(indexB + 1)
  ];
}

function inversionMutation(chromosome, mutationRate) {
  const mutationChance = Math.random();

  // No mutation
  if (mutationRate < mutationChance)
    return chromosome;

  // Create copy of chromosome
  const copyChromosome = JSON.parse(JSON.stringify(chromosome));

  // Choose 2 points in chromosome
  var [indexA, indexB] = generateMutationPoints(copyChromosome.length);
  if (indexA > indexB)
    [indexB, indexA] = [indexA, indexB];

  // Inverse genes in this range
  const invertedChromosome = inverseChromosome(copyChromosome.slice(indexA, indexB + 1));

  // Return original and inverted elements as a chromosome in order
  return [
    ...copyChromosome.slice(0, indexA),
    ...invertedChromosome,
    ...copyChromosome.slice(indexB + 1)
  ];
}

module.exports = {
  swapMutation,
  scrambleMutation,
  inversionMutation
}
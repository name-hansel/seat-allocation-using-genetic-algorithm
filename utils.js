function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i][3];
    array[i][3] = array[j][3];
    array[j][3] = temp;
  }
}

module.exports = shuffleArray
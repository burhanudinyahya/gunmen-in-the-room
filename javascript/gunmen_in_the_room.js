var maxGunmen = 0;
var maxGunmenTmp;
var cond;

var walls = {};
makeWalls();

var matrix = {};
var cell = [8, 8]; // Row, Column
createMatrix();

var matrixGunman = {};
placeGunman(cell);


// Place walls
function makeWalls() {
  walls[0] = [1, 3, 5, 7];
  walls[1] = [5];
  walls[2] = [0, 2, 5, 7];
  walls[4] = [3];
  walls[5] = [5, 7];
  walls[6] = [1];
  walls[7] = [4, 6];
}

// Create room
function createMatrix() {
  var x;
  var y;
  
  for (y = 0; y < cell[0]; y++) { // Rows
  	matrix[y] = [];
    
    for (x = 0; x < cell[1]; x++) { // Columns
      if (walls[y] !== undefined) {
    	  matrix[y][x] = walls[y].includes(x) ? 'W' : 'E';
      } else {
        matrix[y][x] = 'E';
      }
    }
  }
}

var p; // Possibilities

// Place Gunman in room
function placeGunman(c) {
  var totalP = c[0] * c[1]; // Total possibilities
  
  var offsetX;
  var offsetY = -1;
  
  for (p = 0; p < totalP; p++) {
    maxGunmenTmp = 0;
    matrixGunman = JSON.parse(JSON.stringify(matrix));
    
    offsetX = p % cell[1];
    
    if (offsetX === 0) {
      offsetY++;
    }

    goThroughCell(
      offsetX,
      offsetY,
      cell[1],
      cell[0],
      false
    );
    
    // Go through the remaining cells after offset
    if (p > 0) {
      goThroughCell(
        0,
        0,
        offsetX + 1,
        offsetY + 1,
        true
      );
    }


    // Check each results
    console.log( p + ' (Gunmen: ' + maxGunmenTmp + ')' );
    for (var t = 0; t < cell[0]; t++) {
      console.log( matrixGunman[t] );
    }
    
    // Get maximum number of gunmen
    maxGunmen = (maxGunmen < maxGunmenTmp) ? maxGunmenTmp : maxGunmen;
    
    // Prevent freezing of browser
    // if (((p + 1) < totalP) && (p % 10 == 0)) {
    //     setTimeout(placeGunman, 5);
    // }
    
  }

  // Print out max gunmen
  console.log( 'Max gunmen: ' + maxGunmen );
}

// Go through all the cells
function goThroughCell(offsetX, offsetY, xAmt, yAmt, isRemaining) {
  var x;
  var y;
  
  if (isRemaining) {
    var xAmtTmp = xAmt;
    xAmt = cell[1];
  }
  
  for (y = 0 + offsetY; y < yAmt; y++) { // Vertical
      
    if (isRemaining && y === yAmt) {
      xAmt = xAmtTmp;
    }
    
    for (x = 0 + offsetX; x < xAmt; x++) { // Horizontal
      offsetX = 0; // Reset for next row

      if (matrixGunman[y][x] === 'E') {
        if (matrixGunman[y][x] !== 'U') {
          matrixGunman[y][x] = 'G';
          maxGunmenTmp++;
        }
        checkForGunman(x, y);
      }
    }
  }
}

// Check every direction for gunmen
function checkForGunman(x, y) {
  cond = 'save'; // Condition
  
  // Up
  if (y !== 0 && cond === 'save') {
    checkDir((y - 1), ['backward', 'vertical'], x, y);
  }
    
  // Down
  if (y !== (cell[0] - 1) && cond === 'save') {
    checkDir((y + 1), ['forward', 'vertical'], x, y);
  }
    
  // Left
  if (x !== 0 && cond === 'save') {
    checkDir((x - 1), ['backward', 'horizontal'], x, y);
  }
    
  // Right
  if (x !== (cell[1] - 1) && cond === 'save') {
    checkDir((x + 1), ['forward', 'horizontal'], x, y);
  }
  
  return cond;
}

// Check direction
function checkDir(start, direction, x, y) {
  var pos;
  
  var step = (direction[0] === 'backward') ? -1 : 1;
  
  var condition = (direction[0] === 'backward') ?
                  function(posCond){
                      return posCond >= 0;
                  } :
                  function(posCond){
                      return posCond < cell[1];
                  };
  
  for (pos = start; condition(pos); pos += step) {
    var row = (direction[1] === 'horizontal') ? y : pos;
    var col = (direction[1] === 'horizontal') ? pos : x;
    
    if (matrixGunman[row][col] === 'G') {
      cond = 'unsave';
      break;
    } else if (matrixGunman[row][col] === 'W') {
      break;
    } else {
      matrixGunman[row][col] = 'U'; // Mark as unsafe
    }
  }
}




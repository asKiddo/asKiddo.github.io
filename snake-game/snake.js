// Desired additions:
//  Play again ability
//  Speed control

// FUNTIONS ----
// draw
//  draws a snake and an apple
var draw = function(snakeToDraw, apple) {
  var drawableSnake = { color: "green", pixels: snakeToDraw };
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableObjects = [drawableSnake, drawableApple];
  CHUNK.draw(drawableObjects);
}


// changeDirection
//  set direction for snake
var changeDirection = function(direction) {
  snake[0].direction = direction;
}

// moveSegment
//  uses string in direction of segment to move one pixel in direction
var moveSegment = function(segment) {
  switch(segment.direction) {
    case "down":
      return { top: segment.top + 1, left: segment.left };
    case "up":
      return { top: segment.top - 1, left: segment.left };
    case "right":
      return { top: segment.top, left: segment.left + 1 }
    case "left":
      return { top: segment.top, left: segment.left - 1 }
    default:
      return segment;
  }
  return segment;
}

// moveSnake
//  moves passed snake down 1 pixel
var moveSnake = function(snake) {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });
}

// segmentFurtherForwardThan
//  ensures snake moves as a unit
var segmentFurtherForwardThan = function(index, snake) {
  if (snake[index - 1] === undefined) {
    return snake[index];
  } else {
    return snake[index - 1];
  }
}

// growSnake
//  increases snake by a segment
var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[indexOfLastSegment];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}

// ate
//  check for self-collision of snake
var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

// advanceGame
//  play the game
var advanceGame = function() {
  var newSnake = moveSnake(snake);

  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
  }

  if (ate(newSnake, [apple])) {
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! you hit a wall!");
  }

  snake = newSnake;
  draw(snake, apple);
}

// runGame
var runGame = function(keyVal) {
  if(keyVal === "enter") {
    CHUNK.executeNTimesPerSecond(advanceGame, 1);
    CHUNK.onArrowKey(changeDirection);
  }
}


// Initialize game
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];
var apple = { top: 8, left: 10 };
CHUNK.flashMessage("Press enter to start.");
CHUNK.onArrowKey(runGame);

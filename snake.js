// Declares a function that takes the arguments snakeToDraw and apple (which are part of an array called drawableObjects) — this portion of code declares the color and dimensions of the snake and the apple, and then uses the CHUNK library to draw them on the canvas.
var draw = function(snakeToDraw, apple) {
	var drawableSnake = { color: "#79BD8F", pixels: snakeToDraw };
	var drawableApple = { color: "#C13B00", pixels: [apple] };
	var drawableObjects = [drawableSnake, drawableApple];
	CHUNK.draw(drawableObjects);
} 

// moveSegment is a function that, depending on which direction key the user hits, changes the positioning of the segment (the snake) on the canvas.
var moveSegment = function(segment) {
	if (segment.direction === "down") {
		return { top: segment.top + 1, left: segment.left }
	}
	else if (segment.direction === "up") {
		return { top: segment.top - 1, left: segment.left }
	}
	else if (segment.direction === "left") {
		return { top: segment.top, left: segment.left - 1 }
	}
	else if (segment.direction === "right") {
		return { top: segment.top, left: segment.left + 1 }
	}
	return segment;
	}

// I don't understand what this function does.
var segmentFurtherForwardThan = function(index, snake) {
	if (snake[index - 1] === undefined) {
		return snake[index];
	}
	else {
		return snake[index - 1];
	}
}

var moveSnake = function(snake) {
	return snake.map(function(oldSegment, segmentIndex) {
		var newSegment = moveSegment(oldSegment);
		newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
		return newSegment;
	});
}

var growSnake = function(snake) {
	var tipOfTailIndex = snake.length - 1;
	var tipOfTail = snake[snake.length - 1];
	snake.push({ top: tipOfTail.top, left: tipOfTail.left });
	return snake;
}

var ate = function(snake, otherThing) {
	var head = snake[0];
	return CHUNK.detectCollisionBetween([head], otherThing);
}

var advanceGame = function() {
	var newSnake = moveSnake(snake);

	if (ate(snake, [apple])) {
		newSnake = growSnake(newSnake);
		score += 50;
		document.getElementById("score").innerHTML = "Score: " + score;
		apple = CHUNK.randomLocation();
	}

	if (ate(newSnake, snake)) {
		CHUNK.endGame();
		// CHUNK.flashMessage("ZOINKS! You squished yourself.");
		document.getElementById("message").innerHTML = "ZOINKS! You squished yourself.";
		document.getElementById("score").innerHTML = "Score: " + score;
	}
	
	else if (ate(snake, CHUNK.gameBoundaries())) {
		CHUNK.endGame();
		// CHUNK.flashMessage("BOOM! You hit a wall.");
		document.getElementById("message").innerHTML = "BOOM! You hit a wall."
		document.getElementById("score").innerHTML = "Score: " + score;
	}

	else { 
		snake = newSnake;
		draw(snake, apple);
}
}

var changeDirection = function(direction) {
	snake[0].direction = direction;
}

var score = 0;

var apple = { top: 8, left: 10 };

var snake = [{ top: 2, left: 0, direction: "down" }, { top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }]; 

CHUNK.executeNTimesPerSecond(advanceGame, 3);
CHUNK.onArrowKey(changeDirection);
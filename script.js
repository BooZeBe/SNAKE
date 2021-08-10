// DOM

const status = document.querySelector('#status')
const scoreNumber = document.querySelector('#scoreNumber')

// SCORE

let score = 0

function growScore() {
	score++
	scoreNumber.innerHTML = score
	if (animationTime > 30) { animationTime -= 5 }
}

// CANVAS

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width
const height = canvas.height

ctx.strokeStyle = 'white';


// SNAKE

const snakeSize = 20
const snake = [{x: 200, y: 200}]
	
function drawSnake(x,y) {
	ctx.beginPath();
	ctx.rect(x, y, snakeSize, snakeSize);
	ctx.stroke();
}

	// Move
	const directions = {		
	  37: 'left',
	  38: 'up',
	  39: 'right',
	  40: 'down'
	}
	const reverseDirections = {
		'left': 'right',
		'right': 'left',
		'down': 'up',
		'up': 'down',
	}
	let currentDirection = 'right'

	function setDirection(e) {
		let newDirection

		typeof e === 'string' ? newDirection = e : newDirection = directions[e.keyCode]	// check mobile or computer input
		
		if (newDirection !== undefined &&
			reverseDirections[newDirection] !== currentDirection) {
			setTimeout(() => currentDirection = newDirection, 10)
		}
	}

	function moveSnake(direction, x, y) {
		switch (direction) {
			case 'left':
				x -= snakeSize
				if (x <= -snakeSize) {
					x = 380
				}
			break;
			case 'up':
				y -= snakeSize
				if (y <= -snakeSize) {
					y = 380
				}
			break;
			case 'right':
				x += snakeSize
				if (x >= 400) {
					x = 0
				}
			break;
			case 'down':
				y += snakeSize
				if (y >= 400) {
					y = 0
				}
			break;
		}
		snake.unshift({x, y})
		snake.pop()
	}

	document.addEventListener('keydown', setDirection)

	// Grow snake
	function growSnake(direction) {
		switch (direction) {
			case 'left':
				snake.unshift({x: snake[0].x - snakeSize, y: snake[0].y})
			break;
			case 'up':
				snake.unshift({x: snake[0].x, y: snake[0].y - snakeSize})
			break;
			case 'right':
				snake.unshift({x: snake[0].x + snakeSize, y: snake[0].y})
			break;
			case 'down':
				snake.unshift({x: snake[0].x, y: snake[0].y + snakeSize})
			break;
		}
	}

	// Check apple
	function checkApple(x, y) {
		if (x === applePositionX &&
			y === applePositionY ||
			x === applePositionX - snakeSize &&
			y === applePositionY - snakeSize) {
			growScore()
			createApplePos()
			growSnake(currentDirection)
		}
	}


// APPLE

function createApple(x,y) {
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, 2*Math.PI, false);
	ctx.strokeStyle = 'red';
	ctx.stroke();
	ctx.strokeStyle = 'white';
}
	// Position
	let applePositionX
	let applePositionY

	function createApplePos() {
		applePositionX = Math.random() * ((width - snakeSize) - snakeSize) + snakeSize
		applePositionY = Math.random() * ((height - snakeSize) - snakeSize) + snakeSize
		validateApplePos(applePositionX, applePositionY)
	}

	function validateApplePos(x,y) {
		if (x % snakeSize !== 0 && y % snakeSize !== 0) {
			applePositionX = x - x % snakeSize
			applePositionY = y - y % snakeSize
		}

		const snakeValuesX = snake.map(e => e.x)
		const snakeValuesY = snake.map(e => e.y)

		if (snakeValuesX.includes(x) && snakeValuesY.includes(y)) {
			createApplePos()
		}
	}
	createApplePos()


// GAME

function gameOverCheck() {
	let head = snake[0]

	for (let i = 1; i < snake.length; i++) {
		if (head.x === snake[i].x &&
			head.y === snake[i].y) {
			gameplay = null
			status.innerHTML = 'GAME OVER'
		}
	}
}


// LAUNCH

let animationTime = 100

let gameplay = function() {
	// CLEAR CANVAS
	ctx.clearRect(0,0,width,height)

	// SNAKE
	snake.forEach(e => drawSnake(e.x, e.y))
	moveSnake(currentDirection, snake[0].x, snake[0].y)
	checkApple(snake[0].x, snake[0].y)

	// APPLE
	createApple(applePositionX, applePositionY)

	// CHECK GAME OVER
	gameOverCheck()
	
	// LOOP 
	setTimeout(gameplay, animationTime)
}

gameplay()

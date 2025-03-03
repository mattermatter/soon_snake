const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

const box = 30;
let snake;
let direction;
let food;
let score;
let game;

// Load the snake image
const snakeImage = new Image();
snakeImage.src = "snake.png";

const foodImage = new Image();
foodImage.src = "food.png";

document.addEventListener("keydown", changeDirection);
startButton.addEventListener("click", startGame);

function startGame() {
    // Initialize game state
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };

    // Clear any previous game interval
    if (game) {
        clearInterval(game);
    }

    // Start the game loop
    game = setInterval(draw, 130);
}

function changeDirection(event) {
    const key = event.keyCode;
    if ([37, 38, 39, 40].includes(key)) {
        event.preventDefault(); // Prevent default scrolling behavior
    }
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
}

function draw() {
    // Clear canvas
    ctx.fillStyle = "#34495e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food as an image
    ctx.drawImage(foodImage, food.x, food.y, box, box);

    // Draw snake
    snake.forEach((segment) => {
        ctx.drawImage(snakeImage, segment.x, segment.y, box, box);
    });

    // Snake movement
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Check if snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    // Check collision with walls with a buffer
    const buffer = box; // Allow one more space
    if (
        snakeX < -buffer ||
        snakeY < -buffer ||
        snakeX > canvas.width ||
        snakeY > canvas.height
    ) {
        endGame();
    }

    // Check collision with itself
    if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
    }

    snake.unshift(newHead);

    // Display score
    ctx.fillStyle = "#ecf0f1";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function endGame() {
    clearInterval(game);
    alert("Game Over! Score: " + score);
}

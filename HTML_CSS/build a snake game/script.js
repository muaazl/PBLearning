const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150}, 
    {x: 120, y: 150}, 
    {x: 110, y: 150},
]

let dx = 10
let dy = 0
let score = 0
let foodX
let foodY

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10)
    foodY = randomTen(0, gameCanvas.height - 10)

    snake.forEach(
        function isFoodOnSnake(part) {
            const foodIsOnSnake = part.x === foodX && part.y === foodY
            if (foodIsOnSnake) createFood()
        }
    )
}

function drawFood() {
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'darkred'
    ctx.fillRect(foodX, foodY, 10, 10)
    ctx.strokeRect(foodX, foodY, 10, 10)
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen'
    ctx.strokeStyle = 'darkgreen'
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)
}

function drawSnake() {
    snake.forEach(drawSnakePart)
}

function clearCanvas() {
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height)
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)
}

function advanceSnake() {
    const head = {
        x: snake[0].x + dx, y: snake[0].y + dy
    }
    snake.unshift(head)
    const didEatFood = snake[0].x === foodX&& snake[0].y === foodY
    if (didEatFood) {
        score += 10
        document.getElementById('score').innerHTML = score
        createFood()
    } else {
        snake.pop()
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37
    const RIGHT_KEY = 39
    const UP_KEY = 38
    const DOWN_KEY = 40

    const KEY_W = 87
    const KEY_S = 83
    const KEY_A = 65
    const KEY_D = 68

    const keyPressed = event.keyCode
    const goingUp = dy === -10
    const goingDown = dy === 10
    const goingRight = dx === 10
    const goingLeft = dx === -10

    if ((keyPressed === LEFT_KEY || keyPressed === KEY_A) && !goingRight) {
        dx = -10
        dy = 0
    }
    if ((keyPressed === UP_KEY || keyPressed === KEY_W) && !goingDown) {
        dx = 0
        dy = -10
    }
    if ((keyPressed === RIGHT_KEY || keyPressed === KEY_D) && !goingLeft) {
        dx = 10
        dy = 0
    }
    if ((keyPressed === DOWN_KEY || keyPressed === KEY_S) && !goingUp) {
        dx = 0
        dy = 10
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if (didCollide) return true
        
        const hitLeftWall = snake[0].x < 0
        const hitRightWall = snake[0].x > gameCanvas.width - 10
        const hitToptWall = snake[0].y < 0
        const hitBottomWall = snake[0].y > gameCanvas.height - 10

        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }
}

function resetGame() {
    dx = 10;
    dy = 0;
    score = 0;
    snake = [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 },
        { x: 110, y: 150 },
    ];
    createFood();
    main();
}

function main() {
    if (didGameEnd()) {
        alert("Game Over. Your score is " + score);
        return;
    }
    setTimeout (
        function onTick() {
            clearCanvas()
            drawFood()
            advanceSnake()
            drawSnake()
            main()
        }, 100
    )
}

createFood()
main()
document.addEventListener("keydown", changeDirection)
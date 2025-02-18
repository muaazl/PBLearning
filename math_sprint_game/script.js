let timer;
let time = 10;
let score = 0;
let highScore = 0;

function startGame() {
    resetGame();
    generateProblem();
    generateOptions();
    timer = setInterval(updateTimer, 1000);
    document.getElementById('highScoreValue').
        innerText = highScore;
}

function resetGame() {
    clearInterval(timer);
    time = 10;
    score = 0;
    document.getElementById('time').
        innerText = time;
    document.getElementById('result').
        innerText = '';
    document.getElementById('currentScore').
        innerText = score;
    document.getElementById('options').
        innerHTML = '';
    document.getElementById('problem').
        innerText = '';
    document.getElementById('highScoreValue').
        innerText = '0';
}

function updateTimer() {
    time--;
    document.getElementById('time').innerText = time;
    if (time === 0) {
        endGame();
    }
}

function generateProblem() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const operation = getRandomOperation();

    let problem;

    switch (operation) {
        case '+':
            problem = `${num1} + ${num2}`;
            break;
        case '-':
            problem = `${num1} - ${num2}`;
            break;
        case '*':
            problem = `${num1} * ${num2}`;
            break;
        case '/':
            // Ensure a non-zero divisor
            const divisor = num2 !== 0 ? num2 : 1;
            const result = (num1 / divisor).toFixed(2);
            problem = `${num1} / ${divisor}`;
            break;
        default:
            // Handle unexpected operations
            problem = '';
    }

    document.getElementById('problem').
        innerText = problem;
}

function getRandomOperation() {
    const operations = ['+', '-', '*', '/'];
    const randomIndex =
        Math.floor(Math.random() *
            operations.length);
    return operations[randomIndex];
}

function generateOptions() {
    const problemText = document.
        getElementById('problem').innerText;
    const correctAnswer = eval(problemText);
    const options = [correctAnswer];

    // Determine if the problem involves 
    // division or multiplication
    const isDivision = problemText.includes('/');
    const isMultiplication = problemText.includes('*');

    while (options.length < 4) {
        let option;
        if (isDivision || isMultiplication) {
            // For division and multiplication, 
            // generate options with 2 decimal places
            option = correctAnswer + (Math.random() * 20 - 10);
            option = parseFloat(option.toFixed(2));
        } else {
            // For other operations, generate options as before
            option = correctAnswer +
                Math.floor(Math.random() * 10) - 5;
        }

        if (!options.includes(option)) {
            options.push(option);
        }
    }

    options.sort(() => Math.random() - 0.5);

    const optionsContainer =
        document.getElementById('options');
    optionsContainer.innerHTML = '';
    options.forEach((option, index) => {
        const button =
            document.createElement('button');
        button.classList.add('option');
        button.innerText = option.toFixed(2);
        button.onclick = () =>
            selectOption(option, correctAnswer);
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        document.getElementById('result').innerHTML =
            `<span class="correct">
                Correct!
            </span>`;
        
        score++;
        document.getElementById('currentScore').innerText = score;

        // Reset the timer
        clearInterval(timer); // Stop the existing timer
        time = 10; // Reset the time to the initial value
        document.getElementById('time').innerText = time;
        timer = setInterval(updateTimer, 1000); // Restart the timer

        // Generate a new problem and options
        generateProblem();
        generateOptions();
    } else {
        endGame(); // End the game on incorrect answer
    }
}

function endGame() {
    clearInterval(timer);
    document.getElementById('result').innerText = 
        'Game over!';
    document.getElementById('options').innerHTML = '';
    document.getElementById('problem').innerText = '';
    updateHighScore();
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScoreValue').
            innerText = highScore;
    }
}
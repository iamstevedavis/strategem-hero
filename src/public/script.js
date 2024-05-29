const sequenceContainer = document.getElementById('sequence-container');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

const arrows = ['U', 'L', 'D', 'R'];
const keys = {
    'w': 'U',
    'a': 'L',
    's': 'D',
    'd': 'R'
};

let sequence = {};
let userInput = [];
let timer = 45;
let score = 0;
let gameInterval;
let timerInterval;

function resetGame() {
    sequence = {};
    userInput = [];
    timer = 45;
    score = 0;
    updateDisplay();
}

function startGame() {
    resetGame();
    nextSequence();
    startButton.style.display = 'none';
    gameInterval = setInterval(gameLoop, 1000 / 60);
    timerInterval = setInterval(updateTimer, 1000);
}

function nextSequence() {
    const length = Math.floor(Math.random() * 5) + 4;
    sequence = {};
    for (let i = 0; i < length; i++) {
        const arrow = {
            id: i,
            arrow: arrows[Math.floor(Math.random() * arrows.length)],
            opacity: .5
        }
        sequence[arrow.id] = arrow;
    }
    userInput = [];
    updateDisplay();
}

function displayArrow(arrow) {
    const img = document.createElement('img');
    img.id = arrow.id;
    img.src = `arrows/${arrow.arrow}.png`;
    sequenceContainer.appendChild(img);
}

function updateDisplay() {
    sequenceContainer.innerHTML = '';
    for (const [key, value] of Object.entries(sequence)) {
       displayArrow(value);
    }
    timerElement.textContent = timer;
    scoreElement.textContent = `Score: ${score}`;
}

function updateTimer() {
    timer--;
    if (timer <= 0) {
        endGame();
    }
    timerElement.textContent = timer;
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    alert(`Game Over! Your score is ${score}`);
    startButton.style.display = 'inline-block';
}

function checkInput() {
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== sequence[i].arrow) {
            userInput = [];
            return;
        }
    }
    if (userInput.length === Object.keys(sequence).length) {
        score++;
        timer += 5;
        nextSequence();
    }
}

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', (event) => {
    if (keys[event.key]) {
        userInput.push(keys[event.key]);
        checkInput();

        if (userInput[userInput.length - 1] === sequence[userInput.length - 1].arrow) {
            const arrowImg = document.getElementById(sequence[userInput.length - 1].id.toString());
            if (arrowImg) {
                arrowImg.style.opacity = '1';
            }
        }
    }
});

function gameLoop() {
    //TODO: Implement game loop logic if needed?

}

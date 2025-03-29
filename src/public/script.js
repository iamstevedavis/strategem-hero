// DOM Elements
const sequenceContainer = document.getElementById('sequence-container');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

// Add a mute button
const muteButton = document.createElement('button');
muteButton.id = 'mute-button';
muteButton.textContent = 'Mute';
document.body.appendChild(muteButton);

// Constants
const ARROWS = ['U', 'L', 'D', 'R'];
const KEY_TO_ARROW = {
    'w': 'U',
    'a': 'L',
    's': 'D',
    'd': 'R'
};

// Game State
let sequence = {};
let userInput = [];
let timer = 45;
let score = 0;
let gameInterval;
let timerInterval;

const audioFiles = [
    new Audio('sound/tone_1.mp3'),
    new Audio('sound/tone_2.mp3'),
    new Audio('sound/tone_3.mp3'),
    new Audio('sound/tone_4.mp3')
];
let isMuted = false;
let currentAudioIndex = 0;

// Function to play audio files sequentially
function playNextAudio() {
    if (isMuted) return; // Don't play if muted

    const currentAudio = audioFiles[currentAudioIndex];
    currentAudio.play();

    currentAudio.onended = () => {
        // Move to the next audio file, looping back to the start if necessary
        currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
        playNextAudio();
    };
}


// Start playing the audio sequence
playNextAudio();

// Mute/unmute functionality
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;

    // Mute or unmute all audio files
    audioFiles.forEach(audio => {
        audio.muted = isMuted;
    });

    // Stop playback if muted, or resume playback if unmuted
    if (isMuted) {
        audioFiles.forEach(audio => audio.pause());
    } else {
        playNextAudio();
    }

    muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
});

// Resets the game state
function resetGame() {
    sequence = {};
    userInput = [];
    timer = 45;
    score = 0;
    updateDisplay();
}

// Starts the game
function startGame() {
    resetGame();
    generateSequence();
    startButton.style.display = 'none';
    gameInterval = setInterval(gameLoop, 1000 / 60); // Placeholder for future logic
    timerInterval = setInterval(updateTimer, 1000);
}

// Generates a new sequence of arrows
function generateSequence() {
    const sequenceLength = Math.floor(Math.random() * 5) + 4; // Random length between 4 and 8
    sequence = {};

    for (let i = 0; i < sequenceLength; i++) {
        const arrow = {
            id: i,
            arrow: ARROWS[Math.floor(Math.random() * ARROWS.length)],
            opacity: 0.5
        };
        sequence[arrow.id] = arrow;
    }

    userInput = [];
    updateDisplay();
}

// Displays an arrow in the sequence container
function displayArrow(arrow) {
    const img = document.createElement('img');
    img.id = arrow.id;
    img.src = `arrows/${arrow.arrow}.png`;
    img.style.opacity = arrow.opacity; // Set initial opacity
    sequenceContainer.appendChild(img);
}

// Updates the display (arrows, timer, and score)
function updateDisplay() {
    // Clear and re-render the sequence container
    sequenceContainer.innerHTML = '';
    for (const arrow of Object.values(sequence)) {
        displayArrow(arrow);
    }

    // Update timer and score
    timerElement.textContent = timer;
    scoreElement.textContent = `Score: ${score}`;
}

// Updates the timer and ends the game if time runs out
function updateTimer() {
    timer--;
    if (timer <= 0) {
        endGame();
    }
    timerElement.textContent = timer;
}

// Ends the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    alert(`Game Over! Your score is ${score}`);
    startButton.style.display = 'inline-block';
}

// Checks the user's input against the sequence
function checkInput() {
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== sequence[i].arrow) {
            userInput = []; // Reset input on incorrect match
            return;
        }
    }

    // If the user completes the sequence
    if (userInput.length === Object.keys(sequence).length) {
        score++;
        timer += 5; // Reward extra time
        generateSequence();
    }
}

// Handles keydown events for user input
document.addEventListener('keydown', (event) => {
    const arrow = KEY_TO_ARROW[event.key];
    if (!arrow) return; // Ignore invalid keys

    userInput.push(arrow);
    checkInput();

    // Highlight the correct arrow by changing its opacity
    const currentArrow = sequence[userInput.length - 1];
    if (currentArrow && arrow === currentArrow.arrow) {
        const arrowImg = document.getElementById(currentArrow.id.toString());
        if (arrowImg) {
            arrowImg.style.opacity = '1'; // Highlight the arrow
        }
    }
});

// Placeholder for game loop logic (if needed in the future)
function gameLoop() {
    // Currently unused, but can be used for animations or other logic
}

// Start button event listener
startButton.addEventListener('click', startGame);
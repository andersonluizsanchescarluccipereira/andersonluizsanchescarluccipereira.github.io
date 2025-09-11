const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameScreen = document.getElementById('game-screen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const feedbackEl = document.getElementById('feedback');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let correctAnswer;
let difficulty = 10; // aumenta gradualmente

// ---------------- Funções ----------------
function generateQuestion() {
    const a = Math.floor(Math.random() * (difficulty + 1));
    const b = Math.floor(Math.random() * (difficulty + 1));
    const op = Math.random() < 0.7 ? '+' : '-'; // 70% adição, 30% subtração

    correctAnswer = op === '+' ? a + b : a - b;
    const options = [correctAnswer,
                     Math.floor(Math.random() * (difficulty*2+1)),
                     Math.floor(Math.random() * (difficulty*2+1))];

    shuffleArray(options);

    questionEl.textContent = `${a} ${op} ${b} = ?`;
    optionsEl.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.classList.add('option-btn');
        btn.onclick = () => checkAnswer(opt);
        optionsEl.appendChild(btn);
    });
}

function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkAnswer(selected) {
    if (selected === correctAnswer) {
        score++;
        feedbackEl.textContent = "⭐ Muito bem! ⭐";
        scoreEl.textContent = `Pontuação: ${score}`;
        if(score % 3 === 0) difficulty += 2; // aumenta dificuldade
        setTimeout(generateQuestion, 800);
    } else {
        feedbackEl.textContent = "❌ Tente novamente!";
        setTimeout(gameOver, 1000);
    }
}

function gameOver() {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreEl.textContent = `Sua pontuação: ${score}`;
}

// ---------------- Eventos ----------------
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    score = 0;
    difficulty = 10;
    scoreEl.textContent = `Pontuação: ${score}`;
    feedbackEl.textContent = "";
    generateQuestion();
});

restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    score = 0;
    difficulty = 10;
    scoreEl.textContent = `Pontuação: ${score}`;
    feedbackEl.textContent = "";
    generateQuestion();
});

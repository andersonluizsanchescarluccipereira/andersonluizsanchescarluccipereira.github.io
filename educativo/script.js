const startScreen = document.getElementById('start-screen');
const levelButtonsContainer = document.getElementById('level-buttons');
const gameScreen = document.getElementById('game-screen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const feedbackEl = document.getElementById('feedback');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

const applauseSound = document.getElementById('applause-sound');
const failSound = document.getElementById('fail-sound');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];

let score = 0;
let correctAnswer;
let level = 3; 
const levels = [3,4,5,6,7,8];

// ... (todo código que já te passei antes)

// ---------------- Inicialização ----------------
function initLevelButtons() {
    levelButtonsContainer.innerHTML = ""; // limpa antes de criar
    levels.forEach(lvl => {
        const btn = document.createElement('button');
        btn.textContent = `${lvl} anos`;
        btn.classList.add('level-btn');
        btn.onclick = () => {
            level = lvl;
            startScreen.classList.add('hidden'); // esconde tela inicial
            gameOverScreen.classList.add('hidden'); // esconde tela de fim se estiver ativa
            startGame();
        };
        levelButtonsContainer.appendChild(btn);
    });
}

// ---------------- Start ----------------
window.onload = () => {
    // Garante que o canvas confete pega o tamanho certo
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initLevelButtons(); // <-- ISSO FALTAVA
};

// ---------------- Dificuldade ----------------
function setDifficulty(level) {
    switch(level) {
        case 3: return { ops: ['+'], maxNum: 5, options: 2 };
        case 4: return { ops: ['+'], maxNum: 10, options: 3 };
        case 5: return { ops: ['+','-'], maxNum: 10, options: 3 };
        case 6: return { ops: ['+','-'], maxNum: 20, options: 4 };
        case 7: return { ops: ['+','-','*'], maxNum: 50, options: 4 };
        case 8: return { ops: ['+','-','*','/'], maxNum: 100, options: 5 };
        default: return { ops: ['+'], maxNum: 10, options: 3 };
    }
}

// ---------------- Geração de perguntas ----------------
function startGame() {
    score = 0;
    scoreEl.textContent = `Pontuação: ${score}`;
    feedbackEl.textContent = '';
    gameScreen.classList.remove('hidden');
    generateQuestion();
}

function generateQuestion() {
    const difficulty = setDifficulty(level);
    const a = Math.floor(Math.random() * (difficulty.maxNum + 1));
    const b = Math.floor(Math.random() * (difficulty.maxNum + 1));
    const op = difficulty.ops[Math.floor(Math.random() * difficulty.ops.length)];

    switch(op) {
        case '+': correctAnswer = a + b; break;
        case '-': correctAnswer = a - b; break;
        case '*': correctAnswer = a * b; break;
        case '/': correctAnswer = b !== 0 ? Math.floor(a / b) : 0; break;
    }

    const options = [correctAnswer];
    while(options.length < difficulty.options) {
        let rand = Math.floor(Math.random() * (difficulty.maxNum * 2 + 1));
        if(!options.includes(rand)) options.push(rand);
    }

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

// ---------------- Confete ----------------
function createConfetti() {
    for(let i=0;i<100;i++){
        confettiParticles.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            r: Math.random()*6+4,
            d: Math.random()*100,
            color: `hsl(${Math.random()*360},100%,50%)`,
            tilt: Math.random()*10-10
        });
    }
}

function drawConfetti() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confettiParticles.forEach(p => {
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r/2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/2);
        ctx.stroke();
    });
    updateConfetti();
}

function updateConfetti() {
    for(let i=0;i<confettiParticles.length;i++){
        let p = confettiParticles[i];
        p.y += Math.cos(0.1 + p.d) + 1 + p.r/2;
        p.x += Math.sin(0.1) * 2;
        if(p.y > canvas.height){ confettiParticles.splice(i,1); i--; }
    }
}

function animateConfetti(){
    if(confettiParticles.length>0){
        drawConfetti();
        requestAnimationFrame(animateConfetti);
    }
}

// ---------------- Resposta ----------------
function checkAnswer(selected) {
    if (selected === correctAnswer) {
        score++;
        feedbackEl.textContent = "⭐ Muito bem! ⭐";
        scoreEl.textContent = `Pontuação: ${score}`;
        applauseSound.currentTime = 0;
        applauseSound.play();
        createConfetti();
        animateConfetti();
        if(score % 3 === 0) level = Math.min(8, level+1); 
        setTimeout(generateQuestion,
// Substitua o array emojiBase por classes do Font Awesome
const iconBase = [
    'fa-code',          // Ícone de código
    'fa-laptop-code',   // Laptop com código
    'fa-terminal',      // Terminal
    'fa-keyboard',      // Teclado
    'fa-microchip',     // Microchip
    'fa-server',        // Servidor
    'fa-database',      // Banco de dados
    'fa-bug',           // Bug (debug)
    'fa-code-branch',   // Branch (Git)
    'fa-rocket',        // Foguete
    'fa-lock',          // Cadeado (segurança)
    'fa-tools',         // Ferramentas
    'fa-save',          // Disquete (salvar)
    'fa-wifi',          // Wi-Fi
    'fa-hammer',        // Martelo
    'fa-calculator',    // Calculadora
    'fa-plug',          // Plugue
    'fa-folder',        // Pasta
    'fa-file-code',    // Arquivo de código
    'fa-globe'          // Globo (internet)
];

let icons = [];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let startTime;
let timerInterval;
let level = 1;
let wins = 0;
let soundEnabled = true;
const maxPairsPerLevel = [4, 6, 8, 10, 12, 14, 16, 18, 20]; 

// Elementos DOM
const board = document.getElementById("game-board");
const status = document.getElementById("status");
const timerDisplay = document.getElementById("timer");
const levelSpan = document.getElementById("level");
const rankingList = document.getElementById("ranking-list");
const winsSpan = document.getElementById("wins");
const soundBtn = document.getElementById("sound-btn");

// Sons
const soundCorrect = document.getElementById("sound-correct");
const soundWrong = document.getElementById("sound-wrong");
const soundWin = document.getElementById("sound-win");

function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i> Som';
    } else {
    soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Som';
    }
}

function playSound(sound) {
    if (soundEnabled) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Erro ao reproduzir som:", e));
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    let numPairs = maxPairsPerLevel[Math.min(level - 1, maxPairsPerLevel.length - 1)];
    icons = iconBase.slice(0, numPairs);
    cards = [...icons, ...icons];
    shuffle(cards);
    board.innerHTML = "";
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    startTime = new Date().getTime();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    timerDisplay.textContent = "0s";
    levelSpan.textContent = level;
    status.className = "status-info";
    status.textContent = `Nível ${level}: Decifre ${numPairs} pares de chaves criptografadas!`;

    const rows = Math.ceil(cards.length / 4);
    board.style.gridTemplateRows = `repeat(${rows}, 70px)`;

    cards.forEach((iconClass, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = iconClass;
    card.dataset.index = index;
    card.addEventListener("click", flipCard);
    
    // Adiciona o elemento <i> para o ícone (inicialmente vazio)
    const iconElement = document.createElement("i");
    iconElement.className = `fas ${iconClass}`;
    iconElement.style.display = 'none'; // Inicialmente escondido
    card.appendChild(iconElement);
    
    board.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains("flipped") || this.classList.contains("matched")) return;
    
    this.classList.add("flipped");
    // Mostra o ícone
    const icon = this.querySelector('i');
    icon.style.display = 'inline-block';
    
    if (!firstCard) {
    firstCard = this;
    } else {
    secondCard = this;
    checkMatch();
    }
}

function checkMatch() {
    lockBoard = true;
    
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    matchedPairs++;
    playSound(soundCorrect);
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.classList.add("pulse");
    secondCard.classList.add("pulse");
    resetCards();
    
    if (matchedPairs === icons.length) {
        clearInterval(timerInterval);
        const timeTaken = Math.floor((new Date().getTime() - startTime) / 1000);
        wins++;
        winsSpan.textContent = wins;
        status.className = "status-success";
        status.textContent = `🎉 Nível ${level} completo em ${timeTaken} segundos!`;
        playSound(soundWin);
        updateRanking(level, timeTaken);
        level++;
        
        setTimeout(() => {
        createBoard();
        displayRanking();
        }, 2000);
    }
    } else {
    playSound(soundWrong);
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        // Esconde os ícones novamente
        firstCard.querySelector('i').style.display = 'none';
        secondCard.querySelector('i').style.display = 'none';
        resetCards();
    }, 800);
    }
}

function resetCards() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function updateTimer() {
    const elapsed = Math.floor((new Date().getTime() - startTime) / 1000);
    timerDisplay.textContent = `${elapsed}s`;
}

function updateRanking(lvl, newTime) {
    let rankings = JSON.parse(localStorage.getItem("memoryDevRankings")) || {};
    if (!rankings[lvl]) rankings[lvl] = [];
    rankings[lvl].push(newTime);
    rankings[lvl].sort((a, b) => a - b);
    rankings[lvl] = rankings[lvl].slice(0, 5);
    localStorage.setItem("memoryDevRankings", JSON.stringify(rankings));
}

function displayRanking() {
    let rankings = JSON.parse(localStorage.getItem("memoryDevRankings")) || {};
    const list = rankings[level] || [];
    rankingList.innerHTML = "";
    
    if (list.length === 0) {
    rankingList.innerHTML = "<li>Nenhum recorde ainda</li>";
    return;
    }
    
    list.forEach((time, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>#${index + 1}</span> <span>${time}s</span>`;
    rankingList.appendChild(li);
    });
}

// Inicializa o jogo
createBoard();
displayRanking();
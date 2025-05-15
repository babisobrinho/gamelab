// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const elements = {
        status: document.getElementById('status-display'),
        board: document.getElementById('board'),
        messageText: document.querySelector('.message-text'),
        soundBtn: document.getElementById('sound-btn'),
        restartBtn: document.getElementById('restart-btn'),
        playerXScore: document.getElementById('playerX-score'),
        playerOScore: document.getElementById('playerO-score'),
        drawsScore: document.getElementById('draws'),
        playerIndicator: document.getElementById('player-indicator'),
        messageBox: document.getElementById('message'),
        ranking: document.getElementById('ranking'),
        overlay: document.getElementById('overlay'),
        rankingList: document.getElementById('ranking-list'),
        showRanking: document.getElementById('show-ranking'),
        closeRanking: document.getElementById('close-ranking')
    };

    // Mensagens de status do jogo
    const statusMessages = [
        "$ Iniciando sistema de jogo...",
        "✅ Jogador X venceu!",
        "✅ Jogador O venceu!",
        "🤝 Empate!",
        "ALERTA: Movimento inválido!",
        "> Aguardando jogada do jogador..."
    ];

    // Frases de ataque/defesa temáticas
    const attackPhrases = [
        "> Exploit detectado! Tentando invadir o sistema...",
        "🛡️ Patch aplicado! Fortalecendo a defesa...",
        "🔥 Ataque em andamento! Protegendo as linhas de código...",
        "🔒 Sistema reforçado contra vulnerabilidades!",
        "💥 Exploit avançando... Precisa de uma contra-medida!",
        "🛡️ Defesa ativada! Mantendo o sistema seguro...",
        "⚔️ Embate entre exploits e patches!",
        "🚨 Alerta! Tentativa de invasão detectada!",
        "🛡️ Atualização de segurança em progresso..."
    ];

    // Estado do jogo
    const gameState = {
        board: ['', '', '', '', '', '', '', '', ''], // Tabuleiro 3x3
        currentPlayer: 'X', // Jogador atual (X ou O)
        gameOver: false, // Indica se o jogo terminou
        scores: {
            playerX: 0, // Vitórias do jogador X
            playerO: 0, // Vitórias do jogador O
            draws: 0    // Empates
        },
        soundEnabled: true, // Som ligado/desligado
        gameHistory: [], // Histórico de partidas
        firstMoveMade: false // Indica se o primeiro movimento foi feito
    };

    // Efeitos sonoros
    const sounds = {
        moveX: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'), // Som para jogador X
        moveO: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'), // Som para jogador O
        win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'), // Som de vitória
        draw: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3'), // Som de empate
        error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3') // Som de erro
    };

    // Inicializa o jogo
    function initGame() {
        createBoard(); // Cria o tabuleiro
        loadGameHistory(); // Carrega o histórico de jogos
        updateScoresDisplay(); // Atualiza os placares
        startNewGame(); // Inicia um novo jogo
        setupEventListeners(); // Configura os eventos
    }

    // Cria o tabuleiro do jogo
    function createBoard() {
        elements.board.innerHTML = ''; // Limpa o tabuleiro
        
        // Cria 9 células (3x3)
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i; // Armazena o índice da célula
            cell.addEventListener('click', () => handleMove(i)); // Adiciona evento de clique
            elements.board.appendChild(cell); // Adiciona a célula ao tabuleiro
        }
    }

    // Inicia um novo jogo
    function startNewGame() {
        // Reseta o estado do jogo
        gameState.board = ['', '', '', '', '', '', '', '', ''];
        gameState.currentPlayer = 'X';
        gameState.gameOver = false;
        gameState.firstMoveMade = false;

        updateBoard(); // Atualiza a exibição do tabuleiro
        updatePlayerIndicator(); // Atualiza o indicador de jogador
        setMessage(statusMessages[0], 'info'); // Mostra mensagem inicial
        typeWriter(elements.status, statusMessages[0]); // Efeito de máquina de escrever
    }

    // Atualiza a exibição do tabuleiro
    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        
        // Percorre todas as células
        gameState.board.forEach((value, index) => {
            cells[index].innerHTML = ''; // Limpa o conteúdo
            cells[index].className = 'cell'; // Reseta as classes
            
            // Adiciona ícone e classe conforme o jogador
            if (value === 'X') {
                cells[index].innerHTML = '<i class="fa-solid fa-virus"></i>';
                cells[index].classList.add('x');
            } else if (value === 'O') {
                cells[index].innerHTML = '<i class="fa-solid fa-shield"></i>';
                cells[index].classList.add('o');
            }
        });
    }

    // Manipula o movimento do jogador
    function handleMove(index) {
        // Verifica se o jogo acabou ou a célula já está ocupada
        if (gameState.gameOver || gameState.board[index] !== '') {
            playSound(sounds.error); // Toca som de erro
            typeWriter(elements.status, statusMessages[4]); // Mostra mensagem de erro
            return;
        }

        // Toca o som do movimento
        playSound(gameState.currentPlayer === 'X' ? sounds.moveX : sounds.moveO);

        // Faz o movimento
        gameState.board[index] = gameState.currentPlayer;
        updateBoard();

        // Mostra frase de ataque/defesa
        if (!gameState.firstMoveMade) {
            typeWriter(elements.status, attackPhrases[0]);
            gameState.firstMoveMade = true;
        } else {
            const randomPhrase = attackPhrases[Math.floor(Math.random() * (attackPhrases.length - 1)) + 1];
            typeWriter(elements.status, randomPhrase);
        }

        // Verifica vitória
        if (checkWin(gameState.currentPlayer)) {
            endGame(gameState.currentPlayer);
            return;
        }

        // Verifica empate
        if (checkDraw()) {
            endGame('draw');
            return;
        }

        // Alterna o jogador
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        updatePlayerIndicator();
        setMessage(`Vez do Jogador ${gameState.currentPlayer}`, 'info');
    }

    // Verifica se um jogador venceu
    function checkWin(player) {
        // Padrões de vitória (linhas, colunas e diagonais)
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
            [0, 4, 8], [2, 4, 6]             // diagonais
        ];

        // Verifica cada padrão
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            if (gameState.board[a] === player &&
                gameState.board[b] === player &&
                gameState.board[c] === player) {
                
                // Destaca as células vencedoras
                pattern.forEach(i => {
                    document.querySelector(`.cell[data-index="${i}"]`).classList.add('winner');
                });
                return true;
            }
            return false;
        });
    }

    // Verifica se houve empate
    function checkDraw() {
        return !gameState.board.includes('') && // Todas as células preenchidas
               !checkWin('X') && // Ninguém venceu
               !checkWin('O');
    }

    // Finaliza o jogo e atualiza os placares
    function endGame(result) {
        gameState.gameOver = true;

        if (result === 'X') {
            gameState.scores.playerX++;
            typeWriter(elements.status, statusMessages[1]);
            setMessage('🎉 Jogador X venceu!', 'success');
            playSound(sounds.win);
        } else if (result === 'O') {
            gameState.scores.playerO++;
            typeWriter(elements.status, statusMessages[2]);
            setMessage('🎉 Jogador O venceu!', 'success');
            playSound(sounds.win);
        } else {
            gameState.scores.draws++;
            typeWriter(elements.status, statusMessages[3]);
            setMessage('🤝 Empate!', 'info');
            playSound(sounds.draw);
        }

        updateScoresDisplay(); // Atualiza os placares
        saveGame(result); // Salva o jogo no histórico
    }

    // Atualiza a exibição dos placares
    function updateScoresDisplay() {
        elements.playerXScore.textContent = gameState.scores.playerX;
        elements.playerOScore.textContent = gameState.scores.playerO;
        elements.drawsScore.textContent = gameState.scores.draws;
    }

    // Atualiza o indicador de jogador atual
    function updatePlayerIndicator() {
        if (gameState.currentPlayer === 'X') {
            elements.playerIndicator.innerHTML = '<i class="fa-solid fa-virus"></i>';
            elements.playerIndicator.style.color = 'var(--player-x)';
        } else {
            elements.playerIndicator.innerHTML = '<i class="fa-solid fa-shield"></i>';
            elements.playerIndicator.style.color = 'var(--player-o)';
        }
    }

    // Define a mensagem exibida
    function setMessage(text, type = 'info') {
        elements.messageText.textContent = text;
        elements.messageBox.className = 'message-box ' + type;
    }

    // Efeito de máquina de escrever
    let typingInterval = null;
    function typeWriter(element, text, speed = 50) {
        if (typingInterval) clearInterval(typingInterval);

        text = text.replace(/\s+/g, ' ').trim();

        let i = 0;
        element.textContent = '';
        element.classList.add('typing');

        typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                element.classList.remove('typing');
                typingInterval = null;
            }
        }, speed);
    }

    // Toca um efeito sonoro
    function playSound(sound) {
        if (gameState.soundEnabled && sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {
                console.log("Error playing sound:", e);
                // Alguns navegadores exigem interação do usuário antes de tocar sons
                document.body.addEventListener('click', () => sound.play(), { once: true });
            });
        }
    }

    // Alterna o som ligado/desligado
    function toggleSound() {
        gameState.soundEnabled = !gameState.soundEnabled;
        elements.soundBtn.innerHTML = gameState.soundEnabled ?
            '<i class="fas fa-volume-up"></i> Som' :
            '<i class="fas fa-volume-mute"></i> Som';
    }

    // Carrega o histórico de jogos do localStorage
    function loadGameHistory() {
        const savedHistory = localStorage.getItem('zerodayduelHistory');
        if (savedHistory) {
            gameState.gameHistory = JSON.parse(savedHistory);
            
            // Calcula os placares a partir do histórico
            gameState.scores.playerX = gameState.gameHistory.filter(game => game.winner === 'X').length;
            gameState.scores.playerO = gameState.gameHistory.filter(game => game.winner === 'O').length;
            gameState.scores.draws = gameState.gameHistory.filter(game => game.winner === 'draw').length;
            
            updateScoresDisplay();
            updateRanking();
        }
    }

    // Salva o jogo no histórico
    function saveGame(result) {
        const game = {
            date: new Date().toLocaleString('pt-BR'), // Data atual
            mode: '2 Players', // Modo de jogo
            winner: result, // Vencedor (X, O ou draw)
            board: [...gameState.board] // Estado do tabuleiro
        };
        
        // Adiciona no início do histórico
        gameState.gameHistory.unshift(game);
        // Mantém apenas os últimos 10 jogos
        if (gameState.gameHistory.length > 10) {
            gameState.gameHistory.pop();
        }
        
        // Salva no localStorage
        localStorage.setItem('zerodayduelHistory', JSON.stringify(gameState.gameHistory));
        updateRanking();
    }

    // Atualiza a exibição do ranking
    function updateRanking() {
        elements.rankingList.innerHTML = gameState.gameHistory.map((game, index) => `
            <li>
                <span class="rank">${index + 1}º</span>
                <span class="name">${game.winner === 'X' ? 'Jogador X' : game.winner === 'O' ? 'Jogador O' : 'Empate'}</span>
                <span class="score">${game.mode}</span>
                <span class="date">${game.date}</span>
            </li>
        `).join('');
    }

    // Mostra o ranking
    function showRanking() {
        updateRanking();
        elements.ranking.classList.remove('hidden');
        elements.overlay.classList.remove('hidden');
    }

    // Esconde o ranking
    function hideRanking() {
        elements.ranking.classList.add('hidden');
        elements.overlay.classList.add('hidden');
    }

    // Configura os ouvintes de eventos
    function setupEventListeners() {
        elements.soundBtn.addEventListener('click', toggleSound);
        elements.restartBtn.addEventListener('click', startNewGame);
        elements.showRanking.addEventListener('click', showRanking);
        elements.closeRanking.addEventListener('click', hideRanking);
        elements.overlay.addEventListener('click', hideRanking);
    }

    // Inicializa o jogo
    initGame();
});
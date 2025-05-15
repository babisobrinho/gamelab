document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const elementos = {
        status: document.getElementById('status-display'),
        board: document.getElementById('board'),
        mensagem: document.querySelector('.message-text'),
        botaoModo: document.getElementById('mode-btn'),
        botaoSom: document.getElementById('sound-btn'),
        botaoReiniciar: document.getElementById('restart-btn'),
        playerXScore: document.getElementById('playerX-score'),
        playerOScore: document.getElementById('playerO-score'),
        draws: document.getElementById('draws'),
        playerIndicator: document.getElementById('player-indicator'),
        caixaMensagem: document.getElementById('message'),
        ranking: document.getElementById('ranking'),
        overlay: document.getElementById('overlay'),
        rankingList: document.getElementById('ranking-list'),
        showRanking: document.getElementById('show-ranking'),
        closeRanking: document.getElementById('close-ranking')
    };

    const statusMessages = [
        "$ Iniciando sistema de jogo...",
        "✅ Jogador X venceu!",
        "✅ Jogador O venceu!",
        "🤝 Empate!",
        "ALERTA: Movimento inválido!",
        "> Aguardando jogada do jogador..."
    ];

    const frasesAtaque = [
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

    let primeiraJogadaFeita = false; // Flag para controlar frase da primeira jogada

    const estadoJogo = {
        board: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: 'X',
        gameOver: false,
        scores: {
            playerX: 0,
            playerO: 0,
            draws: 0
        },
        somAtivado: true,
        gameHistory: []
    };

    const sons = {
        move: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'),
        win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
        draw: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-game-over-213.mp3'),
        error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3')
    };

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

    function iniciarJogo() {
        estadoJogo.board = ['', '', '', '', '', '', '', '', ''];
        estadoJogo.currentPlayer = 'X';
        estadoJogo.gameOver = false;
        primeiraJogadaFeita = false; // reset flag

        atualizarTabuleiro();
        atualizarStatus();
        atualizarIndicadorJogador();
        definirMensagem(statusMessages[0], 'info'); // "$ Iniciando sistema de jogo..."

        typeWriter(elementos.status, statusMessages[0]);
    }

    function criarTabuleiro() {
        elementos.board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => fazerJogada(i));
            elementos.board.appendChild(cell);
        }
    }

    function atualizarTabuleiro() {
        const cells = document.querySelectorAll('.cell');
        estadoJogo.board.forEach((valor, index) => {
            cells[index].innerHTML = '';
            cells[index].className = 'cell';
            if (valor === 'X') {
                cells[index].innerHTML = '<i class="fa-solid fa-virus"></i>';
                cells[index].classList.add('x');
            } else if (valor === 'O') {
                cells[index].innerHTML = '<i class="fa-solid fa-shield"></i>';
                cells[index].classList.add('o');
            }
        });
    }

    function fazerJogada(index) {
        if (estadoJogo.gameOver || estadoJogo.board[index] !== '') {
            tocarSom(sons.error);
            typeWriter(elementos.status, statusMessages[4]);
            return;
        }

        estadoJogo.board[index] = estadoJogo.currentPlayer;
        tocarSom(sons.move);
        atualizarTabuleiro();

        if (!primeiraJogadaFeita) {
            // Frase fixa na primeira jogada
            typeWriter(elementos.status, frasesAtaque[0]); // "> Exploit detectado! Tentando invadir o sistema..."
            primeiraJogadaFeita = true;
        } else {
            // Frases aleatórias depois da primeira jogada
            if (!estadoJogo.gameOver) {
                const aleatoria = frasesAtaque[Math.floor(Math.random() * (frasesAtaque.length -1)) +1]; // evitar a frase[0]
                typeWriter(elementos.status, aleatoria);
            }
        }

        if (verificarVitoria(estadoJogo.currentPlayer)) {
            finalizarJogo(estadoJogo.currentPlayer);
            return;
        }

        if (verificarEmpate()) {
            finalizarJogo('draw');
            return;
        }

        estadoJogo.currentPlayer = estadoJogo.currentPlayer === 'X' ? 'O' : 'X';
        atualizarIndicadorJogador();
        definirMensagem(`Vez do Jogador ${estadoJogo.currentPlayer}`, 'info');
    }

    function verificarVitoria(player) {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];

        return winPatterns.some(pattern => {
            const [a,b,c] = pattern;
            if (estadoJogo.board[a] === player &&
                estadoJogo.board[b] === player &&
                estadoJogo.board[c] === player) {

                pattern.forEach(i => {
                    document.querySelector(`.cell[data-index="${i}"]`).classList.add('winner');
                });
                return true;
            }
            return false;
        });
    }

    function verificarEmpate() {
        return !estadoJogo.board.includes('') && !verificarVitoria('X') && !verificarVitoria('O');
    }

    function finalizarJogo(resultado) {
        estadoJogo.gameOver = true;
        if (resultado === 'X') {
            estadoJogo.scores.playerX++;
            elementos.playerXScore.textContent = estadoJogo.scores.playerX;
            typeWriter(elementos.status, statusMessages[1]);
            definirMensagem('🎉 Jogador X venceu!', 'success');
            tocarSom(sons.win);
        } else if (resultado === 'O') {
            estadoJogo.scores.playerO++;
            elementos.playerOScore.textContent = estadoJogo.scores.playerO;
            typeWriter(elementos.status, statusMessages[2]);
            definirMensagem('🎉 Jogador O venceu!', 'success');
            tocarSom(sons.win);
        } else {
            estadoJogo.scores.draws++;
            elementos.draws.textContent = estadoJogo.scores.draws;
            typeWriter(elementos.status, statusMessages[3]);
            definirMensagem('🤝 Empate!', 'info');
            tocarSom(sons.draw);
        }
        salvarPartida(resultado);
    }

    function atualizarStatus() {
        typeWriter(elementos.status, statusMessages[0]);
    }

    function atualizarIndicadorJogador() {
        if (estadoJogo.currentPlayer === 'X') {
            elementos.playerIndicator.innerHTML = '<i class="fa-solid fa-virus"></i>';
            elementos.playerIndicator.style.color = 'var(--player-x)';
        } else {
            elementos.playerIndicator.innerHTML = '<i class="fa-solid fa-shield"></i>';
            elementos.playerIndicator.style.color = 'var(--player-o)';
        }
    }

    function alternarSom() {
        estadoJogo.somAtivado = !estadoJogo.somAtivado;
        elementos.botaoSom.innerHTML = estadoJogo.somAtivado ?
            '<i class="fas fa-volume-up"></i> Som' :
            '<i class="fas fa-volume-mute"></i> Som';
    }

    function tocarSom(som) {
        if (estadoJogo.somAtivado) {
            som.currentTime = 0;
            som.play().catch(e => console.log("Erro ao reproduzir som:", e));
        }
    }

    function definirMensagem(texto, tipo = 'info') {
        elementos.mensagem.textContent = texto;
        elementos.caixaMensagem.className = 'message-box ' + tipo;
    }

    function salvarPartida(resultado) {
        const partida = {
            data: new Date().toLocaleString('pt-BR'),
            modo: '2 Jogadores',
            vencedor: resultado === 'X' ? 'Jogador X' : resultado === 'O' ? 'Jogador O' : 'Empate',
            tabuleiro: [...estadoJogo.board]
        };
        estadoJogo.gameHistory.unshift(partida);
        if (estadoJogo.gameHistory.length > 10) {
            estadoJogo.gameHistory.pop();
        }
        atualizarRanking();
    }

    function atualizarRanking() {
        elementos.rankingList.innerHTML = estadoJogo.gameHistory.map((partida, index) => `
            <li>
                <span class="rank">${index + 1}º</span>
                <span class="name">${partida.vencedor}</span>
                <span class="score">${partida.modo}</span>
                <span class="date">${partida.data}</span>
            </li>
        `).join('');
    }

    function mostrarRanking() {
        elementos.ranking.classList.remove('hidden');
        elementos.overlay.classList.remove('hidden');
    }

    if (elementos.botaoModo) {
        elementos.botaoModo.style.display = 'none';
        elementos.botaoModo.removeEventListener('click', () => { });
    }

    elementos.botaoSom.addEventListener('click', alternarSom);
    elementos.botaoReiniciar.addEventListener('click', iniciarJogo);
    elementos.showRanking.addEventListener('click', mostrarRanking);
    elementos.closeRanking.addEventListener('click', () => {
        elementos.ranking.classList.add('hidden');
        elementos.overlay.classList.add('hidden');
    });
    elementos.overlay.addEventListener('click', () => {
        elementos.ranking.classList.add('hidden');
        elementos.overlay.classList.add('hidden');
    });

    criarTabuleiro();
    iniciarJogo();
});

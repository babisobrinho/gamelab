document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const elementos = {
        terminal: document.getElementById('terminal-display'),
        guessDisplay: document.getElementById('guess-display'),
        keyboard: document.querySelector('.keyboard'),
        tryBtn: document.getElementById('try-btn'),
        clearBtn: document.getElementById('clear-btn'),
        botaoSom: document.getElementById('sound-btn'),
        botaoReiniciar: document.getElementById('restart-btn'),
        vitorias: document.getElementById('wins'),
        derrotas: document.getElementById('losses'),
        tentativasRestantes: document.getElementById('remaining-attempts'),
        coracoes: document.getElementById('hearts'),
        ranking: document.getElementById('ranking'),
        overlay: document.getElementById('overlay'),
        rankingList: document.getElementById('ranking-list'),
        showRanking: document.getElementById('show-ranking'),
        closeRanking: document.getElementById('close-ranking')
    };

    // Mensagens do terminal
    const terminalMessages = {
        start: "$ Iniciando sistema de segurança...",
        attempts: [
            "> Tentando combinação...",
            "> Testando variações...",
            "> Aumentando potência do ataque...",
            "> Tentando combinações comuns...",
            "> Acesso negado [Firewall Ativado]",
            "> Tentando novamente com novo algoritmo...",
            "> Sistema detectando múltiplas tentativas...",
            "> Ativando medidas de segurança...",
            "> Última tentativa antes do bloqueio...",
        ],
        higher: "> [ERRO] A senha é maior",
        lower: "> [ERRO] A senha é menor",
        success: "💻 SISTEMA COMPROMETIDO\n> Senha encontrada!",
        fail: "🚨 SISTEMA BLOQUEADO\n> Muitas tentativas falhas"
    };

    // Estado do jogo
    const estadoJogo = {
        numeroSecreto: 0,
        tentativas: 0,
        maxTentativas: 10,
        currentGuess: [],
        vitorias: parseInt(localStorage.getItem('bruteForceWins')) || 0,
        derrotas: parseInt(localStorage.getItem('bruteForceLosses')) || 0,
        somAtivado: true,
        jogoAtivo: true
    };

    // Sons
    const sons = {
        keyPress: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'),
        correto: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'),
        errado: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),
        vitoria: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
        derrota: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3')
    };

    // Inicialização do jogo
    function iniciarJogo() {
        // Gera número aleatório entre 1 e 99
        estadoJogo.numeroSecreto = Math.floor(Math.random() * 99) + 1;
        estadoJogo.tentativas = 0;
        estadoJogo.currentGuess = [];
        estadoJogo.jogoAtivo = true;
        
        // Atualiza a interface
        atualizarTerminal(terminalMessages.start);
        atualizarGuessDisplay();
        criarTecladoNumerico();
        atualizarTentativas();
        
        // Atualiza contadores
        elementos.vitorias.textContent = estadoJogo.vitorias;
        elementos.derrotas.textContent = estadoJogo.derrotas;
        
        // Reseta elementos da UI
        elementos.botaoReiniciar.classList.add('hidden');
        elementos.guessDisplay.className = 'guess-display';
        elementos.tryBtn.disabled = false;
        elementos.tryBtn.classList.remove('hidden');
        elementos.clearBtn.classList.remove('hidden');
    }

    // Cria o teclado numérico
    function criarTecladoNumerico() {
        elementos.keyboard.innerHTML = '';
        
        // Adiciona botões de 0 a 9
        for (let i = 0; i <= 9; i++) {
            const botao = document.createElement('button');
            botao.className = 'key';
            botao.textContent = i;
            botao.dataset.numero = i;
            botao.addEventListener('click', () => adicionarNumero(i));
            elementos.keyboard.appendChild(botao);
        }
    }

    // Adiciona número ao palpite atual
    function adicionarNumero(numero) {
        if (!estadoJogo.jogoAtivo || estadoJogo.currentGuess.length >= 2) return;
        
        tocarSom(sons.keyPress);
        estadoJogo.currentGuess.push(numero);
        atualizarGuessDisplay();
        
        // Ativa o botão de tentar se tiver 2 dígitos
        if (estadoJogo.currentGuess.length === 2) {
            elementos.tryBtn.disabled = false;
        }
    }

    // Limpa o palpite atual
    function limparPalpite() {
        tocarSom(sons.keyPress);
        estadoJogo.currentGuess = [];
        atualizarGuessDisplay();
        elementos.tryBtn.disabled = true;
    }

    // Atualiza a exibição do palpite
    function atualizarGuessDisplay() {
        const spans = elementos.guessDisplay.querySelectorAll('span');
        
        for (let i = 0; i < 2; i++) {
            spans[i].textContent = estadoJogo.currentGuess[i] !== undefined ? 
                estadoJogo.currentGuess[i] : '_';
        }
    }

    // Variável para controlar o intervalo de digitação
    let typingInterval = null;

    // Atualiza o terminal
    function atualizarTerminal(mensagem) {
        // Cancela qualquer digitação em andamento
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }

        // Limpa o terminal e prepara para nova digitação
        elementos.terminal.textContent = '';
        elementos.terminal.classList.add('typing');

        // Divide a mensagem em linhas (se houver quebras de linha)
    const linhas = mensagem.split('\n');
    let linhaAtual = 0;
    let textoAcumulado = '';
    let posicaoCaractere = 0;

    function digitarProximoCaractere() {
        // Verifica se ainda há linhas para digitar
        if (linhaAtual < linhas.length) {
            const linha = linhas[linhaAtual];
            
            // Verifica se ainda há caracteres na linha atual
            if (posicaoCaractere < linha.length) {
                textoAcumulado += linha.charAt(posicaoCaractere);
                elementos.terminal.textContent = textoAcumulado;
                posicaoCaractere++;
                typingInterval = setTimeout(digitarProximoCaractere, 50);
            } else {
                // Move para a próxima linha
                linhaAtual++;
                if (linhaAtual < linhas.length) {
                    textoAcumulado += '\n';
                    posicaoCaractere = 0;
                    typingInterval = setTimeout(digitarProximoCaractere, 50);
                } else {
                    // Finaliza a digitação
                    elementos.terminal.classList.remove('typing');
                    typingInterval = null;
                }
            }
        } else {
            // Finaliza a digitação
            elementos.terminal.classList.remove('typing');
            typingInterval = null;
        }
    }

    // Inicia o processo de digitação
    digitarProximoCaractere();
    }

    // Atualiza as tentativas restantes
    function atualizarTentativas() {
        elementos.tentativasRestantes.textContent = estadoJogo.maxTentativas - estadoJogo.tentativas;
        
        // Atualiza corações
        elementos.coracoes.innerHTML = '';
        for (let i = 0; i < estadoJogo.maxTentativas; i++) {
            const coracao = document.createElement('i');
            coracao.className = 'fas fa-heart';
            coracao.style.color = i < (estadoJogo.maxTentativas - estadoJogo.tentativas) ? 'var(--danger)' : '#555';
            elementos.coracoes.appendChild(coracao);
        }
    }

    // Alterna som
    function alternarSom() {
        estadoJogo.somAtivado = !estadoJogo.somAtivado;
        elementos.botaoSom.innerHTML = estadoJogo.somAtivado ? 
            '<i class="fas fa-volume-up"></i> Som' : 
            '<i class="fas fa-volume-mute"></i> Som';
    }

    // Toca som
    function tocarSom(som) {
        if (estadoJogo.somAtivado && som) {
            som.currentTime = 0;
            som.play().catch(e => {
                console.log("Erro ao reproduzir som:", e);
                // Tenta carregar novamente se falhar
                som.load().then(() => som.play()).catch(e => console.log("Erro ao reproduzir som:", e));
            });
        }
    }

    // Processa tentativa do jogador
    function processarTentativa() {
        if (!estadoJogo.jogoAtivo || estadoJogo.currentGuess.length !== 2) return;
      
        const palpite = parseInt(estadoJogo.currentGuess.join(''));
        estadoJogo.tentativas++;

        // Efeito visual de desaparecimento
        const spans = elementos.guessDisplay.querySelectorAll('span');
        spans.forEach(span => span.classList.add('fade-out'));
      
        setTimeout(() => {
            // Mensagem do terminal
            const attemptMsg = terminalMessages.attempts[Math.min(estadoJogo.tentativas - 1, terminalMessages.attempts.length - 1)];
            atualizarTerminal(attemptMsg);
          
            if (palpite === estadoJogo.numeroSecreto) {
                // Acertou
                atualizarTerminal(terminalMessages.success);
                tocarSom(sons.vitoria);
            
                // Atualiza contador de vitórias
                estadoJogo.vitorias++;
                elementos.vitorias.textContent = estadoJogo.vitorias;
                localStorage.setItem('bruteForceWins', estadoJogo.vitorias);
            
                // Calcula pontos (quanto menos tentativas, mais pontos)
                const pontos = (estadoJogo.maxTentativas - estadoJogo.tentativas + 1) * 10;
            
                // Finaliza com vitória
                finalizarJogo(true, pontos);
            } else if (estadoJogo.tentativas >= estadoJogo.maxTentativas) {
                // Atualiza tentativas
                atualizarTentativas();

                // Código de derrota
                atualizarTerminal(terminalMessages.fail);
                tocarSom(sons.derrota);
                
                // Atualiza contador de derrotas
                estadoJogo.derrotas++;
                elementos.derrotas.textContent = estadoJogo.derrotas;
                localStorage.setItem('bruteForceLosses', estadoJogo.derrotas);
                
                // Finaliza com derrota
                finalizarJogo(false, 0);
            } else {
                // Código de tentativa normal
                let dica = palpite < estadoJogo.numeroSecreto ? terminalMessages.higher : terminalMessages.lower;
                atualizarTerminal(`${attemptMsg}\n${dica}`);
                
                // Toca som de erro para palpite errado
                tocarSom(sons.errado);
                
                // Atualiza tentativas restantes
                atualizarTentativas();
            }
            
            // Limpa automaticamente após mostrar a dica
            estadoJogo.currentGuess = [];
            atualizarGuessDisplay();
            elementos.tryBtn.disabled = true;
            
            // Remove o efeito visual
            spans.forEach(span => span.classList.remove('fade-out'));
        }, 500);
    }

    // Salva no ranking
    function salvarRanking(nome, pontos) {
        const ranking = JSON.parse(localStorage.getItem('bruteForceRanking')) || [];
        ranking.push({ 
            nome: nome || 'Anônimo', 
            pontos, 
            data: new Date().toLocaleDateString('pt-BR') 
        });
        
        // Ordena por pontos (maior primeiro)
        ranking.sort((a, b) => b.pontos - a.pontos);
        
        // Mantém apenas top 10
        localStorage.setItem('bruteForceRanking', JSON.stringify(ranking.slice(0, 10)));
    }

    // Mostra ranking
    function mostrarRanking() {
        const ranking = JSON.parse(localStorage.getItem('bruteForceRanking')) || [];
        elementos.rankingList.innerHTML = ranking.map((jogador, index) => `
            <li>
                <span class="rank">${index + 1}º</span>
                <span class="name">${jogador.nome}</span>
                <span class="score">${jogador.pontos} pts</span>
                <span class="date">${jogador.data}</span>
            </li>
        `).join('');
        
        elementos.ranking.classList.remove('hidden');
        elementos.overlay.classList.remove('hidden');
    }

    // Finaliza o jogo
    function finalizarJogo(vitoria, pontos) {
        estadoJogo.jogoAtivo = false;
        elementos.botaoReiniciar.classList.remove('hidden');
        elementos.tryBtn.classList.add('hidden');
        elementos.clearBtn.classList.add('hidden');
        elementos.tryBtn.disabled = true;
        
        if (vitoria) {
            elementos.guessDisplay.classList.add('bounce');
            
            setTimeout(() => {
                const nome = prompt(`Parabéns! Você fez ${pontos} pontos. Digite seu nome para o ranking:`);
                if (nome !== null) {
                    salvarRanking(nome, pontos);
                }
            }, 500);
        } else {
            elementos.guessDisplay.classList.add('shake');
        }
    }

    // Event Listeners
    elementos.tryBtn.addEventListener('click', processarTentativa);
    elementos.clearBtn.addEventListener('click', limparPalpite);
    elementos.botaoSom.addEventListener('click', alternarSom);
    elementos.botaoReiniciar.addEventListener('click', () => {
        elementos.guessDisplay.classList.remove('bounce', 'shake', 'success');
        iniciarJogo();
    });
    elementos.showRanking.addEventListener('click', mostrarRanking);
    elementos.closeRanking.addEventListener('click', () => {
        elementos.ranking.classList.add('hidden');
        elementos.overlay.classList.add('hidden');
    });
    elementos.overlay.addEventListener('click', () => {
        elementos.ranking.classList.add('hidden');
        elementos.overlay.classList.add('hidden');
    });

    // Inicia o jogo
    iniciarJogo();
});
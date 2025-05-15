document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM");

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
        higher: "> Senha incorreta: O número é maior",
        lower: "> Senha incorreta: O número é menor",
        success: "💻 SISTEMA COMPROMETIDO\n> Senha encontrada!",
        fail: "🚨 SISTEMA BLOQUEADO\n> Muitas tentativas falhas"
    };

    // Estado do jogo
    const estadoJogo = {
        numeroSecreto: 0,
        tentativas: 0,
        maxTentativas: 10,
        currentGuess: [],
        vitorias: 0,
        derrotas: 0,
        somAtivado: true,
        jogoAtivo: true
    };

    // Sons
    const sons = {
      keyPress: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3'),
      correto: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'),
      errado: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),
      vitoria: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
      derrota: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3')
    };

    // Inicialização do jogo
    function iniciarJogo() {

        console.log("iniciarJogo()");

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
        
        // Reseta elementos da UI
        elementos.botaoReiniciar.classList.add('hidden');
        elementos.guessDisplay.className = 'guess-display';
        elementos.tryBtn.disabled = false;
    }

    // Cria o teclado numérico
    function criarTecladoNumerico() {

        console.log("criarTecladoNumerico()");

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

        console.log("adicionarNumero()" + numero);

        if (!estadoJogo.jogoAtivo || estadoJogo.currentGuess.length >= 2) return;
        
        tocarSom(sons.keyPress);
        estadoJogo.currentGuess.push(numero);
        atualizarGuessDisplay();
        
        // Ativa o botão de tentar se tiver 2 dígitos
        if (estadoJogo.currentGuess.length === 2) {
            elementos.tryBtn.disabled = false;
            console.log("Ativa o botão de tentar");
        }
    }

    // Limpa o palpite atual
    function limparPalpite() {
        console.log("limparPalpite()");

        tocarSom(sons.keyPress);
        estadoJogo.currentGuess = [];
        atualizarGuessDisplay();
        elementos.tryBtn.disabled = true;
    }

    // Atualiza a exibição do palpite
    function atualizarGuessDisplay() {

        console.log("atualizarGuessDisplay()");

        const spans = elementos.guessDisplay.querySelectorAll('span');
        
        for (let i = 0; i < 2; i++) {
            spans[i].textContent = estadoJogo.currentGuess[i] !== undefined ? 
                estadoJogo.currentGuess[i] : '_';
        }
    }

    // Atualiza o terminal
    function atualizarTerminal(mensagem) {
        console.log("atualizarTerminal()" + mensagem);

        elementos.terminal.textContent = mensagem;
        elementos.terminal.classList.add('typing');
        setTimeout(() => elementos.terminal.classList.remove('typing'), 500);
    }

    // Atualiza as tentativas restantes
    function atualizarTentativas() {

        console.log("atualizarTentativas()");

        elementos.tentativasRestantes.textContent = estadoJogo.maxTentativas - estadoJogo.tentativas;

        console.log("Tentativas restantes: " + elementos.tentativasRestantes.textContent);
        
        // Atualiza corações
        elementos.coracoes.innerHTML = '';
        for (let i = 0; i < estadoJogo.maxTentativas; i++) {
            const coracao = document.createElement('i');
            coracao.className = 'fas fa-heart';
            coracao.style.color = i < (estadoJogo.maxTentativas - estadoJogo.tentativas) ? 'var(--danger)' : '#555';
            coracao.style.fontSize = '1.2rem';
            elementos.coracoes.appendChild(coracao);
        }
    }

    // Alterna som
    function alternarSom() {

        console.log("alternarSom()");

        estadoJogo.somAtivado = !estadoJogo.somAtivado;
        elementos.botaoSom.innerHTML = estadoJogo.somAtivado ? 
            '<i class="fas fa-volume-up"></i> Som' : 
            '<i class="fas fa-volume-mute"></i> Som';
    }

    // Toca som
    function tocarSom(som) {

        console.log("tocarSom()" + som);

        if (estadoJogo.somAtivado) {
            som.currentTime = 0; // Reinicia o som se já estiver tocando
            som.play().catch(e => {
                // Tenta carregar novamente se falhar
                som.load().then(() => som.play()).catch(e => console.log("Erro ao reproduzir som:", e));
            });
        }
    }

    // Processa tentativa do jogador
    function processarTentativa() {

        console.log("processarTentativa()");

        if (!estadoJogo.jogoAtivo || estadoJogo.currentGuess.length !== 2) return;
      
        const palpite = parseInt(estadoJogo.currentGuess.join(''));
        estadoJogo.tentativas++;

        console.log("Palpite: " + palpite);
        console.log("estadoJogo.tentativas: " + estadoJogo.tentativas);
      
        // Efeito visual de desaparecimento
        const spans = elementos.guessDisplay.querySelectorAll('span');
        spans.forEach(span => span.classList.add('fade-out'));
      
        setTimeout(() => {
            // Mensagem do terminal
            const attemptMsg = terminalMessages.attempts[Math.min(estadoJogo.tentativas - 1, terminalMessages.attempts.length - 1)];
            atualizarTerminal(attemptMsg);
            console.log("attemptMsg: " + attemptMsg);

            console.log("estadoJogo.numeroSecreto: " + estadoJogo.numeroSecreto);
          
            if (palpite === estadoJogo.numeroSecreto) {
                // Acertou
                atualizarTerminal(terminalMessages.success);
                tocarSom(sons.vitoria);

                console.log("terminalMessages.success: " + terminalMessages.success);
                console.log("sons.vitoria: " + sons.vitoria);
            
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
                
                // Finaliza com derrota
                finalizarJogo(false, 0);
            } else {
                // Código de tentativa normal
                let dica = palpite < estadoJogo.numeroSecreto ? terminalMessages.higher : terminalMessages.lower;
                atualizarTerminal(`${attemptMsg}\n${dica}`);
                
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
        elementos.tryBtn.classList.remove('hidden');
        elementos.clearBtn.classList.remove('hidden');
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
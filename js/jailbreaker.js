document.addEventListener('DOMContentLoaded', () => {
    
    // Banco de palavras de programação
    const palavrasProgramacao = [
        { palavra: "javascript", dica: "Linguagem da web" },
        { palavra: "typescript", dica: "JavaScript com tipos" },
        { palavra: "react", dica: "Biblioteca front-end" },
        { palavra: "angular", dica: "Framework do Google" },
        { palavra: "vue", dica: "Framework progressivo" },
        { palavra: "nodejs", dica: "JavaScript no servidor" },
        { palavra: "express", dica: "Framework para Node.js" },
        { palavra: "mongodb", dica: "Banco NoSQL" },
        { palavra: "postgresql", dica: "Banco relacional" },
        { palavra: "graphql", dica: "Query language" },
        { palavra: "docker", dica: "Plataforma de containers" },
        { palavra: "kubernetes", dica: "Orquestrador" },
        { palavra: "git", dica: "Versionamento" },
        { palavra: "github", dica: "Hospedagem de código" },
        { palavra: "html", dica: "Linguagem de marcação" },
        { palavra: "css", dica: "Estilização" },
        { palavra: "sass", dica: "Pré-processador CSS" },
        { palavra: "bootstrap", dica: "Framework CSS" },
        { palavra: "webpack", dica: "Empacotador" },
        { palavra: "redux", dica: "Gerenciamento de estado" },
        { palavra: "jest", dica: "Testes JavaScript" },
        { palavra: "python", dica: "Linguagem multiparadigma" },
        { palavra: "django", dica: "Framework Python" },
        { palavra: "flask", dica: "Microframework Python" },
        { palavra: "java", dica: "Linguagem OOP" },
        { palavra: "spring", dica: "Framework Java" },
        { palavra: "csharp", dica: "Linguagem Microsoft" },
        { palavra: "dotnet", dica: "Plataforma Microsoft" },
        { palavra: "php", dica: "Linguagem para web" },
        { palavra: "laravel", dica: "Framework PHP" },
        { palavra: "ruby", dica: "Linguagem dinâmica" },
        { palavra: "rails", dica: "Framework Ruby" },
        { palavra: "swift", dica: "Linguagem Apple" },
        { palavra: "kotlin", dica: "Linguagem Android" },
        { palavra: "go", dica: "Linguagem Google" },
        { palavra: "rust", dica: "Linguagem de sistemas" },
        { palavra: "algoritmo", dica: "Sequência lógica" },
        { palavra: "funcao", dica: "Bloco reutilizável" },
        { palavra: "variavel", dica: "Armazena valores" },
        { palavra: "loop", dica: "Estrutura de repetição" },
        { palavra: "array", dica: "Estrutura de dados" },
        { palavra: "objeto", dica: "Coleção de propriedades" },
        { palavra: "classe", dica: "Modelo para objetos" },
        { palavra: "api", dica: "Interface de programação" },
        { palavra: "json", dica: "Formato de dados" },
        { palavra: "debug", dica: "Encontrar erros" },
        { palavra: "deploy", dica: "Publicar aplicação" },
        { palavra: "serverless", dica: "Sem servidor" },
        { palavra: "microservicos", dica: "Arquitetura" },
        { palavra: "rest", dica: "Estilo arquitetural" },
        { palavra: "soap", dica: "Protocolo" },
        { palavra: "jwt", dica: "Padrão para tokens" },
        { palavra: "devops", dica: "Cultura colaborativa" }
    ];

    // Elementos DOM
    const elementos = {
        forca: document.getElementById('forca-display'),
        palavra: document.getElementById('word-display'),
        teclado: document.querySelector('.keyboard'),
        mensagem: document.querySelector('.message-text'),
        botaoDica: document.getElementById('hint-btn'),
        botaoSom: document.getElementById('sound-btn'),
        botaoReiniciar: document.getElementById('restart-btn'),
        vitorias: document.getElementById('wins'),
        derrotas: document.getElementById('losses'),
        tentativasRestantes: document.getElementById('remaining-attempts'),
        coracoes: document.getElementById('hearts'),
        dicaAtual: document.getElementById('current-hint'),
        caixaMensagem: document.getElementById('message'),
        ranking: document.getElementById('ranking'),
        overlay: document.getElementById('overlay'),
        rankingList: document.getElementById('ranking-list'),
        showRanking: document.getElementById('show-ranking'),
        closeRanking: document.getElementById('close-ranking')
    };

    // Arte ASCII da forca corrigida
    const terminalStates = [
        "$ Iniciando sistema de segurança...",
        "$ Acesso negado [1/6 tentativas restantes]",
        "ALERTA: Tentativa de intrusão detectada",
        "WARNING: Ativando contramedidas [3/6]",
        "CRITICAL: Barreira de firewall comprometida",
        "ERRO FATAL: Isolando núcleo do sistema...",
        "💻 SISTEMA COMPROMETIDO\n> Reinicialização necessária",
        "✅ ACESSO PERMITIDO\n> Sistema desbloqueado com sucesso!"
    ];

    // Estado do jogo
    const estadoJogo = {
        palavraSecreta: '',
        dica: '',
        letrasAcertadas: [],
        letrasErradas: [],
        maxTentativas: 6,
        tentativasRestantes: 6,
        vitorias: 0,
        derrotas: 0,
        dicaUsada: false,
        somAtivado: true
    };

    // Sons
    const sons = {
        correto: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'),
        errado: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),
        vitoria: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
        derrota: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3')
    };

    // Função para desativar o teclado
    function desativarTeclado() {
        document.querySelectorAll('.key').forEach(botao => {
            botao.disabled = true;
            botao.classList.add('disabled');
        });
    }

    // Inicialização do jogo
    function iniciarJogo() {
        // Seleciona palavra aleatória
        const palavraAleatoria = palavrasProgramacao[Math.floor(Math.random() * palavrasProgramacao.length)];
        estadoJogo.palavraSecreta = palavraAleatoria.palavra.toLowerCase();
        estadoJogo.dica = palavraAleatoria.dica;
        estadoJogo.letrasAcertadas = [];
        estadoJogo.letrasErradas = [];
        estadoJogo.tentativasRestantes = estadoJogo.maxTentativas;
        estadoJogo.dicaUsada = false;
        
        // Reativa o teclado
        document.querySelectorAll('.key').forEach(botao => {
            botao.disabled = false;
            botao.classList.remove('disabled');
        });
        
        // Atualiza a interface
        atualizarForca();
        atualizarPalavra();
        criarTeclado();
        atualizarTentativas();
        
        // Reseta elementos da UI
        elementos.botaoReiniciar.classList.add('hidden');
        elementos.botaoDica.classList.remove('hidden');
        elementos.dicaAtual.textContent = '';
        
        // Mensagem inicial
        definirMensagem('Clique em uma letra para começar!', 'info');
    }

    // Cria o teclado virtual
    function criarTeclado() {
        elementos.teclado.innerHTML = '';
        const letras = 'abcdefghijklmnopqrstuvwxyz'.split('');
        
        letras.forEach(letra => {
            const botao = document.createElement('button');
            botao.className = 'key';
            botao.textContent = letra;
            botao.dataset.letra = letra;
            botao.addEventListener('click', () => processarTentativa(letra));
            elementos.teclado.appendChild(botao);
        });
    }

    // Atualiza a arte da forca
    function atualizarForca() {
        typeWriter(elementos.forca, terminalStates[estadoJogo.letrasErradas.length]);
        elementos.forca.classList.add('typing');
        setTimeout(() => elementos.forca.classList.remove('typing'), 500);
    }

    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    }

    // Atualiza a exibição da palavra
    function atualizarPalavra() {
        const exibicao = estadoJogo.palavraSecreta.split('').map(letra => {
            return estadoJogo.letrasAcertadas.includes(letra) ? 
                `<span class="letter pulsar">${letra}</span>` : 
                '<span class="letter">_</span>';
        }).join(' ');
        
        elementos.palavra.innerHTML = exibicao;
    }

    // Atualiza o teclado virtual
    function atualizarTeclado() {
        document.querySelectorAll('.key').forEach(botao => {
            const letra = botao.dataset.letra;
            
            if (estadoJogo.letrasAcertadas.includes(letra)) {
                botao.classList.add('correct');
                botao.classList.add('used');
            } else if (estadoJogo.letrasErradas.includes(letra)) {
                botao.classList.add('wrong');
                botao.classList.add('used');
            }
        });
    }

    // Atualiza as tentativas restantes
    function atualizarTentativas() {
        estadoJogo.tentativasRestantes = estadoJogo.maxTentativas - estadoJogo.letrasErradas.length;
        elementos.tentativasRestantes.textContent = estadoJogo.tentativasRestantes;
        
        // Atualiza corações
        elementos.coracoes.innerHTML = '';
        for (let i = 0; i < estadoJogo.maxTentativas; i++) {
            const coracao = document.createElement('i');
            coracao.className = 'fas fa-heart';
            coracao.style.color = i < estadoJogo.tentativasRestantes ? 'var(--danger)' : '#555';
            elementos.coracoes.appendChild(coracao);
        }
    }

    // Configura mensagem na tela
    function definirMensagem(texto, tipo = 'info') {
        elementos.mensagem.textContent = texto;
        elementos.caixaMensagem.className = 'message-box ' + tipo;
    }

    // Mostra dica
    function mostrarDica() {
        if (!estadoJogo.dicaUsada) {
            elementos.dicaAtual.textContent = `Dica: ${estadoJogo.dica}`;
            definirMensagem(`Dica: ${estadoJogo.dica}`, 'info');
            estadoJogo.dicaUsada = true;
            elementos.botaoDica.classList.add('hidden');
            
            // Efeito visual
            elementos.dicaAtual.classList.add('pulsar');
            setTimeout(() => elementos.dicaAtual.classList.remove('pulsar'), 1000);
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
        if (estadoJogo.somAtivado) {
            som.currentTime = 0;
            som.play().catch(e => console.log("Erro ao reproduzir som:", e));
        }
    }

    // Processa tentativa do jogador
    function processarTentativa(letra) {
        // Verifica se a letra já foi usada
        if (estadoJogo.letrasAcertadas.includes(letra) || estadoJogo.letrasErradas.includes(letra)) {
            definirMensagem(`Você já tentou a letra ${letra.toUpperCase()}!`, 'error');
            return;
        }
        
        // Verifica se a letra está na palavra
        if (estadoJogo.palavraSecreta.includes(letra)) {
            estadoJogo.letrasAcertadas.push(letra);
            definirMensagem(`Letra ${letra.toUpperCase()} correta!`, 'success');
            tocarSom(sons.correto);
            atualizarPalavra();
            atualizarTeclado();
            
            // Verifica vitória
            if (verificarVitoria()) {
                estadoJogo.vitorias++;
                elementos.vitorias.textContent = estadoJogo.vitorias;
                definirMensagem(`🎉 Parabéns! Você acertou: ${estadoJogo.palavraSecreta.toUpperCase()}`, 'success');
                tocarSom(sons.vitoria);
                finalizarJogo();
                return;
            }
        } else {
            estadoJogo.letrasErradas.push(letra);
            definirMensagem(`Letra ${letra.toUpperCase()} incorreta!`, 'error');
            tocarSom(sons.errado);
            atualizarForca();
            atualizarTeclado();
            atualizarTentativas();
            
            // Verifica derrota
            if (estadoJogo.letrasErradas.length >= estadoJogo.maxTentativas) {
                estadoJogo.derrotas++;
                elementos.derrotas.textContent = estadoJogo.derrotas;
                definirMensagem(`💀 Game Over! A palavra era: ${estadoJogo.palavraSecreta.toUpperCase()}`, 'error');
                tocarSom(sons.derrota);
                finalizarJogo();
                return;
            }
        }
    }

    // Verifica vitória
    function verificarVitoria() {
        const vitoria = estadoJogo.palavraSecreta.split('').every(letra => 
            estadoJogo.letrasAcertadas.includes(letra)
        );
        
        if (vitoria) {
            elementos.forca.textContent = terminalStates[terminalStates.length - 1];
            elementos.forca.classList.add('success');
        }
        
        return vitoria;
    }   

    // Salva no ranking
    function salvarRanking(nome, pontos) {
        const ranking = JSON.parse(localStorage.getItem('forcaDevRanking')) || [];
        ranking.push({ 
            nome: nome || 'Anônimo', 
            pontos, 
            data: new Date().toLocaleDateString('pt-BR') 
        });
        
        // Ordena por pontos (maior primeiro)
        ranking.sort((a, b) => b.pontos - a.pontos);
        
        // Mantém apenas top 10
        localStorage.setItem('forcaDevRanking', JSON.stringify(ranking.slice(0, 10)));
    }

    // Mostra ranking
    function mostrarRanking() {
        const ranking = JSON.parse(localStorage.getItem('forcaDevRanking')) || [];
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
    function finalizarJogo() {
        elementos.botaoReiniciar.classList.remove('hidden');
        elementos.botaoDica.classList.add('hidden');
        desativarTeclado();
        
        if (verificarVitoria()) {
            elementos.palavra.classList.add('bounce');
            setTimeout(() => {
                elementos.forca.classList.remove('success');
            }, 1500);
            
            setTimeout(() => {
                const nome = prompt('Parabéns! Digite seu nome para o ranking:');
                const pontos = estadoJogo.palavraSecreta.length * estadoJogo.tentativasRestantes;
                salvarRanking(nome, pontos);
            }, 500);
        } else {
            elementos.palavra.classList.add('shake');
        }
    }

    // Event Listeners
    elementos.botaoDica.addEventListener('click', mostrarDica);
    elementos.botaoSom.addEventListener('click', alternarSom);
    elementos.botaoReiniciar.addEventListener('click', () => {
        elementos.palavra.classList.remove('bounce', 'shake');
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
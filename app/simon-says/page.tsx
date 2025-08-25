<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aventura das Gemas Mágicas com Leo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow: hidden;
            position: relative;
        }

        /* Animação de fundo com estrelas */
        .stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }

        /* Container principal */
        .game-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 10;
        }

        /* Header do jogo */
        .game-header {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 15px 30px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(10px);
        }

        .game-title {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(45deg, #f093fb, #f5576c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .stats {
            display: flex;
            gap: 20px;
        }

        .stat-box {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 10px 20px;
            border-radius: 15px;
            text-align: center;
            min-width: 100px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .stat-label {
            font-size: 12px;
            opacity: 0.9;
        }

        .stat-value {
            font-size: 24px;
            font-weight: bold;
        }

        /* Área do Leo */
        .leo-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .leo-mascot {
            width: 120px;
            height: 120px;
            background: url('https://github.com/ClaudemirWork/teaplus-working/blob/main/public/images/mascotes/leo.webp?raw=true') no-repeat center;
            background-size: contain;
            position: relative;
        }

        .speech-bubble {
            position: absolute;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 15px 20px;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            min-width: 200px;
            max-width: 300px;
            animation: fadeInScale 0.5s ease;
        }

        .speech-bubble::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid white;
        }

        .speech-text {
            color: #333;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
        }

        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: translateX(-50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) scale(1);
            }
        }

        /* Área do jogo */
        .game-area {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            padding: 40px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            min-height: 500px;
            position: relative;
        }

        /* Container das gemas */
        .gems-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            margin: 40px 0;
            perspective: 1000px;
        }

        /* Gema 3D */
        .gem {
            width: 120px;
            height: 120px;
            position: relative;
            transform-style: preserve-3d;
            transition: all 0.3s ease;
            cursor: pointer;
            animation: float 3s ease-in-out infinite;
        }

        .gem:nth-child(odd) {
            animation-delay: 0.5s;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotateY(0deg); }
            50% { transform: translateY(-20px) rotateY(180deg); }
        }

        .gem-inner {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transform: rotateX(-30deg) rotateY(45deg);
            transition: transform 0.3s;
        }

        .gem:hover .gem-inner {
            transform: rotateX(-30deg) rotateY(225deg) scale(1.1);
        }

        .gem.active .gem-inner {
            transform: rotateX(-30deg) rotateY(360deg) scale(1.3);
            animation: pulse 0.5s ease;
        }

        @keyframes pulse {
            0% { transform: rotateX(-30deg) rotateY(45deg) scale(1); }
            50% { transform: rotateX(-30deg) rotateY(225deg) scale(1.5); }
            100% { transform: rotateX(-30deg) rotateY(360deg) scale(1.3); }
        }

        /* Faces da gema */
        .gem-face {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0.9;
            border: 2px solid rgba(255,255,255,0.3);
        }

        .gem-face.front { transform: translateZ(60px); }
        .gem-face.back { transform: rotateY(180deg) translateZ(60px); }
        .gem-face.right { transform: rotateY(90deg) translateZ(60px); }
        .gem-face.left { transform: rotateY(-90deg) translateZ(60px); }
        .gem-face.top { transform: rotateX(90deg) translateZ(60px); }
        .gem-face.bottom { transform: rotateX(-90deg) translateZ(60px); }

        /* Cores das gemas */
        .gem.red .gem-face {
            background: linear-gradient(45deg, #ff0844, #ff4563);
            box-shadow: inset 0 0 30px rgba(255,255,255,0.5);
        }

        .gem.blue .gem-face {
            background: linear-gradient(45deg, #0099ff, #00d4ff);
            box-shadow: inset 0 0 30px rgba(255,255,255,0.5);
        }

        .gem.green .gem-face {
            background: linear-gradient(45deg, #00ff88, #00ff00);
            box-shadow: inset 0 0 30px rgba(255,255,255,0.5);
        }

        .gem.yellow .gem-face {
            background: linear-gradient(45deg, #ffeb3b, #ffc107);
            box-shadow: inset 0 0 30px rgba(255,255,255,0.5);
        }

        .gem.purple .gem-face {
            background: linear-gradient(45deg, #9c27b0, #e91e63);
            box-shadow: inset 0 0 30px rgba(255,255,255,0.5);
        }

        .gem.orange .gem-face {
            background: linear-gradient(45deg, #ff6b35, #ff9558);
            box-shadow: inset 0 0 30px rgba(255,255,255,0.5);
        }

        .gem.cyan .gem-face {
            background: linear-gradient(45deg, #00bcd4, #00acc1);
            box-shadow: inset 0 0 30px rgba(255,255,255,0.5);
        }

        .gem.pink .gem-face {
            background: linear-gradient(45deg, #ff69b4, #ff1493);
            box-shadow: inset 0 0 30px rgba(255,255,255,0.5);
        }

        /* Gema dourada especial */
        .gem.golden .gem-face {
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            box-shadow: inset 0 0 50px rgba(255,255,255,0.8);
            animation: goldenGlow 2s infinite;
        }

        @keyframes goldenGlow {
            0%, 100% { box-shadow: inset 0 0 50px rgba(255,255,255,0.8), 0 0 30px #ffd700; }
            50% { box-shadow: inset 0 0 80px rgba(255,255,255,1), 0 0 50px #ffd700; }
        }

        /* Controles */
        .controls {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }

        .btn {
            padding: 15px 40px;
            font-size: 18px;
            font-weight: bold;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .btn-start {
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            color: white;
        }

        .btn-start:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .btn-start:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        /* Indicador de fase */
        .phase-indicator {
            text-align: center;
            margin: 20px 0;
        }

        .phase-text {
            font-size: 24px;
            color: white;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .progress-bar {
            width: 100%;
            height: 30px;
            background: rgba(255,255,255,0.2);
            border-radius: 15px;
            overflow: hidden;
            margin-top: 10px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00ff88, #00d4ff);
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        /* Efeitos de partículas */
        .particle {
            position: fixed;
            pointer-events: none;
            opacity: 0;
            animation: particleAnimation 1s ease-out;
        }

        @keyframes particleAnimation {
            0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(var(--tx), var(--ty)) scale(0);
            }
        }

        /* Modal de vitória */
        .victory-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .victory-content {
            background: white;
            padding: 40px;
            border-radius: 30px;
            text-align: center;
            animation: victoryBounce 0.5s ease;
        }

        @keyframes victoryBounce {
            0% { transform: scale(0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        .victory-title {
            font-size: 36px;
            color: #764ba2;
            margin-bottom: 20px;
        }

        .victory-stars {
            font-size: 48px;
            margin: 20px 0;
        }

        /* Responsividade */
        @media (max-width: 768px) {
            .gem {
                width: 80px;
                height: 80px;
            }
            
            .gems-container {
                gap: 20px;
            }
            
            .game-title {
                font-size: 20px;
            }
            
            .stats {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <!-- Estrelas de fundo -->
    <div class="stars" id="stars"></div>

    <div class="game-container">
        <!-- Header -->
        <div class="game-header">
            <h1 class="game-title">🌟 Aventura das Gemas Mágicas 🌟</h1>
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-label">Fase</div>
                    <div class="stat-value" id="phase">1</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Pontos</div>
                    <div class="stat-value" id="score">0</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Sequência</div>
                    <div class="stat-value" id="sequence">0</div>
                </div>
            </div>
        </div>

        <!-- Área do jogo -->
        <div class="game-area">
            <div class="phase-indicator">
                <div class="phase-text" id="phaseText">Fase 1: 2 Gemas Mágicas</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progress" style="width: 0%">0/6</div>
                </div>
            </div>

            <div class="gems-container" id="gemsContainer">
                <!-- Gemas serão adicionadas dinamicamente -->
            </div>

            <div class="controls">
                <button class="btn btn-start" id="startBtn" onclick="startGame()">Começar Aventura</button>
            </div>
        </div>
    </div>

    <!-- Leo Mascote -->
    <div class="leo-container">
        <div class="leo-mascot"></div>
        <div class="speech-bubble" id="speechBubble">
            <div class="speech-text" id="speechText">Olá! Eu sou o Leo! Vamos brincar com as gemas mágicas?</div>
        </div>
    </div>

    <!-- Modal de Vitória -->
    <div class="victory-modal" id="victoryModal">
        <div class="victory-content">
            <h2 class="victory-title">🎉 Parabéns! 🎉</h2>
            <div class="victory-stars">⭐⭐⭐⭐⭐</div>
            <p>Você completou a fase!</p>
            <button class="btn btn-start" onclick="nextPhase()">Próxima Fase</button>
        </div>
    </div>

    <script>
        // Configuração do jogo
        const gameConfig = {
            phases: [
                { gems: 2, sequences: 6, name: "Iniciante" },
                { gems: 4, sequences: 6, name: "Aprendiz" },
                { gems: 6, sequences: 6, name: "Mestre" },
                { gems: 8, sequences: 6, name: "Lendário" }
            ],
            gemColors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'pink'],
            sounds: {
                red: 261.63,    // C4
                blue: 293.66,   // D4
                green: 329.63,  // E4
                yellow: 349.23, // F4
                purple: 392.00, // G4
                orange: 440.00, // A4
                cyan: 493.88,   // B4
                pink: 523.25,   // C5
                golden: 659.25  // E5
            }
        };

        // Estado do jogo
        let gameState = {
            currentPhase: 0,
            score: 0,
            sequence: [],
            playerSequence: [],
            isPlaying: false,
            isShowingSequence: false,
            currentSequenceIndex: 0,
            sequencesCompleted: 0,
            audioContext: null
        };

        // Frases do Leo
        const leoMessages = {
            start: "Vamos começar nossa aventura!",
            watching: "Observe com atenção!",
            yourTurn: "Agora é sua vez!",
            correct: ["Muito bem!", "Você está indo bem!", "Excelente!", "Continue assim!", "Fantástico!"],
            almostDone: "Estamos quase no final da fase!",
            phaseComplete: "Iupiiii! Vamos para a próxima gema dourada!",
            error: "Ops! Vamos tentar de novo!",
            gameOver: "Você foi incrível! Vamos jogar mais?"
        };

        // Inicialização
        window.onload = function() {
            createStars();
            initAudio();
        };

        // Criar estrelas de fundo
        function createStars() {
            const starsContainer = document.getElementById('stars');
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(star);
            }
        }

        // Inicializar áudio
        function initAudio() {
            gameState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Sistema de fala do Leo
        function leoSpeak(message) {
            const speechBubble = document.getElementById('speechBubble');
            const speechText = document.getElementById('speechText');
            
            speechText.textContent = message;
            speechBubble.style.animation = 'none';
            setTimeout(() => {
                speechBubble.style.animation = 'fadeInScale 0.5s ease';
            }, 10);

            // Síntese de voz
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.lang = 'pt-BR';
                utterance.rate = 0.9;
                utterance.pitch = 1.2;
                window.speechSynthesis.speak(utterance);
            }
        }

        // Tocar nota musical
        function playNote(frequency, duration = 500) {
            if (!gameState.audioContext) return;

            const oscillator = gameState.audioContext.createOscillator();
            const gainNode = gameState.audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0, gameState.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, gameState.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, gameState.audioContext.currentTime + duration/1000);

            oscillator.connect(gainNode);
            gainNode.connect(gameState.audioContext.destination);

            oscillator.start(gameState.audioContext.currentTime);
            oscillator.stop(gameState.audioContext.currentTime + duration/1000);
        }

        // Criar gemas
        function createGems() {
            const container = document.getElementById('gemsContainer');
            container.innerHTML = '';
            
            const phase = gameConfig.phases[gameState.currentPhase];
            const gemsToCreate = phase.gems;
            
            for (let i = 0; i < gemsToCreate; i++) {
                const gem = document.createElement('div');
                gem.className = `gem ${gameConfig.gemColors[i]}`;
                gem.dataset.color = gameConfig.gemColors[i];
                gem.dataset.index = i;
                gem.onclick = () => handleGemClick(i);
                
                const gemInner = document.createElement('div');
                gemInner.className = 'gem-inner';
                
                const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
                faces.forEach(face => {
                    const faceDiv = document.createElement('div');
                    faceDiv.className = `gem-face ${face}`;
                    gemInner.appendChild(faceDiv);
                });
                
                gem.appendChild(gemInner);
                container.appendChild(gem);
            }
        }

        // Iniciar jogo
        function startGame() {
            gameState.currentPhase = 0;
            gameState.score = 0;
            gameState.sequencesCompleted = 0;
            updateDisplay();
            createGems();
            document.getElementById('startBtn').disabled = true;
            leoSpeak(leoMessages.start);
            setTimeout(() => nextRound(), 2000);
        }

        // Próxima rodada
        function nextRound() {
            const phase = gameConfig.phases[gameState.currentPhase];
            gameState.playerSequence = [];
            
            // Adicionar nova gema à sequência
            const maxGem = phase.gems;
            gameState.sequence.push(Math.floor(Math.random() * maxGem));
            
            showSequence();
        }

        // Mostrar sequência
        async function showSequence() {
            gameState.isShowingSequence = true;
            leoSpeak(leoMessages.watching);
            
            await sleep(1500);
            
            for (let i = 0; i < gameState.sequence.length; i++) {
                const gemIndex = gameState.sequence[i];
                activateGem(gemIndex);
                await sleep(600);
            }
            
            gameState.isShowingSequence = false;
            leoSpeak(leoMessages.yourTurn);
        }

        // Ativar gema
        function activateGem(index) {
            const gems = document.querySelectorAll('.gem');
            const gem = gems[index];
            const color = gem.dataset.color;
            
            gem.classList.add('active');
            playNote(gameConfig.sounds[color]);
            createParticles(gem);
            
            setTimeout(() => {
                gem.classList.remove('active');
            }, 400);
        }

        // Criar partículas
        function createParticles(gem) {
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = gem.offsetLeft + gem.offsetWidth/2 + 'px';
                particle.style.top = gem.offsetTop + gem.offsetHeight/2 + 'px';
                particle.style.width = '10px';
                particle.style.height = '10px';
                particle.style.background = getComputedStyle(gem.querySelector('.gem-face')).background;
                particle.style.borderRadius = '50%';
                particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
                particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
                
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }
        }

        // Lidar com clique na gema
        function handleGemClick(index) {
            if (gameState.isShowingSequence) return;
            
            activateGem(index);
            gameState.playerSequence.push(index);
            
            // Verificar sequência
            const currentIndex = gameState.playerSequence.length - 1;
            
            if (gameState.playerSequence[currentIndex] !== gameState.sequence[currentIndex]) {
                // Erro
                handleError();
            } else if (gameState.playerSequence.length === gameState.sequence.length) {
                // Sequência completa
                handleSuccess();
            }
        }

        // Lidar com sucesso
        function handleSuccess() {
            gameState.score += gameState.sequence.length * 10;
            gameState.sequencesCompleted++;
            
            const phase = gameConfig.phases[gameState.currentPhase];
            const randomMessage = leoMessages.correct[Math.floor(Math.random() * leoMessages.correct.length)];
            
            if (gameState.sequencesCompleted >= phase.sequences) {
                // Fase completa
                handlePhaseComplete();
            } else {
                if (gameState.sequencesCompleted === phase.sequences - 1) {
                    leoSpeak(leoMessages.almostDone);
                } else {
                    leoSpeak(randomMessage);
                }
                updateDisplay();
                setTimeout(() => nextRound(), 1500);
            }
        }

        // Lidar com erro
        function handleError() {
            leoSpeak(leoMessages.error);
            gameState.sequence = [];
            gameState.sequencesCompleted = 0;
            document.getElementById('startBtn').disabled = false;
            updateDisplay();
        }

        // Lidar com fase completa
        function handlePhaseComplete() {
            // Adicionar gema dourada
            showGoldenGem();
            gameState.score += 100; // Bônus da gema dourada
            leoSpeak(leoMessages.phaseComplete);
            
            setTimeout(() => {
                document.getElementById('victoryModal').style.display = 'flex';
            }, 2000);
        }

        // Mostrar gema dourada
        function showGoldenGem() {
            const container = document.getElementById('gemsContainer');
            
            // Criar gema dourada
            const goldenGem = document.createElement('div');
            goldenGem.className = 'gem golden';
            goldenGem.style.animation = 'float 2s ease-in-out infinite, goldenGlow 2s infinite';
            
            const gemInner = document.createElement('div');
            gemInner.className = 'gem-inner';
            
            const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
            faces.forEach(face => {
                const faceDiv = document.createElement('div');
                faceDiv.className = `gem-face ${face}`;
                gemInner.appendChild(faceDiv);
            });
            
            goldenGem.appendChild(gemInner);
            container.appendChild(goldenGem);
            
            playNote(gameConfig.sounds.golden, 1000);
        }

        // Próxima fase
        function nextPhase() {
            gameState.currentPhase++;
            
            if (gameState.currentPhase >= gameConfig.phases.length) {
                // Jogo completo
                leoSpeak(leoMessages.gameOver);
                gameState.currentPhase = 0;
                document.getElementById('startBtn').disabled = false;
                document.getElementById('startBtn').textContent = 'Jogar Novamente';
            } else {
                gameState.sequence = [];
                gameState.sequencesCompleted = 0;
                createGems();
                updateDisplay();
                setTimeout(() => nextRound(), 2000);
            }
            
            document.getElementById('victoryModal').style.display = 'none';
        }

        // Atualizar display
        function updateDisplay() {
            const phase = gameConfig.phases[gameState.currentPhase];
            document.getElementById('phase').textContent = gameState.currentPhase + 1;
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('sequence').textContent = gameState.sequence.length;
            document.getElementById('phaseText').textContent = 
                `Fase ${gameState.currentPhase + 1}: ${phase.gems} Gemas Mágicas`;
            
            const progress = (gameState.sequencesCompleted / phase.sequences) * 100;
            document.getElementById('progress').style.width = progress + '%';
            document.getElementById('progress').textContent = 
                `${gameState.sequencesCompleted}/${phase.sequences}`;
        }

        // Função auxiliar sleep
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    </script>
</body>
</html>

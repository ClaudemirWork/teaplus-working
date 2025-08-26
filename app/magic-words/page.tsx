<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Palavras Mágicas - CAA Gamificado</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
        }

        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            overflow: hidden;
            background: #000;
        }

        #gameContainer {
            width: 100%;
            max-width: 480px;
            height: 100vh;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
        }

        /* Tutorial Overlay - MILA APARECE PRIMEIRO */
        #tutorialOverlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, rgba(135, 206, 235, 0.3) 0%, rgba(0, 0, 0, 0.95) 60%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            animation: fadeIn 0.5s ease;
        }

        #tutorialOverlay.hidden {
            display: none;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Mila Character Completa */
        .mila-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            animation: slideDown 0.8s ease;
        }

        @keyframes slideDown {
            from { transform: translateY(-100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .mila {
            width: 180px;
            height: 180px;
            background: linear-gradient(135deg, #FF69B4, #FFB6C1);
            border-radius: 50%;
            position: relative;
            animation: float 3s ease-in-out infinite;
            box-shadow: 0 20px 40px rgba(255, 105, 180, 0.4);
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }

        .mila-hat {
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 40px solid transparent;
            border-right: 40px solid transparent;
            border-bottom: 60px solid #4B0082;
            z-index: 10;
        }

        .mila-hat::after {
            content: '⭐';
            position: absolute;
            top: 15px;
            left: -10px;
            font-size: 30px;
            animation: twinkle 2s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
            50% { opacity: 0.6; transform: scale(0.9) rotate(180deg); }
        }

        .mila-face {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
        }

        .mila-eyes {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
        }

        .eye {
            width: 20px;
            height: 25px;
            background: white;
            border-radius: 50%;
            position: relative;
            animation: blink 4s infinite;
        }

        @keyframes blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
        }

        .eye::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background: #333;
            border-radius: 50%;
            top: 10px;
            left: 5px;
        }

        .mila-mouth {
            width: 30px;
            height: 15px;
            border-bottom: 3px solid #333;
            border-radius: 0 0 30px 30px;
            margin: 0 auto;
            animation: talk 0.8s infinite alternate;
        }

        @keyframes talk {
            from { width: 30px; }
            to { width: 20px; }
        }

        .mila::before {
            content: "✨";
            position: absolute;
            font-size: 30px;
            top: -20px;
            right: -20px;
            animation: sparkle 2s ease-in-out infinite;
        }

        .mila::after {
            content: "✨";
            position: absolute;
            font-size: 25px;
            bottom: 20px;
            left: -25px;
            animation: sparkle 2s ease-in-out infinite reverse;
        }

        @keyframes sparkle {
            0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }

        /* Speech Bubble */
        .speech-bubble {
            background: white;
            border-radius: 20px;
            padding: 25px 35px;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 350px;
            animation: bubbleUp 0.5s ease 0.3s both;
        }

        @keyframes bubbleUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .speech-bubble::before {
            content: '';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-bottom: 20px solid white;
        }

        .speech-text {
            font-size: 22px;
            line-height: 1.5;
            color: #333;
            text-align: center;
            font-weight: 500;
        }

        .continue-btn {
            margin-top: 30px;
            padding: 15px 40px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            animation: pulse 2s infinite;
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* Example Container */
        .example-container {
            margin-top: 30px;
            animation: fadeIn 0.5s ease;
        }

        .npc-demo {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
        }

        .npc-avatar {
            width: 100px;
            height: 100px;
            position: relative;
        }

        .npc-head {
            width: 60px;
            height: 60px;
            background: #FFE4B5;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 20px;
        }

        .npc-body {
            width: 80px;
            height: 50px;
            background: #4169E1;
            border-radius: 20px 20px 10px 10px;
            position: absolute;
            bottom: 0;
            left: 10px;
        }

        .npc-name-demo {
            font-size: 18px;
            font-weight: bold;
            color: white;
            margin-top: 10px;
        }

        .npc-gesture-demo {
            font-size: 60px;
            margin-top: 10px;
            animation: gestureDemo 1.5s infinite;
        }

        @keyframes gestureDemo {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(10deg); }
        }

        .cards-demo {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
            padding: 0 20px;
        }

        .card-demo {
            background: white;
            border-radius: 15px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            opacity: 0.3;
            transition: all 0.3s ease;
        }

        .card-demo.highlight {
            background: linear-gradient(135deg, #90EE90, #98FB98);
            transform: scale(1.1);
            box-shadow: 0 5px 20px rgba(144, 238, 144, 0.5);
            animation: pulseHighlight 1s infinite;
            opacity: 1;
        }

        @keyframes pulseHighlight {
            0%, 100% { transform: scale(1.1); }
            50% { transform: scale(1.15); }
        }

        /* Menu Screen */
        .menu-screen {
            display: none;
            min-height: 100vh;
            background: linear-gradient(135deg, #87CEEB 0%, #98E4D6 100%);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .menu-screen.active {
            display: flex;
        }

        .game-logo {
            font-size: 48px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
            text-align: center;
            text-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .game-subtitle {
            font-size: 20px;
            color: rgba(255,255,255,0.9);
            margin-bottom: 40px;
        }

        .menu-buttons {
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 100%;
            max-width: 300px;
        }

        .menu-btn {
            padding: 18px 30px;
            background: white;
            color: #2196F3;
            border: none;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        .menu-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .menu-btn.primary {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            font-size: 22px;
        }

        /* Game Screen */
        #gameScreen {
            display: none;
            min-height: 100vh;
            background: linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 100%);
        }

        .game-header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }

        .level-badge {
            background: rgba(255,255,255,0.3);
            padding: 8px 16px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
        }

        .score {
            background: rgba(255,255,255,0.3);
            padding: 8px 20px;
            border-radius: 20px;
            color: white;
            font-size: 18px;
            font-weight: bold;
        }

        .lives {
            display: flex;
            gap: 5px;
        }

        .heart {
            font-size: 24px;
            animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* Progress Bar */
        .progress-section {
            padding: 15px 20px;
            background: rgba(255,255,255,0.8);
        }

        .progress-bar {
            background: #E0E0E0;
            height: 30px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #8BC34A);
            border-radius: 15px;
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            min-width: 50px;
        }

        /* NPC Area */
        .npc-area {
            padding: 20px;
            display: flex;
            justify-content: center;
        }

        .npc-container {
            background: white;
            border-radius: 20px;
            padding: 20px 40px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
        }

        .npc-character {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #FFE4C4, #FFDAB9);
            border-radius: 50%;
            margin: 0 auto 15px;
            position: relative;
            animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .npc-name {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .npc-gesture {
            font-size: 60px;
            animation: gestureAnim 1.5s infinite;
        }

        @keyframes gestureAnim {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(5deg); }
        }

        /* Cards Grid */
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }

        .card {
            background: white;
            border-radius: 15px;
            padding: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            min-height: 140px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }

        .card.correct {
            background: linear-gradient(135deg, #84fab0, #8fd3f4);
            animation: correctPulse 0.6s ease;
        }

        @keyframes correctPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        .card.wrong {
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            animation: shake 0.5s ease;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        .card-image {
            width: 80px;
            height: 80px;
            object-fit: contain;
            margin-bottom: 8px;
        }

        .card-label {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            text-align: center;
        }

        /* Modal */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            padding: 40px;
            border-radius: 30px;
            text-align: center;
            max-width: 90%;
            animation: zoomIn 0.5s ease;
        }

        @keyframes zoomIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }

        .modal-icon {
            font-size: 80px;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 28px;
            margin-bottom: 10px;
            color: #333;
        }

        .modal-description {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <!-- Tutorial Overlay - APARECE PRIMEIRO -->
        <div id="tutorialOverlay">
            <div class="mila-container">
                <div class="mila">
                    <div class="mila-hat"></div>
                    <div class="mila-face">
                        <div class="mila-eyes">
                            <div class="eye"></div>
                            <div class="eye"></div>
                        </div>
                        <div class="mila-mouth"></div>
                    </div>
                </div>
                
                <div class="speech-bubble">
                    <p class="speech-text" id="tutorialText">Olá! Eu sou a Mila, a feiticeira das palavras!</p>
                </div>
            </div>
            
            <div class="example-container" id="exampleContainer" style="display: none;">
                <div class="npc-demo">
                    <div class="npc-avatar">
                        <div class="npc-head"></div>
                        <div class="npc-body"></div>
                    </div>
                    <div class="npc-name-demo">João</div>
                    <div class="npc-gesture-demo">👉💧</div>
                </div>
                
                <div class="cards-demo" id="cardsDemo" style="display: none;">
                    <div class="card-demo" id="cardSede">
                        <img src="https://api.arasaac.org/v1/pictograms/2439?color=true&download=false" width="50" alt="Sede">
                        <span>Sede</span>
                    </div>
                    <div class="card-demo">
                        <img src="https://api.arasaac.org/v1/pictograms/11738?color=true&download=false" width="50" alt="Fome">
                        <span>Fome</span>
                    </div>
                    <div class="card-demo">
                        <img src="https://api.arasaac.org/v1/pictograms/6246?color=true&download=false" width="50" alt="Sono">
                        <span>Sono</span>
                    </div>
                    <div class="card-demo">
                        <img src="https://api.arasaac.org/v1/pictograms/8975?color=true&download=false" width="50" alt="Banheiro">
                        <span>Banheiro</span>
                    </div>
                </div>
            </div>
            
            <button class="continue-btn" id="continueBtn" onclick="nextTutorialStep()">Continuar ➡️</button>
        </div>

        <!-- Menu Screen -->
        <div class="menu-screen" id="menuScreen">
            <h1 class="game-logo">🎪 Palavras Mágicas</h1>
            <p class="game-subtitle">Uma aventura CAA gamificada</p>
            
            <div class="menu-buttons">
                <button class="menu-btn primary" onclick="startGame()">🎮 Jogar</button>
                <button class="menu-btn" onclick="showCollection()">📚 Minha Coleção</button>
                <button class="menu-btn" onclick="toggleSound()">🔊 Som: ON</button>
                <button class="menu-btn" onclick="showAbout()">ℹ️ Sobre</button>
            </div>
        </div>

        <!-- Game Screen -->
        <div id="gameScreen">
            <div class="game-header">
                <div class="level-badge">Fase <span id="currentLevel">1</span></div>
                <div class="score">⭐ <span id="scoreDisplay">0</span></div>
                <div class="lives" id="livesDisplay">
                    <span class="heart">❤️</span>
                    <span class="heart">❤️</span>
                    <span class="heart">❤️</span>
                </div>
            </div>

            <div class="progress-section">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressBar" style="width: 20%">
                        <span id="progressText">1/5</span>
                    </div>
                </div>
            </div>

            <div class="npc-area">
                <div class="npc-container">
                    <div class="npc-character"></div>
                    <div class="npc-name" id="npcName">Maria</div>
                    <div class="npc-gesture" id="npcGesture">👉💧</div>
                </div>
            </div>

            <div class="cards-grid" id="cardsGrid">
                <!-- Cards serão inseridos aqui -->
            </div>
        </div>

        <!-- Modal -->
        <div class="modal" id="rewardModal">
            <div class="modal-content">
                <div class="modal-icon" id="modalIcon">🏆</div>
                <h2 class="modal-title" id="modalTitle">Parabéns!</h2>
                <p class="modal-description" id="modalDescription">Você completou a fase!</p>
                <button class="continue-btn" onclick="closeModal()">Continuar</button>
            </div>
        </div>
    </div>

    <script>
        // Game State
        const gameState = {
            currentLevel: 1,
            score: 0,
            lives: 3,
            tutorialStep: 0,
            currentRound: 1,
            soundEnabled: true,
            correctCardId: null
        };

        // Cards com IMAGENS REAIS
        const cards = {
            necessidades: [
                {
                    id: 'sede',
                    label: 'Sede',
                    image: 'https://api.arasaac.org/v1/pictograms/2439?color=true&download=false',
                    gesture: '👉💧',
                    gestureDesc: 'apontando para a garganta'
                },
                {
                    id: 'fome',
                    label: 'Fome',
                    image: 'https://api.arasaac.org/v1/pictograms/11738?color=true&download=false',
                    gesture: '🤲🍽️',
                    gestureDesc: 'mãos na barriga'
                },
                {
                    id: 'banheiro',
                    label: 'Banheiro',
                    image: 'https://api.arasaac.org/v1/pictograms/8975?color=true&download=false',
                    gesture: '🚽',
                    gestureDesc: 'se contorcendo'
                },
                {
                    id: 'sono',
                    label: 'Sono',
                    image: 'https://api.arasaac.org/v1/pictograms/6246?color=true&download=false',
                    gesture: '😴',
                    gestureDesc: 'bocejando'
                },
                {
                    id: 'doente',
                    label: 'Doente',
                    image: 'https://api.arasaac.org/v1/pictograms/11439?color=true&download=false',
                    gesture: '🤒',
                    gestureDesc: 'mão na testa'
                },
                {
                    id: 'frio',
                    label: 'Frio',
                    image: 'https://api.arasaac.org/v1/pictograms/6369?color=true&download=false',
                    gesture: '🥶',
                    gestureDesc: 'tremendo'
                },
                {
                    id: 'calor',
                    label: 'Calor',
                    image: 'https://api.arasaac.org/v1/pictograms/5467?color=true&download=false',
                    gesture: '🥵',
                    gestureDesc: 'se abanando'
                },
                {
                    id: 'ajuda',
                    label: 'Ajuda',
                    image: 'https://api.arasaac.org/v1/pictograms/7421?color=true&download=false',
                    gesture: '🙏',
                    gestureDesc: 'mãos juntas pedindo'
                }
            ]
        };

        const npcNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Sofia'];

        const tutorialSteps = [
            {
                text: "Olá! Eu sou a Mila, a feiticeira das palavras!",
                showMila: true
            },
            {
                text: "O Reino perdeu a voz mágica! Todos fazem gestos agora!",
                showMila: true
            },
            {
                text: "Você será o tradutor mágico que entende os gestos!",
                showMila: true
            },
            {
                text: "Veja! João está apontando para a garganta...",
                showMila: true,
                showExample: true
            },
            {
                text: "Clique no card SEDE para ajudá-lo!",
                showMila: true,
                showExample: true,
                showCards: true,
                highlight: 'sede'
            }
        ];

        // Speech
        function speak(text) {
            if (!gameState.soundEnabled) return;
            
            const cleanText = text.replace(/[^\w\sÀ-ÿ.,!?]/g, '');
            
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'pt-BR';
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                speechSynthesis.speak(utterance);
            }
        }

        // Start Tutorial
        function startTutorial() {
            gameState.tutorialStep = 0;
            document.getElementById('tutorialOverlay').classList.remove('hidden');
            showTutorialStep();
        }

        // Show Tutorial Step
        function showTutorialStep() {
            const step = tutorialSteps[gameState.tutorialStep];
            
            document.getElementById('tutorialText').textContent = step.text;
            speak(step.text);
            
            // Show/hide example
            if (step.showExample) {
                document.getElementById('exampleContainer').style.display = 'block';
            } else {
                document.getElementById('exampleContainer').style.display = 'none';
            }
            
            // Show/hide cards demo
            if (step.showCards) {
                document.getElementById('cardsDemo').style.display = 'grid';
                if (step.highlight === 'sede') {
                    document.getElementById('cardSede').classList.add('highlight');
                }
            } else {
                document.getElementById('cardsDemo').style.display = 'none';
            }
        }

        // Next Tutorial Step
        function nextTutorialStep() {
            gameState.tutorialStep++;
            
            if (gameState.tutorialStep < tutorialSteps.length) {
                showTutorialStep();
            } else {
                document.getElementById('tutorialOverlay').classList.add('hidden');
                document.getElementById('menuScreen').classList.add('active');
                speak("Agora você já sabe jogar! Vamos começar!");
            }
        }

        // Start Game
        function startGame() {
            document.getElementById('menuScreen').classList.remove('active');
            document.getElementById('gameScreen').style.display = 'block';
            
            gameState.currentRound = 1;
            gameState.lives = 3;
            loadRound();
        }

        // Load Round
        function loadRound() {
            const availableCards = [...cards.necessidades];
            const roundCards = availableCards.slice(0, 4);
            const correctCard = roundCards[Math.floor(Math.random() * roundCards.length)];
            
            gameState.correctCardId = correctCard.id;
            
            // Setup NPC
            const npcName = npcNames[Math.floor(Math.random() * npcNames.length)];
            document.getElementById('npcName').textContent = npcName;
            document.getElementById('npcGesture').textContent = correctCard.gesture;
            
            // Display cards
            const grid = document.getElementById('cardsGrid');
            grid.innerHTML = '';
            
            roundCards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `
                    <img src="${card.image}" alt="${card.label}" class="card-image">
                    <div class="card-label">${card.label}</div>
                `;
                cardElement.onclick = () => checkCard(card.id);
                grid.appendChild(cardElement);
            });
            
            // Update progress
            document.getElementById('progressText').textContent = `${gameState.currentRound}/5`;
            document.getElementById('progressBar').style.width = `${(gameState.currentRound / 5) * 100}%`;
            
            // Speak instruction
            speak(`${npcName} está ${correctCard.gestureDesc}. O que será?`);
        }

        // Check Card
        function checkCard(cardId) {
            const cardElement = event.currentTarget;
            
            if (cardId === gameState.correctCardId) {
                cardElement.classList.add('correct');
                speak("Muito bem! Você acertou!");
                gameState.score += 100;
                document.getElementById('scoreDisplay').textContent = gameState.score;
                
                setTimeout(() => {
                    if (gameState.currentRound < 5) {
                        gameState.currentRound++;
                        loadRound();
                    } else {
                        completeLevel();
                    }
                }, 1500);
            } else {
                cardElement.classList.add('wrong');
                speak("Ops! Tente novamente!");
                gameState.lives--;
                updateLives();
                
                setTimeout(() => {
                    cardElement.classList.remove('wrong');
                }, 500);
                
                if (gameState.lives <= 0) {
                    gameOver();
                }
            }
        }

        // Update Lives
        function updateLives() {
            const livesDisplay = document.getElementById('livesDisplay');
            livesDisplay.innerHTML = '';
            
            for (let i = 0; i < 3; i++) {
                if (i < gameState.lives) {
                    livesDisplay.innerHTML += '<span class="heart">❤️</span>';
                } else {
                    livesDisplay.innerHTML += '<span class="heart" style="opacity: 0.3">💔</span>';
                }
            }
        }

        // Complete Level
        function completeLevel() {
            showModal('🏆', 'Fase Completa!', `Você ganhou ${gameState.score} pontos!`);
            gameState.currentLevel++;
        }

        // Game Over
        function gameOver() {
            showModal('😢', 'Fim de Jogo', `Pontuação final: ${gameState.score}`);
        }

        // Show Modal
        function showModal(icon, title, description) {
            document.getElementById('modalIcon').textContent = icon;
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDescription').textContent = description;
            document.getElementById('rewardModal').classList.add('active');
            speak(title);
        }

        // Close Modal
        function closeModal() {
            document.getElementById('rewardModal').classList.remove('active');
            document.getElementById('gameScreen').style.display = 'none';
            document.getElementById('menuScreen').classList.add('active');
        }

        // Other functions
        function showCollection() {
            showModal('📚', 'Minha Coleção', 'Em breve: Veja todos os cards descobertos!');
        }

        function toggleSound() {
            gameState.soundEnabled = !gameState.soundEnabled;
            event.target.textContent = `🔊 Som: ${gameState.soundEnabled ? 'ON' : 'OFF'}`;
        }

        function showAbout() {
            showModal('ℹ️', 'Sobre', 'Palavras Mágicas - Um jogo CAA gamificado para crianças especiais');
        }

        // Initialize on load
        window.onload = function() {
            // Start with tutorial
            setTimeout(startTutorial, 500);
        };
    </script>
</body>
</html>

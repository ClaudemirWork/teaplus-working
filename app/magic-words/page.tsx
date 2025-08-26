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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        #gameContainer {
            width: 100%;
            max-width: 480px;
            height: 100vh;
            background: #1a1a2e;
            position: relative;
            overflow: hidden;
        }

        /* Tutorial Overlay */
        #tutorialOverlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.95) 70%);
            display: none;
            z-index: 1000;
            animation: fadeIn 0.5s ease;
        }

        #tutorialOverlay.active {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Mila Character */
        .mila {
            width: 180px;
            height: 180px;
            background: linear-gradient(135deg, #f093fb, #f5576c);
            border-radius: 50%;
            position: relative;
            animation: float 3s ease-in-out infinite;
            box-shadow: 0 20px 40px rgba(240, 147, 251, 0.4);
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }

        .mila::before {
            content: "✨";
            position: absolute;
            font-size: 40px;
            top: -20px;
            right: -10px;
            animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        .mila-face {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
        }

        .mila-eyes {
            position: absolute;
            top: 30px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            padding: 0 25px;
        }

        .eye {
            width: 15px;
            height: 20px;
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
            width: 8px;
            height: 8px;
            background: #333;
            border-radius: 50%;
            top: 8px;
            left: 3px;
        }

        .mila-mouth {
            position: absolute;
            bottom: 25px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 15px;
            border-bottom: 3px solid white;
            border-radius: 0 0 30px 30px;
            animation: talk 0.5s ease-in-out infinite alternate;
        }

        @keyframes talk {
            from { width: 30px; }
            to { width: 25px; }
        }

        .mila-hat {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 40px solid transparent;
            border-right: 40px solid transparent;
            border-bottom: 60px solid #4a0e4e;
        }

        .mila-hat::after {
            content: '⭐';
            position: absolute;
            top: 20px;
            left: -10px;
            font-size: 24px;
        }

        /* Speech Bubble */
        .speech-bubble {
            background: white;
            border-radius: 20px;
            padding: 20px;
            margin: 30px 20px;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease;
            max-width: 300px;
        }

        @keyframes slideUp {
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
            font-size: 18px;
            line-height: 1.5;
            color: #333;
            text-align: center;
        }

        .continue-btn {
            margin-top: 20px;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            animation: pulse 2s infinite;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* Game Header */
        .game-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }

        .level-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .level-badge {
            background: rgba(255,255,255,0.2);
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
        }

        .score {
            background: rgba(255,255,255,0.2);
            padding: 8px 15px;
            border-radius: 20px;
            color: white;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .score::before {
            content: '⭐';
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

        /* NPC Display Area */
        .npc-area {
            background: linear-gradient(135deg, #a8edea, #fed6e3);
            margin: 20px;
            padding: 30px;
            border-radius: 20px;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .npc-character {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #ffecd2, #fcb69f);
            border-radius: 50%;
            position: relative;
            animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .npc-name {
            margin-top: 15font-size: 20px;
            font-weight: bold;
            color: #333;
        }

        .npc-gesture {
            margin-top: 10px;
            font-size: 60px;
            animation: gesture 1s ease-in-out infinite alternate;
        }

        @keyframes gesture {
            from { transform: rotate(-10deg) scale(1); }
            to { transform: rotate(10deg) scale(1.1); }
        }

        /* Cards Grid */
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 15px;
            padding: 20px;
            max-height: 40vh;
            overflow-y: auto;
        }

        .card {
            background: white;
            border-radius: 15px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            min-height: 120px;
        }

        .card:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
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

        .card-icon {
            font-size: 40px;
            margin-bottom: 8px;
        }

        .card-label {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            text-align: center;
        }

        /* Progress Bar */
        .progress-section {
            padding: 15px 20px;
            background: rgba(255,255,255,0.1);
        }

        .progress-bar {
            background: rgba(255,255,255,0.2);
            height: 30px;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #f093fb, #f5576c);
            border-radius: 15px;
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            box-shadow: 0 0 20px rgba(240, 147, 251, 0.5);
        }

        /* Collection Album */
        .album-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f093fb, #f5576c);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 100;
        }

        /* Story Creation Mode */
        .story-mode {
            padding: 20px;
            background: linear-gradient(135deg, #ffecd2, #fcb69f);
            min-height: 70vh;
            border-radius: 20px 20px 0 0;
            margin-top: 20px;
        }

        .story-canvas {
            background: white;
            border-radius: 15px;
            padding: 20px;
            min-height: 300px;
            margin-bottom: 20px;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
        }

        .story-text {
            font-size: 18px;
            line-height: 1.8;
            color: #333;
        }

        .story-cards {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }

        .story-card {
            background: white;
            border: 2px solid #667eea;
            border-radius: 10px;
            padding: 8px 12px;
            cursor: move;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 0.3s ease;
        }

        .story-card:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        /* Rewards Modal */
        .reward-modal {
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

        .reward-modal.active {
            display: flex;
        }

        .reward-content {
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 40px;
            border-radius: 30px;
            text-align: center;
            color: white;
            animation: zoomIn 0.5s ease;
        }

        @keyframes zoomIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }

        .reward-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: rotate 2s linear infinite;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .reward-title {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .reward-description {
            font-size: 18px;
            opacity: 0.9;
        }

        /* Power-ups */
        .powerups {
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            gap: 10px;
            z-index: 100;
        }

        .powerup {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #84fab0, #8fd3f4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        .powerup:hover {
            transform: scale(1.1);
        }

        .powerup.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Menu Screen */
        .menu-screen {
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea, #764ba2);
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
            color: #667eea;
            border: none;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }

        .menu-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .menu-btn.primary {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
            font-size: 22px;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .cards-grid {
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            }
            
            .card {
                min-height: 100px;
                padding: 10px;
            }
            
            .card-icon {
                font-size: 30px;
            }
            
            .card-label {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <!-- Menu Screen -->
        <div class="menu-screen active" id="menuScreen">
            <div class="game-logo">🎪 Palavras Mágicas</div>
            <div class="game-subtitle">Uma aventura CAA gamificada</div>
            <div class="menu-buttons">
                <button class="menu-btn primary" onclick="startGame()">🎮 Jogar</button>
                <button class="menu-btn" onclick="showCollection()">📚 Minha Coleção</button>
                <button class="menu-btn" onclick="showSettings()">⚙️ Configurações</button>
                <button class="menu-btn" onclick="showAbout()">ℹ️ Sobre</button>
            </div>
        </div>

        <!-- Tutorial Overlay -->
        <div id="tutorialOverlay">
            <div class="mila" id="milaCharacter">
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
                <div class="speech-text" id="tutorialText">Olá! Eu sou a Mila, a feiticeira das palavras!</div>
            </div>
            <button class="continue-btn" onclick="nextTutorialStep()">Continuar ➡️</button>
        </div>

        <!-- Game Screen -->
        <div id="gameScreen" style="display: none;">
            <!-- Header -->
            <div class="game-header">
                <div class="level-info">
                    <span class="level-badge">Fase <span id="currentLevel">1</span></span>
                </div>
                <div class="score" id="scoreDisplay">0</div>
                <div class="lives" id="livesDisplay">
                    <span class="heart">❤️</span>
                    <span class="heart">❤️</span>
                    <span class="heart">❤️</span>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="progress-section">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressBar" style="width: 0%">
                        <span id="progressText">0/10</span>
                    </div>
                </div>
            </div>

            <!-- NPC Area -->
            <div class="npc-area" id="npcArea">
                <div class="npc-character" id="npcCharacter"></div>
                <div class="npc-name" id="npcName">João</div>
                <div class="npc-gesture" id="npcGesture">👉💧</div>
            </div>

            <!-- Cards Grid -->
            <div class="cards-grid" id="cardsGrid"></div>

            <!-- Power-ups -->
            <div class="powerups">
                <div class="powerup" onclick="usePowerup('hint')" title="Dica da Mila">💡</div>
                <div class="powerup" onclick="usePowerup('time')" title="Tempo Extra">⏱️</div>
                <div class="powerup" onclick="usePowerup('life')" title="Segunda Chance">💚</div>
            </div>
        </div>

        <!-- Story Mode Screen -->
        <div id="storyScreen" style="display: none;">
            <div class="game-header">
                <div class="level-info">
                    <span class="level-badge">Modo História</span>
                </div>
                <button onclick="backToMenu()" style="background: rgba(255,255,255,0.2); border: none; padding: 8px 15px; border-radius: 20px; color: white; cursor: pointer;">Voltar</button>
            </div>
            
            <div class="story-mode">
                <div class="story-canvas" id="storyCanvas">
                    <div class="story-text" id="storyText">Era uma vez...</div>
                </div>
                <div class="story-cards" id="storyCards"></div>
            </div>
        </div>

        <!-- Collection Album Button -->
        <div class="album-btn" onclick="showCollection()" style="display: none;" id="albumBtn">📚</div>

        <!-- Reward Modal -->
        <div class="reward-modal" id="rewardModal">
            <div class="reward-content">
                <div class="reward-icon" id="rewardIcon">🌟</div>
                <div class="reward-title" id="rewardTitle">Parabéns!</div>
                <div class="reward-description" id="rewardDescription">Você completou a fase!</div>
                <button class="continue-btn" onclick="closeReward()">Continuar</button>
            </div>
        </div>
    </div>

    <script>
        // Game State
        const gameState = {
            currentLevel: 1,
            score: 0,
            lives: 3,
            cardsDiscovered: new Set(),
            tutorialStep: 0,
            currentRound: 0,
            correctStreak: 0,
            powerups: {
                hint: 3,
                time: 2,
                life: 1
            },
            isStoryMode: false,
            storyPhase: 5,
            soundEnabled: true
        };

        // Card Database (670 cards simplified to categories)
        const cardDatabase = {
            necessidades: [
                {id: 'sede', icon: '💧', label: 'Sede', gesture: '👉💧', gestureDesc: 'apontando para a garganta'},
                {id: 'fome', icon: '🍽️', label: 'Fome', gesture: '🤲🍽️', gestureDesc: 'mãos na barriga'},
                {id: 'banheiro', icon: '🚽', label: 'Banheiro', gesture: '🚽', gestureDesc: 'se contorcendo'},
                {id: 'sono', icon: '😴', label: 'Sono', gesture: '😴', gestureDesc: 'bocejando'},
                {id: 'doente', icon: '🤒', label: 'Doente', gesture: '🤒', gestureDesc: 'mão na testa'},
                {id: 'frio', icon: '🥶', label: 'Frio', gesture: '🥶', gestureDesc: 'tremendo'},
                {id: 'calor', icon: '🥵', label: 'Calor', gesture: '🥵', gestureDesc: 'se abanando'},
                {id: 'ajuda', icon: '🆘', label: 'Ajuda', gesture: '🙏', gestureDesc: 'mãos juntas'}
            ],
            emocoes: [
                {id: 'feliz', icon: '😊', label: 'Feliz', gesture: '😊', gestureDesc: 'sorrindo'},
                {id: 'triste', icon: '😢', label: 'Triste', gesture: '😢', gestureDesc: 'enxugando lágrimas'},
                {id: 'bravo', icon: '😠', label: 'Bravo', gesture: '😠', gestureDesc: 'punhos cerrados'},
                {id: 'medo', icon: '😨', label: 'Medo', gesture: '😨', gestureDesc: 'se encolhendo'},
                {id: 'surpreso', icon: '😲', label: 'Surpreso', gesture: '😲', gestureDesc: 'boca aberta'},
                {id: 'confuso', icon: '😕', label: 'Confuso', gesture: '😕', gestureDesc: 'coçando a cabeça'},
                {id: 'amigo', icon: '🤝', label: 'Amigo', gesture: '🤝', gestureDesc: 'estendendo a mão'},
                {id: 'amor', icon: '❤️', label: 'Amor', gesture: '❤️', gestureDesc: 'mãos no coração'}
            ],
            alimentos: [
                {id: 'agua', icon: '💧', label: 'Água', gesture: '💧', gestureDesc: 'bebendo'},
                {id: 'leite', icon: '🥛', label: 'Leite', gesture: '🥛', gestureDesc: 'segurando copo'},
                {id: 'pao', icon: '🍞', label: 'Pão', gesture: '🍞', gestureDesc: 'mastigando'},
                {id: 'fruta', icon: '🍎', label: 'Fruta', gesture: '🍎', gestureDesc: 'mordendo'},
                {id: 'suco', icon: '🧃', label: 'Suco', gesture: '🧃', gestureDesc: 'sugando canudo'},
                {id: 'biscoito', icon: '🍪', label: 'Biscoito', gesture: '🍪', gestureDesc: 'pegando'},
                {id: 'sorvete', icon: '🍦', label: 'Sorvete', gesture: '🍦', gestureDesc: 'lambendo'},
                {id: 'pizza', icon: '🍕', label: 'Pizza', gesture: '🍕', gestureDesc: 'abrindo a boca'}
            ],
            animais: [
                {id: 'cachorro', icon: '🐕', label: 'Cachorro', gesture: '🐕', gestureDesc: 'latindo'},
                {id: 'gato', icon: '🐈', label: 'Gato', gesture: '🐈', gestureDesc: 'miando'},
                {id: 'passaro', icon: '🦜', label: 'Pássaro', gesture: '🦜', gestureDesc: 'batendo asas'},
                {id: 'peixe', icon: '🐠', label: 'Peixe', gesture: '🐠', gestureDesc: 'nadando'},
                {id: 'coelho', icon: '🐰', label: 'Coelho', gesture: '🐰', gestureDesc: 'pulando'},
                {id: 'cavalo', icon: '🐴', label: 'Cavalo', gesture: '🐴', gestureDesc: 'galopando'},
                {id: 'vaca', icon: '🐄', label: 'Vaca', gesture: '🐄', gestureDesc: 'mugindo'},
                {id: 'galinha', icon: '🐓', label: 'Galinha', gesture: '🐓', gestureDesc: 'bicando'}
            ]
        };

        // NPC Names
        const npcNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Sofia', 'Gabriel', 'Julia'];

        // Tutorial Steps
        const tutorialSteps = [
            {
                text: "Olá! Eu sou a Mila, a feiticeira das palavras! 🌟",
                speak: true
            },
            {
                text: "O Reino perdeu a voz mágica! Todos fazem gestos agora! 😱",
                speak: true
            },
            {
                text: "Você será o tradutor mágico que entende os gestos! 🎭",
                speak: true
            },
            {
                text: "Veja! João está apontando para a garganta... 👉💧",
                speak: true,
                showExample: true
            },
            {
                text: "Clique no card SEDE para ajudá-lo! 💧",
                speak: true,
                highlight: 'sede'
            },
            {
                text: "Muito bem! Agora você já sabe jogar! Vamos começar! 🎮",
                speak: true,
                endTutorial: true
            }
        ];

        // Speech Synthesis
        function speak(text) {
            if (!gameState.soundEnabled) return;
            
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'pt-BR';
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                speechSynthesis.speak(utterance);
            }
        }

        // Play Sound Effect
        function playSound(type) {
            if (!gameState.soundEnabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'correct':
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                    oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    break;
                case 'wrong':
                    oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime); // D4
                    oscillator.frequency.exponentialRampToValueAtTime(146.83, audioContext.currentTime + 0.2); // D3
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    break;
                case 'powerup':
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
                    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1); // A5
                    oscillator.frequency.exponentialRampToValueAtTime(1760, audioContext.currentTime + 0.2); // A6
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    break;
            }
            
            oscillator.type = 'sine';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }

        // Initialize Game
        function initGame() {
            // Check if returning player
            const savedState = localStorage.getItem('palavrasMagicasState');
            if (savedState) {
                Object.assign(gameState, JSON.parse(savedState));
            }
            
            // Show tutorial for new players
            if (gameState.tutorialStep === 0 && !savedState) {
                startTutorial();
            }
        }

        // Start Tutorial
        function startTutorial() {
            document.getElementById('tutorialOverlay').classList.add('active');
            showTutorialStep();
        }

        // Show Tutorial Step
        function showTutorialStep() {
            const step = tutorialSteps[gameState.tutorialStep];
            document.getElementById('tutorialText').textContent = step.text;
            
            if (step.speak) {
                speak(step.text);
            }
            
            if (step.showExample) {
                // Show example NPC
                setTimeout(() => {
                    document.getElementById('npcGesture').style.display = 'block';
                }, 1000);
            }
            
            if (step.endTutorial) {
                setTimeout(() => {
                    document.getElementById('tutorialOverlay').classList.remove('active');
                    startGame();
                }, 2000);
            }
        }

        // Next Tutorial Step
        function nextTutorialStep() {
            gameState.tutorialStep++;
            if (gameState.tutorialStep < tutorialSteps.length) {
                showTutorialStep();
            } else {
                document.getElementById('tutorialOverlay').classList.remove('active');
                startGame();
            }
        }

        // Start Game
        function startGame() {
            document.getElementById('menuScreen').classList.remove('active');
            document.getElementById('gameScreen').style.display = 'block';
            document.getElementById('albumBtn').style.display = 'block';
            
            loadLevel(gameState.currentLevel);
        }

        // Load Level
        function loadLevel(level) {
            const categories = ['necessidades', 'emocoes', 'alimentos', 'animais'];
            let currentCategory, numCards;
            
            // Determine category and number of cards based on level
            if (level <= 4) {
                currentCategory = categories[level - 1];
                numCards = [4, 6, 8, 12][level - 1];
            } else if (level >= 5 && level <= 8) {
                // Story mode
                gameState.isStoryMode = true;
                loadStoryMode(level);
                return;
            } else {
                // Mix mode
                currentCategory = 'mix';
                numCards = 16;
            }
            
            // Update UI
            document.getElementById('currentLevel').textContent = level;
            updateScore();
            updateLives();
            
            // Start round
            startRound(currentCategory, numCards);
        }

        // Start Round
        function startRound(category, numCards) {
            gameState.currentRound++;
            
            // Get cards for this round
            let availableCards;
            if (category === 'mix') {
                // Mix cards from all categories
                availableCards = [];
                Object.values(cardDatabase).forEach(cat => {
                    availableCards.push(...cat);
                });
            } else {
                availableCards = [...cardDatabase[category]];
            }
            
            // Shuffle and select cards
            availableCards = shuffleArray(availableCards);
            const roundCards = availableCards.slice(0, numCards);
            
            // Select correct answer
            const correctCard = roundCards[Math.floor(Math.random() * roundCards.length)];
            
            // Setup NPC
            setupNPC(correctCard);
            
            // Display cards
            displayCards(roundCards, correctCard);
            
            // Update progress
            updateProgress();
        }

        // Setup NPC
        function setupNPC(correctCard) {
            const npcName = npcNames[Math.floor(Math.random() * npcNames.length)];
            document.getElementById('npcName').textContent = npcName;
            document.getElementById('npcGesture').textContent = correctCard.gesture;
            
            // Animate NPC
            const npcChar = document.getElementById('npcCharacter');
            npcChar.style.animation = 'none';
            setTimeout(() => {
                npcChar.style.animation = 'bounce 2s ease-in-out infinite';
            }, 10);
            
            // Speak the gesture description
            speak(`${npcName} está ${correctCard.gestureDesc}. O que será?`);
        }

        // Display Cards
        function displayCards(cards, correctCard) {
            const grid = document.getElementById('cardsGrid');
            grid.innerHTML = '';
            
            // Shuffle cards for display
            cards = shuffleArray(cards);
            
            cards.forEach(card => {
                const cardElement = createCardElement(card, card.id === correctCard.id);
                grid.appendChild(cardElement);
            });
        }

        // Create Card Element
        function createCardElement(card, isCorrect) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.innerHTML = `
                <div class="card-icon">${card.icon}</div>
                <div class="card-label">${card.label}</div>
            `;
            
            cardDiv.onclick = () => handleCardClick(card, isCorrect, cardDiv);
            
            return cardDiv;
        }

        // Handle Card Click
        function handleCardClick(card, isCorrect, cardElement) {
            if (isCorrect) {
                // Correct answer
                cardElement.classList.add('correct');
                playSound('correct');
                speak("Muito bem! Acertou!");
                
                // Add to collection
                gameState.cardsDiscovered.add(card.id);
                
                // Update score
                gameState.score += 100;
                gameState.correctStreak++;
                
                // Check for special rewards
                checkSpecialRewards();
                
                // Next round
                setTimeout(() => {
                    if (gameState.currentRound < 10) {
                        startRound(getCurrentCategory(), getCurrentNumCards());
                    } else {
                        completeLevel();
                    }
                }, 1500);
            } else {
                // Wrong answer
                cardElement.classList.add('wrong');
                playSound('wrong');
                speak("Ops! Tente novamente!");
                
                // Lose life
                gameState.lives--;
                gameState.correctStreak = 0;
                updateLives();
                
                if (gameState.lives <= 0) {
                    gameOver();
                } else {
                    setTimeout(() => {
                        cardElement.classList.remove('wrong');
                    }, 500);
                }
            }
            
            updateScore();
            saveGameState();
        }

        // Check Special Rewards
        function checkSpecialRewards() {
            if (gameState.correctStreak === 3) {
                showReward('Card Dourado', '⭐', 'Vale 500 pontos extras!');
                gameState.score += 500;
            } else if (gameState.correctStreak === 5) {
                showReward('Card Arco-íris', '🌈', 'Vale 1000 pontos extras!');
                gameState.score += 1000;
            }
        }

        // Complete Level
        function completeLevel() {
            const bonus = gameState.lives * 200;
            gameState.score += bonus;
            
            showReward(
                `Fase ${gameState.currentLevel} Completa!`,
                '🏆',
                `Bônus de vida: ${bonus} pontos!`
            );
            
            gameState.currentLevel++;
            gameState.currentRound = 0;
            gameState.lives = 3;
            
            // Check if unlocked story mode
            if (gameState.score >= 1000 && gameState.currentLevel === 5) {
                showReward('Modo História Desbloqueado!', '📖', 'Agora você pode criar suas próprias histórias!');
            }
            
            setTimeout(() => {
                loadLevel(gameState.currentLevel);
            }, 3000);
        }

        // Load Story Mode
        function loadStoryMode(phase) {
            document.getElementById('gameScreen').style.display = 'none';
            document.getElementById('storyScreen').style.display = 'block';
            
            const storyModes = {
                5: loadGuidedStory,
                6: loadSemiFreeStory,
                7: loadFreeStory,
                8: loadTheaterMode
            };
            
            storyModes[phase]();
        }

        // Guided Story Mode (Phase 5)
        function loadGuidedStory() {
            const canvas = document.getElementById('storyCanvas');
            const cards = document.getElementById('storyCards');
            
            const template = [
                "Era uma vez um/uma ",
                " que morava em ",
                ". Um dia estava ",
                " porque ",
                ". Então ",
                " e ficou ",
                "!"
            ];
            
            let storyText = template[0];
            let currentStep = 0;
            
            // Create selectable cards
            const options = [
                ['menino', 'menina', 'animal'],
                ['casa', 'escola', 'parque'],
                ['feliz', 'triste', 'assustado'],
                ['choveu', 'encontrou amigo', 'perdeu brinquedo'],
                ['brincou', 'correu', 'abraçou'],
                ['alegre', 'cansado', 'satisfeito']
            ];
            
            function updateStory() {
                canvas.innerHTML = `<div class="story-text">${storyText}</div>`;
                cards.innerHTML = '';
                
                if (currentStep < options.length) {
                    options[currentStep].forEach(option => {
                        const card = document.createElement('div');
                        card.className = 'story-card';
                        card.textContent = option;
                        card.onclick = () => {
                            storyText += option + template[currentStep + 1];
                            currentStep++;
                            updateStory();
                            speak(option);
                        };
                        cards.appendChild(card);
                    });
                } else {
                    speak(storyText);
                    showReward('História Criada!', '📚', 'Sua história foi salva!');
                    saveStory(storyText);
                }
            }
            
            updateStory();
        }

        // Semi-Free Story Mode (Phase 6)
        function loadSemiFreeStory() {
            // Implementation similar to guided but with more freedom
            const canvas = document.getElementById('storyCanvas');
            canvas.innerHTML = `
                <div class="story-text">
                    Hoje eu <input type="text" placeholder="[AÇÃO]"> 
                    com <input type="text" placeholder="[PESSOA]"> 
                    no <input type="text" placeholder="[LUGAR]">
                </div>
            `;
        }

        // Free Story Mode (Phase 7)
        function loadFreeStory() {
            const canvas = document.getElementById('storyCanvas');
            const cards = document.getElementById('storyCards');
            
            canvas.innerHTML = '<div class="story-text">Arraste os cards para criar sua história!</div>';
            
            // Display all available cards
            const allCards = [];
            Object.values(cardDatabase).forEach(category => {
                allCards.push(...category);
            });
            
            // Random selection of cards
            const storyCards = shuffleArray(allCards).slice(0, 20);
            
            storyCards.forEach(card => {
                const cardEl = document.createElement('div');
                cardEl.className = 'story-card';
                cardEl.draggable = true;
                cardEl.innerHTML = `${card.icon} ${card.label}`;
                cardEl.ondragstart = (e) => {
                    e.dataTransfer.setData('card', JSON.stringify(card));
                };
                cards.appendChild(cardEl);
            });
            
            canvas.ondrop = (e) => {
                e.preventDefault();
                const card = JSON.parse(e.dataTransfer.getData('card'));
                const span = document.createElement('span');
                span.className = 'story-card';
                span.innerHTML = `${card.icon} ${card.label} `;
                canvas.appendChild(span);
                speak(card.label);
            };
            
            canvas.ondragover = (e) => e.preventDefault();
        }

        // Theater Mode (Phase 8)
        function loadTheaterMode() {
            // Advanced mode with backgrounds and animations
            const canvas = document.getElementById('storyCanvas');
            canvas.innerHTML = `
                <div style="text-align: center;">
                    <h2>🎭 Teatro Mágico</h2>
                    <p>Em breve! Continue jogando para desbloquear!</p>
                </div>
            `;
        }

        // Save Story
        function saveStory(story) {
            const stories = JSON.parse(localStorage.getItem('savedStories') || '[]');
            stories.push({
                text: story,
                date: new Date().toLocaleDateString('pt-BR'),
                level: gameState.currentLevel
            });
            localStorage.setItem('savedStories', JSON.stringify(stories));
        }

        // Use Power-up
        function usePowerup(type) {
            if (gameState.powerups[type] <= 0) return;
            
            gameState.powerups[type]--;
            playSound('powerup');
            
            switch(type) {
                case 'hint':
                    // Remove 2 wrong cards
                    const wrongCards = document.querySelectorAll('.card:not(.correct)');
                    const toRemove = shuffleArray([...wrongCards]).slice(0, 2);
                    toRemove.forEach(card => {
                        card.style.opacity = '0.3';
                        card.style.pointerEvents = 'none';
                    });
                    speak("Dica da Mila ativada!");
                    break;
                case 'time':
                    // Add extra time (for timed modes)
                    speak("Tempo extra!");
                    break;
                case 'life':
                    // Restore one life
                    if (gameState.lives < 3) {
                        gameState.lives++;
                        updateLives();
                        speak("Vida restaurada!");
                    }
                    break;
            }
            
            saveGameState();
        }

        // Show Reward
        function showReward(title, icon, description) {
            const modal = document.getElementById('rewardModal');
            document.getElementById('rewardIcon').textContent = icon;
            document.getElementById('rewardTitle').textContent = title;
            document.getElementById('rewardDescription').textContent = description;
            modal.classList.add('active');
            speak(title);
        }

        // Close Reward
        function closeReward() {
            document.getElementById('rewardModal').classList.remove('active');
        }

        // Show Collection
        function showCollection() {
            const discovered = gameState.cardsDiscovered.size;
            const total = Object.values(cardDatabase).reduce((sum, cat) => sum + cat.length, 0);
            
            showReward(
                'Minha Coleção',
                '📚',
                `${discovered}/${total} cards descobertos!`
            );
        }

        // Update Score
        function updateScore() {
            document.getElementById('scoreDisplay').textContent = gameState.score;
        }

        // Update Lives
        function updateLives() {
            const livesDisplay = document.getElementById('livesDisplay');
            livesDisplay.innerHTML = '';
            for (let i = 0; i < gameState.lives; i++) {
                livesDisplay.innerHTML += '<span class="heart">❤️</span>';
            }
            for (let i = gameState.lives; i < 3; i++) {
                livesDisplay.innerHTML += '<span class="heart" style="opacity: 0.3">💔</span>';
            }
        }

        // Update Progress
        function updateProgress() {
            const progress = (gameState.currentRound / 10) * 100;
            document.getElementById('progressBar').style.width = `${progress}%`;
            document.getElementById('progressText').textContent = `${gameState.currentRound}/10`;
        }

        // Get Current Category
        function getCurrentCategory() {
            const categories = ['necessidades', 'emocoes', 'alimentos', 'animais'];
            if (gameState.currentLevel <= 4) {
                return categories[gameState.currentLevel - 1];
            }
            return 'mix';
        }

        // Get Current Number of Cards
        function getCurrentNumCards() {
            if (gameState.currentLevel <= 4) {
                return [4, 6, 8, 12][gameState.currentLevel - 1];
            }
            return 16;
        }

        // Game Over
        function gameOver() {
            showReward(
                'Fim de Jogo',
                '😢',
                `Pontuação final: ${gameState.score} pontos`
            );
            
            setTimeout(() => {
                backToMenu();
            }, 3000);
        }

        // Back to Menu
        function backToMenu() {
            document.getElementById('gameScreen').style.display = 'none';
            document.getElementById('storyScreen').style.display = 'none';
            document.getElementById('menuScreen').classList.add('active');
            document.getElementById('albumBtn').style.display = 'none';
        }

        // Show Settings
        function showSettings() {
            showReward(
                'Configurações',
                '⚙️',
                `Som: ${gameState.soundEnabled ? 'Ligado' : 'Desligado'}`
            );
        }

        // Show About
        function showAbout() {
            showReward(
                'Sobre',
                'ℹ️',
                'Palavras Mágicas v1.0 - Um jogo CAA gamificado'
            );
        }

        // Save Game State
        function saveGameState() {
            localStorage.setItem('palavrasMagicasState', JSON.stringify(gameState));
        }

        // Shuffle Array
        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        // Initialize on load
        window.onload = initGame;

        // Prevent scrolling on mobile
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });

        // Handle orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        });
    </script>
</body>
</html>

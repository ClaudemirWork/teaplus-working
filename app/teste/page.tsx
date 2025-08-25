<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simon Mágico Premium</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="container">
    <header>
      <h1>Simon Mágico Premium</h1>
      <p id="narrativa">Leo está pronto para enfrentar o desafio das gemas mágicas!</p>
    </header>

    <main>
      <div id="painel">
        <div class="gema" id="gema-vermelha"></div>
        <div class="gema" id="gema-azul"></div>
        <div class="gema" id="gema-verde"></div>
        <div class="gema" id="gema-amarela"></div>
      </div>

      <div id="controle">
        <button id="btn-iniciar">Iniciar</button>
        <p id="fase">Fase: 1</p>
        <p id="medalhas">Medalhas: 0</p>
      </div>
    </main>

    <footer>
      <p>Desenvolvido por Claudemir</p>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>
/* style.css */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to right, #1e3c72, #2a5298);
  color: #fff;
}

#container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

header, footer {
  text-align: center;
  margin-bottom: 20px;
}

#painel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.gema {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.7;
  transition: transform 0.3s, opacity 0.3s;
}

#gema-vermelha { background-color: red; }
#gema-azul { background-color: blue; }
#gema-verde { background-color: green; }
#gema-amarela { background-color: yellow; }

.gema.ativa {
  transform: scale(1.2);
  opacity: 1;
}

#controle {
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #666;
}// script.js
const gemas = [
  document.getElementById('gema-vermelha'),
  document.getElementById('gema-azul'),
  document.getElementById('gema-verde'),
  document.getElementById('gema-amarela')
];

const btnIniciar = document.getElementById('btn-iniciar');
const faseTexto = document.getElementById('fase');
const medalhasTexto = document.getElementById('medalhas');

let sequencia = [];
let jogador = [];
let fase = 1;
let medalhas = 0;

function piscarGema(indice) {
  gemas[indice].classList.add('ativa');
  setTimeout(() => {
    gemas[indice].classList.remove('ativa');
  }, 600);
}

function gerarSequencia() {
  sequencia.push(Math.floor(Math.random() * 4));
}

function mostrarSequencia() {
  let i = 0;
  const intervalo = setInterval(() => {
    piscarGema(sequencia[i]);
    i++;
    if (i >= sequencia.length) clearInterval(intervalo);
  }, 800);
}

function iniciarJogo() {
  sequencia = [];
  jogador = [];
  fase = 1;
  medalhas = 0;
  faseTexto.textContent = 'Fase: ' + fase;
  medalhasTexto.textContent = 'Medalhas: ' + medalhas;
  gerarSequencia();
  mostrarSequencia();
}

function verificarJogada() {
  for (let i = 0; i < jogador.length; i++) {
    if (jogador[i] !== sequencia[i]) {
      alert('Você errou! Tente novamente.');
      iniciarJogo();
      return;
    }
  }

  if (jogador.length === sequencia.length) {
    fase++;
    medalhas++;
    faseTexto.textContent = 'Fase: ' + fase;
    medalhasTexto.textContent = 'Medalhas: ' + medalhas;
    jogador = [];
    gerarSequencia();
    setTimeout(mostrarSequencia, 1000);
  }
}

btnIniciar.addEventListener('click', iniciarJogo);

gemas.forEach((gema, indice) => {
  gema.addEventListener('click', () => {
    jogador.push(indice);
    piscarGema(indice);
    verificarJogada();
  });
});// Adicione ao final do script.js

const narrativa = document.getElementById('narrativa');
const sons = [
  new Audio('sons/vermelha.mp3'),
  new Audio('sons/azul.mp3'),
  new Audio('sons/verde.mp3'),
  new Audio('sons/amarela.mp3')
];

function piscarGema(indice) {
  gemas[indice].classList.add('ativa');
  sons[indice].play();
  setTimeout(() => {
    gemas[indice].classList.remove('ativa');
  }, 600);
}

function atualizarNarrativa(texto) {
  narrativa.textContent = texto;
}

function iniciarJogo() {
  sequencia = [];
  jogador = [];
  fase = 1;
  medalhas = 0;
  faseTexto.textContent = 'Fase: ' + fase;
  medalhasTexto.textContent = 'Medalhas: ' + medalhas;
  atualizarNarrativa('Leo começa sua jornada mágica!');
  gerarSequencia();
  mostrarSequencia();
}

function verificarJogada() {
  for (let i = 0; i < jogador.length; i++) {
    if (jogador[i] !== sequencia[i]) {
      atualizarNarrativa('Leo falhou, mas vai tentar novamente!');
      alert('Você errou! Tente novamente.');
      iniciarJogo();
      return;
    }
  }

  if (jogador.length === sequencia.length) {
    fase++;
    medalhas++;
    faseTexto.textContent = 'Fase: ' + fase;
    medalhasTexto.textContent = 'Medalhas: ' + medalhas;
    atualizarNarrativa('Leo avançou para a fase ' + fase + '!');
    jogador = [];
    gerarSequencia();
    setTimeout(mostrarSequencia, 1000);
  }
}// Adicione ao final do script.js

function aplicarTema(fase) {
  const body = document.body;
  switch (fase) {
    case 1:
    case 2:
      body.style.background = 'linear-gradient(to right, #14532d, #1e3a8a)'; // Floresta
      atualizarNarrativa('Leo explora a Floresta das Gemas!');
      break;
    case 3:
    case 4:
      body.style.background = 'linear-gradient(to right, #0f172a, #38bdf8)'; // Gelo
      atualizarNarrativa('Leo enfrenta os ventos congelantes do Reino de Gelo!');
      break;
    case 5:
    case 6:
      body.style.background = 'linear-gradient(to right, #7f1d1d, #f97316)'; // Fogo
      atualizarNarrativa('Leo atravessa as Chamas Eternas!');
      break;
    case 7:
    case 8:
      body.style.background = 'linear-gradient(to right, #1e3a8a, #a78bfa)'; // Céu
      atualizarNarrativa('Leo voa entre nuvens encantadas!');
      break;
    default:
      body.style.background = 'linear-gradient(to right, #1e293b, #64748b)'; // Mistério
      atualizarNarrativa('Leo entra em um reino desconhecido...');
      break;
  }
}

function verificarJogada() {
  for (let i = 0; i < jogador.length; i++) {
    if (jogador[i] !== sequencia[i]) {
      atualizarNarrativa('Leo tropeçou, mas vai tentar de novo!');
      alert('Você errou! Tente novamente.');
      iniciarJogo();
      return;
    }
  }

  if (jogador.length === sequencia.length) {
    fase++;
    medalhas++;
    faseTexto.textContent = 'Fase: ' + fase;
    medalhasTexto.textContent = 'Medalhas: ' + medalhas;
    aplicarTema(fase);
    jogador = [];
    gerarSequencia();
    setTimeout(mostrarSequencia, 1000);
  }
}

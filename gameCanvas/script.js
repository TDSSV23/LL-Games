document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  restartButton.addEventListener('click', restartGame);
  startButton.addEventListener('click', startGame);
});

// Seleciona o canvas, contexto e botões
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const levelDisplay = document.getElementById('level');

// Ajusta o canvas para ocupar a tela inteira
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Propriedades do jogador
let player = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
  dy: 0,
  image: new Image(),
  lives: 15
};
player.image.src = './img/jogador.png';

// Configuração do cenário e imagens
const background = new Image();
background.src = './img/cenario1.png';
const enemyImage = new Image();
enemyImage.src = './img/inimigo.png';
const playerProjectileImage = new Image();
playerProjectileImage.src = './img/projetil_jogador.png';
const enemyProjectileImage = new Image();
enemyProjectileImage.src = './img/projetil_inimigo.png';
const gameOverImage = new Image();
gameOverImage.src = './img/game_over.png';

// Imagens dos chefes e cenários
const bossImages = [new Image(), new Image(), new Image()];
bossImages[0].src = './img/boss1.png';
bossImages[1].src = './img/boss2.png';
bossImages[2].src = './img/boss3.png';
const backgrounds = [new Image(), new Image(), new Image()];
backgrounds[0].src = './img/cenario1.png';
backgrounds[1].src = './img/cenario2.png';
backgrounds[2].src = './img/cenario3.png';

// Estado do jogo
let gameOver = false;
let score = 0;
let currentLevel = 1;
let currentWave = 0;
const maxLevels = 15;
let bossActive = false;
let enemies = [];
let playerProjectiles = [];
let enemyProjectiles = [];

// Atualiza a exibição do nível
function updateLevelDisplay() {
  levelDisplay.textContent = `Nível: ${currentLevel}`;
}

// Funções de desenho
function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(enemy.image || enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

function drawProjectiles() {
  playerProjectiles.forEach(proj => {
    ctx.drawImage(playerProjectileImage, proj.x, proj.y, proj.width, proj.height);
  });
  enemyProjectiles.forEach(proj => {
    ctx.drawImage(enemyProjectileImage, proj.x, proj.y, proj.width, proj.height);
  });
}

function drawGameOver() {
  ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
  restartButton.style.display = 'block';
}

// Controle de entrada do jogador
function handleKeyDown(e) {
  if (gameOver) return;
  switch (e.key) {
    case 'ArrowUp':
      player.dy = -player.speed;
      break;
    case 'ArrowDown':
      player.dy = player.speed;
      break;
    case 'ArrowLeft':
      player.dx = -player.speed;
      break;
    case 'ArrowRight':
      player.dx = player.speed;
      break;
    case ' ':
      shootPlayerProjectile();
      break;
  }
}

function handleKeyUp(e) {
  if (gameOver) return;
  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      player.dy = 0;
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      player.dx = 0;
      break;
  }
}

// Função para atirar projéteis do jogador
function shootPlayerProjectile() {
  const projectile = {
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 10,
    speed: 7
  };
  playerProjectiles.push(projectile);
}

// Função para criar inimigos
function createEnemies() {
  for (let i = 0; i < 2; i++) {
    const enemy = {
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height / 2),
      width: 50,
      height: 50,
      speed: 2,
      image: enemyImage
    };
    enemies.push(enemy);
  }
}

// Função para checar colisões entre projéteis e inimigos, e inimigos e o jogador
function checkCollisions() {
  // Checar colisões de projéteis do jogador com inimigos
  playerProjectiles.forEach((proj, pIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        proj.x < enemy.x + enemy.width &&
        proj.x + proj.width > enemy.x &&
        proj.y < enemy.y + enemy.height &&
        proj.y + proj.height > enemy.y
      ) {
        enemies.splice(eIndex, 1); // Remove o inimigo
        playerProjectiles.splice(pIndex, 1); // Remove o projétil do jogador
        score++; // Aumenta a pontuação
        scoreDisplay.textContent = `Pontos: ${score}`;
        createEnemies(); // Cria novos inimigos
      }
    });
  })};

  // Checar colisões de projéteis dos inimigos com o jogador
  enemyProjectiles.forEach((proj, index) => {
    if (
      proj.x < player.x + player.width &&
      proj.x + proj.width > player.x &&
      proj.y + proj.height > player.y &&
      proj.y < player.y + player.height
    ) {
      player.lives--; // Perde 1 vida
      if (player.lives < 0) player.lives = 0; // Garante que as vidas não fiquem negativas
      livesDisplay.textContent = `Vidas: ${player.lives}`;
      enemyProjectiles.splice(index, 1); // Remove o projétil do inimigo
    }
  });

 // Checar colisões entre o jogador e inimigos
enemies.forEach((enemy, index) => {
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    player.lives -= 2; // Perde 2 vidas ao colidir com um inimigo
    if (player.lives < 0) player.lives = 0; // Garante que as vidas não fiquem negativas
    livesDisplay.textContent = `Vidas: ${player.lives}`;
    enemies.splice(index, 1); // Remove o inimigo
  }
});

// Função para atualizar a lógica do jogo
function updateGame() {
  updatePlayerPosition();
  updatePlayerProjectiles();
  updateEnemyProjectiles();
  checkCollisions();

  // Faz com que os inimigos atirem
  enemies.forEach(enemy => {
    if (Math.random() < 0.05) { // 5% de chance de atirar
      shootEnemyProjectile(enemy);
    }
  });

  // Verifica se o jogador perdeu todas as vidas
  if (player.lives <= 0) {
    gameOver = true;
  }
}

// Funções para atualizar as posições dos elementos
function updatePlayerPosition() {
  player.x += player.dx;
  player.y += player.dy;

  // Limites da tela
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function updatePlayerProjectiles() {
  playerProjectiles.forEach((proj, index) => {
    proj.y -= proj.speed; // Move o projétil do jogador
    if (proj.y < 0) {
      playerProjectiles.splice(index, 1); // Remove projéteis fora da tela
    }
  });
}

function updateEnemyProjectiles() {
  enemyProjectiles.forEach((proj, index) => {
    proj.y += proj.speed; // Move o projétil do inimigo
    if (proj.y > canvas.height) {
      enemyProjectiles.splice(index, 1); // Remove projéteis fora da tela
    }
  });
}

// Função para reiniciar o jogo
function restartGame() {
  gameOver = false;
  player.lives = 15;
  player.x = canvas.width / 2;
  player.y = canvas.height - 150;
  enemies = [];
  playerProjectiles = [];
  enemyProjectiles = [];
  score = 0;
  scoreDisplay.textContent = `Pontos: ${score}`;
  livesDisplay.textContent = `Vidas: ${player.lives}`;
  restartButton.style.display = 'none';
  createEnemies();
  gameLoop();
}

// Função para iniciar o jogo
function startGame() {
  startButton.style.display = 'none';
  createEnemies();
  gameLoop();
}

// Loop do jogo
function gameLoop() {
  if (gameOver) {
    drawGameOver();
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlayer();
  drawEnemies();
  drawProjectiles();
  updateGame();
  requestAnimationFrame(gameLoop);
}

// Adiciona event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  restartButton.addEventListener('click', restartGame);
  startButton.addEventListener('click', startGame);
});
resizeCanvas(); 
// Inicializa o canvas corretamente

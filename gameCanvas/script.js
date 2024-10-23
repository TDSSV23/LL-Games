// Seleciona o canvas, contexto e botões
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

// Ajusta o canvas para ocupar a tela inteira
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Propriedades do jogador
let player = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  width: 100,
  height: 100,
  speed: 5,
  dx: 0,
  dy: 0,
  image: new Image(),
  lives: 15,
  lastHitTime: 0
};
player.image.src = './img/jogador.png';

// Configuração do cenário
const background = new Image();
background.src = './img/cenario.png';

// Propriedades dos inimigos e projéteis
let enemies = [];
let playerProjectiles = [];
let enemyProjectiles = [];
const maxEnemyProjectiles = 5;
const enemyImage = new Image();
enemyImage.src = './img/inimigo.png';
const playerProjectileImage = new Image();
playerProjectileImage.src = './img/projetil_jogador.png';
const enemyProjectileImage = new Image();
enemyProjectileImage.src = './img/projetil_inimigo.png';

// Estado do jogo
let gameOver = false;
let score = 0;
const gameOverImage = new Image();
gameOverImage.src = './img/game_over.png';

// Ajusta o canvas quando a janela for redimensionada
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Função para desenhar o cenário
function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

// Função para desenhar o jogador
function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

// Função para desenhar os inimigos
function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Função para desenhar os projéteis
function drawProjectiles() {
  playerProjectiles.forEach(proj => {
    ctx.drawImage(playerProjectileImage, proj.x, proj.y, proj.width, proj.height);
  });
  enemyProjectiles.forEach(proj => {
    ctx.drawImage(proj.image, proj.x, proj.y, proj.width, proj.height);
  });
}

// Função para capturar as teclas de movimento
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

// Função para parar o movimento quando as teclas são soltas
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
    x: player.x + player.width / 2 - 10,
    y: player.y,
    width: 20,
    height: 20,
    speed: 10
  };
  playerProjectiles.push(projectile);
}

// Função para criar inimigos
function createEnemies() {
  for (let i = 0; i < 2; i++) {
    const enemy = {
      x: Math.random() * (canvas.width - 100),
      y: Math.random() * (canvas.height / 2),
      width: 100,
      height: 100,
      speed: 2,
      shootInterval: Math.random() * 1000 + 1000,
      lastShotTime: Date.now()
    };
    enemies.push(enemy);
  }
}

// Função para atirar projéteis dos inimigos
function shootEnemyProjectile(enemy) {
  if (enemyProjectiles.length >= maxEnemyProjectiles) return;

  const projectile = {
    x: enemy.x + enemy.width / 2 - 10,
    y: enemy.y + enemy.height,
    width: 20,
    height: 20,
    speed: 5,
    image: enemyProjectileImage
  };
  enemyProjectiles.push(projectile);
}

// Função para checar colisões
function checkCollisions() {
  const currentTime = Date.now();

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
        score++;
        scoreDisplay.textContent = `Pontos: ${score}`;
        createEnemies(); // Cria dois novos inimigos
        createEnemies(); // Chamada adicional para criar mais dois
      }
    });
  });

  enemyProjectiles.forEach((proj, index) => {
    if (
      proj.x < player.x + player.width &&
      proj.x + proj.width > player.x &&
      proj.y + proj.height > player.y &&
      proj.y < player.y + player.height
    ) {
      player.lives--;
      if (player.lives < 0) player.lives = 0;
      livesDisplay.textContent = `Vidas: ${player.lives}`;
      enemyProjectiles.splice(index, 1);
    }
  });

  enemies.forEach((enemy, index) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      if (currentTime - player.lastHitTime > 1000) { // 1 segundo de intervalo
        player.lives -= 2;
        if (player.lives < 0) player.lives = 0;
        livesDisplay.textContent = `Vidas: ${player.lives}`;
        player.lastHitTime = currentTime; // Atualiza o tempo da última colisão
        enemies.splice(index, 1); // Remove o inimigo ao colidir
        createEnemies(); // Cria dois novos inimigos
        createEnemies(); // Chamada adicional para criar mais dois
      }
    }
  });
}

// Função para atualizar a lógica do jogo
function updateGame() {
  updatePlayerPosition();
  updatePlayerProjectiles();
  updateEnemyProjectiles();

  // Faz com que os inimigos atirem
  enemies.forEach(enemy => {
    if (Date.now() - enemy.lastShotTime > enemy.shootInterval) {
      shootEnemyProjectile(enemy);
      enemy.lastShotTime = Date.now(); // Atualiza o tempo do último tiro
    }
  });

  checkCollisions();

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

// Função para desenhar a tela de Game Over
function drawGameOver() {
  ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
  restartButton.style.display = 'block'; // Mostra o botão de reinício
}

// Função para reiniciar o jogo
function restartGame() {
  gameOver = false;
  player.lives = 15; // Define as vidas para 15
  player.x = canvas.width / 2;
  player.y = canvas.height - 150;
  enemies = [];
  playerProjectiles = [];
  enemyProjectiles = [];
  score = 0;
  scoreDisplay.textContent = `Pontos: ${score}`;
  livesDisplay.textContent = `Vidas: ${player.lives}`;
  restartButton.style.display = 'none'; // Esconde o botão de reinício
  createEnemies(); // Cria os inimigos iniciais
  gameLoop(); // Reinicia o loop do jogo
}

// Função para iniciar o jogo
function startGame() {
  startButton.style.display = 'none'; // Esconde o botão de iniciar
  restartButton.style.display = 'none'; // Esconde o botão de reiniciar se aparecer
  restartGame(); // Inicia o jogo
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
restartButton.addEventListener('click', restartGame); // Reinicia o jogo quando o botão é clicado
startButton.addEventListener('click', startGame); // Inicia o jogo quando o botão é clicado

// Função principal do jogo
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

// Inicializa o jogo
createEnemies(); // Cria inimigos
gameLoop(); // Inicia o loop do jogo

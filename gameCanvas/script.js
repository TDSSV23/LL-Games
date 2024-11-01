// Seleciona o canvas, contexto e botões
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const startButton = document.getElementById("startButton"); // Botão de iniciar
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const levelDisplay = document.getElementById("level");

// Ajusta o canvas para ocupar a tela inteira
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

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
  lives: 15, // Inicia com 15 vidas
};
player.image.src = "./img/jogador.png"; // Substitua pelo caminho da imagem do jogador

// Configuração do cenário
const background = new Image();
background.src = "./img/cenario1.png"; // Substitua pelo caminho da imagem do cenário

// Propriedades dos inimigos e projéteis
let enemies = [];
let bosses = [];
let playerProjectiles = [];
let enemyProjectiles = [];
let bossProjectiles = [];
const enemyImage = new Image();
enemyImage.src = "./img/inimigo.png";
const playerProjectileImage = new Image();
playerProjectileImage.src = "./img/projetil_jogador.png";
const enemyProjectileImage = new Image();
enemyProjectileImage.src = "./img/projetil_inimigo.png";
const bossProjectileImage = new Image();
bossProjectileImage.src = "./img/projetil_inimigo.png";

// Estado do jogo
let gameOver = false;
let score = 0;
let level = 1;
let boss1 = false;
let boss2 = false;
let boss3 = false;
let boss4 = false;
const scoreLevel1 = 10;
const scoreLevel2 = 20;
const scoreLevel3 = 30;
const scoreLevel4 = 40;
const bossLife1 = 3;
const bossLife2 = 3;
const bossLife3 = 3;
const bossLife4 = 3;

const gameOverImage = new Image();
gameOverImage.src = "./img/game_over.png";

// Ajusta o canvas quando a janela for redimensionada
window.addEventListener("resize", resizeCanvas);
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
  enemies.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Função para desenhar os chefões
function drawBoss() {
  bosses.forEach((boss) => {
    ctx.drawImage(boss.image, boss.x, boss.y, boss.width, boss.height);
  });
}

// Função para desenhar os projéteis
function drawProjectiles() {
  playerProjectiles.forEach((proj) => {
    ctx.drawImage(
      playerProjectileImage,
      proj.x,
      proj.y,
      proj.width,
      proj.height
    );
  });
  enemyProjectiles.forEach((proj) => {
    ctx.drawImage(proj.image, proj.x, proj.y, proj.width, proj.height);
  });
  bossProjectiles.forEach((proj) => {
    ctx.drawImage(proj.image, proj.x, proj.y, proj.width, proj.height);
  });
}

// Função para capturar as teclas de movimento
function handleKeyDown(e) {
  if (gameOver) {
    player.dy = 0;
    player.dx = 0;
    return;
  }
  switch (e.key) {
    case "ArrowUp":
      player.dy = -player.speed;
      break;
    case "ArrowDown":
      player.dy = player.speed;
      break;
    case "ArrowLeft":
      player.dx = -player.speed;
      break;
    case "ArrowRight":
      player.dx = player.speed;
      break;
    case " ":
      shootPlayerProjectile();
      break;
  }
}

// Função para parar o movimento quando as teclas são soltas
function handleKeyUp(e) {
  if (gameOver) return;
  switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
      player.dy = 0;
      break;
    case "ArrowLeft":
    case "ArrowRight":
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
    speed: 7,
  };
  playerProjectiles.push(projectile);
}

// Função para criar inimigos
function createEnemies() {
  for (let i = 0; i < 2; i++) {
    // Adiciona dois inimigos de cada vez
    const enemy = {
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height / 2),
      width: 50,
      height: 50,
      speed: 2,
      shootInterval: Math.random() * 1000 + 500, // Intervalo aleatório para atirar
      lastShotTime: Date.now(), // Adiciona a última vez que o inimigo atirou
    };
    enemies.push(enemy);
  }
}

// Função para atirar projéteis dos inimigos
function shootEnemyProjectile(enemy) {
  const projectile = {
    x: enemy.x + enemy.width / 2 - 25,
    y: enemy.y + enemy.height,
    width: 50,
    height: 10,
    speed: 2,
    image: enemyProjectileImage,
  };
  enemyProjectiles.push(projectile);
}

function createBosses() {
  // Propriedades do chefão
  const boss = {
    x: canvas.width / 1.7,
    y: canvas.height / 9,
    width: 200,
    height: 200,
    speed: 5,
    dx: 0,
    dy: 0,
    image: new Image(),
    lives: 0,
    speed: 2,
    shootInterval: Math.random() * 1000 + 500, // Intervalo aleatório para atirar
    lastShotTime: Date.now(), // Adiciona a última vez que o inimigo atirou
  };
  switch (level) {
    case 1:
      boss.image.src = "./img/boss1.png";
      boss.lives = bossLife1;
      break;
    case 2:
      boss.image.src = "./img/boss2.png";
      boss.lives = bossLife2;
      break;
    case 3:
      boss.image.src = "./img/boss3.png";
      boss.lives = bossLife3;
      break;
    case 4:
      boss.image.src = "./img/boss4.png";
      boss.lives = bossLife4;
      break;
  }
  if (bosses.length == 0) {
    bosses.push(boss);
    enemies = [];
  }
}

// Função para atirar projéteis dos chefões
function shootBossProjectile(boss) {
  const projectile = {
    x: boss.x + boss.width / 2 - 25,
    y: boss.y + boss.height,
    width: 50,
    height: 10,
    speed: 5,
    image: bossProjectileImage
  };
  bossProjectiles.push(projectile);
}

// Função para checar colisões
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

        createEnemies(); // Adiciona dois novos inimigos
        createEnemies(); // Chamada adicional para criar mais dois
      }
    });
  });

  // Checar colisões de projéteis dos inimigos com o jogador
  enemyProjectiles.forEach((proj, index) => {
    if (
      proj.x < player.x + player.width &&
      proj.x + proj.width > player.x &&
      proj.y + proj.height > player.y &&
      proj.y < player.y + player.height
    ) {
      player.lives--; // Perde 1 vida
      livesDisplay.textContent = `Vidas: ${player.lives}`;
      enemyProjectiles.splice(index, 1); // Remove o projétil do inimigo
    }
  });

  // Checar colisões de projéteis dos inimigos com o jogador
  bossProjectiles.forEach((proj, index) => {
    if (
      proj.x < player.x + player.width &&
      proj.x + proj.width > player.x &&
      proj.y + proj.height > player.y &&
      proj.y < player.y + player.height
    ) {
      player.lives--; // Perde 1 vida
      livesDisplay.textContent = `Vidas: ${player.lives}`;
      bossProjectiles.splice(index, 1); // Remove o projétil do inimigo
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
      livesDisplay.textContent = `Vidas: ${player.lives}`;
      enemies.splice(index, 1); // Remove o inimigo
      createEnemies(); // Adiciona dois novos inimigos
      createEnemies(); // Chamada adicional para criar mais dois
    }
  });

  // Checar colisões entre o projetil do jogador e o boss
  playerProjectiles.forEach((proj, pIndex) => {
    bosses.forEach((boss, eIndex) => {
      if (
        proj.x < boss.x + boss.width &&
        proj.x + proj.width > boss.x &&
        proj.y < boss.y + boss.height &&
        proj.y + proj.height > boss.y
      ) {
        boss.lives--;
        if (boss.lives <= 0) bosses.splice(eIndex, 1); // Remove o inimigo
        playerProjectiles.splice(pIndex, 1); // Remove o projétil do jogador
        score++; // Aumenta a pontuação
        scoreDisplay.textContent = `Pontos: ${score}`;
      }
    });
  });
}

// Função para atualizar a lógica do jogo
function updateGame() {
  updatePlayerPosition();
  updatePlayerProjectiles();
  updateEnemyProjectiles();
  updateBossProjectiles();

  // Faz com que os inimigos atirem
  enemies.forEach((enemy) => {
    if (Date.now() - enemy.lastShotTime > enemy.shootInterval) {
      shootEnemyProjectile(enemy);
      enemy.lastShotTime = Date.now(); // Atualiza o tempo do último tiro
    }
  });
  // Faz com que os inimigos atirem
  bosses.forEach((boss) => {
    if (Date.now() - boss.lastShotTime > boss.shootInterval) {
      shootBossProjectile(boss);
      boss.lastShotTime = Date.now(); // Atualiza o tempo do último tiro
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
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height)
    player.y = canvas.height - player.height;
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

function updateBossProjectiles() {
  bossProjectiles.forEach((proj, index) => {
    proj.y += proj.speed; // Move o projétil do boss
    if (proj.y > canvas.height) {
      bossProjectiles.splice(index, 1); // Remove projéteis fora da tela
    }
  });
}
// Função para desenhar a tela de Game Over
function drawGameOver() {
  ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
  restartButton.style.display = "block"; // Mostra o botão de reinício
  restartButton.style.top = "60px"; // Centraliza o botão de reinício (ajuste o valor conforme necessário)
}

// Função para reiniciar o jogo
function restartGame() {
  gameOver = false;
  player.lives = 15; // Define as vidas para 15
  player.x = canvas.width / 2;
  player.y = canvas.height - 150;
  enemies = [];
  bosses = [];
  playerProjectiles = [];
  enemyProjectiles = [];
  bossProjectiles = [];
  score = 0;
  level = 1;
  scoreDisplay.textContent = `Pontos: ${score}`;
  livesDisplay.textContent = `Vidas: ${player.lives}`;
  levelDisplay.textContent = `Nível: ${level}`;
  restartButton.style.display = "none"; // Esconde o botão de reinício
  createEnemies(); // Cria os inimigos iniciais
  gameLoop(); // Reinicia o loop do jogo
}

// Função para iniciar o jogo
function startGame() {
  startButton.style.display = "none"; // Esconde o botão de iniciar
  restartButton.style.display = "none"; // Esconde o botão de reinício se aparecer
  restartGame(); // Inicia o jogo
}

// Função para subir o Nível ou fase do jogo
function upLevelGame() {
  level++;
  levelDisplay.textContent = `Nível: ${level}`;
  if (level == 2) {
    background.src = "./img/cenario2.png"; // Substitua pelo caminho da imagem do cenário
  }
  if (level == 3) {
    background.src = "./img/cenario3.png"; // Substitua pelo caminho da imagem do cenário
  }
  if (level == 4) {
    background.src = "./img/cenario4.png"; // Substitua pelo caminho da imagem do cenário
  }
  if (level == 5) {
    background.src = "./img/cenario2.png"; // Substitua pelo caminho da imagem do cenário
  }
  createEnemies();
}

// Event listeners
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
restartButton.addEventListener("click", restartGame); // Reinicia o jogo quando o botão é clicado
startButton.addEventListener("click", startGame); // Inicia o jogo quando o botão é clicado

// Função principal do jogo
function gameLoop() {
  if (gameOver) {
    drawGameOver();
    return;
  }
  if (level == 1) {
    if (score == scoreLevel1 - bossLife1) {
      if (!boss1) {
        boss1 = false;
        createBosses();
      }
    }
    if (score == scoreLevel1) {
      upLevelGame();
    }
  }
  if (level == 2) {
    if (score == scoreLevel2 - bossLife2) {
      if (!boss2) {
        boss2 = false;
        createBosses();
      }
    }
    if (score == scoreLevel2) {
      upLevelGame();
    }
  }
  if (level == 3) {
    if (score == scoreLevel3 - bossLife3) {
      if (!boss3) {
        boss3 = false;
        createBosses();
      }
    }
    if (score == scoreLevel3) {
      upLevelGame();
    }
  }
  if (level == 4) {
    if (score == scoreLevel4 - bossLife4) {
      if (!boss4) {
        boss4 = false;
        createBosses();
      }
    }
    if (score == scoreLevel4) {
      gameOver = true;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlayer();
  drawEnemies();
  drawProjectiles();
  drawBoss();
  updateGame();
  requestAnimationFrame(gameLoop);
}

// Inicializa o jogo
createEnemies(); // Cria inimigos
gameLoop(); // Inicia o loop do jogo

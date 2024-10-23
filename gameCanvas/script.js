import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

public class JogoDeNave extends JPanel implements KeyListener {

    private int naveX = 250;
    private int naveY = 400;
    private int tiroX = 0;
    private int tiroY = 0;
    private boolean tiroAtirado = false;
    private int pontos = 0;
    private int vidas = 3;
    private ArrayList<Inimigo> inimigos;
    private ArrayList<Tiro> tiros;

<<<<<<< HEAD
// Configuração do cenário
const background = new Image();
background.src = './img/cenario.png'; // Substitua pelo caminho da imagem do cenário

// Propriedades dos inimigos e projéteis
let enemies = [];
let playerProjectiles = [];
let enemyProjectiles = [];
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
    // Adiciona dois inimigos de cada vez
    const enemy = {
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height / 2),
      width: 50,
      height: 50,
      speed: 2,
      shootInterval: Math.random() * 1000 + 500 // Intervalo aleatório para atirar
    };
    enemies.push(enemy);
  }
}

// Função para atirar projéteis dos inimigos
function shootEnemyProjectile(enemy) {
  const projectile = {
  x: enemy.x + enemy.width / 2 - 5,
  y: enemy.y + enemy.height,
  width: 10,
  height: 10,
  speed: 3,
  image: enemyProjectileImage
  };
  enemyProjectiles.push(projectile);
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
  scoreDisplay.textContent = Pontos: ${score};
  // Adiciona dois novos inimigos
  createEnemies();
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
  livesDisplay.textContent = Vidas: ${player.lives};
  enemyProjectiles.splice(index, 1); // Remove o projétil do inimigo
  }
  });
  
  // Checar colisões entre o jogador e inimigos
  enemies.forEach(enemy => {
  if (
  player.x < enemy.x + enemy.width &&
  player.x + player.width > enemy.x &&
  player.y < enemy.y + enemy.height &&
  player.y + player.height > enemy.y
  ) {
  player.lives -= 2; // Perde 2 vidas ao colidir com um inimigo
  livesDisplay.textContent = Vidas: ${player.lives};
  }
  });
  }
  
  // Função para atualizar a lógica do jogo
  function updateGame() {
  // Atualização do jogador
  updatePlayerPosition();
  updatePlayerProjectiles();
  updateEnemyProjectiles();
  
  // Faz com que os inimigos atirem
  enemies.forEach(enemy => {
  if (Math.random() < 0.05) { // 5% de chance de atirar
  shootEnemyProjectile(enemy);
  }
  });
  
  // Checa colisões
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
player.lives = 3;
player.x = canvas.width / 2;
player.y = canvas.height - 100;
enemies = [];
playerProjectiles = [];
enemyProjectiles = [];
score = 0;
scoreDisplay.textContent = Pontos: ${score};
livesDisplay.textContent = Vidas: ${player.lives};
restartButton.style.display = 'none'; // Esconde o botão de reinício
createEnemies(); // Cria os inimigos iniciais
gameLoop(); // Reinicia o loop do jogo
}
=======
    public JogoDeNave() {
        setBackground(Color.BLACK);
        setFocusable(true);
        addKeyListener(this);
        inimigos = new ArrayList<>();
        tiros = new ArrayList<>();
        Timer timer = new Timer(10, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                atualizarJogo();
                repaint();
            }
        });
        timer.start();
    }

    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setColor(Color.WHITE);
        g.fillRect(naveX, naveY, 50, 50);
        for (Tiro tiro : tiros) {
            g.setColor(Color.YELLOW);
            g.fillRect(tiro.x, tiro.y, 10, 20);
        }
        for (Inimigo inimigo : inimigos) {
            g.setColor(Color.RED);
            g.fillRect(inimigo.x, inimigo.y, 50, 50);
        }
        g.setColor(Color.WHITE);
        g.drawString("Pontos: " + pontos, 10, 20);
        g.drawString("Vidas: " + vidas, 10, 40);
    }

    public void atualizarJogo() {
        for (Tiro tiro : tiros) {
            tiro.y -= 5;
            if (tiro.y < 0) {
                tiros.remove(tiro);
            }
        }
        for (Inimigo inimigo : inimigos) {
            inimigo.y += 2;
            if (inimigo.y > getHeight()) {
                inimigos.remove(inimigo);
                vidas--;
            }
            for (Tiro tiro : tiros) {
                if (tiro.x < inimigo.x + 50 && tiro.x + 10 > inimigo.x && tiro.y < inimigo.y + 50 && tiro.y + 20 > inimigo.y) {
                    pontos++;
                    inimigos.remove(inimigo);
                    tiros.remove(tiro);
                }
            }
        }
        if (vidas <= 0) {
            JOptionPane.showMessageDialog(null, "Game Over!");
            System.exit(0);
        }
        if (Math.random() < 0.1) {
            inimigos.add(new Inimigo((int) (Math.random() * (getWidth() - 50))));
        }
    }

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_LEFT) {
            naveX -= 10;
        } else if (e.getKeyCode() == KeyEvent.VK_RIGHT) {
            naveX += 10;
        } else if (e.getKeyCode() == KeyEvent.VK_SPACE && !tiroAtirado) {
            tiroX = naveX + 25;
            tiroY = naveY;
            tiros.add(new Tiro(tiroX, tiroY));
            tiroAtirado = false;
        }
    }

    public void keyReleased(KeyEvent e) {}

    public void keyTyped(KeyEvent e) {}
>>>>>>> f5dccce78b1a915bc2f448671f82de0a8d2f4590

    private class Inimigo {
        int x, y;

<<<<<<< HEAD
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

// Atualizar posições e lógica do jogo
updateGame();
requestAnimationFrame(gameLoop);
}

// Inicializa o jogo
createEnemies(); // Cria inimigos
gameLoop(); // Inicia o loop do jogo
=======
        public Inimigo(int x) {
            this.x = x;
            this.y = 0;
        }
    }

    private class Tiro {
        int x, y;

        public Tiro(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Jogo de Nave");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new JogoDeNave());
        frame.setSize(500, 500);
        frame.setVisible(true);
    }
}
>>>>>>> f5dccce78b1a915bc2f448671f82de0a8d2f4590

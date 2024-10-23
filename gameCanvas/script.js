let vidas = 15;
let inimigos = [];
let jogoIniciado = false;
let jogoAcabou = false;
let botaoReiniciar, botaoIniciar;

// Função para iniciar o jogo
function iniciarJogo() {
  vidas = 15;
  inimigos = [];
  for (let i = 0; i < 5; i++) {
    inimigos.push(criarInimigo());
  }
  jogoIniciado = true;
  jogoAcabou = false;
  removerBotoes();
}

function reiniciarJogo() {
  iniciarJogo();
}

// Função para remover botões ao iniciar o jogo
function removerBotoes() {
  if (botaoIniciar) botaoIniciar.remove();
  if (botaoReiniciar) botaoReiniciar.remove();
}

// Configuração inicial do jogo
function setup() {
  createCanvas(600, 400);

  // Botão de iniciar
  botaoIniciar = createButton('Iniciar Jogo');
  botaoIniciar.position(width / 2 - 50, height / 2);
  botaoIniciar.mousePressed(iniciarJogo);
  
  // Configurando reiniciar, mas ainda não visível
  botaoReiniciar = createButton('Reiniciar Jogo');
  botaoReiniciar.position(width / 2 - 50, height / 2);
  botaoReiniciar.mousePressed(reiniciarJogo);
  botaoReiniciar.hide();
}

// Função principal de desenho
function draw() {
  background(200);
  
  // Mostra as vidas do jogador
  fill(0);
  textSize(24);
  text("Vidas: " + vidas, 20, 30);

  if (!jogoIniciado) {
    text("Pressione 'Iniciar Jogo' para começar", width / 2 - 150, height / 2 - 50);
    return;
  }
  
  // Verifica se o jogo acabou
  if (vidas <= 0) {
    jogoAcabou = true;
    textSize(32);
    text("Game Over", width / 2 - 80, height / 2 - 80);
    botaoReiniciar.show();
    return;
  }

  // Atualiza e mostra os inimigos
  for (let i = inimigos.length - 1; i >= 0; i--) {
    let inimigo = inimigos[i];
    inimigo.mover();
    inimigo.mostrar();

    // Verifica colisão com o jogador
    if (colidiuComJogador(inimigo)) {
      vidas -= 2;
      inimigos.splice(i, 1); // Remove inimigo
      adicionarInimigos(2);   // Adiciona mais 2 inimigos
    }
  }
}

// Função para criar novos inimigos
function criarInimigo() {
  return {
    x: random(width),
    y: random(height),
    tamanho: 20,
    mover: function() {
      this.y += random(1, 3);
      if (this.y > height) this.y = 0;
    },
    mostrar: function() {
      fill(255, 0, 0);
      ellipse(this.x, this.y, this.tamanho);
    }
  };
}

// Função para adicionar novos inimigos
function adicionarInimigos(quantidade) {
  for (let i = 0; i < quantidade; i++) {
    inimigos.push(criarInimigo());
  }
}

// Função para verificar colisão com o jogador
function colidiuComJogador(inimigo) {
  let distancia = dist(inimigo.x, inimigo.y, mouseX, mouseY);
  return distancia < inimigo.tamanho / 2 + 20;  // Supondo que o jogador seja controlado pelo mouse
}

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

    private class Inimigo {
        int x, y;

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
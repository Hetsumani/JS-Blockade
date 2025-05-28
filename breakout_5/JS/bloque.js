export class Bloque {
    constructor(spriteSheet, col, fil, x, y, ancho, alto, escala, vida = 1) {
        this.vida = vida; // Vida del bloque, por defecto 1
        this.spriteSheet = spriteSheet;
        this.col = col;
        this.fil = fil;
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.vivo = true;
        this.escala = escala;
    }

    dibujar(ctx) {
        ctx.drawImage(
            this.spriteSheet,
            this.col * this.ancho,
            this.fil * this.alto,
            this.ancho,
            this.alto,
            this.x,
            this.y,
            this.ancho * this.escala,
            this.alto * this.escala
        );
    }

    bloqueGolpeado() {
        this.vida -= 1; // Reducir la vida del bloque
        if (this.vida <= 0) {
            this.vivo = false; // Marcar el bloque como no vivo si la vida es 0 o menos
        }
    }
}
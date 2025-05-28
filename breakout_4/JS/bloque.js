export class Bloque {
    constructor(spriteSheet, col, fil, x, y, ancho, alto, escala) {
        this.spriteSheet = spriteSheet;
        this.col = col;
        this.fil = fil;
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.visible = true;
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
}
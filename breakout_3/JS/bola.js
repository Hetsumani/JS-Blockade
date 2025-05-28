export class Bola {
    constructor(spriteSheet, col, fil, x, y, ancho, alto, escala, velocidad) {
        this.spriteSheet = spriteSheet;
        this.col = col;
        this.fil = fil;
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.visible = true;
        this.escala = escala;
        // Agregamos las dimensiones del canvas
        this.canvasWidth = 700; // Ancho del canvas
        this.canvasHeight = 1000; // Alto del canvas

        // Inicializamos el ángulo y la velocidad de la bola
        // El ángulo se elige aleatoriamente entre -20 y -160 grados
        const min = -160 * Math.PI / 180;   // -8π/9
        const max = -20 * Math.PI / 180;   // -π/9
        this.angulo = min + Math.random() * (max - min);

        this.velocidad = velocidad; // Velocidad de la bola en píxeles por segundo
        this.vx = Math.cos(this.angulo) * this.velocidad; // Componente x de la velocidad
        this.vy = Math.sin(this.angulo) * this.velocidad; // Componente y de la velocidad 
        
        console.log(this.vx, this.vy);
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

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Colisiones con los bordes
        if (this.x < 0 || this.x + this.ancho * this.escala > this.canvasWidth) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y + this.alto * this.escala > this.canvasHeight) {
            this.vy *= -1;
        }
    }
}
export class Jugador {
    constructor(spriteSheet, recorteX, recorteY, recorteAncho, recorteAlto,
        colocarX, colocarY, colocarAncho, colocarAlto, velocidad) {
        this.spriteSheet = spriteSheet;
        this.recorteX = recorteX;
        this.recorteY = recorteY;
        this.recorteAncho = recorteAncho;
        this.recorteAlto = recorteAlto;
        this.colocarX = colocarX;
        this.colocarY = colocarY;
        this.colocarAncho = colocarAncho;
        this.colocarAlto = colocarAlto;
        this.escala = 2;
        this.velocidad = velocidad;
        this.direccion = 0; // -1 para izquierda, 1 para derecha       

        // Calcular el tamaño escalado
        this.escalarX = this.colocarAncho * this.escala;
        this.escalarY = this.colocarAlto * this.escala;
    };

    update(dt) {
        // Aquí puedes agregar lógica para actualizar el jugador
        // Por ejemplo, cambiar la posición, animaciones, etc.
        this.colocarX += this.direccion * this.velocidad * dt;
        // Limitar el movimiento del jugador dentro de los límites del canvas
        this.colocarX = Math.max(0, Math.min(this.colocarX, 700 - this.escalarX));
    }

    dibujar(ctx) {
        ctx.drawImage(
            this.spriteSheet,
            this.recorteX,
            this.recorteY,
            this.recorteAncho,
            this.recorteAlto,
            this.colocarX,
            this.colocarY,
            this.escalarX,
            this.escalarY
        );
    }
    mover(direccion) {
        this.direccion = direccion;
    }
}
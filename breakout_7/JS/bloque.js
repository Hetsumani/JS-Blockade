/**
 * Clase Bloque
 * Representa un bloque destructible en el juego, con “vidas” y una apariencia
 * distinta según la vida que le queda. El sprite cambia dependiendo de la vida.
 */
export class Bloque {

    /**
     * Tabla estática: mapea cantidad de vidas → coordenadas en el spritesheet.
     * Cada entrada indica en qué columna y fila (col, fil) se encuentra la
     * apariencia correspondiente en la hoja de sprites.
     * (Puedes ampliar la tabla si tienes más estados de vida/diseños).
     */
    static tablaBloques = {
        5: { col: 4, fil: 2 },  // Vida 5 → columna 4, fila 2
        4: { col: 4, fil: 0 },  // Vida 4 → columna 4, fila 0
        3: { col: 0, fil: 0 },  // Vida 3 → columna 0, fila 0
        2: { col: 0, fil: 2 },  // Vida 2 → columna 0, fila 2
        1: { col: 2, fil: 1 }   // Vida 1 → columna 2, fila 1
    };

    /**
     * Constructor de la clase Bloque.
     * @param {Image} spriteSheet  - Imagen con todos los sprites de bloques.
     * @param {number} x          - Posición X en el canvas.
     * @param {number} y          - Posición Y en el canvas.
     * @param {number} ancho      - Ancho (en píxeles) del bloque base.
     * @param {number} alto       - Alto (en píxeles) del bloque base.
     * @param {number} escala     - Factor de escala para dibujar el bloque.
     * @param {number} vida       - Cantidad inicial de vidas (por defecto 1).
     */
    constructor(spriteSheet, x, y, ancho, alto, escala, vida = 1) {
        this.vida = vida;             // Vidas restantes del bloque
        this.spriteSheet = spriteSheet; // Spritesheet de referencia
        this.x = x;                   // Posición X en el canvas
        this.y = y;                   // Posición Y en el canvas
        this.ancho = ancho;           // Ancho original (no escalado)
        this.alto = alto;             // Alto original (no escalado)
        this.escala = escala;         // Escala visual al dibujar
        this.vivo = true;             // ¿Sigue activo en el juego?
    }

    /**
     * Dibuja el bloque en el canvas según su vida actual.
     * Si el bloque ya no está vivo, simplemente no se dibuja.
     * Elige la apariencia correcta desde el spritesheet usando la tabla.
     * @param {CanvasRenderingContext2D} ctx - Contexto de dibujo del canvas.
     */
    dibujar(ctx) {
        // Si el bloque ya está destruido (vida <= 0), no lo dibujes
        if (!this.vivo && this.vida <= 0) return;

        // Busca la apariencia correspondiente en la tabla
        const apariencia = Bloque.tablaBloques[this.vida];
        if (!apariencia) return; // Si no hay apariencia para esa vida, no dibuja nada

        const { col, fil } = apariencia;

        // Dibuja el sprite recortado de la hoja de sprites en la posición y escala correctas
        ctx.drawImage(
            this.spriteSheet,
            col * this.ancho,          // X en la hoja de sprites
            fil * this.alto,           // Y en la hoja de sprites
            this.ancho,                // Ancho del recorte
            this.alto,                 // Alto del recorte
            this.x,                    // X en el canvas
            this.y,                    // Y en el canvas
            this.ancho * this.escala,  // Ancho en el canvas (escalado)
            this.alto * this.escala    // Alto en el canvas (escalado)
        );
    }

    /**
     * Gestiona el golpe al bloque (por ejemplo, cuando la bola lo toca).
     * Disminuye la vida y, si llega a 0 o menos, lo marca como “muerto”.
     * Puedes añadir aquí efectos, sonido, partículas, etc.
     */
    bloqueGolpeado() {
        this.vida -= 1;       // Quita una vida al bloque
        if (this.vida <= 0) {
            this.vivo = false; // El bloque deja de existir en el juego
        }
    }
}

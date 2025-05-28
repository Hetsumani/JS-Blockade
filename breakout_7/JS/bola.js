import { gameEvents } from "./StateMachine/eventBus.js";

export class Bola {
    constructor(spriteSheet, col, fil, x, y, ancho, alto, escala, velocidad, vidas = 3) {
        this.spriteSheet = spriteSheet;
        this.col = col;
        this.fil = fil;
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.visible = true;
        this.escala = escala;
        this.vidas = vidas; // Número de vidas de la bola
        this.velocidad = velocidad; // Velocidad de la bola en píxeles por segundo

        // Agregamos las dimensiones del canvas
        this.canvasWidth = 700; // Ancho del canvas
        this.canvasHeight = 1000; // Alto del canvas

        this.direccionBola(); // Inicializamos la dirección de la bola
    }

    direccionBola() {
        // Inicializamos el ángulo y la velocidad de la bola
        // El ángulo se elige aleatoriamente entre -20 y -160 grados
        const min = -160 * Math.PI / 180;   // -8π/9
        const max = -20 * Math.PI / 180;   // -π/9
        this.angulo = min + Math.random() * (max - min);
        
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


    /**
     * Detecta y resuelve la colisión entre la bola (this) y un bloque rectangular.
     * Devuelve true si hubo choque (la velocidad y la posición ya se ajustaron),
     * o false si no se tocaron.
    */
    colisionBloque(bloque) {

        /*───────────────────────────────────────────────────────────────*
         * 1. PRIMER FILTRO: AABB (Axis-Aligned Bounding Box)           *
         *    ──────────────────────────────────────────────────────────*
         *    Comprobamos si las cajas de la bola y el bloque NI        *
         *    SIQUIERA se solapan.                                      *
         *    Basta con verificar que exista un “hueco” en algún eje.   *
         *    Si hay hueco → NO colisión → salida temprana.             *
         *───────────────────────────────────────────────────────────────*/
        if (
            // bola completamente a la derecha del bloque
            this.x >= bloque.x + bloque.ancho * bloque.escala ||

            // bola completamente a la izquierda del bloque
            this.x + this.ancho * this.escala <= bloque.x ||

            // bola completamente debajo del bloque
            this.y >= bloque.y + bloque.alto * bloque.escala ||

            // bola completamente encima del bloque
            this.y + this.alto * this.escala <= bloque.y
        ) {
            return false;              // cajas separadas → fin
        }

        /*───────────────────────────────────────────────────────────────*
         * 2. CÁLCULO DE SOLAPES PARA DETERMINAR LA CARA IMPACTADA      *
         *    ──────────────────────────────────────────────────────────*
         *    Estrategia:                                               *
         *      a) medimos la distancia entre CENTROS en X (dx) y en Y  *
         *      b) calculamos cuánto se solapan en cada eje:            *
         *         overlapX = “cuánto se metió” en horizontal           *
         *         overlapY = “cuánto se metió” en vertical             *
         *      c) el eje con MENOR solape es la cara golpeada.         *
         *───────────────────────────────────────────────────────────────*/

        /* a) Centros de bola y bloque */
        const cxBola = this.x + (this.ancho * this.escala) / 2;
        const cyBola = this.y + (this.alto * this.escala) / 2;
        const cxBloque = bloque.x + (bloque.ancho * bloque.escala) / 2;
        const cyBloque = bloque.y + (bloque.alto * bloque.escala) / 2;

        /* Diferencias de centros */
        const dx = cxBola - cxBloque;   // + → bola a la derecha del centro del bloque
        const dy = cyBola - cyBloque;   // + → bola debajo   del centro del bloque

        /* b) “Half sizes” sumados = distancia máxima sin colisión     */
        const halfW = (this.ancho * this.escala) / 2 + (bloque.ancho * bloque.escala) / 2;
        const halfH = (this.alto * this.escala) / 2 + (bloque.alto * bloque.escala) / 2;

        /* Solapes reales = cuánto exceden esos límites */
        const overlapX = halfW - Math.abs(dx);
        const overlapY = halfH - Math.abs(dy);

        /* c) Si el solape lateral es menor → chocó por los costados   */
        if (overlapX < overlapY) {
            /*───────── COLISIÓN LATERAL ─────────*/
            this.vx *= -1;                        // invertir velocidad horizontal

            // Reposición: empujamos la bola justo fuera del bloque
            // (signo de dx indica qué lado: + = derecha, - = izquierda)
            this.x += (dx > 0 ? overlapX : -overlapX);

        } else {
            /*───────── COLISIÓN SUPERIOR / INFERIOR ─────────*/
            this.vy *= -1;                        // invertir velocidad vertical

            // Reposición vertical según el lado de impacto
            this.y += (dy > 0 ? overlapY : -overlapY);
        }

        /* Si llegamos aquí hubo choque y lo resolvimos */
        return true;
    }


    /**
     * Detecta y resuelve la colisión entre la bola (this) y la barra del jugador.
     * Regresa true si hubo choque (la velocidad / posición ya fueron ajustadas),
     * o false si no se tocaron.
    */
    colisionBarra(jugador) {

        /*───────────────────────────────────────────────────────────────*
         * 1.  OBTENEMOS LOS “BOUNDING-BOXES”                           *
         *     (coordenadas y dimensiones reales en pantalla)           *
         *───────────────────────────────────────────────────────────────*/

        // Barra (paddle)
        const padX = jugador.colocarX;     // esquina sup-izq. en X
        const padY = jugador.colocarY;     // esquina sup-izq. en Y
        const padW = jugador.escalarX;     // ancho ya escalado
        const padH = jugador.escalarY;     // alto  ya escalado

        // Bola
        const balW = this.ancho * this.escala;
        const balH = this.alto * this.escala;

        /*───────────────────────────────────────────────────────────────*
         * 2.  AABB “EARLY OUT”                                         *
         *     Si hay un hueco en X o en Y → NO colisión → salimos.     *
         *───────────────────────────────────────────────────────────────*/
        if (this.x >= padX + padW ||           // bola a la derecha
            this.x + balW <= padX ||           // bola a la izquierda
            this.y >= padY + padH ||           // bola debajo
            this.y + balH <= padY) {          // bola encima
            return false;
        }

        /*───────────────────────────────────────────────────────────────*
         * 3.  CALCULAMOS SOLAPES PARA SABER QUÉ CARA GOLPEÓ            *
         *───────────────────────────────────────────────────────────────*/

        /* 3·1  Centros */
        const cxBall = this.x + balW / 2;
        const cyBall = this.y + balH / 2;
        const cxPad = padX + padW / 2;
        const cyPad = padY + padH / 2;

        /* 3·2  Distancias centro-a-centro */
        const dx = cxBall - cxPad;   // + : bola a la derecha del centro de la barra
        const dy = cyBall - cyPad;   // + : bola debajo   del centro de la barra

        /* 3·3  Half-sizes combinados: la “distancia máxima sin colisión” */
        const halfW = balW / 2 + padW / 2;
        const halfH = balH / 2 + padH / 2;

        /* 3·4  Solapes reales (cuánto se han metido uno dentro de otro) */
        const overlapX = halfW - Math.abs(dx);
        const overlapY = halfH - Math.abs(dy);

        /*───────────────────────────────────────────────────────────────*
         * 4.  RESOLVEMOS SEGÚN LA CARA IMPACTADA                       *
         *     • Lateral  → invertir vx   (y también vy, por tu regla). *
         *     • Arriba   → nuevo ángulo dependiente del punto de golpe.*
         *───────────────────────────────────────────────────────────────*/
        const speed = this.velocidad;   // magnitud constante de la bola

        /*—— 4·A  COLISIÓN LATERAL ———————————————————————————————*/
        if (overlapX < overlapY) {

            /* Invertimos ambos ejes (vx y vy) para “rebotar” en diagonal */
            this.vx *= -1;
            this.vy *= -1;

            /* Reubicamos la bola justo fuera de la barra                 *
             *  dx>0 → venía por la derecha; dx<0 → por la izquierda      */
            this.x += (dx > 0 ? overlapX : -overlapX);

            /*—— 4·B  COLISIÓN SUPERIOR / INFERIOR ————————————————*/
        } else {

            /* 4·B·1  Reubicación vertical para evitar pegado */
            this.y += (dy > 0 ? overlapY : -overlapY);

            /* 4·B·2  Ángulo controlado por el punto de impacto           *
             *        rel ∈ [-1,1]  (-1 extremo izq., 0 centro, +1 der.)  */
            const rel = (cxBall - cxPad) / (padW / 2);

            /*   Queremos:                                                *
             *      • centro  → ≈ −90°  (recto hacia arriba-abajo)        *
             *      • borde   → ≈ −25°  o −155° (rasante)                 *
             *   Elegimos ±65° de desviación máxima respecto a −90°.      */
            const maxDesvio = 65 * Math.PI / 180;   // 65° en radianes
            const angulo = -Math.PI / 2 + rel * maxDesvio;

            /* 4·B·3  Recalculamos componentes de velocidad manteniendo   *
             *        la magnitud constante (speed)                       */
            this.vx = Math.cos(angulo) * speed;
            this.vy = Math.sin(angulo) * speed;
        }

        /* Si llegamos aquí hubo colisión y todo quedó resuelto */
        return true;
    }


    /**
     * Actualiza la posición de la bola y la hace rebotar cuando
     * toca los límites del área de juego.
     *
     * @param {number} dt  Δt en SEGUNDOS desde el frame anterior.
     *                     Si usas requestAnimationFrame, normalmente es ≈ 0.016 s.
    */
    update(dt) {

        /*───────────────────────────────────────────────────────────────*
         * 1· DESPLAZAMIENTO PROVISIONAL                                 *
         *    Avanzamos la bola según su velocidad (vx, vy) y el tiempo *
         *    transcurrido.  NO corregimos todavía colisiones; eso lo   *
         *    haremos en los pasos 2 y 3.                               *
         *───────────────────────────────────────────────────────────────*/
        this.x += this.vx * dt;      // Δx = velocidadX * tiempo
        this.y += this.vy * dt;      // Δy = velocidadY * tiempo

        /* Dimensiones reales del sprite ya escaladas */
        const w = this.ancho * this.escala;
        const h = this.alto * this.escala;

        /*───────────────────────────────────────────────────────────────*
         * 2· COLISIÓN CON PAREDES VERTICALES (IZQ / DER)               *
         *───────────────────────────────────────────────────────────────*/

        /* 2A · Izquierda                                                  *
         * Si la X quedó NEGATIVA, la bola salió por la izquierda.         *
         * - La pegamos a 0   (x = 0)                                      *
         * - Forzamos vx POSITIVO (hacia la derecha) con Math.abs(...)     */
        if (this.x < 0) {
            this.x = 0;
            this.vx = Math.abs(this.vx);
        }

        /* 2B · Derecha                                                    *
         * Si la X supera el límite derecho (canvasWidth),                 *
         * - La pegamos al borde interior (canvasWidth - w).               *
         * - Forzamos vx NEGATIVO (hacia la izquierda).                    */
        else if (this.x + w > this.canvasWidth) {
            this.x = this.canvasWidth - w;
            this.vx = -Math.abs(this.vx);
        }

        /*───────────────────────────────────────────────────────────────*
         * 3· COLISIÓN CON PAREDES HORIZONTALES (TECHO / SUELO)          *
         *───────────────────────────────────────────────────────────────*/

        /* 3A · Techo                                                      *
         * Bola salió por arriba → pegamos a y=0 y mandamos vy hacia abajo *
         * (vy POSITIVO).                                                  */
        if (this.y < 0) {
            this.y = 0;
            this.vy = Math.abs(this.vy);
        }

        /* 3B · Suelo / zona de pérdida                                    *
         * Bola cae por debajo del canvasHeight.                           *
         * - La recolocamos dentro.                                        *
         * - Invertimos vy (rebote).                                       *
         *   Si prefieres que aquí se pierda una vida en vez de rebotar,   *
         *   llama a tu función de “vida-perdida” y saca la bola del juego *
         *   (por ejemplo, reiniciando su posición).                       */
        else if (this.y + h > this.canvasHeight) {
            this.y = this.canvasHeight - h;
            this.vy = -Math.abs(this.vy);
            this.perderVida(); //  <-- tu lógica de vidas  
            return false; // Retornamos false para indicar que la bola no se ha actualizado          
        }

        return true; // Retornamos true para indicar que la bola se ha actualizado
    }

    /**
     * Método para perder una vida de la bola.
     * Si la bola pierde todas sus vidas, se marca como no visible.
    */
    perderVida() {
        this.vidas -= 1;
        if (this.vidas <= 0) {
            this.visible = false;
        }
        // 1. Crear el evento personalizado
        const bolaPerdidaEvent = new CustomEvent('bolaPerdida', {
            detail: {
                bola: this, // Puedes pasar datos adicionales si los necesitas
                mensaje: "La bola ha salido por abajo"
            }
        });

        // 2. Despachar el evento a través del event bus
        gameEvents.dispatchEvent(bolaPerdidaEvent);
    }
}
import { BaseState } from "./baseState.js";
import { GameOverState } from "./gameOverState.js";
import { ServirState } from "./servirState.js";
import { drawGrid } from "../drawGrid.js";

export class JugarState extends BaseState {
    constructor(sm, jugador, bola, bloques, spriteSheet, filaColor, nivel = 1) {
        super(sm);
        this.sm = sm; // stateMachine
        this.jugador = jugador;
        this.bola = bola;
        this.bloques = bloques;
        this.spriteSheet = spriteSheet;
        this.filaColor = filaColor;
        this.nivel = nivel;
    }

    enter() {
        this.teclas = [];

        window.addEventListener("keydown", (event) => {
            this.teclas[event.key] = true;
        });
        window.addEventListener("keyup", (event) => {
            this.teclas[event.key] = false;
        });
               
        
    }

    update(dt) {
        if (this.teclas["ArrowLeft"] || this.teclas["a"]) {
            this.jugador.mover(-1);
        } else if (this.teclas["ArrowRight"] || this.teclas["d"]) {
            this.jugador.mover(1);
        } else {
            this.jugador.mover(0);
        }
        this.jugador.update(dt);

        // Actualizar la bola
        this.bola.update(dt);
        this.bola.colisionBarra(this.jugador);

        // Comprobar colisiones con los bloques
        for (let i = this.bloques.length - 1; i >= 0; i--) {
            if (this.bola.colisionBloque(this.bloques[i])) {
                this.bloques[i].bloqueGolpeado();
                if (!this.bloques[i].vivo) {
                    this.bloques.splice(i, 1); // Eliminar el bloque si no está vivo
                }
            }
        }

        if (this.bola.vidas <= 0) {
            console.log("La bola ha perdido todas sus vidas.");
            // Cambiar al estado de Game Over
            this.sm.change(new GameOverState(this.sm));
            return; // Salir del update para evitar más lógica si la bola ha perdido
        }

        // Si no quedan bloques, cambiar al estado servir, para avanzar al siguiente nivel
        if (this.bloques.length === 0) {
            console.log("Todos los bloques han sido destruidos. Cambiando al estado de servir.");

            // Incrementar el nivel
            this.nivel += 1;
            this.sm.change(new ServirState(this.sm, this.nivel, this.filaColor, this.spriteSheet));
        }
    }

    draw(canvas, ctx) {
        drawGrid(canvas, ctx);

        // Dibujar el jugador
        this.jugador.dibujar(ctx);

        // Dibujar la bola
        this.bola.dibujar(ctx);

        // Dibujar los bloques
        for (const bloque of this.bloques) {
            bloque.dibujar(ctx);
        }
    }

}

import { BaseState } from "./baseState.js";
import { GameOverState } from "./gameOverState.js";
import { ServirState } from "./servirState.js";
import { RevivirState } from "./revivirState.js";
import { drawGrid } from "../drawGrid.js";
import { gameEvents } from "./eventBus.js";

export class JugarState extends BaseState {
    constructor(sm, jugador, bola, bloques, spriteSheet, filaColor, nivel = 1, score = 0) {
        super(sm);
        this.sm = sm; // stateMachine
        this.jugador = jugador;
        this.bola = bola;
        this.bloques = bloques;
        this.spriteSheet = spriteSheet;
        this.filaColor = filaColor;
        this.nivel = nivel;

        // Es importante hacer .bind(this) si el handler usa 'this' para referirse a JugarState
        this.handleBolaPerdida = this._handleBolaPerdida.bind(this);

        this.score = score; // Inicializar el score

        console.log(this.bloques.length, "bloques restantes");
    }

    enter() {
        this.teclas = [];

        window.addEventListener("keydown", (event) => {
            this.teclas[event.key] = true;
        });
        window.addEventListener("keyup", (event) => {
            this.teclas[event.key] = false;
        });

        // Escuchar el evento de bola perdida
        gameEvents.addEventListener('bolaPerdida', this.handleBolaPerdida);      
        
    }

    _handleBolaPerdida(event) {
        console.log("JugarState recibió el evento 'bolaPerdida':", event.detail.mensaje);
        console.log(`Vidas restantes: ${this.bola.vidas}`);
        document.getElementById("vidasValue").innerText = this.bola.vidas;
        if (this.bola.vidas <= 0) {
            console.log("La bola ha perdido todas sus vidas.");
            // Cambiar al estado de Game Over
            this.sm.change(new GameOverState(this.sm, this.score));
            return; // Salir del update para evitar más lógica si la bola ha perdido
        } else {
            this.sm.change(new RevivirState(this.sm, this.jugador, this.bola, this.bloques, this.spriteSheet, this.filaColor, this.nivel, this.score));
        }
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
        if (!this.bola.update(dt)) {
            return; // Si la bola no se actualiza correctamente, salir del update
        }
        this.bola.colisionBarra(this.jugador);

        // Comprobar colisiones con los bloques
        for (let i = this.bloques.length - 1; i >= 0; i--) {
            if (this.bola.colisionBloque(this.bloques[i])) {
                this.bloques[i].bloqueGolpeado();
                this.score += 100;
                if (!this.bloques[i].vivo) {
                    this.bloques.splice(i, 1); // Eliminar el bloque si no está vivo
                }
                document.getElementById("scoreValue").innerText = this.score;
            }
        }

        // Si no quedan bloques, cambiar al estado servir, para avanzar al siguiente nivel
        if (this.bloques.length === 0) {
            console.log("Todos los bloques han sido destruidos. Cambiando al estado de servir.");
            // Incrementar el nivel
            this.nivel += 1;
            this.sm.change(new ServirState(this.sm, this.nivel, this.filaColor, this.spriteSheet, this.bola.vidas, this.score));
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
    exit() {
        console.log("Saliendo de JugarState");
        // Desuscribirse del evento para limpiar
        gameEvents.removeEventListener('bolaPerdida', this.handleBolaPerdida);        
    }
}

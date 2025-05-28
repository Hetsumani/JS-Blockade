import { BaseState } from "./baseState.js";
import { JugarState } from "./jugarState.js";
import { drawGrid } from "../drawGrid.js";

export class RevivirState extends BaseState {
    constructor(sm, jugador, bola, bloques, spriteSheet, fila, nivel, score = 0) {
        super(sm);
        this.sm = sm; // stateMachine
        this.jugador = jugador;
        this.bola = bola;
        this.bloques = bloques;
        this.spriteSheet = spriteSheet;
        this.fila = fila;
        this.nivel = nivel;
        this.score = score; // Inicializar el score

        // Colocar la bola en la posición del jugador
        this.bola.x = this.jugador.colocarX + (this.jugador.recorteAncho - this.bola.ancho);
        this.bola.y = this.jugador.colocarY - this.bola.alto*2.1; // Justo encima del jugador

        this.bola.direccionBola();
    }

    enter() {
        console.log("RevivirState: Preparando para revivir al jugador y la bola.");
        document.getElementById("revivirState").style.display = "flex";
    }

    update(dt) {
        // Aquí podrías manejar la lógica de actualización si es necesario
    }

    draw(canvas, ctx) {
        // Aquí podrías dibujar elementos específicos del estado de revivir
        drawGrid(canvas, ctx);
        this.jugador.dibujar(ctx);
        this.bola.dibujar(ctx);
        // Dibujar los bloques
        for (const bloque of this.bloques) {
            bloque.dibujar(ctx);
        }       
    }

    input(e) {
        // Aquí podrías manejar la entrada del teclado
        if (e.key === " ") { // Espacio
            console.log("Espacio presionado, reviviendo al jugador y la bola.");            
            this.sm.change(new JugarState(this.sm, this.jugador, this.bola, this.bloques, this.spriteSheet, this.fila, this.nivel, this.score));
        }
    }

    exit() {
        document.getElementById("revivirState").style.display = "none";
    }
}
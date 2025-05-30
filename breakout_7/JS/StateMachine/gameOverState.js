import { BaseState } from "./baseState.js";
import { drawGrid } from "../drawGrid.js";
import { InicioState } from "./inicioState.js";
import { globalState } from "../StateMachine/globalState.js";

export class GameOverState extends BaseState {
    constructor(sm, score = 0) {
        super(sm);
        this.sm = sm; // stateMachine
        this.score = score; // Inicializar el score        
        
        if (globalState.highScore < this.score) {
            // Si el high score es menor que el score actual, actualizarlo
            this.highScore = this.score; // Actualizar el high score si es mayor
            document.getElementById("highScoreValue").innerText = this.highScore; // Actualizar el elemento del high score
            globalState.highScore = this.highScore; // Guardar el nuevo high score en el estado global            
        } else {
            console.log("GameOverState: No supera el high score actual.");
        }

        // 1. Guardar una referencia al elemento del botón si se va a usar múltiples veces
        //    o si quieres ser consistente con cómo manejas los elementos.
        //    También puedes obtenerlo directamente en enter() si solo se usa ahí.
        this.gameOverElement = document.getElementById("gameOverState");
        this.resetButton = document.getElementById("resetButton"); // Obtenemos el botón aquí
        this.finalScoreElement = document.getElementById("finalScore");
        if (this.finalScoreElement) {
            this.finalScoreElement.innerText = this.score;
        } else {
            console.log("GameOverState: El elemento 'finalScore' no fue encontrado.");
        }

        // 2. Definir el manejador del evento y enlazar 'this'
        //    Guardamos la función enlazada en una propiedad de la instancia.
        this.handleResetButtonClick = this._handleResetButtonClick.bind(this);
    }

    // 3. Crear un método para la lógica del clic
    _handleResetButtonClick() {
        console.log("Botón de reset presionado en GameOverState");
        this.sm.change(new InicioState(this.sm));
    }

    enter() {
        if (this.gameOverElement) {
            this.gameOverElement.style.display = "flex";
        }

        // 4. Añadir el event listener usando la referencia guardada
        if (this.resetButton) {
            this.resetButton.addEventListener("click", this.handleResetButtonClick);
        } else {
            console.warn("GameOverState: El botón 'resetButton' no fue encontrado.");
        }
        console.log("Entrando al estado de Game Over");
    }

    exit() {
        if (this.gameOverElement) {
            this.gameOverElement.style.display = "none";
        }
        // 5. Remover el event listener usando la misma referencia guardada
        if (this.resetButton) {
            this.resetButton.removeEventListener("click", this.handleResetButtonClick);
        }
        console.log("Saliendo del estado de Game Over");
    }

    update(dt) {
        // Aquí podrías manejar la lógica de actualización si es necesario
    }

    draw(canvas, ctx) {
        drawGrid(canvas, ctx);
    }
}
import { BaseState } from "./baseState.js";
import { drawGrid } from "../drawGrid.js";
import { ServirState } from "./servirState.js";

export class SeleccionarBarraState extends BaseState {
    constructor(sm, spriteSheet) {
        super(sm);
        this.sm = sm; // stateMachine
        this.spriteSheet = spriteSheet;

        // Guardar referencias a los elementos del DOM y los handlers
        this.seleccionarBarraElement = document.getElementById("seleccionarBarraState");
        this.botonColor1 = document.getElementById("color1");
        this.botonColor2 = document.getElementById("color2");
        this.botonColor3 = document.getElementById("color3");
        this.botonColor4 = document.getElementById("color4");

        // Definir los handlers usando el método genérico y .bind()
        // .bind(this, colorName, filaColorValue)
        // El primer 'this' asegura el contexto correcto para _handleColorSelection.
        // Los siguientes argumentos se pre-fijan para la llamada.
        this.handleColor1Click = this._handleColorSelection.bind(this, "Color 1", 4);
        this.handleColor2Click = this._handleColorSelection.bind(this, "Color 2", 6);
        this.handleColor3Click = this._handleColorSelection.bind(this, "Color 3", 8);
        this.handleColor4Click = this._handleColorSelection.bind(this, "Color 4", 10);
    }

    enter() {
        if (this.seleccionarBarraElement) {
            this.seleccionarBarraElement.style.display = "flex";
        }

        // Añadir event listeners una sola vez
        if (this.botonColor1) {
            this.botonColor1.addEventListener("click", this.handleColor1Click);
        }
        if (this.botonColor2) {
            this.botonColor2.addEventListener("click", this.handleColor2Click);
        }
        if (this.botonColor3) {
            this.botonColor3.addEventListener("click", this.handleColor3Click);
        }
        if (this.botonColor4) {
            this.botonColor4.addEventListener("click", this.handleColor4Click);
        }
        console.log("Entrando al estado de selección de barra");
    }

    _handleColorSelection(colorName, filaColorValue) {
        console.log(`${colorName} seleccionado`);
        this.filaColor = filaColorValue; // Si necesitas this.filaColor para algo más en este estado
        // Si no, puedes pasar filaColorValue directamente abajo.

        // Asumo que this.spriteSheet se inicializa en algún lugar de esta clase,
        // por ejemplo, en el constructor o en el método enter().
        if (!this.spriteSheet) {
            console.warn("SeleccionarBarraState: this.spriteSheet no está definido al intentar cambiar a ServirState.");
            // Podrías querer cargarla aquí o asegurar que esté cargada antes.
            // Por ahora, procederemos asumiendo que existe.
        }

        // El '1' como segundo argumento es nuevo según tu snippet.
        // Asegúrate de que el constructor de ServirState espere (sm, algunOtroParametro, filaColor, spriteSheet)
        this.sm.change(new ServirState(this.sm, 1, filaColorValue, this.spriteSheet));
    }

    update(dt) {
        // El método update generalmente no se usa para añadir listeners.
        // Aquí puedes actualizar la lógica del juego si es necesario,
        // pero para este estado específico, podría estar vacío si
        // toda la lógica es reactiva a los clics.
    }

    exit() {
        if (this.seleccionarBarraElement) {
            this.seleccionarBarraElement.style.display = "none";
        }

        // Remover event listeners para evitar memory leaks y comportamiento inesperado
        if (this.botonColor1) {
            this.botonColor1.removeEventListener("click", this.handleColor1Click);
        }
        if (this.botonColor2) {
            this.botonColor2.removeEventListener("click", this.handleColor2Click);
        }
        if (this.botonColor3) {
            this.botonColor3.removeEventListener("click", this.handleColor3Click);
        }
        if (this.botonColor4) {
            this.botonColor4.removeEventListener("click", this.handleColor4Click);
        }
        console.log("Saliendo del estado de selección de barra");
    }

    draw(canvas, ctx) {
        drawGrid(canvas, ctx);
    }
}
import { BaseState } from "./baseState.js";
import { SeleccionarBarraState } from "./seleccionarBarraState.js";
import { drawGrid } from "../drawGrid.js";

export class InicioState extends BaseState {
    constructor(sm) {
        super(sm);
        this.sm = sm; // stateMachine

        // Guardar referencias a los elementos del DOM
        this.inicioStateElement = document.getElementById("inicioState");
        this.botonInicio = document.getElementById("startButton");

        // Definir el handler del evento para poder añadirlo y quitarlo.
        // Usamos .bind(this) para asegurar que 'this' dentro de _handleInicioClick
        // se refiera a la instancia de InicioState.
        this.handleInicioClick = this._handleInicioClick.bind(this);
    }

    enter() {
        this.spriteSheet = new Image();
        this.spriteSheet.src = "./assets/sprites/blocks.png";

        this.spriteSheet.onload = () => {
            console.log("SpriteSheet cargado correctamente");
            if (this.inicioStateElement) {
                this.inicioStateElement.style.display = "flex";
            }
        };

        // Añadir el event listener una sola vez
        if (this.botonInicio) {
            this.botonInicio.addEventListener("click", this.handleInicioClick);
        } else {
            console.warn("El botón de inicio 'startButton' no fue encontrado.");
        }
        console.log("Entrando al estado de inicio");
    }

    // Método para manejar el clic del botón de inicio
    _handleInicioClick() {
        console.log("Botón de inicio presionado");
        // Es importante que el cambio de estado sea lo último o que
        // la lógica de 'exit' no dependa de este listener específico
        // ya que 'exit' se llamará como parte de sm.change (usualmente).
        // Si sm.change() llama a this.exit() internamente, no necesitas llamarlo aquí.
        // Si no lo hace, entonces this.exit() aquí estaría bien, pero asegúrate
        // que el listener se remueva correctamente en el exit().
        // Asumiendo que this.sm.change se encarga de llamar a exit() del estado actual:
        this.sm.change(new SeleccionarBarraState(this.sm, this.spriteSheet));
    }

    exit() {
        if (this.inicioStateElement) {
            this.inicioStateElement.style.display = "none";
        }

        // Remover el event listener para limpiar
        if (this.botonInicio) {
            this.botonInicio.removeEventListener("click", this.handleInicioClick);
        }
        console.log("Saliendo del estado de inicio");
    }

    draw(canvas, ctx) {
        drawGrid(canvas, ctx);
    }
}
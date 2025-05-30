/*
    Frontend II
    JS-Blockade

    Blockade-7
    "The Player Life Update"

    -- Programa Principal --

    Autor: Rafael Getsemani Oseguera Marroquín
    rafael.oseguera@cesunbc.edu.mx

    Basado en Arkanoid, lanzado originalmente por Taito en 1986, 
    que es un clásico juego de romper bloques donde el jugador 
    controla una paleta para hacer rebotar una bola y destruir 
    todos los bloques del nivel.

    Esta versión ha sido desarrollada para navegador, utilizando 
    HTML5 Canvas para la lógica del juego y HTML para una interfaz 
    de usuario más elaborada. El diseño integra colores vibrantes y 
    un estilo visual más pulido, buscando una experiencia moderna 
    sin perder la esencia retro del original. Pensado para jugarse 
    en pantalla horizontal, el proyecto explora tanto la jugabilidad 
    clásica como la mejora en la presentación y usabilidad.
*/
import { StateMachine } from "./StateMachine/stateMachine.js";
import { InicioState } from "./StateMachine/inicioState.js";


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");



// Inicializamos el estado de la máquina de estados
const sm = new StateMachine();
sm.change(new InicioState(sm));   // estado inicial

let tiempoInicial = 0;

function gameLoop(time) {
    let tiempoActual = time;
    let deltaTime = (tiempoActual - tiempoInicial) / 1000;
    tiempoInicial = tiempoActual;

    sm.update(deltaTime);
    sm.draw(canvas, ctx);

    requestAnimationFrame(gameLoop);
}


window.addEventListener("keydown", e => {
    sm.input(e);    
});


requestAnimationFrame(gameLoop);

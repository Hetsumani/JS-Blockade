/*
    Frontend II
    JS-Blockade

    Blockade-2
    "The Player Update"

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
import { drawGrid } from "./drawGrid.js";
import { Bloque } from "./bloque.js";
import { Jugador } from "./jugador.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const spriteSheet = new Image();
spriteSheet.src = "./assets/sprites/blocks.png";

const anchoBloque = 32;
const altoBloque = 16;
const fila = 0;
const columna = 0;
const escala = 2.5;
const velocidadJugador = 350;

const bloque = new Bloque(
    spriteSheet,
    columna,
    fila,
    0,
    0,
    anchoBloque,
    altoBloque,
    escala
);

const jugador = new Jugador(spriteSheet, 32, 64, 64, 16, 286, 800, 64, 16, velocidadJugador);

let teclas = [];

window.addEventListener("keydown", (event) => {
    teclas[event.key] = true;
});
window.addEventListener("keyup", (event) => {
    teclas[event.key] = false;
});

function update(dt) {
    // Aquí puedes actualizar la lógica del juego
    // Por ejemplo, mover objetos, verificar colisiones, etc.    
    
    if (teclas["ArrowLeft"] || teclas["a"]) {
        jugador.mover(-1);
    } else if (teclas["ArrowRight"] || teclas["d"]) {
        jugador.mover(1);
    } else {
        jugador.mover(0);
    }

    jugador.update(dt);
}

function draw() {
    // Aquí puedes dibujar los objetos del juego
    // Por ejemplo, dibujar el jugador, enemigos, etc.

    // Dibujamos el fondo
    drawGrid(canvas, ctx);
    bloque.dibujar(ctx);
    jugador.dibujar(ctx);
}

let tiempoInicial = 0;

function gameLoop(time) {
    let tiempoActual = time;
    let deltaTime = (tiempoActual - tiempoInicial) / 1000;
    tiempoInicial = tiempoActual;

    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}

spriteSheet.onload = () => {
    requestAnimationFrame(gameLoop);
}
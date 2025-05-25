import { drawGrid } from "./drawGrid.js";
import { Bloque } from "./bloque.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const spriteSheet = new Image();
spriteSheet.src = "./assets/sprites/blocks.png";

const anchoBloque = 32;
const altoBloque = 16;
const fila = 0;
const columna = 0;
const escala = 2.5;

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

function update(dt) {
    // Aquí puedes actualizar la lógica del juego
    // Por ejemplo, mover objetos, verificar colisiones, etc.
}

function draw() {
    // Aquí puedes dibujar los objetos del juego
    // Por ejemplo, dibujar el jugador, enemigos, etc.

    // Dibujamos el fondo
    drawGrid(canvas, ctx);
    bloque.dibujar(ctx);
    
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
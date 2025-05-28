/*
    Frontend II
    JS-Blockade

    Blockade-1
    "The Block Update"

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

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const spriteSheet = new Image();
spriteSheet.src = "./assets/sprites/blocks.png";

const anchoBloque = 32;
const altoBloque = 16;
const fila = 2;
const columna = 5;
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
/*
    Frontend II
    JS-Blockade

    Blockade-0
    "The Interface Update"

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

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function update(dt){
    // Aquí puedes actualizar la lógica del juego
    // Por ejemplo, mover objetos, verificar colisiones, etc.
}

function draw(){
    // Aquí puedes dibujar los objetos del juego
    // Por ejemplo, dibujar el jugador, enemigos, etc.
    
    // Dibujamos el fondo
    drawGrid(canvas, ctx);
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

requestAnimationFrame(gameLoop);
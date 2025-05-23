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

function gameLoop() { 
    let tiempoActual = Date.now();
    let deltaTime = tiempoActual - tiempoInicial;
    tiempoInicial = tiempoActual;

    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
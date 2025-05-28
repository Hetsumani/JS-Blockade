import { BaseState } from "./baseState.js";
import { JugarState } from "./jugarState.js";
import { drawGrid } from "../drawGrid.js";
import { Jugador } from "../jugador.js";
import { Bola } from "../bola.js";
import { Bloque } from "../bloque.js";

export class ServirState extends BaseState {
    constructor(sm, nivel, filaColor, spriteSheet) {
        super(sm);
        this.sm = sm; // stateMachine
        this.nivel = nivel;
        this.fila = filaColor;
        this.velocidadJugador = 350;
        this.velocidadBola = 300;
        this.spriteSheet = spriteSheet;
    }

    enter() {
        document.getElementById("servirState").style.display = "flex";

        const velocidadBaseNivel1 = this.velocidadBola; // Velocidad base para el nivel 1
        const factorDeEscalaLogaritmico = 90; // ¡Ajusta este valor según tus pruebas!

        // Asegúrate de que this.nivel sea al menos 1.
        // Si this.nivel puede ser 0 o menos, Math.log() dará errores o resultados no deseados.
        // Asumiendo que this.nivel siempre empieza en 1.
        let velocidadCalculadaParaEsteNivel;

        if (this.nivel === 1) {
            velocidadCalculadaParaEsteNivel = velocidadBaseNivel1;
        } else {
            // Math.log(1) es 0, así que la fórmula general también funciona para nivel 1,
            // pero esta estructura es por si quieres una lógica especial para nivel 1.
            // La fórmula simplificada es:
            // velocidadCalculadaParaEsteNivel = velocidadBaseNivel1 + factorDeEscalaLogaritmico * Math.log(this.nivel);
            // Math.log() es el logaritmo natural (ln).
            velocidadCalculadaParaEsteNivel = velocidadBaseNivel1 + factorDeEscalaLogaritmico * Math.log(this.nivel);
        }

        // Crear el jugador
        this.jugador = new Jugador(
            this.spriteSheet,
            32,
            16 * this.fila,
            64,
            16,
            286,
            800,
            64,
            16,
            this.velocidadJugador
        );

        // Crear la bola
        this.bola = new Bola(
            this.spriteSheet,
            12,
            6,
            342,
            784,
            8,
            8,
            2,
            this.velocidadBola
        );

        this.bloques = [];
        this.crearBloques();

        console.log("Entrando al estado de servir");
    }

    update(dt) {
        // Aquí puedes actualizar la lógica del juego
    }

    exit() {
        document.getElementById("servirState").style.display = "none";
        console.log("Saliendo del estado de servir");
    }

    draw(canvas, ctx) {
        drawGrid(canvas, ctx);
        this.jugador.dibujar(ctx);
        this.bola.dibujar(ctx);
        this.bloques.forEach((bloque) => {
            bloque.dibujar(ctx);
        });
    }

    input(e) {
        // Aquí puedes manejar la entrada del teclado o mouse
        if (e.key === " ") { // Espacio
            console.log("Espacio presionado, iniciar juego");
            this.sm.change(new JugarState(this.sm, this.jugador, this.bola, this.bloques, this.spriteSheet, this.fila, this.nivel));
        }
    }

    crearBloques() {
        const bloquesPorHilera = 9;
        const anchoBloqueEnSprite = 32; // El ancho del sprite del bloque
        const altoBloqueEnSprite = 16;  // El alto del sprite del bloque
        const escalaBloque = 2;
        const anchoBloqueEscalado = anchoBloqueEnSprite * escalaBloque; // 32 * 2 = 64
        const altoBloqueEscalado = altoBloqueEnSprite * escalaBloque;   // 16 * 2 = 32

        const inicioX = 64; // Posición X inicial para la primera columna de bloques
        const yInicialPrimeraHilera = 400; // Posición Y de la hilera más baja (o la primera que creaste)
        const espacioVerticalEntreHileras = altoBloqueEscalado + 4; // Alto del bloque + un pequeño espacio de 4px        

        // Bucle para cada nivel (cada hilera)
        for (let j = 0; j < this.nivel; j++) {
            // Calculamos la posición 'y' para la hilera actual.
            // Las nuevas hileras se apilarán hacia arriba desde yInicialPrimeraHilera.
            const yActualHilera = yInicialPrimeraHilera - (j * espacioVerticalEntreHileras);

            // Bucle para crear los bloques de la hilera actual
            for (let i = 0; i < bloquesPorHilera; i++) {
                const xActualBloque = inicioX + (i * anchoBloqueEscalado);

                // Aquí podrías variar la 'fila' del spritesheet si quieres
                // que diferentes hileras tengan diferentes colores/tipos de bloques.
                // Por ejemplo: const filaSpriteBloque = j % numeroDeTiposDeBloquesEnSpriteSheet;
                const filaSpriteBloque = 0; // Mantenemos la fila 0 del spritesheet por ahora

                let vidaBloque = Math.floor(Math.random() * 5) + 1; // Vida aleatoria entre 1 y 5

                const bloque = new Bloque(
                    this.spriteSheet,                   
                    xActualBloque,    // x en el canvas
                    yActualHilera,    // y en el canvas
                    anchoBloqueEnSprite,
                    altoBloqueEnSprite,
                    escalaBloque,
                    vidaBloque
                );
                this.bloques.push(bloque);
            }
        }
    }
}
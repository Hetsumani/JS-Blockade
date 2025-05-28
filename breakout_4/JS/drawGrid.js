export function drawGrid(canvas, ctx) {
    const COLUMNAS = 12;
    const FILAS = (10 / 7) * COLUMNAS;

    let verticalLinesSeparation = canvas.width / COLUMNAS;
    let horizontalLinesSeparation = canvas.height / FILAS;

    let verticalLines = [];
    let horizontalLines = [];

    for (let i = 0; i < COLUMNAS + 1; i++) {
        verticalLines.push(i * verticalLinesSeparation);
    }

    for (let i = 0; i < FILAS + 1; i++) {
        horizontalLines.push(i * horizontalLinesSeparation);
    }

    ctx.fillStyle = "#011418";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < verticalLines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(verticalLines[i], 0);
        ctx.lineTo(verticalLines[i], canvas.height);
        ctx.strokeStyle = "#021e24";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    for (let i = 0; i < horizontalLines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0, horizontalLines[i]);
        ctx.lineTo(canvas.width, horizontalLines[i]);
        ctx.strokeStyle = "#021e24";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
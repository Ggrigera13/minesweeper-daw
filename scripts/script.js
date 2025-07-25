var tableroContainer = document.getElementById('tablero');
var mensajeContainer = document.getElementById('mensaje');
var tablero = [];
var filas = 0;
var columnas = 0;
var minas = 0;
var partidaPerdida = false;

document.getElementById('comenzar').addEventListener('click', iniciarJuego);

function iniciarJuego() {
    /* Reseteamos todas las variables de juego*/
    tablero = [];
    minas = 10;
    mensajeContainer.textContent = '';
    partidaPerdida = false;

    /* Creacion de tablero */
    tableroContainer.innerHTML = '';
    tableroContainer.classList.add("tablero");
    tableroContainer.classList.add("nivel-bajo");
    filas = 8;
    columnas = 8;

    for (var fila = 0; fila < filas; fila++) {
        tablero[fila] = [];
        for (var columna = 0; columna < columnas; columna++) {
            var celda = document.createElement('div');
            celda.classList.add('celda');
            celda.dataset.fila = fila;
            celda.dataset.columna = columna;
            celda.addEventListener('click', revelarCelda);
            tableroContainer.appendChild(celda);
            tablero[fila][columna] = { mina: false, revelada: false, numero: 0, elemento: celda };
        }
    }

    colocarMinas();
}

/* Colocamos las minas en el tablero de forma aleatoria */
function colocarMinas() {
    minasColocadas = 0;
    while (minasColocadas < minas) {
        var fila = Math.floor(Math.random() * filas);
        var columna = Math.floor(Math.random() * columnas);
        if (!tablero[fila][columna].mina) {
            tablero[fila][columna].mina = true;
            minasColocadas++;
            actualizarCantidadMinasAdyacentes(fila, columna);
        }
    }
}

/* Actualizamos el número de la cantidad de minas adyacentes a cada celda */
function actualizarCantidadMinasAdyacentes(fila, columna) {
    for (var filaAdyacente = fila - 1; filaAdyacente <= fila + 1; filaAdyacente++) {
        for (var columnaAdyacente = columna - 1; columnaAdyacente <= columna + 1; columnaAdyacente++) {
            if (
                filaAdyacente >= 0 && filaAdyacente < filas &&
                columnaAdyacente >= 0 && columnaAdyacente < columnas &&
                !(filaAdyacente === fila && columnaAdyacente === columna)
            ) {
                tablero[filaAdyacente][columnaAdyacente].numero++;
            }
        }
    }
}

function revelarCelda(elemento) {
    var fila = parseInt(this.dataset.fila);
    var columna = parseInt(this.dataset.columna);
    var celda = tablero[fila][columna];

    if (partidaPerdida || celda.revelada) {
        return;
    }

    celda.revelada = true;
    celda.elemento.classList.add('revelada');

    if (celda.mina) {
        celda.elemento.classList.add('mina');
        celda.elemento.textContent = '💣';
        terminarJuego('💣 Perdiste. Tocaste una mina.');
    } else if (celda.numero > 0) {
        celda.elemento.dataset.numero = celda.numero;
        celda.elemento.textContent = celda.numero;
    } else {
        for (var filaAdyacente = fila - 1; filaAdyacente <= fila + 1; filaAdyacente++) {
            for (var columnaAdyacente = columna - 1; columnaAdyacente <= columna + 1; columnaAdyacente++) {
                if (filaAdyacente >= 0 && filaAdyacente < filas && columnaAdyacente >= 0 && columnaAdyacente < columnas) {
                    revelarCelda.call(tablero[filaAdyacente][columnaAdyacente].elemento);
                }
            }
        }
    }
}

function terminarJuego(mensajeFinal) {
    partidaPerdida = true;
    mensajeContainer.textContent = mensajeFinal;

    // Mostramos todas las minas en el tablero
    for (var fila = 0; fila < filas; fila++) {
        for (var columna = 0; columna < columnas; columna++) {
            var celda = tablero[fila][columna];
            if (celda.mina) {
                celda.elemento.classList.add('mina');
                celda.elemento.textContent = '💣';
            }
        }
    }
}
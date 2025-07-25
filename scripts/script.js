var tableroContainer = document.getElementById('tablero');
var mensajeContainer = document.getElementById('mensaje');
var formularioJugador = document.getElementById('formularioJugador');
var informacionJugadorTexto = document.getElementById('informacionJugador');
var tablero = [];
var filas = 0;
var columnas = 0;
var minas = 0;
var partidaTerminada = false;
var banderasActivas = 0;


document.getElementById('comenzar').addEventListener('click', iniciarJuego);

function iniciarJuego() {
    var nombreJugador = formularioJugador.nombreJugador.value;
    if (!nombreJugador) {
        alert('Por favor, ingresa tu nombre.');
        return;
    }

    if (nombreJugador.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres.');
        return;
    }

    /* Reseteamos todas las variables de juego*/
    tablero = [];
    minas = 10;
    mensajeContainer.textContent = '';
    partidaTerminada = false;
    informacionJugadorTexto.textContent = `Jugador: ${nombreJugador}`;
    banderasActivas = 0;
    actualizarContadorMinas();

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
            celda.addEventListener('contextmenu', marcarBandera);
            tableroContainer.appendChild(celda);
            tablero[fila][columna] = { mina: false, revelada: false, numero: 0, banderaActiva: false, elemento: celda };
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
    if (partidaTerminada) {
        return;
    }

    var fila = parseInt(this.dataset.fila);
    var columna = parseInt(this.dataset.columna);
    var celda = tablero[fila][columna];

    if (celda.revelada) {
        return;
    }

    if (celda.banderaActiva) {
        celda.banderaActiva = false;
        celda.elemento.textContent = '';
        celda.elemento.classList.remove('bandera');
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

    if (validarPartidaGanada()) {
        terminarJuego('🎉 ¡Ganaste! Felicitaciones.');
    }
}

function terminarJuego(mensajeFinal) {
    partidaTerminada = true;
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

function validarPartidaGanada() {
    for (var fila = 0; fila < filas; fila++) {
        for (var columna = 0; columna < columnas; columna++) {
            var celda = tablero[fila][columna];
            
            if (!celda.mina && !celda.revelada) {
                return false;
            }
        }
    }
    
    return true;
}

function marcarBandera(e) {
    if (partidaTerminada) {
        return;
    }
    
    e.preventDefault();

    var fila = parseInt(this.dataset.fila);
    var columna = parseInt(this.dataset.columna);
    var celda = tablero[fila][columna];

    if (celda.revelada) {
        return;
    }

    if (celda.banderaActiva) {
        celda.banderaActiva = false;
        celda.elemento.textContent = '';
        celda.elemento.classList.remove('bandera');
        banderasActivas--;
    } else {
        celda.banderaActiva = true;
        celda.elemento.textContent = '🚩';
        celda.elemento.classList.add('bandera');
        banderasActivas++;
    }

    actualizarContadorMinas();
}

function actualizarContadorMinas() {
    var minasRestantes = minas - banderasActivas;
    var contadorElemento = document.getElementById('minasRestantes');
    contadorElemento.textContent = `Minas restantes: ${minasRestantes}`;

    contadorElemento.classList.toggle('negativo', minasRestantes < 0);
}
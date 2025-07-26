'use strict';

var tableroContainer = document.getElementById("tablero");
var formularioJugador = document.getElementById("formularioJugador");
var informacionJugadorTexto = document.getElementById("informacionJugador");
var reiniciarBoton = document.getElementById("reiniciar");
var comenzarBoton = document.getElementById("comenzar");
var botonContacto = document.getElementById("contacto");
var botonCerrarModal = document.getElementById("cerrarModal");
var sonidoExplosion = document.getElementById('sonidoExplosion');
var sonidoVictoria = document.getElementById('sonidoVictoria');
var sonidoRevelar = document.getElementById('sonidoRevelar');
var tablero = [];
var filas = 0;
var columnas = 0;
var minas = 0;
var partidaTerminada = false;
var banderasActivas = 0;
var tiempoInicio = null;
var intervaloTemporizador = null;
var tiempoTranscurrido = 0;

reiniciarBoton.disabled = true;

function mostrarModal(mensaje) {
    var modal = document.getElementById("modal");
    var modalMensaje = document.getElementById("modalMensaje");

    modalMensaje.textContent = mensaje;
    modal.classList.remove("oculto");
}

function actualizarContadorMinas() {
    var minasRestantes = minas - banderasActivas;
    var contadorElemento = document.getElementById("minasRestantes");
    contadorElemento.textContent = `Minas restantes: ${minasRestantes}`;

    contadorElemento.classList.toggle("negativo", minasRestantes < 0);
}

function actualizarTemporizador() {
    tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    document.getElementById('tiempo').textContent = '⏱️ Tiempo: ' + tiempoTranscurrido + 's';
}

function iniciarTemporizador() {
    if (intervaloTemporizador) {
        return;
    }

    tiempoInicio = Date.now();
    intervaloTemporizador = setInterval(actualizarTemporizador, 1000);
}

function detenerTemporizador() {
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;
    tiempoInicio = null;
}

function reproducirExplosion() {
    sonidoExplosion.currentTime = 0;
    sonidoExplosion.play();
}

function reproducirVictoria() {
    sonidoVictoria.currentTime = 0;
    sonidoVictoria.play();
}

function reproducirRevelar() {
    sonidoRevelar.currentTime = 0;
    sonidoRevelar.play();
}

function terminarJuego(mensajeFinal) {
    detenerTemporizador();
    partidaTerminada = true;
    comenzarBoton.disabled = false;
    reiniciarBoton.disabled = true;
    mostrarModal(mensajeFinal);

    // Mostramos todas las minas en el tablero
    for (var fila = 0; fila < filas; fila++) {
        for (var columna = 0; columna < columnas; columna++) {
            var celda = tablero[fila][columna];
            if (celda.mina) {
                celda.elemento.classList.add("mina");
                celda.elemento.textContent = "💣";
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

function revelarCelda(elemento) {
    if (!tiempoInicio) {
        iniciarTemporizador();
    }

    if (partidaTerminada) {
        return;
    }

    var fila = parseInt(this.dataset.fila);
    var columna = parseInt(this.dataset.columna);
    var celda = tablero[fila][columna];

    if (celda.revelada) {
        return;
    }

    reproducirRevelar();

    if (celda.banderaActiva) {
        celda.banderaActiva = false;
        celda.elemento.textContent = "";
        celda.elemento.classList.remove("bandera");
    }

    celda.revelada = true;
    celda.elemento.classList.add("revelada");

    if (celda.mina) {
        celda.elemento.classList.add("mina");
        celda.elemento.textContent = "💣";
        reproducirExplosion();
        terminarJuego("💣 Perdiste. Tocaste una mina.");
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
        reproducirVictoria();
        terminarJuego("🎉 ¡Ganaste! Felicitaciones.");
    }
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
        celda.elemento.textContent = "";
        celda.elemento.classList.remove("bandera");
        banderasActivas--;
    } else {
        celda.banderaActiva = true;
        celda.elemento.textContent = "🚩";
        celda.elemento.classList.add("bandera");
        banderasActivas++;
    }

    actualizarContadorMinas();
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

/* Colocamos las minas en el tablero de forma aleatoria */
function colocarMinas() {
    var minasColocadas = 0;
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

function iniciarJuego() {
    var nombreJugador = formularioJugador.nombreJugador.value;
    if (!nombreJugador) {
        mostrarModal("Por favor, ingresa tu nombre.");
        return;
    }

    if (nombreJugador.length < 3) {
        mostrarModal("El nombre debe tener al menos 3 caracteres.");
        return;
    }

    /* Reseteamos todas las variables de juego*/
    tablero = [];
    minas = 10;
    partidaTerminada = false;
    informacionJugadorTexto.textContent = `Jugador: ${nombreJugador}`;
    banderasActivas = 0;
    actualizarContadorMinas();
    document.getElementById("tiempo").textContent = "⏱️ Tiempo: 0s";
    reiniciarBoton.disabled = false;
    comenzarBoton.disabled = true;

    /* Creacion de tablero */
    tableroContainer.innerHTML = "";
    tableroContainer.classList.add("tablero");
    tableroContainer.classList.add("nivel-bajo");
    filas = 8;
    columnas = 8;

    for (var fila = 0; fila < filas; fila++) {
        tablero[fila] = [];
        for (var columna = 0; columna < columnas; columna++) {
            var celda = document.createElement("div");
            celda.classList.add("celda");
            celda.dataset.fila = fila;
            celda.dataset.columna = columna;
            celda.addEventListener("click", revelarCelda);
            celda.addEventListener("contextmenu", marcarBandera);
            tableroContainer.appendChild(celda);
            tablero[fila][columna] = { mina: false, revelada: false, numero: 0, banderaActiva: false, elemento: celda };
        }
    }

    colocarMinas();
}

function cerrarModal() {
    var modal = document.getElementById("modal");
    modal.classList.add("oculto");
}

function redirigirContacto() {
    window.location.href = "contacto.html";
}

function reiniciarJuego() {
    detenerTemporizador();
    iniciarJuego();
}

botonContacto.addEventListener("click", redirigirContacto);
botonCerrarModal.addEventListener("click", cerrarModal);
comenzarBoton.addEventListener("click", iniciarJuego);
reiniciarBoton.addEventListener("click", reiniciarJuego);
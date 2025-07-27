'use strict';

var tableroContainer = document.getElementById("tablero");
var formularioJugador = document.getElementById("formularioJugador");
var informacionJugadorTexto = document.getElementById("informacionJugador");
var reiniciarBoton = document.getElementById("reiniciar");
var comenzarBoton = document.getElementById("comenzar");
var botonContacto = document.getElementById("contacto");
var botonCerrarModal = document.getElementById("cerrarModal");
var sonidoExplosion = document.getElementById("sonidoExplosion");
var sonidoVictoria = document.getElementById("sonidoVictoria");
var sonidoRevelar = document.getElementById("sonidoRevelar");
var cambioTemaBoton = document.getElementById("cambioTema");
var rankingBoton = document.getElementById("ranking");
var rankingModal = document.getElementById("rankingModal");
var botonCerrarModalRanking = document.getElementById("cerrarModalRanking");
var selectOrdenRanking = document.getElementById("ordenRanking");
var tablero = [];
var filas = 0;
var columnas = 0;
var minas = 0;
var claseTablero = ""
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

function calcularPuntajeFinal(dificultad) {
    var base = 0;
    var penalizacion = 0;

    switch (dificultad) {
        case "facil":
            base = 1000;
            penalizacion = 5;
            break;
        case "medio":
            base = 3000;
            penalizacion = 4;
            break;
        case "dificil":
            base = 5000;
            penalizacion = 3;
            break;
        default:
            base = 0;
            penalizacion = 0;
    }

    var puntaje = base - (tiempoTranscurrido * penalizacion);
    return Math.max(puntaje, 0);
}


function guardarResultadoPartida() {
    var nombreJugador = formularioJugador.nombreJugador.value;
    var dificultad = tableroContainer.dataset.dificultad;
    var puntajeFinal = calcularPuntajeFinal(dificultad);
    var fechaActual = new Date();

    var resultado = {
        nombre: nombreJugador,
        puntaje: puntajeFinal,
        duracion: tiempoTranscurrido,
        fecha: fechaActual.toLocaleDateString(),
        hora: fechaActual.toLocaleTimeString()
    };

    var resultadosGuardados = JSON.parse(localStorage.getItem("resultados")) || [];
    resultadosGuardados.push(resultado);

    localStorage.setItem("resultados", JSON.stringify(resultadosGuardados));
}

function terminarJuego(mensajeFinal) {
    guardarResultadoPartida();
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

function generarConfiguracionDificultad(dificultad) {
    switch (dificultad) {
        case "facil":
            filas = 8;
            columnas = 8;
            minas = 10;
            claseTablero = "nivel-bajo";
            break;
        case "medio":
            filas = 12;
            columnas = 12;
            minas = 25;
            claseTablero = "nivel-medio";
            break;
        case "dificil":
            filas = 16;
            columnas = 16;
            minas = 40;
            claseTablero = "nivel-alto";
            break;
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

    var dificultadSeleccionada = document.getElementById("dificultad").value;
    generarConfiguracionDificultad(dificultadSeleccionada);

    /* Reseteamos todas las variables de juego*/
    tablero = [];
    partidaTerminada = false;
    informacionJugadorTexto.textContent = `Jugador: ${nombreJugador}`;
    banderasActivas = 0;
    actualizarContadorMinas();
    document.getElementById("tiempo").textContent = "⏱️ Tiempo: 0s";
    document.getElementById("nivel").textContent = `Nivel: ${dificultadSeleccionada.charAt(0).toUpperCase() + dificultadSeleccionada.slice(1)}`;
    reiniciarBoton.disabled = false;
    comenzarBoton.disabled = true;

    /* Creacion de tablero */
    tableroContainer.innerHTML = "";
    tableroContainer.classList.add("tablero");
    tableroContainer.classList.add(claseTablero);

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
    tableroContainer.dataset.dificultad = dificultadSeleccionada;
}

function cerrarModal() {
    var modal = document.getElementById("modal");
    modal.classList.add("oculto");
}

function cerrarModalRanking() {
    var rankingModal = document.getElementById("rankingModal");
    rankingModal.classList.add("oculto");
}

function redirigirContacto() {
    window.location.href = "contacto.html";
}

function reiniciarJuego() {
    detenerTemporizador();
    iniciarJuego();
}

function cambiarTema() {
    document.body.classList.toggle("tema-claro");

    var temaClaroActivo = document.body.classList.contains("tema-claro");
    cambioTemaBoton.textContent = temaClaroActivo ? "🌙 Modo Oscuro" : "☀️ Modo Claro";

    localStorage.setItem('tema', temaClaroActivo ? 'claro' : 'oscuro');
}

function cargarTemaGuardado() {
    var temaGuardado = localStorage.getItem("tema");

    if (temaGuardado === "claro") {
        document.body.classList.add("tema-claro");
        cambioTemaBoton.textContent = "🌙 Modo Oscuro";
      } else {
        document.body.classList.remove("tema-claro");
        cambioTemaBoton.textContent = "☀️ Modo Claro";
      }
}

function ordenarRankingPorPuntaje(a, b) {
    return b.puntaje - a.puntaje;
}

function ordenarRankingPorFecha(a, b) {
    var fechaA = new Date(`${a.fecha} ${a.hora}`);
    var fechaB = new Date(`${b.fecha} ${b.hora}`);
    return fechaB - fechaA;
}

function mostrarRanking() {
    var resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    var ordenCriterio = document.getElementById("ordenRanking").value;

    if (ordenCriterio === "puntaje") {
        resultados.sort(ordenarRankingPorPuntaje);
    } else {
        resultados.sort(ordenarRankingPorFecha);
    }

    var tbody = document.getElementById("rankingCuerpo");
    tbody.innerHTML = "";

    if (resultados.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>No hay resultados guardados.</td></tr>";
    } else {
        resultados.forEach(function(resultado) {
            var fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${resultado.nombre}</td>
                <td>${resultado.puntaje}</td>
                <td>${resultado.duracion}</td>
                <td>${resultado.fecha}</td>
                <td>${resultado.hora}</td>
            `;
            tbody.appendChild(fila);
        });
    }

    rankingModal.classList.remove("oculto");
}

botonContacto.addEventListener("click", redirigirContacto);
botonCerrarModal.addEventListener("click", cerrarModal);
comenzarBoton.addEventListener("click", iniciarJuego);
reiniciarBoton.addEventListener("click", reiniciarJuego);
cambioTemaBoton.addEventListener("click", cambiarTema);
rankingBoton.addEventListener("click", mostrarRanking);
botonCerrarModalRanking.addEventListener("click", cerrarModalRanking)
selectOrdenRanking.addEventListener("change", mostrarRanking);

document.addEventListener("DOMContentLoaded", cargarTemaGuardado);
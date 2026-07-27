/* Punto de entrada: conecta la interfaz con la logica del juego */

(function () {
  "use strict";

  var pantallaInicio = document.getElementById("pantalla-inicio");
  var pantallaJuego = document.getElementById("pantalla-juego");
  var formularioInicio = document.getElementById("formulario-inicio");
  var inputNombre = document.getElementById("input-nombre");
  var selectNivel = document.getElementById("select-nivel");
  var mensajeErrorInicio = document.getElementById("mensaje-error-inicio");
  var datoJugador = document.getElementById("dato-jugador");
  var datoNivel = document.getElementById("dato-nivel");

  var modalResultado = document.getElementById("modal-resultado");
  var resultadoJugador = document.getElementById("resultado-jugador");
  var resultadoNivel = document.getElementById("resultado-nivel");
  var resultadoIntentos = document.getElementById("resultado-intentos");
  var resultadoErrores = document.getElementById("resultado-errores");
  var resultadoTiempo = document.getElementById("resultado-tiempo");
  var resultadoPuntaje = document.getElementById("resultado-puntaje");
  var botonCerrarResultado = document.getElementById("boton-cerrar-resultado");
  var botonJugarDeNuevo = document.getElementById("boton-jugar-de-nuevo");
  var botonCambiarDatos = document.getElementById("boton-cambiar-datos");
  var botonReiniciar = document.getElementById("boton-reiniciar");
  var botonVolverInicio = document.getElementById("boton-volver-inicio");

  var modalRanking = document.getElementById("modal-ranking");
  var listaRanking = document.getElementById("lista-ranking");
  var mensajeRankingVacio = document.getElementById("mensaje-ranking-vacio");
  var selectOrden = document.getElementById("select-orden");
  var botonVerRanking = document.getElementById("boton-ver-ranking");
  var botonCerrarRanking = document.getElementById("boton-cerrar-ranking");
  var botonBorrarRanking = document.getElementById("boton-borrar-ranking");

  var modalConfirmarBorrado = document.getElementById("modal-confirmar-borrado");
  var botonConfirmarBorrado = document.getElementById("boton-confirmar-borrado");
  var botonCancelarBorrado = document.getElementById("boton-cancelar-borrado");

  /* Peso de cada nivel para poder ordenar el ranking por dificultad */
  var PESO_DE_NIVELES = { facil: 1, medio: 2, dificil: 3 };

  /* Datos de la partida en curso, para poder reiniciarla sin recargar */
  var jugadorActual = "";
  var nivelActual = "";

  /* Muestra un mensaje de error dentro de la interfaz */
  function mostrarError(texto) {
    mensajeErrorInicio.textContent = texto;
    mensajeErrorInicio.className = "mensaje-error";
  }

  /* Oculta el mensaje de error de la pantalla de inicio */
  function ocultarError() {
    mensajeErrorInicio.textContent = "";
    mensajeErrorInicio.className = "mensaje-error oculto";
  }

  /* Cambia de la pantalla de inicio a la pantalla de juego */
  function mostrarPantallaJuego(nombreJugador, nivel) {
    datoJugador.textContent = nombreJugador;
    datoNivel.textContent = Juego.obtenerNombreNivel(nivel);

    pantallaInicio.className = "pantalla-inicio oculto";
    pantallaJuego.className = "pantalla-juego";
  }

  /* Carga el resultado de la partida, lo guarda y abre el modal final */
  function mostrarResultado(resultado) {
    Almacenamiento.guardarPartida(resultado);

    resultadoJugador.textContent = resultado.nombreJugador;
    resultadoNivel.textContent = resultado.nombreNivel;
    resultadoIntentos.textContent = resultado.intentos;
    resultadoErrores.textContent = resultado.errores;
    resultadoTiempo.textContent = resultado.tiempo;
    resultadoPuntaje.textContent = resultado.puntaje;

    modalResultado.className = "fondo-modal";
    botonCerrarResultado.focus();
  }

  /* Cierra el modal con el resultado final */
  function cerrarResultado() {
    modalResultado.className = "fondo-modal oculto";
  }

  /* Reinicia la partida con el mismo jugador y el mismo nivel */
  function reiniciarPartida() {
    cerrarResultado();
    Juego.iniciarPartida(jugadorActual, nivelActual);
  }

  /* Vuelve a la pantalla de inicio para cambiar el jugador o el nivel */
  function volverAlInicio() {
    cerrarResultado();
    Juego.detenerPartida();

    pantallaJuego.className = "pantalla-juego oculto";
    pantallaInicio.className = "pantalla-inicio";
    inputNombre.focus();
  }

  /* Agrega un cero adelante para mostrar siempre dos digitos */
  function agregarCeroAdelante(numero) {
    if (numero < 10) {
      return "0" + numero;
    }

    return "" + numero;
  }

  /* Convierte una cantidad de segundos al formato mm:ss */
  function formatearDuracion(segundos) {
    var minutos = Math.floor(segundos / 60);
    var resto = segundos % 60;

    return agregarCeroAdelante(minutos) + ":" + agregarCeroAdelante(resto);
  }

  /* Convierte una marca de tiempo al formato dd/mm/aaaa hh:mm */
  function formatearFecha(milisegundos) {
    var fecha = new Date(milisegundos);

    return (
      agregarCeroAdelante(fecha.getDate()) +
      "/" +
      agregarCeroAdelante(fecha.getMonth() + 1) +
      "/" +
      fecha.getFullYear() +
      " " +
      agregarCeroAdelante(fecha.getHours()) +
      ":" +
      agregarCeroAdelante(fecha.getMinutes())
    );
  }

  /* Comparadores usados para ordenar el ranking */
  function compararPorPuntaje(primera, segunda) {
    return segunda.puntaje - primera.puntaje;
  }

  function compararPorFecha(primera, segunda) {
    return segunda.fecha - primera.fecha;
  }

  function compararPorDuracion(primera, segunda) {
    return primera.duracion - segunda.duracion;
  }

  function compararPorNivel(primera, segunda) {
    return PESO_DE_NIVELES[segunda.nivel] - PESO_DE_NIVELES[primera.nivel];
  }

  /* Ordena una copia del ranking segun el criterio elegido */
  function ordenarRanking(ranking, criterio) {
    var copia = ranking.slice();

    if (criterio === "fecha") {
      return copia.sort(compararPorFecha);
    }

    if (criterio === "duracion") {
      return copia.sort(compararPorDuracion);
    }

    if (criterio === "nivel") {
      return copia.sort(compararPorNivel);
    }

    return copia.sort(compararPorPuntaje);
  }

  /* Crea el elemento HTML de una fila del ranking */
  function crearFilaRanking(partida, posicion) {
    var fila = document.createElement("li");
    var numero = document.createElement("span");
    var jugador = document.createElement("span");
    var puntaje = document.createElement("span");
    var detalle = document.createElement("span");

    fila.className = "fila-ranking";

    numero.className = "posicion-ranking";
    numero.textContent = posicion;

    jugador.className = "jugador-ranking";
    jugador.textContent = partida.nombreJugador;

    puntaje.textContent = partida.puntaje + " pts";

    detalle.className = "detalle-ranking";
    detalle.textContent =
      "Nivel " +
      partida.nombreNivel +
      " - " +
      partida.intentos +
      " intentos - " +
      partida.errores +
      " errores - " +
      formatearDuracion(partida.duracion) +
      " - " +
      formatearFecha(partida.fecha);

    fila.appendChild(numero);
    fila.appendChild(jugador);
    fila.appendChild(puntaje);
    fila.appendChild(detalle);

    return fila;
  }

  /* Dibuja el ranking completo con el orden elegido */
  function dibujarRanking() {
    var ranking = ordenarRanking(Almacenamiento.obtenerRanking(), selectOrden.value);
    var i;

    listaRanking.innerHTML = "";

    if (ranking.length === 0) {
      mensajeRankingVacio.className = "texto-ayuda";
      return;
    }

    mensajeRankingVacio.className = "texto-ayuda oculto";

    for (i = 0; i < ranking.length; i++) {
      listaRanking.appendChild(crearFilaRanking(ranking[i], i + 1));
    }
  }

  /* Abre el modal del ranking */
  function abrirRanking() {
    dibujarRanking();
    modalRanking.className = "fondo-modal";
    botonCerrarRanking.focus();
  }

  /* Cierra el modal del ranking */
  function cerrarRanking() {
    modalRanking.className = "fondo-modal oculto";
  }

  /* Abre el modal propio de confirmacion de borrado */
  function abrirConfirmacionBorrado() {
    modalConfirmarBorrado.className = "fondo-modal";
    botonCancelarBorrado.focus();
  }

  /* Cierra el modal propio de confirmacion de borrado */
  function cerrarConfirmacionBorrado() {
    modalConfirmarBorrado.className = "fondo-modal oculto";
  }

  /* Borra el historial y refresca el listado */
  function confirmarBorrado() {
    Almacenamiento.borrarRanking();
    cerrarConfirmacionBorrado();
    dibujarRanking();
  }

  /* Valida los datos ingresados antes de iniciar la partida */
  function alEnviarFormulario(evento) {
    var resultadoNombre;
    var resultadoNivel;
    var nombreJugador;
    var nivel;

    evento.preventDefault();
    ocultarError();

    resultadoNombre = Validaciones.validarNombre(inputNombre.value);

    if (!resultadoNombre.valido) {
      mostrarError(resultadoNombre.mensaje);
      inputNombre.focus();
      return;
    }

    resultadoNivel = Validaciones.validarNivel(selectNivel.value);

    if (!resultadoNivel.valido) {
      mostrarError(resultadoNivel.mensaje);
      return;
    }

    nombreJugador = Validaciones.limpiarTexto(inputNombre.value);
    nivel = selectNivel.value;

    /* Control de seguridad: el nivel no puede pedir mas pares de los disponibles */
    if (!Juego.hayAnimalesSuficientes(nivel)) {
      mostrarError("No hay suficientes animales para armar este nivel.");
      return;
    }

    jugadorActual = nombreJugador;
    nivelActual = nivel;

    mostrarPantallaJuego(nombreJugador, nivel);
    Juego.iniciarPartida(nombreJugador, nivel);
  }

  formularioInicio.addEventListener("submit", alEnviarFormulario);
  inputNombre.addEventListener("input", ocultarError);
  selectNivel.addEventListener("change", ocultarError);
  botonCerrarResultado.addEventListener("click", cerrarResultado);
  botonJugarDeNuevo.addEventListener("click", reiniciarPartida);
  botonCambiarDatos.addEventListener("click", volverAlInicio);
  botonReiniciar.addEventListener("click", reiniciarPartida);
  botonVolverInicio.addEventListener("click", volverAlInicio);
  botonVerRanking.addEventListener("click", abrirRanking);
  botonCerrarRanking.addEventListener("click", cerrarRanking);
  botonBorrarRanking.addEventListener("click", abrirConfirmacionBorrado);
  botonConfirmarBorrado.addEventListener("click", confirmarBorrado);
  botonCancelarBorrado.addEventListener("click", cerrarConfirmacionBorrado);
  selectOrden.addEventListener("change", dibujarRanking);

  Juego.definirAlFinalizar(mostrarResultado);
})();

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
    jugadorActual = nombreJugador;
    nivelActual = nivel;

    /* Control de seguridad: el nivel no puede pedir mas pares de los disponibles */
    if (!Juego.hayAnimalesSuficientes(nivel)) {
      mostrarError("No hay suficientes animales para armar este nivel.");
      return;
    }

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

  Juego.definirAlFinalizar(mostrarResultado);
})();

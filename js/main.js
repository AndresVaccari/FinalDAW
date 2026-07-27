/* Punto de entrada: conecta la interfaz con la logica del juego */

(function () {
  "use strict";

  var formularioInicio = document.getElementById("formulario-inicio");
  var inputNombre = document.getElementById("input-nombre");
  var selectNivel = document.getElementById("select-nivel");
  var mensajeErrorInicio = document.getElementById("mensaje-error-inicio");

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

  /* Valida los datos ingresados antes de iniciar la partida */
  function alEnviarFormulario(evento) {
    var resultadoNombre;
    var resultadoNivel;

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

    mostrarError("Falta conectar la logica del juego.");
  }

  formularioInicio.addEventListener("submit", alEnviarFormulario);
  inputNombre.addEventListener("input", ocultarError);
  selectNivel.addEventListener("change", ocultarError);
})();

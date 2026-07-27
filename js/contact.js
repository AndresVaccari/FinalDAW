/* Formulario de contacto: valida los datos y abre el programa de correo */

(function () {
  "use strict";

  var MAIL_DE_DESTINO = "andresvaccari34@gmail.com";

  var formularioContacto = document.getElementById("formulario-contacto");
  var inputNombre = document.getElementById("input-nombre-contacto");
  var inputMail = document.getElementById("input-mail");
  var inputMensaje = document.getElementById("input-mensaje");
  var mensajeError = document.getElementById("mensaje-error-contacto");
  var mensajeExito = document.getElementById("mensaje-exito-contacto");

  /* Muestra un mensaje de error dentro de la pagina */
  function mostrarError(texto) {
    mensajeError.textContent = texto;
    mensajeError.className = "mensaje-error";
    mensajeExito.className = "mensaje-exito oculto";
  }

  /* Muestra el mensaje de envio correcto */
  function mostrarExito(texto) {
    mensajeExito.textContent = texto;
    mensajeExito.className = "mensaje-exito";
    mensajeError.className = "mensaje-error oculto";
  }

  /* Limpia los dos mensajes de la pagina */
  function limpiarMensajes() {
    mensajeError.className = "mensaje-error oculto";
    mensajeExito.className = "mensaje-exito oculto";
  }

  /* Arma el enlace mailto con el asunto y el cuerpo del mensaje */
  function armarEnlaceMailto(nombre, mail, mensaje) {
    var asunto = encodeURIComponent("Consulta desde el Memotest de Animales");
    var cuerpo = encodeURIComponent(
      "Nombre: " + nombre + "\nMail: " + mail + "\n\n" + mensaje
    );

    return "mailto:" + MAIL_DE_DESTINO + "?subject=" + asunto + "&body=" + cuerpo;
  }

  /* Valida el formulario y, si esta todo bien, abre el cliente de correo */
  function alEnviarFormulario(evento) {
    var resultadoNombre;
    var resultadoMail;
    var resultadoMensaje;
    var nombre;
    var mail;
    var mensaje;

    evento.preventDefault();
    limpiarMensajes();

    resultadoNombre = Validaciones.validarNombre(inputNombre.value);

    if (!resultadoNombre.valido) {
      mostrarError(resultadoNombre.mensaje);
      inputNombre.focus();
      return;
    }

    resultadoMail = Validaciones.validarEmail(inputMail.value);

    if (!resultadoMail.valido) {
      mostrarError(resultadoMail.mensaje);
      inputMail.focus();
      return;
    }

    resultadoMensaje = Validaciones.validarMensaje(inputMensaje.value);

    if (!resultadoMensaje.valido) {
      mostrarError(resultadoMensaje.mensaje);
      inputMensaje.focus();
      return;
    }

    nombre = Validaciones.limpiarTexto(inputNombre.value);
    mail = Validaciones.limpiarTexto(inputMail.value);
    mensaje = Validaciones.limpiarTexto(inputMensaje.value);

    mostrarExito("Abrimos tu programa de correo con el mensaje listo para enviar.");
    window.location.href = armarEnlaceMailto(nombre, mail, mensaje);
  }

  formularioContacto.addEventListener("submit", alEnviarFormulario);
  inputNombre.addEventListener("input", limpiarMensajes);
  inputMail.addEventListener("input", limpiarMensajes);
  inputMensaje.addEventListener("input", limpiarMensajes);
})();

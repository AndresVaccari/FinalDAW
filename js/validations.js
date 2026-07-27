/* Validaciones reutilizables del sitio.
   Cada funcion devuelve un objeto { valido: boolean, mensaje: string } */

var Validaciones = (function () {
  "use strict";

  var LARGO_MINIMO_NOMBRE = 3;
  var LARGO_MINIMO_MENSAJE = 6;
  var NIVELES_VALIDOS = ["facil", "medio", "dificil"];

  /* Acepta letras (con acentos y enie), numeros y espacios */
  var PATRON_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9 ]+$/;
  var PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  /* Saca los espacios del principio y del final */
  function limpiarTexto(texto) {
    if (typeof texto !== "string") {
      return "";
    }
    return texto.trim();
  }

  /* Arma la respuesta de una validacion */
  function armarResultado(valido, mensaje) {
    return { valido: valido, mensaje: mensaje };
  }

  /* Valida el nombre del jugador o del formulario de contacto */
  function validarNombre(nombre) {
    var nombreLimpio = limpiarTexto(nombre);

    if (nombreLimpio === "") {
      return armarResultado(false, "Tenes que ingresar un nombre.");
    }

    if (nombreLimpio.length < LARGO_MINIMO_NOMBRE) {
      return armarResultado(
        false,
        "El nombre debe tener al menos " + LARGO_MINIMO_NOMBRE + " caracteres."
      );
    }

    if (!PATRON_NOMBRE.test(nombreLimpio)) {
      return armarResultado(
        false,
        "El nombre solo puede tener letras, numeros y espacios."
      );
    }

    return armarResultado(true, "");
  }

  /* Valida que el nivel elegido sea uno de los disponibles */
  function validarNivel(nivel) {
    var i;

    for (i = 0; i < NIVELES_VALIDOS.length; i++) {
      if (NIVELES_VALIDOS[i] === nivel) {
        return armarResultado(true, "");
      }
    }

    return armarResultado(false, "Tenes que elegir un nivel de dificultad.");
  }

  /* Valida el formato del correo electronico */
  function validarEmail(email) {
    var emailLimpio = limpiarTexto(email);

    if (emailLimpio === "") {
      return armarResultado(false, "Tenes que ingresar un mail.");
    }

    if (!PATRON_EMAIL.test(emailLimpio)) {
      return armarResultado(false, "El mail ingresado no tiene un formato valido.");
    }

    return armarResultado(true, "");
  }

  /* Valida el mensaje del formulario de contacto */
  function validarMensaje(mensaje) {
    var mensajeLimpio = limpiarTexto(mensaje);

    if (mensajeLimpio === "") {
      return armarResultado(false, "Tenes que escribir un mensaje.");
    }

    if (mensajeLimpio.length < LARGO_MINIMO_MENSAJE) {
      return armarResultado(false, "El mensaje debe tener mas de 5 caracteres.");
    }

    return armarResultado(true, "");
  }

  return {
    limpiarTexto: limpiarTexto,
    validarNombre: validarNombre,
    validarNivel: validarNivel,
    validarEmail: validarEmail,
    validarMensaje: validarMensaje
  };
})();

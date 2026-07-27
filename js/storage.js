/* Guardado de los resultados de las partidas en LocalStorage */

var Almacenamiento = (function () {
  "use strict";

  var CLAVE_RANKING = "memotest-ranking";
  var CLAVE_TEMA = "memotest-tema";
  var CLAVE_SONIDO = "memotest-sonido";
  var MAXIMO_DE_PARTIDAS = 50;

  /* Algunos navegadores bloquean LocalStorage, por eso se controla el acceso */
  function hayLocalStorage() {
    try {
      return typeof window.localStorage !== "undefined" &&
        window.localStorage !== null;
    } catch (error) {
      return false;
    }
  }

  /* Devuelve true si el valor recibido es un arreglo */
  function esArreglo(valor) {
    return Object.prototype.toString.call(valor) === "[object Array]";
  }

  /* Lee el ranking guardado. Si no hay nada o el dato esta roto devuelve
     un arreglo vacio para no romper la interfaz. */
  function obtenerRanking() {
    var textoGuardado;
    var datos;

    if (!hayLocalStorage()) {
      return [];
    }

    textoGuardado = window.localStorage.getItem(CLAVE_RANKING);

    if (textoGuardado === null || textoGuardado === "") {
      return [];
    }

    try {
      datos = JSON.parse(textoGuardado);
    } catch (error) {
      return [];
    }

    if (!esArreglo(datos)) {
      return [];
    }

    return datos;
  }

  /* Escribe el ranking completo en LocalStorage */
  function escribirRanking(ranking) {
    if (!hayLocalStorage()) {
      return false;
    }

    try {
      window.localStorage.setItem(CLAVE_RANKING, JSON.stringify(ranking));
      return true;
    } catch (error) {
      return false;
    }
  }

  /* Agrega el resultado de una partida terminada al ranking */
  function guardarPartida(resultado) {
    var ranking = obtenerRanking();

    ranking.push({
      nombreJugador: resultado.nombreJugador,
      puntaje: resultado.puntaje,
      nivel: resultado.nivel,
      nombreNivel: resultado.nombreNivel,
      intentos: resultado.intentos,
      errores: resultado.errores,
      duracion: resultado.segundos,
      fecha: new Date().getTime()
    });

    /* Se guardan solo las ultimas partidas para no llenar el navegador */
    if (ranking.length > MAXIMO_DE_PARTIDAS) {
      ranking = ranking.slice(ranking.length - MAXIMO_DE_PARTIDAS);
    }

    return escribirRanking(ranking);
  }

  /* Borra todo el historial de partidas */
  function borrarRanking() {
    if (!hayLocalStorage()) {
      return false;
    }

    try {
      window.localStorage.removeItem(CLAVE_RANKING);
      return true;
    } catch (error) {
      return false;
    }
  }

  /* Guarda el tema elegido por el usuario */
  function guardarTema(tema) {
    if (!hayLocalStorage()) {
      return false;
    }

    try {
      window.localStorage.setItem(CLAVE_TEMA, tema);
      return true;
    } catch (error) {
      return false;
    }
  }

  /* Devuelve el tema guardado, o "claro" si todavia no se eligio ninguno */
  function obtenerTema() {
    var temaGuardado;

    if (!hayLocalStorage()) {
      return "claro";
    }

    temaGuardado = window.localStorage.getItem(CLAVE_TEMA);

    if (temaGuardado !== "claro" && temaGuardado !== "oscuro") {
      return "claro";
    }

    return temaGuardado;
  }

  /* Guarda si los sonidos quedaron activados o silenciados */
  function guardarSonido(activo) {
    if (!hayLocalStorage()) {
      return false;
    }

    try {
      window.localStorage.setItem(CLAVE_SONIDO, activo ? "activado" : "silenciado");
      return true;
    } catch (error) {
      return false;
    }
  }

  /* Devuelve true si los sonidos estan activados.
     Si el usuario nunca eligio, arrancan activados. */
  function obtenerSonido() {
    var valorGuardado;

    if (!hayLocalStorage()) {
      return true;
    }

    valorGuardado = window.localStorage.getItem(CLAVE_SONIDO);

    return valorGuardado !== "silenciado";
  }

  return {
    obtenerRanking: obtenerRanking,
    guardarPartida: guardarPartida,
    borrarRanking: borrarRanking,
    guardarTema: guardarTema,
    obtenerTema: obtenerTema,
    guardarSonido: guardarSonido,
    obtenerSonido: obtenerSonido
  };
})();

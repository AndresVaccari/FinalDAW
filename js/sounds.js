/* Sonidos del juego, con opcion para activarlos o silenciarlos */

var Sonidos = (function () {
  "use strict";

  var CARPETA = "assets/sounds/";

  /* Cada evento del juego tiene su archivo de sonido.
     Los cuatro efectos son de Leszek_Szary en freesound.org y estan libres
     de derechos. Las fuentes estan detalladas en el README del proyecto. */
  var ARCHIVOS = {
    carta: "click.wav",
    acierto: "good.wav",
    error: "error.wav",
    fin: "success-1.wav"
  };

  var audios = {};
  var activo = true;

  var botonSonido = document.getElementById("boton-sonido");

  /* Crea un objeto Audio por cada sonido para no cargarlos en cada jugada */
  function precargarSonidos() {
    var nombre;

    for (nombre in ARCHIVOS) {
      if (ARCHIVOS.hasOwnProperty(nombre)) {
        audios[nombre] = new Audio(CARPETA + ARCHIVOS[nombre]);
        audios[nombre].preload = "auto";
      }
    }
  }

  /* Reproduce un sonido desde el principio, si estan activados */
  function reproducir(nombre) {
    var audio = audios[nombre];
    var promesa;

    if (!activo || audio === undefined) {
      return;
    }

    /* Volver el audio a cero permite repetir el sonido en jugadas seguidas */
    audio.currentTime = 0;
    promesa = audio.play();

    /* Los navegadores bloquean el audio hasta que el usuario interactua con
       la pagina. En ese caso play() falla y hay que ignorar el error para
       que no rompa el juego. */
    if (promesa !== undefined && typeof promesa.catch === "function") {
      promesa.catch(function () {
        return;
      });
    }
  }

  /* Actualiza el texto del boton segun el estado de los sonidos */
  function actualizarBoton() {
    if (activo) {
      botonSonido.textContent = "Sonido activado";
      botonSonido.setAttribute("aria-label", "Silenciar los sonidos");
      return;
    }

    botonSonido.textContent = "Sonido silenciado";
    botonSonido.setAttribute("aria-label", "Activar los sonidos");
  }

  /* Activa o silencia los sonidos y guarda la preferencia */
  function alternarSonido() {
    activo = !activo;

    actualizarBoton();
    Almacenamiento.guardarSonido(activo);

    /* Se avisa con un sonido que quedaron activados */
    if (activo) {
      reproducir("carta");
    }
  }

  precargarSonidos();
  activo = Almacenamiento.obtenerSonido();
  actualizarBoton();
  botonSonido.addEventListener("click", alternarSonido);

  return {
    reproducir: reproducir
  };
})();

/* Cambio entre modo claro y modo oscuro, compartido por todas las paginas */

(function () {
  "use strict";

  var botonTema = document.getElementById("boton-tema");
  var temaActual = "claro";

  /* Aplica el tema al body y actualiza el texto del boton */
  function aplicarTema(tema) {
    temaActual = tema;

    if (tema === "oscuro") {
      document.body.className = "tema-oscuro";
      botonTema.textContent = "Modo claro";
      botonTema.setAttribute("aria-label", "Cambiar a modo claro");
      return;
    }

    document.body.className = "";
    botonTema.textContent = "Modo oscuro";
    botonTema.setAttribute("aria-label", "Cambiar a modo oscuro");
  }

  /* Alterna el tema y guarda la preferencia del usuario */
  function alternarTema() {
    if (temaActual === "oscuro") {
      aplicarTema("claro");
    } else {
      aplicarTema("oscuro");
    }

    Almacenamiento.guardarTema(temaActual);
  }

  aplicarTema(Almacenamiento.obtenerTema());
  botonTema.addEventListener("click", alternarTema);
})();

/* Logica del juego de memoria: niveles, mezcla de cartas y armado del tablero */

var Juego = (function () {
  "use strict";

  /* Configuracion de cada nivel de dificultad */
  var NIVELES = {
    facil: { nombre: "Facil", pares: 8, penalizacion: 10 },
    medio: { nombre: "Medio", pares: 10, penalizacion: 20 },
    dificil: { nombre: "Dificil", pares: 18, penalizacion: 30 }
  };

  /* Temática del juego: animales representados con emojis */
  var ANIMALES = [
    { emoji: "🐶", nombre: "perro" },
    { emoji: "🐱", nombre: "gato" },
    { emoji: "🐭", nombre: "raton" },
    { emoji: "🐹", nombre: "hamster" },
    { emoji: "🐰", nombre: "conejo" },
    { emoji: "🦊", nombre: "zorro" },
    { emoji: "🐻", nombre: "oso" },
    { emoji: "🐼", nombre: "panda" },
    { emoji: "🐨", nombre: "koala" },
    { emoji: "🐯", nombre: "tigre" },
    { emoji: "🦁", nombre: "leon" },
    { emoji: "🐮", nombre: "vaca" },
    { emoji: "🐷", nombre: "cerdo" },
    { emoji: "🐸", nombre: "rana" },
    { emoji: "🐵", nombre: "mono" },
    { emoji: "🐔", nombre: "gallina" },
    { emoji: "🐧", nombre: "pinguino" },
    { emoji: "🦉", nombre: "buho" },
    { emoji: "🐺", nombre: "lobo" },
    { emoji: "🐴", nombre: "caballo" },
    { emoji: "🐢", nombre: "tortuga" },
    { emoji: "🐳", nombre: "ballena" }
  ];

  /* Tiempo que quedan visibles dos cartas que no coinciden */
  var MILISEGUNDOS_PARA_TAPAR = 900;

  /* Estado de la partida en curso */
  var estado = {
    nombreJugador: "",
    nivel: "facil",
    cartas: [],
    primeraCarta: null,
    segundaCarta: null,
    tableroBloqueado: false,
    partidaActiva: false
  };

  var tablero = document.getElementById("tablero");

  /* Mezcla un arreglo con el algoritmo de Fisher-Yates */
  function mezclarArreglo(arreglo) {
    var copia = arreglo.slice();
    var indiceAleatorio;
    var temporal;
    var i;

    for (i = copia.length - 1; i > 0; i--) {
      indiceAleatorio = Math.floor(Math.random() * (i + 1));
      temporal = copia[i];
      copia[i] = copia[indiceAleatorio];
      copia[indiceAleatorio] = temporal;
    }

    return copia;
  }

  /* Arma el mazo duplicando cada animal para formar los pares */
  function armarCartas(nivel) {
    var configuracion = NIVELES[nivel];
    var animalesElegidos = mezclarArreglo(ANIMALES).slice(0, configuracion.pares);
    var cartas = [];
    var i;

    for (i = 0; i < animalesElegidos.length; i++) {
      cartas.push({
        emoji: animalesElegidos[i].emoji,
        nombre: animalesElegidos[i].nombre,
        emparejada: false
      });
      cartas.push({
        emoji: animalesElegidos[i].emoji,
        nombre: animalesElegidos[i].nombre,
        emparejada: false
      });
    }

    return mezclarArreglo(cartas);
  }

  /* Crea el elemento HTML de una carta */
  function crearElementoCarta(indice) {
    var boton = document.createElement("button");
    var dorso = document.createElement("span");
    var frente = document.createElement("span");

    boton.className = "carta";
    boton.type = "button";
    boton.setAttribute("data-indice", indice);
    boton.setAttribute("aria-label", "Carta " + (indice + 1) + ", tapada");

    dorso.className = "carta-cara carta-dorso";
    dorso.textContent = "?";

    frente.className = "carta-cara carta-frente";
    frente.textContent = estado.cartas[indice].emoji;

    boton.appendChild(dorso);
    boton.appendChild(frente);
    boton.addEventListener("click", alHacerClickEnCarta);

    return boton;
  }

  /* Dibuja todas las cartas del nivel elegido dentro del tablero */
  function dibujarTablero() {
    var i;

    tablero.innerHTML = "";
    tablero.className = "tablero tablero-" + estado.nivel;

    for (i = 0; i < estado.cartas.length; i++) {
      tablero.appendChild(crearElementoCarta(i));
    }
  }

  /* Muestra una carta y actualiza su texto alternativo */
  function descubrirCarta(elemento, indice) {
    elemento.className = "carta descubierta";
    elemento.setAttribute(
      "aria-label",
      "Carta " + (indice + 1) + ", " + estado.cartas[indice].nombre
    );
  }

  /* Vuelve a tapar una carta */
  function taparCarta(elemento, indice) {
    elemento.className = "carta";
    elemento.setAttribute("aria-label", "Carta " + (indice + 1) + ", tapada");
  }

  /* Deja una carta fija en el tablero porque ya encontro su pareja */
  function marcarCartaEmparejada(elemento, indice) {
    estado.cartas[indice].emparejada = true;
    elemento.className = "carta descubierta emparejada";
    elemento.setAttribute(
      "aria-label",
      "Carta " + (indice + 1) + ", " + estado.cartas[indice].nombre + ", emparejada"
    );
  }

  /* Limpia la seleccion del turno y habilita el tablero */
  function limpiarSeleccion() {
    estado.primeraCarta = null;
    estado.segundaCarta = null;
    estado.tableroBloqueado = false;
  }

  /* Tapa las dos cartas del turno cuando no forman un par */
  function taparCartasDelTurno() {
    taparCarta(estado.primeraCarta.elemento, estado.primeraCarta.indice);
    taparCarta(estado.segundaCarta.elemento, estado.segundaCarta.indice);
    limpiarSeleccion();
  }

  /* Compara las dos cartas seleccionadas en el turno */
  function compararCartas() {
    var primera = estado.cartas[estado.primeraCarta.indice];
    var segunda = estado.cartas[estado.segundaCarta.indice];

    if (primera.emoji === segunda.emoji) {
      marcarCartaEmparejada(estado.primeraCarta.elemento, estado.primeraCarta.indice);
      marcarCartaEmparejada(estado.segundaCarta.elemento, estado.segundaCarta.indice);
      limpiarSeleccion();
      return;
    }

    /* Las cartas incorrectas quedan visibles un momento antes de taparse */
    estado.primeraCarta.elemento.className = "carta descubierta incorrecta";
    estado.segundaCarta.elemento.className = "carta descubierta incorrecta";
    setTimeout(taparCartasDelTurno, MILISEGUNDOS_PARA_TAPAR);
  }

  /* Da vuelta la carta sobre la que se hizo click */
  function alHacerClickEnCarta() {
    var indice = parseInt(this.getAttribute("data-indice"), 10);

    if (!estado.partidaActiva || estado.tableroBloqueado) {
      return;
    }

    /* No se puede elegir una carta ya emparejada */
    if (estado.cartas[indice].emparejada) {
      return;
    }

    /* No se puede elegir dos veces la misma carta en el mismo turno */
    if (estado.primeraCarta !== null && estado.primeraCarta.indice === indice) {
      return;
    }

    descubrirCarta(this, indice);

    if (estado.primeraCarta === null) {
      estado.primeraCarta = { indice: indice, elemento: this };
      return;
    }

    estado.segundaCarta = { indice: indice, elemento: this };
    estado.tableroBloqueado = true;
    compararCartas();
  }

  /* Inicia una partida nueva con el jugador y el nivel indicados */
  function iniciarPartida(nombreJugador, nivel) {
    estado.nombreJugador = nombreJugador;
    estado.nivel = nivel;
    estado.cartas = armarCartas(nivel);
    estado.primeraCarta = null;
    estado.segundaCarta = null;
    estado.tableroBloqueado = false;
    estado.partidaActiva = true;

    dibujarTablero();
  }

  /* Indica si hay suficientes animales para armar el nivel pedido */
  function hayAnimalesSuficientes(nivel) {
    return ANIMALES.length >= NIVELES[nivel].pares;
  }

  /* Devuelve el nombre visible de un nivel */
  function obtenerNombreNivel(nivel) {
    return NIVELES[nivel].nombre;
  }

  return {
    iniciarPartida: iniciarPartida,
    hayAnimalesSuficientes: hayAnimalesSuficientes,
    obtenerNombreNivel: obtenerNombreNivel
  };
})();

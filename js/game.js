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

  /* Estado de la partida en curso */
  var estado = {
    nombreJugador: "",
    nivel: "facil",
    cartas: [],
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

  /* Da vuelta la carta sobre la que se hizo click */
  function alHacerClickEnCarta() {
    if (!estado.partidaActiva) {
      return;
    }

    this.className = "carta descubierta";
  }

  /* Inicia una partida nueva con el jugador y el nivel indicados */
  function iniciarPartida(nombreJugador, nivel) {
    estado.nombreJugador = nombreJugador;
    estado.nivel = nivel;
    estado.cartas = armarCartas(nivel);
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

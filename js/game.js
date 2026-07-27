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

  /* Valores del sistema de puntaje */
  var PUNTOS_POR_PAR = 100;
  var PUNTOS_QUE_RESTA_CADA_SEGUNDO = 1;
  var BONUS_POR_TERMINAR = 300;

  /* Estado de la partida en curso */
  var estado = {
    nombreJugador: "",
    nivel: "facil",
    cartas: [],
    primeraCarta: null,
    segundaCarta: null,
    tableroBloqueado: false,
    partidaActiva: false,
    intentos: 0,
    errores: 0,
    paresEncontrados: 0,
    puntaje: 0,
    segundos: 0,
    temporizadorId: null
  };

  var tablero = document.getElementById("tablero");
  var datoIntentos = document.getElementById("dato-intentos");
  var datoPares = document.getElementById("dato-pares");
  var datoErrores = document.getElementById("dato-errores");
  var datoPuntaje = document.getElementById("dato-puntaje");
  var datoTiempo = document.getElementById("dato-tiempo");

  /* Funcion que se ejecuta cuando el jugador encuentra todos los pares */
  var funcionAlFinalizar = null;

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

  /* Tapa las dos cartas del turno cuando no forman un par.
     Puede quedar pendiente si la partida se reinicio, por eso se controla antes. */
  function taparCartasDelTurno() {
    if (estado.primeraCarta === null || estado.segundaCarta === null) {
      return;
    }

    taparCarta(estado.primeraCarta.elemento, estado.primeraCarta.indice);
    taparCarta(estado.segundaCarta.elemento, estado.segundaCarta.indice);
    limpiarSeleccion();
  }

  /* Calcula el puntaje actual: los pares suman, los errores y el tiempo restan.
     El puntaje nunca puede quedar por debajo de cero. */
  function calcularPuntaje() {
    var penalizacion = NIVELES[estado.nivel].penalizacion;
    var total =
      estado.paresEncontrados * PUNTOS_POR_PAR -
      estado.errores * penalizacion -
      estado.segundos * PUNTOS_QUE_RESTA_CADA_SEGUNDO;

    if (total < 0) {
      return 0;
    }

    return total;
  }

  /* Agrega un cero adelante para mostrar siempre dos digitos */
  function agregarCeroAdelante(numero) {
    if (numero < 10) {
      return "0" + numero;
    }

    return "" + numero;
  }

  /* Convierte una cantidad de segundos al formato mm:ss */
  function formatearTiempo(segundos) {
    var minutos = Math.floor(segundos / 60);
    var resto = segundos % 60;

    return agregarCeroAdelante(minutos) + ":" + agregarCeroAdelante(resto);
  }

  /* Vuelca los contadores del estado en el panel de datos */
  function actualizarPanel() {
    estado.puntaje = calcularPuntaje();

    datoIntentos.textContent = estado.intentos;
    datoPares.textContent = estado.paresEncontrados;
    datoErrores.textContent = estado.errores;
    datoPuntaje.textContent = estado.puntaje;
    datoTiempo.textContent = formatearTiempo(estado.segundos);
  }

  /* Suma un segundo y refresca el panel */
  function correrUnSegundo() {
    estado.segundos = estado.segundos + 1;
    actualizarPanel();
  }

  /* Arranca el temporizador si todavia no esta corriendo */
  function iniciarTemporizador() {
    if (estado.temporizadorId !== null) {
      return;
    }

    estado.temporizadorId = setInterval(correrUnSegundo, 1000);
  }

  /* Frena el temporizador de la partida */
  function detenerTemporizador() {
    if (estado.temporizadorId === null) {
      return;
    }

    clearInterval(estado.temporizadorId);
    estado.temporizadorId = null;
  }

  /* Cierra la partida, frena el reloj y avisa el resultado a la interfaz */
  function finalizarPartida() {
    var resultado;

    detenerTemporizador();
    estado.partidaActiva = false;
    estado.puntaje = calcularPuntaje() + BONUS_POR_TERMINAR;

    datoPuntaje.textContent = estado.puntaje;

    resultado = {
      nombreJugador: estado.nombreJugador,
      nivel: estado.nivel,
      nombreNivel: NIVELES[estado.nivel].nombre,
      intentos: estado.intentos,
      errores: estado.errores,
      paresEncontrados: estado.paresEncontrados,
      segundos: estado.segundos,
      tiempo: formatearTiempo(estado.segundos),
      puntaje: estado.puntaje
    };

    if (funcionAlFinalizar !== null) {
      funcionAlFinalizar(resultado);
    }
  }

  /* Revisa si ya se encontraron todos los pares del tablero */
  function verificarFinDePartida() {
    var totalDePares = NIVELES[estado.nivel].pares;

    if (estado.paresEncontrados === totalDePares) {
      finalizarPartida();
    }
  }

  /* Compara las dos cartas seleccionadas en el turno */
  function compararCartas() {
    var primera = estado.cartas[estado.primeraCarta.indice];
    var segunda = estado.cartas[estado.segundaCarta.indice];

    estado.intentos = estado.intentos + 1;

    if (primera.emoji === segunda.emoji) {
      estado.paresEncontrados = estado.paresEncontrados + 1;
      marcarCartaEmparejada(estado.primeraCarta.elemento, estado.primeraCarta.indice);
      marcarCartaEmparejada(estado.segundaCarta.elemento, estado.segundaCarta.indice);
      limpiarSeleccion();
      actualizarPanel();
      verificarFinDePartida();
      return;
    }

    estado.errores = estado.errores + 1;
    actualizarPanel();

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

    /* El reloj arranca recien cuando el jugador descubre la primera carta */
    iniciarTemporizador();
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
    detenerTemporizador();

    estado.nombreJugador = nombreJugador;
    estado.nivel = nivel;
    estado.cartas = armarCartas(nivel);
    estado.primeraCarta = null;
    estado.segundaCarta = null;
    estado.tableroBloqueado = false;
    estado.partidaActiva = true;
    estado.intentos = 0;
    estado.errores = 0;
    estado.paresEncontrados = 0;
    estado.puntaje = 0;
    estado.segundos = 0;

    dibujarTablero();
    actualizarPanel();
  }

  /* Indica si hay suficientes animales para armar el nivel pedido */
  function hayAnimalesSuficientes(nivel) {
    return ANIMALES.length >= NIVELES[nivel].pares;
  }

  /* Devuelve el nombre visible de un nivel */
  function obtenerNombreNivel(nivel) {
    return NIVELES[nivel].nombre;
  }

  /* Corta la partida en curso, por ejemplo al volver a la pantalla de inicio */
  function detenerPartida() {
    detenerTemporizador();
    estado.partidaActiva = false;
    estado.cartas = [];
    limpiarSeleccion();
    tablero.innerHTML = "";
  }

  /* Guarda la funcion que la interfaz quiere ejecutar al terminar la partida */
  function definirAlFinalizar(funcion) {
    funcionAlFinalizar = funcion;
  }

  return {
    iniciarPartida: iniciarPartida,
    detenerPartida: detenerPartida,
    definirAlFinalizar: definirAlFinalizar,
    hayAnimalesSuficientes: hayAnimalesSuficientes,
    obtenerNombreNivel: obtenerNombreNivel
  };
})();

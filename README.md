# Memotest de Animales

Juego de memoria (memotest) desarrollado como Proyecto Final de la materia
**Desarrollo y Arquitecturas Web** — Ingeniería en Sistemas Informáticos, UAI 2026.

**Jugar online:** https://andresvaccari.github.io/FinalDAW/

---

## Descripción del juego

El tablero se arma con una cantidad par de cartas dadas vuelta. Cada carta tiene
una pareja. El jugador destapa dos cartas por turno:

- Si coinciden, quedan descubiertas y suma puntos.
- Si no coinciden, se vuelven a tapar después de un momento y suma un error.

La partida termina cuando se encuentran todos los pares del tablero.

## Temática elegida

**Animales**, representados con emojis. Se eligieron emojis en lugar de imágenes
para que el juego cargue al instante, se vea igual en cualquier dispositivo y no
dependa de archivos externos ni de recursos con derechos de autor.

El mazo tiene 22 animales disponibles, suficientes para el nivel más difícil, que
necesita 18 pares.

## Reglas del juego

1. Antes de empezar hay que ingresar un nombre y elegir un nivel de dificultad.
2. Las cartas se mezclan al azar al iniciar cada partida.
3. Se pueden seleccionar dos cartas por turno.
4. No se puede seleccionar dos veces la misma carta en el mismo turno.
5. No se puede seleccionar una carta que ya fue emparejada.
6. Mientras dos cartas incorrectas están visibles, el tablero queda bloqueado.
7. El temporizador arranca cuando se destapa la primera carta y se detiene al ganar.
8. La partida se puede reiniciar en cualquier momento sin recargar la página.

## Niveles de dificultad

| Nivel   | Tablero | Cartas | Pares | Penalización por error |
| ------- | ------- | ------ | ----- | ---------------------- |
| Fácil   | 4x4     | 16     | 8     | -10 puntos             |
| Medio   | 4x5     | 20     | 10    | -20 puntos             |
| Difícil | 6x6     | 36     | 18    | -30 puntos             |

### Modo progresivo

Marcando la casilla **"Modo progresivo"** en la pantalla de inicio, el juego arranca
en nivel fácil y va avanzando solo: al completar un tablero se muestra un mensaje
intermedio con lo que hiciste en ese nivel y el puntaje acumulado, y con un botón se
continúa al siguiente nivel **sin recargar la página**.

- Recorrido: Fácil → Medio → Difícil.
- El puntaje se **acumula** entre niveles (los tres bonus de +300 se suman).
- Al completar los tres niveles se muestra un **resultado general** con los intentos,
  errores, tiempo y puntaje totales.
- La partida progresiva se guarda en el ranking como una sola entrada de nivel
  "Progresivo", con el puntaje acumulado.
- Mientras el modo progresivo está activo, el selector de nivel queda deshabilitado,
  porque el nivel lo decide el juego.

## Sistema de puntaje

El puntaje se calcula así:

```
puntaje = (pares encontrados x 100)
        - (errores x penalización del nivel)
        - (1 punto por cada segundo transcurrido)
```

- Cada **par correcto** suma **+100 puntos**.
- Cada **error** resta según el nivel: **-10** (fácil), **-20** (medio), **-30** (difícil).
- Cada **segundo** transcurrido resta **-1 punto**.
- Al **completar la partida** se suma un bonus de **+300 puntos**.

El puntaje se muestra en pantalla y se actualiza durante toda la partida.

**Nunca puede quedar negativo:** si el cálculo da menos de cero, se muestra 0. El
bonus final se suma después de ese control, así que el puntaje final siempre es un
número coherente.

Los niveles más difíciles otorgan más puntaje porque tienen más pares para
encontrar (18 pares x 100 = 1800 puntos base contra 800 del nivel fácil).

## Funcionalidades implementadas

### Obligatorias

- Validación del nombre del jugador con JavaScript (mínimo 3 caracteres,
  solo letras, números y espacios).
- Selección de nivel de dificultad antes de comenzar.
- Tablero generado dinámicamente con JavaScript según el nivel.
- Mezcla aleatoria de las cartas con el algoritmo de Fisher-Yates.
- Comparación de pares con bloqueo del tablero mientras se resuelve el turno.
- Contadores de intentos, pares encontrados, errores y puntaje en vivo.
- Temporizador que arranca con la primera carta y se detiene al ganar.
- Detección automática del fin de la partida.
- Modal final con nombre, nivel, intentos, errores, tiempo total y puntaje.
- Reinicio de partida sin recargar la página.
- Opción para volver al inicio y cambiar el jugador o el nivel.
- Página de contacto con validaciones en JavaScript y apertura del programa
  de correo del sistema.
- Navegación entre las páginas, link al repositorio y link a Github Pages
  (ambos se abren en una pestaña nueva).
- Diseño responsive con Flexbox para desktop, tablet y mobile.
- **Sin `alert`, `prompt` ni `confirm`:** todos los mensajes son modales o
  carteles propios dentro de la interfaz.

### Adicionales

- **Modo progresivo:** el jugador avanza de fácil a difícil acumulando puntaje, con
  mensaje intermedio entre niveles y resultado general al terminar (ver más arriba).
- **Ranking con LocalStorage:** guarda nombre, puntaje, nivel, intentos, errores,
  fecha, hora y duración de cada partida.
- Modal de ranking con orden configurable por puntaje, fecha, duración o nivel.
- Borrado del historial confirmado con un modal propio.
- **Sonidos** al seleccionar una carta, al encontrar un par, al equivocarse y al
  completar el nivel, con un botón para activarlos o silenciarlos y la preferencia
  recordada en LocalStorage.
- **Modo claro y modo oscuro**, con la preferencia recordada en LocalStorage.
- Estados visuales diferenciados para cartas seleccionadas, correctas e
  incorrectas, marcados con **color y con un símbolo** (✔ / ✖), para no depender
  únicamente del color.
- Textos alternativos (`aria-label`) en cada carta, que se actualizan según su estado.

## Tecnologías

- **HTML5**
- **CSS3** con Flexbox y media queries
- **JavaScript ES5** — sin `let`, `const`, arrow functions ni template literals
- Sin frameworks ni librerías externas

## Estructura de archivos

```
/assets
  /sounds          Efectos de sonido del juego (.wav)
/css
  reset.css        Reset de los estilos por defecto del navegador
  styles.css       Estilos del sitio, modo oscuro y responsive
/js
  validations.js   Validaciones reutilizables (nombre, nivel, mail, mensaje)
  storage.js       Lectura y escritura en LocalStorage
  theme.js         Cambio entre modo claro y modo oscuro
  sounds.js        Reproducción de sonidos y opción para silenciarlos
  game.js          Lógica del juego: niveles, mezcla, tablero y puntaje
  main.js          Conexión entre la interfaz y la lógica del juego
  contact.js       Formulario de contacto
/pages
  contact.html     Página de contacto
index.html         Página principal del juego
README.md
.gitignore
```

## Créditos de los sonidos

Todos los efectos de sonido son de **Leszek_Szary**, publicados en
[freesound.org](https://freesound.org/) y libres de derechos.

| Archivo         | Evento del juego            | Fuente                                                    |
| --------------- | --------------------------- | --------------------------------------------------------- |
| `click.wav`     | Seleccionar una carta       | https://freesound.org/people/Leszek_Szary/sounds/171520/  |
| `good.wav`      | Encontrar un par correcto   | https://freesound.org/people/Leszek_Szary/sounds/146723/  |
| `error.wav`     | Equivocarse en un par       | https://freesound.org/people/Leszek_Szary/sounds/146730/  |
| `success-1.wav` | Completar el nivel          | https://freesound.org/people/Leszek_Szary/sounds/171671/  |

Los archivos están en `assets/sounds/`.

## Convenciones de nombres

| Elemento                        | Estilo      | Ejemplo                       |
| ------------------------------- | ----------- | ----------------------------- |
| Archivos y carpetas             | Kebab Case  | `contact.html`, `styles.css`  |
| Clases e id de HTML y CSS       | Kebab Case  | `.panel-datos`, `#dato-nivel` |
| Variables y funciones de JS     | Camel Case  | `paresEncontrados`            |
| Constantes de JS                | Snake Case en mayúsculas | `PUNTOS_POR_PAR` |
| Módulos de JS                   | Pascal Case | `Juego`, `Validaciones`       |

## Cómo ejecutarlo localmente

El proyecto no necesita instalación ni dependencias. Alcanza con abrir
`index.html` en el navegador.

Para probarlo con un servidor local:

```bash
python3 -m http.server 8000
```

Y entrar a http://localhost:8000

## Integrantes

- Andrés Vaccari

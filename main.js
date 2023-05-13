const cardContainer = document.getElementById('card-container');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const result = document.getElementById('result');

let currentCard;
let intervalId;
let hasGuessed = false;

// Obtener una carta aleatoria de la API de Scryfall
function obtenerCartaAleatoria() {
  return fetch('https://api.scryfall.com/cards/random')
    .then(response => response.json())
    .then(data => {
      console.log(data); // Registrar los datos de la carta en la consola para inspección
      const carta = data.card_faces ? data.card_faces[0] : data;
      const convertedManaCost = carta.cmc || 0; // Obtener el valor de converted_mana_cost
      carta.converted_mana_cost = parseInt(convertedManaCost); // Convertir el valor a entero
      return carta;
    });
}

// Mostrar la carta
function mostrarCarta(carta) {
  const img = new Image();
  img.src = carta.image_uris.normal;
  img.alt = carta.name;
  cardContainer.innerHTML = '';
  cardContainer.appendChild(img);
}

// Iniciar una nueva ronda
function iniciarNuevaRonda() {
  obtenerCartaAleatoria()
    .then(carta => {
      currentCard = carta;
      mostrarCarta(carta);
      result.textContent = '';
      guessInput.value = '';
      hasGuessed = false;
    });
}

// Comprobar la suposición del jugador
function comprobarSuposicion() {
  if (hasGuessed) {
    return; // Salir si el jugador ya ha realizado una suposición en esta ronda
  }
  
  const suposicionJugador = parseInt(guessInput.value);
  if (isNaN(suposicionJugador)) {
    result.textContent = 'Please enter a valid number.';
  } else {
    const cmcReal = currentCard.converted_mana_cost;
    if (suposicionJugador === cmcReal) {
      result.textContent = 'Congratulations! You guessed it right.';
    } else {
      result.textContent = `Sorry, the actual converted mana cost is ${cmcReal}.`;
    }
    hasGuessed = true; // Establecer una flag para indicar que el jugador ha realizado una suposición
    clearInterval(intervalId);
    intervalId = setTimeout(iniciarNuevaRonda, 3000);
  }
}

// Event listeners
submitBtn.addEventListener('click', comprobarSuposicion);
guessInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    comprobarSuposicion();
  }
});

// Inicializar el juego
function inicializarJuego() {
  iniciarNuevaRonda();
}

// Iniciar el juego cuando se carga la página
window.addEventListener('load', inicializarJuego);


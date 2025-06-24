import { saveGameResult, updateRanking } from './ranking.js';

const gameBoard = document.getElementById('game-board');
const modal = document.getElementById('modal');
const startGame = document.getElementById('play-btn');
const logOutBtn = document.getElementById('logout-btn');
const inputCards = document.getElementById('cards-number');
const jugarBtn = document.getElementById('submit-btn');

let flippedCards = [];
const matchedCards = [];
let timerInterval = null;
let finishTimer = 0;
let totalCards = 0;

jugarBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent form submission

  // Get the username and email values
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;

  // Do something with the username and email (e.g., save them, validate)
  if (username && email) {
    // Hide the user form and show the game container
    document.getElementById('user-form').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('ranking').style.display = 'block';
    document.getElementById('log-out').style.display = 'block';
  } else {
    alert('Please enter both your name and email.');
  }
});

function validateNumber(value) {
  if (Number.isNaN(value) || value < 3 || value % 2 !== 0 || value > 12) {
    return false;
  }
  return true;
}

function showModal(param) {
  if (param === 'Win') {
    modal.textContent = 'Congratulations! You have matched all cards!';
    modal.showModal();
  } else {
    modal.textContent = 'Error! The number is not valid!';
    modal.showModal();
  }
  setTimeout(() => {
    modal.close();
  }, 3000);
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  const start = Date.now();

  timerInterval = setInterval(() => {
    const delta = Date.now() - start;
    const secondsElapsed = Math.floor(delta / 1000);
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;

    document.getElementById('timer').innerHTML = `${minutes}m ${seconds}s`;
  }, 1000);
}

async function checkForMatch(cards) {
  const [first, second] = flippedCards;
  if (first.card.id === second.card.id) {
    first.card.matched = true;
    second.card.matched = true;
    first.cardElement.classList.add('matched');
    second.cardElement.classList.add('matched');
    matchedCards.push(first.card, second.card);
    flippedCards = [];
    if (matchedCards.length === cards.length) {
      finishTimer = document.getElementById('timer').innerHTML;
      totalCards = matchedCards.length;
      // console.log(`Finish time: ${finishTimer}`);
      clearInterval(timerInterval);
      showModal('Win');

      const user = sessionStorage.getItem('user');
      if (user) {
        const userData = await fetch(
          `https://pokemonmatchingcards-45ac1-default-rtdb.europe-west1.firebasedatabase.app/${user}.json`,
        );
        const { username, email } = await userData.json();
        await saveGameResult(username, email, finishTimer, totalCards);
        updateRanking(user);
      }
    }
  } else {
    setTimeout(() => {
      first.card.flipped = false;
      second.card.flipped = false;
      first.cardElement.classList.remove('flipped');
      second.cardElement.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

async function fetchPokemonData(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener datos del Pokémon con ID ${pokemonId}`);
    }
    const data = await response.json();

    return {
      id: pokemonId,
      image: data.sprites.front_default,
    };
  } catch (error) {
    return null;
  }
}

async function fetchMultiplePokemonData(pokemonIds) {
  if (!Array.isArray(pokemonIds)) {
    throw new Error('Invalid input: pokemonIds must be an array.');
  }

  const promises = pokemonIds.map((id) => fetchPokemonData(id));
  const results = await Promise.all(promises);

  return results.filter((result) => result !== null);
}

async function getPokemonCards(numCards) {
  const uniqueIds = Array.from({ length: numCards / 2 }, () => Math.floor(Math.random() * 150) + 1);
  const pokemonIds = [...uniqueIds, ...uniqueIds].sort(() => Math.random() - 0.5);
  const pokemonData = await fetchMultiplePokemonData(pokemonIds);
  return pokemonData.map((pokemon) => ({
    id: pokemon.id,
    image: pokemon.image,
    flipped: false,
    matched: false,
  }));
}

function handleCardClick(cardElement, cards) {
  const { index } = cardElement.dataset;
  const cardIndex = parseInt(index, 10);

  // console.log('Card clicked:', cardElement);
  // console.log('Card index:', cardIndex);

  if (cards[cardIndex].flipped || cards[cardIndex].matched || flippedCards.length === 2) {
    // console.log('Card is already flipped or matched, or two cards are already flipped.');
    return;
  }

  const updatedCards = cards.map((card, i) => {
    if (i === cardIndex) {
      return { ...card, flipped: true };
    }
    return card;
  });

  // console.log('Flipping card:', cardElement);
  cardElement.classList.add('flipped');
  flippedCards.push({ cardElement, card: updatedCards[cardIndex] });

  if (flippedCards.length === 2) {
    checkForMatch(updatedCards);
  }
}

function renderGameBoard(cards) {
  gameBoard.innerHTML = '';
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id;
    cardElement.dataset.index = index;
    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front" style="background-image: url('${card.image}')"></div>
        <div class="card-back"></div>
      </div>
    `;
    gameBoard.appendChild(cardElement);
    cardElement.addEventListener('click', () => handleCardClick(cardElement, cards));
  });
}
async function initializeGame() {
  const numCards = parseInt(inputCards.value, 10);
  if (!validateNumber(numCards)) {
    showModal('Error! The number is not valid!');
    return;
  }

  startTimer();
  const cards = await getPokemonCards(numCards);
  renderGameBoard(cards);
  startGame.textContent = 'Play again';
}

startGame.addEventListener('click', (event) => {
  event.preventDefault();
  initializeGame();
});

logOutBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  sessionStorage.removeItem('user');
  window.location.reload();
});

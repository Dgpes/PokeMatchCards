const rankingTableBody = document.querySelector('#ranking-table tbody');
const RANKING_LIMIT = 5;

function sortRanking(data) {
  return data.sort((a, b) => {
    if (b.cards !== a.cards) {
      return b.cards - a.cards;
    }
    return a.time - b.time;
  });
}

async function fetchRankingData() {
  try {
    const response = await fetch(
      'https://pokemonmatchingcards-45ac1-default-rtdb.europe-west1.firebasedatabase.app/ranking.json',
    );
    const data = await response.json();
    sortRanking(data);
    return data ? Object.entries(data).map(([id, entry]) => ({ id, ...entry })) : [];
  } catch (error) {
    // console.error('Error fetching ranking data:', error);
    return [];
  }
}

function renderRanking(data, lastAddedId) {
  rankingTableBody.innerHTML = '';
  let displayedRows = 0;
  let lastAddedRow = null;
  let extraRowAdded = false;

  if (Array.isArray(data)) {
    data.sort((a, b) => a.time - b.time); // Sort by time in ascending order
  } else {
    // console.error('Data is not an array:', data);
    return;
  }

  data.forEach((entry, index) => {
    if (displayedRows >= RANKING_LIMIT && entry.id !== lastAddedId) {
      if (!extraRowAdded) {
        rankingTableBody.innerHTML += "<tr><td colspan='5'>...</td></tr>";
        extraRowAdded = true;
      }
      return;
    }

    const row = document.createElement('tr');
    if (entry.id === lastAddedId) {
      row.classList.add('highlight');
      lastAddedRow = row;
    }
    row.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.username}</td>
          <td>${entry.email}</td>
          <td>${entry.time}s</td>
          <td>${entry.cards}</td>
      `;
    rankingTableBody.appendChild(row);
    displayedRows += 1;
  });

  if (displayedRows > RANKING_LIMIT && lastAddedRow) {
    rankingTableBody.innerHTML += "<tr><td colspan='5'>...</td></tr>";
    rankingTableBody.appendChild(lastAddedRow);
    rankingTableBody.innerHTML += "<tr><td colspan='5'>...</td></tr>";
  }
}

export async function updateRanking(newId) {
  try {
    const response = await fetch(
      'https://pokemonmatchingcards-45ac1-default-rtdb.europe-west1.firebasedatabase.app/.json',
    );
    const data = await response.json();
    /*
    if (!data) {
      console.log('Data: '+data);
      // console.log('No hay registros en la base de datos.');
      return;
    } */

    const rankingArray = Object.entries(data).map(([id, entry]) => ({
      id,
      ...entry,
    }));
    rankingArray.sort((a, b) => b.cards - a.cards || a.time - b.time);
    /* for (let i = 0; i < rankingArray.length; i++)
      console.log(rankingArray[i].name); */
    renderRanking(rankingArray, newId);
  } catch (error) {
    // console.error('Error actualizando el ranking:', error);
  }
}

export async function saveGameResult(username, email, time, cards) {
  const newEntry = {
    username,
    email,
    time,
    cards,
  };
  try {
    const response = await fetch(
      'https://pokemonmatchingcards-45ac1-default-rtdb.europe-west1.firebasedatabase.app/.json',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      },
    );
    const data = await response.json();
    console.log('Se supone que ha hecho un guardado');
    return data.name;
  } catch (error) {
    // console.error('Error saving game result:', error);
    return null;
  }
}

fetchRankingData();
// renderRanking();
updateRanking();
saveGameResult();

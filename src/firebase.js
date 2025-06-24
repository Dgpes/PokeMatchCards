const databaseURL = 'https://pokemonmatchingcards-45ac1-default-rtdb.europe-west1.firebasedatabase.app/';
const formulario = document.getElementById('user-form');

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  // console.log('Se supone que el formulario funciona? xd');
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const ranking = '';
  const time = '';
  const cards = '';

  try {
    const response = await fetch(`${databaseURL}.json`);
    const data = response.ok ? await response.json() : null;
    let userId = null;

    if (data) {
      for (const [key, user] of Object.entries(data)) {
        if (user.email === email) {
          userId = key;
          break;
        }
      }
    }

    if (userId) {
      await fetch(`${databaseURL}/${userId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      // console.log('Username actualizado.');
    } else {
      const newUserResponse = await fetch(`${databaseURL}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards,
          email,
          ranking,
          time,
          username,
        }),
      });
      const newUserData = await newUserResponse.json();
      userId = newUserData.name;
      // console.log('Nuevo usuario creado.');
    }

    sessionStorage.setItem('user', userId);
  } catch (error) {
    // console.error('Error:', error);
  }
});

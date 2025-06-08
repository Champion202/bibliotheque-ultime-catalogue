fetch('books.json')
  .then(res => res.json())
  .then(books => {
    const list = document.getElementById('books-list');
    list.innerHTML = books.map(book => `
      <div class="book">
        <h2>${book.titre}</h2>
        <p>Auteur : ${book.auteur}</p>
        <a href="https://https://t.me/CryptoEarn1Bot?start=${book.id}" target="_blank">📲 Télécharger sur Telegram</a>
      </div>
    `).join('');
  });

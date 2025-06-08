  fetch('books.json')
  .then(res => res.json())
  .then(books => {
    const list = document.getElementById('books-list');
    list.innerHTML = books.map(book => `
      <div class="book">
        <img src="${book.cover || 'https://placehold.co/100x150?text=LIVRE'}" alt="Couverture du livre ${book.titre}">
        <div>
          <h2>${book.titre}</h2>
          <p><strong>Auteur :</strong> ${book.auteur || "N/A"}</p>
          <p>${book.description || ""}</p>
          <a href="https://t.me/CryptoEarn1Bot?start=${book.id}" target="_blank">📲 Télécharger sur Telegram</a>
        </div>
      </div>
    `).join('');
  });
  
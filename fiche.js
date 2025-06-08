function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

fetch('books.json')
  .then(res => res.json())
  .then(books => {
    const bookId = getIdFromUrl();
    const book = books.find(b => b.id === bookId);
    const ficheDiv = document.getElementById('fiche-livre');

    if (!book) {
      ficheDiv.innerHTML = `<p style="text-align:center;">Livre introuvable.</p>`;
      document.title = "Livre introuvable – Bibliothèque Ultime";
      return;
    }

    document.title = `${book.titre} – Bibliothèque Ultime`;
    document.querySelector('meta[name=description]').setAttribute('content', `Découvrez le livre "${book.titre}" (${book.auteur || ""}) sur la Bibliothèque Ultime. Téléchargement direct sur Telegram.`);

    ficheDiv.innerHTML = `
      <div class="book" style="max-width:670px;margin:2.5rem auto;">
        <img src="${book.cover || 'https://placehold.co/100x150?text=LIVRE'}" alt="Couverture du livre ${book.titre}">
        <div>
          <h1 style="font-size:1.33rem;margin-top:0.2em;color:#384b92;">${book.titre}</h1>
          <p><strong>Auteur :</strong> ${book.auteur || "N/A"}</p>
          <p style="font-size:1.03em;color:#364a90;"><strong>Description :</strong> ${book.description || "<span style='color:#b1b7d6;'>Non renseignée</span>"}</p>
          <a href="https://t.me/BibliothequeUltime_bot?start=${book.id}" target="_blank" style="margin-top:1.1em;">📲 Télécharger sur Telegram</a>
        </div>
      </div>
    `;
  });

let allBooks = [];
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 10;

// Chargement initial
fetch('books.json')
  .then(res => res.json())
  .then(books => {
    allBooks = books;
    populateAuthorFilter(books);
    applyFiltersAndShow();
  });

function populateAuthorFilter(books) {
  const select = document.getElementById('author-filter');
  select.innerHTML = `<option value="">Tous les auteurs</option>`;
  const authors = Array.from(new Set(books.map(b => b.auteur).filter(a => a && a.trim().length > 0))).sort();
  authors.forEach(author => {
    const opt = document.createElement('option');
    opt.value = author;
    opt.textContent = author;
    select.appendChild(opt);
  });
}

function applyFiltersAndShow(page = 1) {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const author = document.getElementById('author-filter').value;

  filteredBooks = allBooks.filter(book => {
    const matchAuteur = !author || (book.auteur === author);
    const matchQuery =
      !query ||
      (book.titre && book.titre.toLowerCase().includes(query)) ||
      (book.auteur && book.auteur.toLowerCase().includes(query)) ||
      (book.description && book.description.toLowerCase().includes(query));
    return matchAuteur && matchQuery;
  });

  currentPage = page;
  showPage(currentPage);
}

function showPage(page) {
  const list = document.getElementById('books-list');
  if (!filteredBooks.length) {
    list.innerHTML = "<p>Aucun livre trouvé.</p>";
    document.getElementById('pagination-controls').innerHTML = "";
    return;
  }
  const start = (page - 1) * booksPerPage;
  const end = start + booksPerPage;
  const booksToShow = filteredBooks.slice(start, end);

  // On prend les 10 derniers livres ajoutés comme "nouveau"
  const latestBookIds = allBooks.slice(-10).map(b => b.id);

  list.innerHTML = booksToShow.map(book => `
    <div class="book">
      <a href="livre.html?id=${encodeURIComponent(book.id)}" style="text-decoration:none;position:relative;">
        <img src="${book.cover || 'https://placehold.co/100x150?text=LIVRE'}" alt="Couverture du livre ${book.titre}">
        ${latestBookIds.includes(book.id) ? `<span class="badge-nouveau">Nouveau</span>` : ''}
      </a>
      <div>
        <h2><a href="livre.html?id=${encodeURIComponent(book.id)}" style="color:#0370c0;text-decoration:none;">${book.titre}</a></h2>
        <p><strong>Auteur :</strong> ${book.auteur || "N/A"}</p>
        <p>${book.description || ""}</p>
        <a href="https://t.me/BibliothequeUltime_bot?start=${book.id}" target="_blank">📲 Télécharger sur Telegram</a>
      </div>
    </div>
  `).join('');

  renderPagination(page, Math.ceil(filteredBooks.length / booksPerPage));
}

function renderPagination(current, total) {
  const container = document.getElementById('pagination-controls');
  if (total <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  if (current > 1) {
    html += `<button class="pag-btn" data-page="${current - 1}">⬅️ Précédent</button>`;
  }
  html += ` Page ${current} / ${total} `;
  if (current < total) {
    html += `<button class="pag-btn" data-page="${current + 1}">Suivant ➡️</button>`;
  }
  container.innerHTML = html;

  // Gestion du clic sur les boutons de pagination
  Array.from(container.querySelectorAll('.pag-btn')).forEach(btn => {
    btn.onclick = (e) => {
      const page = parseInt(btn.getAttribute('data-page'));
      showPage(page);
      currentPage = page;
      window.scrollTo({top: 0, behavior: 'smooth'});
    };
  });
}

// Mise à jour en live sur recherche/filtre
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search-input').addEventListener('input', () => applyFiltersAndShow(1));
  document.getElementById('author-filter').addEventListener('change', () => applyFiltersAndShow(1));
});

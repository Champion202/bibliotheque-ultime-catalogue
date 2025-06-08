import fs from 'fs';
import fetch from 'node-fetch';

// Charge la liste brute exportée
let books = JSON.parse(fs.readFileSync('./books.json', 'utf8'));

async function enrichBook(book) {
    try {
        // Nettoie le titre
        let titreClean = book.titre;
        titreClean = titreClean.replace(/\.pdf$/i, '');
        titreClean = titreClean.replace(/\.epub$/i, '');
        titreClean = titreClean.replace(/ – .+$/, '');
        titreClean = titreClean.replace(/ - .+$/, '');
        const q = encodeURIComponent(titreClean.trim());

        const url = `https://openlibrary.org/search.json?title=${q}&limit=1`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.docs && data.docs.length > 0) {
            const doc = data.docs[0];
            book.auteur = doc.author_name ? doc.author_name.join(', ') : "";
            book.description = doc.first_sentence ? (
                typeof doc.first_sentence === "string"
                    ? doc.first_sentence
                    : doc.first_sentence[Object.keys(doc.first_sentence)[0]]
            ) : (doc.subject ? `Sujet : ${doc.subject[0]}` : "");

            // Cover id sur OpenLibrary
            if (doc.cover_i) {
                book.cover = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
            } else {
                book.cover = "https://placehold.co/100x150?text=LIVRE";
            }
        } else {
            book.auteur = "";
            book.description = "";
            book.cover = "https://placehold.co/100x150?text=LIVRE";
        }
    } catch (e) {
        book.auteur = "";
        book.description = "";
        book.cover = "https://placehold.co/100x150?text=LIVRE";
    }
    return book;
}

const BATCH_SIZE = 10; // Nombre de livres traités en même temps

async function enrichBatch(books) {
  return await Promise.all(books.map(enrichBook));
}

(async () => {
    let enriched = [];
    for (let i = 0; i < books.length; i += BATCH_SIZE) {
        const batch = books.slice(i, i + BATCH_SIZE);
        process.stdout.write(`Enrichissement des livres ${i + 1} à ${i + batch.length}... `);
        const results = await enrichBatch(batch);
        console.log("OK");
        enriched.push(...results);
    }
    fs.writeFileSync('./books.json', JSON.stringify(enriched, null, 2));
    console.log("✅ books.json enrichi avec auteurs, description, cover !");
})();

import('./generate_sitemap.mjs');

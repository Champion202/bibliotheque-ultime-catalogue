import fs from 'fs';

// 1. On charge le catalogue
const books = JSON.parse(fs.readFileSync('./books.json', 'utf8'));

const BASE_URL = 'https://livrespdf.vercel.app';

// 2. On construit le sitemap
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Page d’accueil
xml += `  <url><loc>${BASE_URL}/</loc><priority>1.0</priority></url>\n`;

// Toutes les fiches livres
for (const book of books) {
  xml += `  <url><loc>${BASE_URL}/livre.html?id=${encodeURIComponent(book.id)}</loc><priority>0.8</priority></url>\n`;
}

xml += `</urlset>\n`;

// 3. On écrit le fichier sitemap.xml
fs.writeFileSync('./sitemap.xml', xml, 'utf8');
console.log("✅ sitemap.xml généré avec " + books.length + " livres !");

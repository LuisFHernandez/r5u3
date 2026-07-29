const API_KEY = 'b78fc90cc378dc38bcbb02ee608ac941'; 
const API_URL = `https://gnews.io/api/v4/top-headlines?category=general&lang=es&apikey=${API_KEY}`;
const PROXY_URL = 'https://corsproxy.io/?' + encodeURIComponent(API_URL);
const newsContainer = document.getElementById('news-container');
const refreshBtn = document.getElementById('refresh-btn');

async function fetchNews() {
    newsContainer.innerHTML = '<div class="status-message">Cargando las últimas noticias...</div>';

    try {
        const response = await fetch(PROXY_URL);

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            newsContainer.innerHTML = '<div class="status-message">No hay noticias disponibles en este momento. Intente más tarde.</div>';
            return;
        }

        renderNews(data.articles);

    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        newsContainer.innerHTML = `
            <div class="status-message error-message">
                Lo sentimos, ocurrió un error al cargar las noticias.<br>
                Detalle: ${error.message}
            </div>`;
    }
}

function renderNews(articles) {
    newsContainer.innerHTML = '';

    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'news-card';

        articleElement.innerHTML = `
            <h2><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h2>
            <p>${article.description || 'Sin descripción disponible.'}</p>
            <span class="source">${article.source.name}</span>
        `;

        newsContainer.appendChild(articleElement);
    });
}

refreshBtn.addEventListener('click', fetchNews);
document.addEventListener('DOMContentLoaded', fetchNews);

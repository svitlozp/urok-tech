document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display popular anime
    const popularGrid = document.getElementById('popular-anime-grid');
    if (popularGrid) {
        fetch('https://shikimori.one/api/animes?limit=8&order=popularity')
            .then(response => response.json())
            .then(data => {
                popularGrid.innerHTML = ''; // Clear loading message
                data.forEach(anime => {
                    const animeCard = createAnimeCard(anime);
                    popularGrid.appendChild(animeCard);
                });
            })
            .catch(error => {
                console.error('Error fetching popular anime:', error);
                popularGrid.innerHTML = '<p>Не вдалося завантажити популярні аніме.</p>';
            });
    }

    // Fetch and display latest news
    const newsGrid = document.getElementById('news-grid');
    if (newsGrid) {
        // Shikimori's topic updates can serve as a proxy for news
        fetch('https://shikimori.one/api/topics?type=news&limit=3') // Fetching 3 news articles
            .then(response => response.json())
            .then(newsItems => {
                newsGrid.innerHTML = ''; // Clear loading message
                newsItems.forEach(item => {
                    const newsCard = createNewsCard(item);
                    newsGrid.appendChild(newsCard);
                });
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsGrid.innerHTML = '<p>Не вдалося завантажити новини.</p>';
            });
    }
});

function createAnimeCard(anime) {
    const animeCard = document.createElement('div');
    animeCard.classList.add('anime-card');

    const imageUrl = anime.image.original ? `https://shikimori.one${anime.image.original}` : 'https://via.placeholder.com/200x300.png?text=No+Image';

    animeCard.innerHTML = `
        <a href="anime-detail.html?id=${anime.id}">
            <img src="${imageUrl}" alt="${anime.name}">
            <div class="anime-card-info">
                <h3>${anime.name}</h3>
                <p>${anime.kind.toUpperCase()}, ${anime.aired_on ? new Date(anime.aired_on).getFullYear() : 'N/A'}</p>
            </div>
        </a>
    `;
    return animeCard;
}

function createNewsCard(news) {
    const newsCard = document.createElement('a');
    newsCard.href = news.forum_topic.url; // Link directly to the forum topic
    newsCard.target = '_blank'; // Open in new tab
    newsCard.classList.add('news-card');

    // Very basic image extraction from the HTML body of the news.
    // Note: This is brittle. A better solution requires a proxy or more advanced parsing.
    const bodyHtml = news.html_body;
    const imgMatch = bodyHtml.match(/<img.*?src=["'](.*?)["']/);
    const imageUrl = imgMatch ? imgMatch[1] : 'https://via.placeholder.com/300x180.png?text=News';

    // Clean up the footer text
    const footerText = news.html_footer.replace(/<.*?>/g, ''); // Strip HTML tags

    newsCard.innerHTML = `
        <img src="${imageUrl}" alt="${news.topic_title}">
        <div class="news-card-content">
            <h3>${news.topic_title}</h3>
            <p>${news.body.substring(0, 100)}...</p> 
            <div class="news-card-footer">
               ${footerText}
            </div>
        </div>
    `;
    return newsCard;
}

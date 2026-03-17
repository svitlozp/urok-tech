
document.addEventListener('DOMContentLoaded', () => {
    const animeGrid = document.querySelector('#top-rated .anime-grid');

    if (animeGrid) {
        // Fetch top-rated anime from Shikimori API
        fetch('https://shikimori.one/api/animes?limit=8&order=ranked') // Let's load 8 for the main page
            .then(response => response.json())
            .then(data => {
                animeGrid.innerHTML = ''; // Clear placeholder cards
                data.forEach(anime => {
                    const animeCard = document.createElement('div');
                    animeCard.classList.add('anime-card');

                    // Use the correct base URL for Shikimori images
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
                    animeGrid.appendChild(animeCard);
                });
            })
            .catch(error => {
                console.error('Error fetching from Shikimori API:', error);
                animeGrid.innerHTML = '<p style="color: #FF4081;">Не вдалося завантажити дані. Спробуйте оновити сторінку.</p>';
            });
    }
});

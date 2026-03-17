
document.addEventListener('DOMContentLoaded', () => {
    const animeGrid = document.querySelector('.anime-grid');

    if (animeGrid) {
        fetch('https://shikimori.one/api/animes?limit=20&order=ranked')
            .then(response => response.json())
            .then(data => {
                animeGrid.innerHTML = ''; // Clear placeholder content
                data.forEach(anime => {
                    const animeCard = document.createElement('div');
                    animeCard.classList.add('anime-card');

                    const imageUrl = anime.image.original ? `https://shikimori.one${anime.image.original}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
                    
                    animeCard.innerHTML = `
                        <img src="${imageUrl}" alt="${anime.name}">
                        <div class="anime-card-info">
                            <h3>${anime.name}</h3>
                            <p>${anime.kind.toUpperCase()}, ${anime.aired_on ? new Date(anime.aired_on).getFullYear() : 'N/A'}</p>
                        </div>
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

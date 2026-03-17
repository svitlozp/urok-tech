document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('anime-detail-content');
    const animeId = new URLSearchParams(window.location.search).get('id');

    if (!animeId) {
        mainContent.innerHTML = '<p style="color: #FF4081;">Помилка: ID аніме не знайдено. Будь ласка, поверніться до каталогу.</p>';
        return;
    }

    fetch(`https://shikimori.one/api/animes/${animeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(anime => {
            // Update the document title
            document.title = `${anime.name} - Мій Аніме Сайт`;

            const imageUrl = anime.image.original ? `https://shikimori.one${anime.image.original}` : 'https://via.placeholder.com/300x450.png?text=No+Image';

            mainContent.innerHTML = `
                <section class="anime-detail-container">
                    <div class="anime-detail-poster">
                        <img src="${imageUrl}" alt="Poster for ${anime.name}">
                    </div>
                    <div class="anime-detail-info">
                        <h1>${anime.name} / ${anime.russian}</h1>
                        <p><strong>Тип:</strong> ${anime.kind.toUpperCase()}</p>
                        <p><strong>Епізоди:</strong> ${anime.episodes || 'N/A'}</p>
                        <p><strong>Статус:</strong> ${anime.status}</p>
                        <p><strong>Рік:</strong> ${anime.aired_on ? new Date(anime.aired_on).getFullYear() : 'N/A'}</p>
                        <p><strong>Рейтинг:</strong> ${anime.score} &#9733;</p>
                        <div class="genres">
                            ${anime.genres.map(g => `<span class="genre">${g.name}</span>`).join('')}
                        </div>
                        <p class="description">
                            <strong>Опис:</strong><br>
                            ${anime.description ? anime.description.replace(/\n/g, '<br>') : 'Опис відсутній.'}
                        </p>
                    </div>
                </section>
            `;
        })
        .catch(error => {
            console.error('Error fetching anime details:', error);
            mainContent.innerHTML = '<p style="color: #FF4081;">Не вдалося завантажити детальну інформацію про аніме. Спробуйте оновити сторінку.</p>';
        });
});
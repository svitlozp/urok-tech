document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (!animeId) {
        document.getElementById('anime-title').textContent = 'Аніме не знайдено';
        return;
    }

    fetch(`https://shikimori.one/api/animes/${animeId}`)
        .then(response => response.json())
        .then(anime => {
            // Set document title
            document.title = `${anime.name} - АнімеБаза`;

            // Banner and Poster
            const bannerUrl = anime.image.original ? `https://shikimori.one${anime.image.original}` : 'https://via.placeholder.com/1200x400.png?text=No+Banner';
            document.getElementById('banner-image').src = bannerUrl;
            document.getElementById('poster-image').src = `https://shikimori.one${anime.image.original}`;
            document.getElementById('poster-image').alt = anime.name;

            // Header Info
            document.getElementById('anime-title').textContent = anime.name;
            document.getElementById('anime-type-year').textContent = `${anime.kind.toUpperCase()}, ${anime.aired_on ? new Date(anime.aired_on).getFullYear() : 'N/A'}`;
            document.getElementById('anime-episodes').textContent = `Епізоди: ${anime.episodes || '??'}`;
            document.getElementById('anime-score').textContent = `⭐ ${anime.score}`;

            // Genres
            const genresContainer = document.getElementById('anime-genres');
            genresContainer.innerHTML = '';
            anime.genres.forEach(genre => {
                const genreTag = document.createElement('span');
                genreTag.classList.add('genre-tag');
                genreTag.textContent = genre.russian;
                genresContainer.appendChild(genreTag);
            });

            // Description
            const description = anime.description ? anime.description.replace(/\r?\n/g, "<br>").replace(/\[spoiler.*?\]/g, "").replace(/\[\/spoiler\]/g, "") : 'Опис відсутній.';
            document.getElementById('anime-description-text').innerHTML = description;

            // Trailer
            const trailerContainer = document.getElementById('trailer-container');
            if (anime.videos && anime.videos.length > 0) {
                const trailer = anime.videos[0];
                trailerContainer.innerHTML = `<iframe src="${trailer.player_url}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                trailerContainer.innerHTML = '<p>Трейлер відсутній.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching anime details:', error);
            document.getElementById('anime-title').textContent = 'Помилка завантаження';
        });
});

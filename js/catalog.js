document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('catalog-grid');
    const searchInput = document.getElementById('search-input');
    const genreFilter = document.getElementById('genre-filter');
    const statusFilter = document.getElementById('status-filter');
    const sortFilter = document.getElementById('sort-filter');

    let searchTimeout;

    // Populate genres
    fetch('https://shikimori.one/api/genres')
        .then(res => res.json())
        .then(genres => {
            genreFilter.innerHTML = '<option value="">Всі жанри</option>'; // Reset
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.russian;
                genreFilter.appendChild(option);
            });
        });

    function fetchAndDisplayAnime() {
        grid.innerHTML = '<p>Завантаження...</p>';
        
        const params = new URLSearchParams({
            limit: 40, // More items for a catalog page
            order: sortFilter.value,
        });

        const searchTerm = searchInput.value;
        if (searchTerm.length > 2) {
            params.append('search', searchTerm);
        }
        if (genreFilter.value) {
            params.append('genre', genreFilter.value);
        }
        if (statusFilter.value) {
            params.append('status', statusFilter.value);
        }

        const url = `https://shikimori.one/api/animes?${params.toString()}`;

        fetch(url)
            .then(res => res.json())
            .then(animes => {
                grid.innerHTML = '';
                if (animes.length === 0) {
                    grid.innerHTML = '<p>Нічого не знайдено. Спробуйте змінити фільтри.</p>';
                    return;
                }
                animes.forEach(anime => {
                    const animeCard = createAnimeCard(anime);
                    grid.appendChild(animeCard);
                });
            })
            .catch(error => {
                console.error('Error fetching catalog:', error);
                grid.innerHTML = '<p>Помилка завантаження. Спробуйте ще раз.</p>';
            });
    }

    // Event Listeners
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(fetchAndDisplayAnime, 500); // Debounce
    });

    [genreFilter, statusFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', fetchAndDisplayAnime);
    });

    // Initial fetch
    fetchAndDisplayAnime();
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

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabs = document.querySelectorAll('.tab-button');
    const lists = document.querySelectorAll('.list-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tabs and lists
            tabs.forEach(t => t.classList.remove('active'));
            lists.forEach(l => l.classList.remove('active'));

            // Activate the clicked tab and corresponding list
            tab.classList.add('active');
            const listId = `${tab.dataset.list}-list`;
            document.getElementById(listId).classList.add('active');
        });
    });

    // Fetch and display anime for the 'Watching' list
    const watchingGrid = document.getElementById('watching-list');
    const animeIdsToFetch = [1, 21, 20]; // Example: One Piece, Death Note, Naruto

    // Create a fetch promise for each ID
    const fetchPromises = animeIdsToFetch.map(id =>
        fetch(`https://shikimori.one/api/animes/${id}`).then(res => res.json())
    );

    Promise.all(fetchPromises)
        .then(animes => {
            watchingGrid.innerHTML = ''; // Clear loading message
            animes.forEach(anime => {
                const animeCard = document.createElement('div');
                animeCard.classList.add('anime-card');

                const imageUrl = anime.image.original ? `https://shikimori.one${anime.image.original}` : 'https://via.placeholder.com/200x300.png?text=No+Image';
                
                animeCard.innerHTML = `
                    <a href="anime-detail.html?id=${anime.id}">
                        <img src="${imageUrl}" alt="${anime.name}">
                        <div class="anime-card-info">
                            <h3>${anime.name}</h3>
                        </div>
                    </a>
                `;
                watchingGrid.appendChild(animeCard);
            });
        })
        .catch(error => {
            console.error('Error fetching anime for profile:', error);
            watchingGrid.innerHTML = '<p style="color: #FF4081;">Не вдалося завантажити список.</p>';
        });
});

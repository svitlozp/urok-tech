document.addEventListener('DOMContentLoaded', () => {
    const newsContent = document.getElementById('news-content');
    const scheduleContent = document.getElementById('schedule-content');

    // Fetch News (Topics) from Shikimori API
    if (newsContent) {
        fetch('https://shikimori.one/api/topics?limit=10&type=news') // Fetch 10 latest news topics
            .then(response => response.json())
            .then(topics => {
                newsContent.innerHTML = ''; // Clear loading message
                topics.forEach(topic => {
                    const newsItem = document.createElement('div');
                    newsItem.classList.add('news-item');
                    newsItem.innerHTML = `
                        <h3><a href="https://shikimori.one${topic.forum.url}" target="_blank">${topic.title}</a></h3>
                        <p>Створено: ${new Date(topic.created_at).toLocaleDateString()}</p>
                        <p>Коментарів: ${topic.comments_count}</p>
                    `;
                    newsContent.appendChild(newsItem);
                });
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsContent.innerHTML = '<p style="color: #FF4081;">Не вдалося завантажити новини.</p>';
            });
    }

    // Fetch Release Calendar from Shikimori API
    if (scheduleContent) {
        fetch('https://shikimori.one/api/calendar')
            .then(response => response.json())
            .then(calendarData => {
                scheduleContent.innerHTML = ''; // Clear loading message
                if (calendarData.length === 0) {
                    scheduleContent.innerHTML = '<p>На сьогодні немає запланованих релізів.</p>';
                    return;
                }

                // Group by date
                const groupedByDate = calendarData.reduce((acc, item) => {
                    const date = new Date(item.next_episode_at).toLocaleDateString();
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(item);
                    return acc;
                }, {});

                for (const date in groupedByDate) {
                    const dateGroup = document.createElement('div');
                    dateGroup.classList.add('schedule-group');
                    dateGroup.innerHTML = `<h4>${date}</h4>`;
                    
                    const itemsGrid = document.createElement('div');
                    itemsGrid.classList.add('anime-grid'); // Reuse anime-grid for styling

                    groupedByDate[date].forEach(item => {
                        const scheduleItem = document.createElement('div');
                        scheduleItem.classList.add('anime-card'); // Reuse anime-card for styling

                        const imageUrl = item.anime.image.original ? `https://shikimori.one${item.anime.image.original}` : 'https://via.placeholder.com/200x300.png?text=No+Image';

                        scheduleItem.innerHTML = `
                            <a href="anime-detail.html?id=${item.anime.id}">
                                <img src="${imageUrl}" alt="${item.anime.name}">
                                <div class="anime-card-info">
                                    <h3>${item.anime.name}</h3>
                                    <p>Епізод: ${item.next_episode}</p>
                                </div>
                            </a>
                        `;
                        itemsGrid.appendChild(scheduleItem);
                    });

                    dateGroup.appendChild(itemsGrid);
                    scheduleContent.appendChild(dateGroup);
                }

            })
            .catch(error => {
                console.error('Error fetching calendar:', error);
                scheduleContent.innerHTML = '<p style="color: #FF4081;">Не вдалося завантажити розклад.</p>';
            });
    }
});
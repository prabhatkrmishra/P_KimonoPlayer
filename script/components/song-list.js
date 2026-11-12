
import { $ } from '../utils/dom.js';
import { getState, getCurrentSong } from '../state/store.js';

export function initSongList(callbacks) {
    const songsList = $('#songs-list');
    const genreFilter = $('#genre-filter');
    const songSearch = $('#song-search');

    function render() {
        if (!songsList) return;

        const state = getState();
        const currentSong = getCurrentSong();

        songsList.innerHTML = '';

        if (state.filteredSongs.length === 0) {
            songsList.innerHTML = '<p class="empty-message">No songs found matching your criteria.</p>';
            return;
        }

        for (const song of state.filteredSongs) {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';

            const isCurrentSong = currentSong !== null && song.id === currentSong.id;
            if (isCurrentSong) {
                songItem.classList.add('playing');
            }

            songItem.innerHTML = `
                <img src="${song.img}" alt="${song.name}">
                <div class="song-details">
                    <h4>${song.name}</h4>
                    <p>${song.artist}</p>
                    <span class="song-genre-tag">${song.genre}</span>
                </div>
            `;

            songItem.addEventListener('click', function () {
                callbacks.onSongSelect(song.id);
            });

            songsList.appendChild(songItem);
        }
    }

    genreFilter?.addEventListener('change', function (event) {
        callbacks.onGenreChange(event.target.value);
    });

    songSearch?.addEventListener('input', function (event) {
        callbacks.onSongQueryChange(event.target.value);
    });

    return { render: render };
}

import { $ } from '../utils/dom.js';
import { getState, getCurrentSong } from '../state/store.js';

export function initSongList({ onGenreChange, onSongQueryChange, onSongSelect }) {
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

        state.filteredSongs.forEach((song) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            if (currentSong && song.id === currentSong.id) {
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

            songItem.addEventListener('click', () => onSongSelect(song.id));
            songsList.appendChild(songItem);
        });
    }

    genreFilter?.addEventListener('change', (e) => onGenreChange(e.target.value));
    songSearch?.addEventListener('input', (e) => onSongQueryChange(e.target.value));

    return { render };
}

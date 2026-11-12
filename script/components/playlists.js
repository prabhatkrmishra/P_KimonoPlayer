import { $ } from '../utils/dom.js';
import { getSongs, getState, getCurrentPlaylist, getFilteredPlaylists } from '../state/store.js';

export function initPlaylists({
    onSelectPlaylist,
    onCreatePlaylist,
    onRemoveSong,
    onPlaySong,
    onPlaylistSearchChange,
}) {
    const playlistsList = $('#playlists-list');
    const playlistSongs = $('#playlist-songs');
    const selectedPlaylistName = $('#selected-playlist-name');
    const createPlaylistBtn = $('#create-playlist-btn');
    const newPlaylistName = $('#new-playlist-name');
    const playlistSearch = $('#playlist-search');

    function renderPlaylists() {
        if (!playlistsList) return;

        const state = getState();
        const filteredPlaylists = getFilteredPlaylists();
        playlistsList.innerHTML = '';

        if (filteredPlaylists.length === 0) {
            playlistsList.innerHTML = '<p class="empty-message">No playlists found.</p>';
            return;
        }

        filteredPlaylists.forEach((playlist) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            if (state.currentPlaylistId === playlist.id) {
                playlistItem.classList.add('active');
            }

            const songCount = playlist.songs.length;
            const songText = songCount === 1 ? 'song' : 'songs';

            playlistItem.innerHTML = `
                <div class="playlist-info">
                    <span class="playlist-name">${playlist.name}</span>
                    <span class="playlist-song-count">${songCount} ${songText}</span>
                </div>
            `;

            playlistItem.addEventListener('click', () => onSelectPlaylist(playlist.id));
            playlistsList.appendChild(playlistItem);
        });
    }

    function renderPlaylistSongs() {
        if (!playlistSongs || !selectedPlaylistName) return;

        const currentPlaylist = getCurrentPlaylist();
        playlistSongs.innerHTML = '';

        if (!currentPlaylist) {
            selectedPlaylistName.textContent = 'Select a Playlist';
            playlistSongs.innerHTML = '<p class="empty-message">No playlist selected. Select a playlist to view its songs.</p>';
            return;
        }

        selectedPlaylistName.textContent = currentPlaylist.name;

        if (currentPlaylist.songs.length === 0) {
            playlistSongs.innerHTML = '<p class="empty-message">This playlist is empty. Add songs to it!</p>';
            return;
        }

        const songs = getSongs();
        const playlistSongObjects = songs.filter((song) => currentPlaylist.songs.includes(song.id));

        playlistSongObjects.forEach((song) => {
            const songItem = document.createElement('div');
            songItem.className = 'playlist-song-item';

            songItem.innerHTML = `
                <div class="playlist-song-info">
                    <div>
                        <strong>${song.name}</strong>
                        <p class="playlist-song-artist">${song.artist} • ${song.genre}</p>
                    </div>
                    <button class="remove-song-btn" data-song-id="${song.id}" title="Remove from playlist">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            songItem.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-song-btn')) {
                    onPlaySong(song.id);
                }
            });

            const removeBtn = songItem.querySelector('.remove-song-btn');
            removeBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                onRemoveSong(currentPlaylist.id, song.id);
            });

            playlistSongs.appendChild(songItem);
        });
    }

    function render() {
        renderPlaylists();
        renderPlaylistSongs();
    }

    createPlaylistBtn?.addEventListener('click', () => {
        onCreatePlaylist(newPlaylistName?.value || '');
        if (newPlaylistName) newPlaylistName.value = '';
    });

    newPlaylistName?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            onCreatePlaylist(newPlaylistName.value || '');
            newPlaylistName.value = '';
        }
    });

    playlistSearch?.addEventListener('input', (e) => {
        onPlaylistSearchChange(e.target.value);
    });

    return {
        render,
        renderPlaylists,
        renderPlaylistSongs,
    };
}

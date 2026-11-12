
import { $ } from '../utils/dom.js';
import { getSongs, getState, getCurrentPlaylist, getFilteredPlaylists } from '../state/store.js';

export function initPlaylists(callbacks) {
    const playlistsList = $('#playlists-list');
    const playlistSongs = $('#playlist-songs');
    const selectedPlaylistName = $('#selected-playlist-name');
    const createPlaylistBtn = $('#create-playlist-modal-button');
    const newPlaylistName = $('#new-playlist-name');
    const playlistSearch = $('#playlist-search');

    const createPlaylistModal = document.getElementById('create-playlist-modal');
    const openModalBtn = document.getElementById('create-playlist-btn');
    const closeModalBtn = document.getElementById('create-playlist-modal-close-button');

    function openCreateModal() {
        if (createPlaylistModal) {
            createPlaylistModal.style.display = 'block';
        }
    }

    function closeCreateModal() {
        if (createPlaylistModal) {
            createPlaylistModal.style.display = 'none';
        }
    }

    function renderPlaylists() {
        if (!playlistsList) return;

        const state = getState();
        const filteredPlaylists = getFilteredPlaylists();

        playlistsList.innerHTML = '';

        if (filteredPlaylists.length === 0) {
            playlistsList.innerHTML = '<p class="empty-message">No playlists found.</p>';
            return;
        }

        for (const playlist of filteredPlaylists) {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';

            const isOpen = state.currentPlaylistId === playlist.id;
            if (isOpen) {
                playlistItem.classList.add('active');
            }

            const songCount = playlist.songs.length;
            let songText = 'songs';
            if (songCount === 1) {
                songText = 'song';
            }

            playlistItem.innerHTML = `
                <div class="playlist-info">
                    <span class="playlist-name">${playlist.name}</span>
                    <span class="playlist-song-count">${songCount} ${songText}</span>
                </div>
            `;

            playlistItem.addEventListener('click', function () {
                callbacks.onSelectPlaylist(playlist.id);
            });

            playlistsList.appendChild(playlistItem);
        }
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

        const allSongs = getSongs();
        const playlistSongObjects = [];
        for (const song of allSongs) {
            if (currentPlaylist.songs.includes(song.id)) {
                playlistSongObjects.push(song);
            }
        }

        for (const song of playlistSongObjects) {
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

            songItem.addEventListener('click', function (event) {
                const clickedOnRemoveButton = event.target.closest('.remove-song-btn');
                if (!clickedOnRemoveButton) {
                    callbacks.onPlaySong(song.id);
                }
            });

            const removeBtn = songItem.querySelector('.remove-song-btn');
            removeBtn?.addEventListener('click', function (event) {
                event.stopPropagation();
                callbacks.onRemoveSong(currentPlaylist.id, song.id);
            });

            playlistSongs.appendChild(songItem);
        }
    }

    function render() {
        renderPlaylists();
        renderPlaylistSongs();
    }

    createPlaylistBtn?.addEventListener('click', function () {
        const name = newPlaylistName?.value || '';
        callbacks.onCreatePlaylist(name);

        if (newPlaylistName) {
            newPlaylistName.value = '';
        }
        closeCreateModal();
    });

    openModalBtn?.addEventListener('click', openCreateModal);

    closeModalBtn?.addEventListener('click', closeCreateModal);

    newPlaylistName?.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const name = newPlaylistName.value || '';
            callbacks.onCreatePlaylist(name);
            newPlaylistName.value = '';
        }
    });

    playlistSearch?.addEventListener('input', function (event) {
        callbacks.onPlaylistSearchChange(event.target.value);
    });

    return {
        render: render,
        renderPlaylists: renderPlaylists,
        renderPlaylistSongs: renderPlaylistSongs,
    };
}

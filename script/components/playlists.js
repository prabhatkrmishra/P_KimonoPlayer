
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
    const createPlayListModalName = document.getElementById('new-playlist-name');
    const openModalBtn = document.getElementById('create-playlist-btn');
    const closeModalBtn = document.getElementById('create-playlist-modal-close-button');

    const playListSongsModal = document.getElementById('playlist-songs-modal');
    const playListSongsModalClose = document.getElementById('close-playlist-songlist-modal');

    function openCreateModal() {
        if (createPlaylistModal && createPlayListModalName) {
            createPlaylistModal.style.display = 'flex';
            createPlayListModalName.focus();
        }
    }

    function closeCreateModal() {
        if (createPlaylistModal) {
            createPlaylistModal.style.display = 'none';
        }
    }

    function closePlayListSongs() {
        if (playListSongsModal) {
            playListSongsModal.style.display = "none";
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
                <button type="button" class="playlist-delete-button" id="playlist-delete-button" title="Delete the playlist">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                        viewBox="0 0 48 48">
                        <path
                            d="M 20.5 4 A 1.50015 1.50015 0 0 0 19.066406 6 L 14.640625 6 C 12.803372 6 11.082924 6.9194511 10.064453 8.4492188 L 7.6972656 12 L 7.5 12 A 1.50015 1.50015 0 1 0 7.5 15 L 8.2636719 15 A 1.50015 1.50015 0 0 0 8.6523438 15.007812 L 11.125 38.085938 C 11.423352 40.868277 13.795836 43 16.59375 43 L 31.404297 43 C 34.202211 43 36.574695 40.868277 36.873047 38.085938 L 39.347656 15.007812 A 1.50015 1.50015 0 0 0 39.728516 15 L 40.5 15 A 1.50015 1.50015 0 1 0 40.5 12 L 40.302734 12 L 37.935547 8.4492188 C 36.916254 6.9202798 35.196001 6 33.359375 6 L 28.933594 6 A 1.50015 1.50015 0 0 0 27.5 4 L 20.5 4 z M 14.640625 9 L 33.359375 9 C 34.196749 9 34.974746 9.4162203 35.439453 10.113281 L 36.697266 12 L 11.302734 12 L 12.560547 10.113281 A 1.50015 1.50015 0 0 0 12.5625 10.111328 C 13.025982 9.4151428 13.801878 9 14.640625 9 z M 11.669922 15 L 36.330078 15 L 33.890625 37.765625 C 33.752977 39.049286 32.694383 40 31.404297 40 L 16.59375 40 C 15.303664 40 14.247023 39.049286 14.109375 37.765625 L 11.669922 15 z">
                        </path>
                    </svg>
                </button>
            `;

            const playListDeleteButton = playlistItem.querySelector('#playlist-delete-button');
            playListDeleteButton.addEventListener('click', function (event) {
                event.stopPropagation();
                callbacks.onDeletePlayList(playlist.id);
            });

            playlistItem.addEventListener('click', function () {
                callbacks.onSelectPlaylist(playlist.id);
                playListSongsModal.style.display = "flex";
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
                        <strong class="playlist-song-name">${song.name}</strong>
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
        closeCreateModal();
        if (newPlaylistName) {
            newPlaylistName.value = '';
        }
    });

    openModalBtn?.addEventListener('click', openCreateModal);

    closeModalBtn?.addEventListener('click', closeCreateModal);

    playListSongsModalClose?.addEventListener('click', closePlayListSongs);

    newPlaylistName?.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const name = newPlaylistName.value || '';
            callbacks.onCreatePlaylist(name);
            closeCreateModal();
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

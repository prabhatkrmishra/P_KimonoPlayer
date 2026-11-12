
import { songs } from '../data/songs.js';

const DEFAULT_PLAYLISTS = [
    { id: 1, name: 'Favorites', songs: [1, 3, 5, 7] },
    { id: 2, name: 'Workout', songs: [2, 4, 8, 12] },
    { id: 3, name: 'Chill Vibes', songs: [6, 9, 14, 15] },
];

function getDefaultPlaylists() {
    const copy = [];
    for (const playlist of DEFAULT_PLAYLISTS) {
        copy.push({
            id: playlist.id,
            name: playlist.name,
            songs: playlist.songs.slice(),
        });
    }
    return copy;
}

function findPlaylist(playlistId) {
    for (const playlist of state.playlists) {
        if (playlist.id === playlistId) {
            return playlist;
        }
    }
    return null;
}

function nextPlaylistId() {
    let nextId = 1;
    for (const playlist of state.playlists) {
        if (playlist.id >= nextId) {
            nextId = playlist.id + 1;
        }
    }
    return nextId;
}

const state = {
    currentSongIndex: 0,
    isPlaying: false,
    currentPlaylistId: null,
    playlists: getDefaultPlaylists(),
    filteredSongs: songs.slice(),
    filters: {
        genre: 'all',
        songQuery: '',
        playlistQuery: '',
    },
};

const listeners = new Set();

export function subscribe(listener) {
    listeners.add(listener);
    return function () {
        listeners.delete(listener);
    };
}

export function notify() {
    for (const listener of listeners) {
        listener(state);
    }
}

export function getState() {
    return state;
}

export function getSongs() {
    return songs;
}

export function getCurrentSong() {
    if (state.currentSongIndex >= 0 && state.currentSongIndex < songs.length) {
        return songs[state.currentSongIndex];
    }
    return null;
}

export function getCurrentPlaylist() {
    return findPlaylist(state.currentPlaylistId);
}

export function getFilteredPlaylists() {
    const query = state.filters.playlistQuery.toLowerCase();
    const result = [];

    for (const playlist of state.playlists) {
        const name = playlist.name.toLowerCase();
        if (name.includes(query)) {
            result.push(playlist);
        }
    }
    return result;
}

export function setCurrentSongIndex(index) {
    if (index >= 0 && index < songs.length) {
        state.currentSongIndex = index;
    }
}

export function setIsPlaying(isPlaying) {
    state.isPlaying = isPlaying;
}

export function setCurrentPlaylistId(playlistId) {
    state.currentPlaylistId = playlistId;
}

export function setSongFilter(changes) {
    if (!changes) {
        changes = {};
    }

    if (typeof changes.genre === 'string') {
        state.filters.genre = changes.genre;
    }
    if (typeof changes.songQuery === 'string') {
        state.filters.songQuery = changes.songQuery;
    }

    applySongFilter();
}

export function setPlaylistQuery(playlistQuery) {
    if (!playlistQuery) {
        playlistQuery = '';
    }
    state.filters.playlistQuery = playlistQuery;
}

export function applySongFilter() {
    const genre = state.filters.genre;
    const query = state.filters.songQuery.trim().toLowerCase();
    const result = [];

    for (const song of songs) {
        const genreMatches = genre === 'all' || song.genre === genre;

        const searchMatches = query === ''
            || song.name.toLowerCase().includes(query)
            || song.artist.toLowerCase().includes(query);

        if (genreMatches && searchMatches) {
            result.push(song);
        }
    }

    state.filteredSongs = result;
}

export function createPlaylist(name) {
    const trimmedName = name.trim();

    if (trimmedName === '') {
        return { ok: false, reason: 'empty', playlist: null };
    }

    for (const playlist of state.playlists) {
        if (playlist.name.toLowerCase() === trimmedName.toLowerCase()) {
            return { ok: false, reason: 'duplicate', playlist: null };
        }
    }

    const playlist = { id: nextPlaylistId(), name: trimmedName, songs: [] };
    state.playlists.push(playlist);
    savePlaylistsToStorage();
    return { ok: true, reason: null, playlist: playlist };
}

export function addSongToPlaylist(playlistId, songId) {
    const playlist = findPlaylist(playlistId);

    if (playlist === null) {
        return { ok: false, reason: 'missing' };
    }

    if (playlist.songs.includes(songId)) {
        return { ok: false, reason: 'exists' };
    }

    playlist.songs.push(songId);
    savePlaylistsToStorage();
    return { ok: true, reason: null, playlist: playlist };
}

export function removeSongFromPlaylist(playlistId, songId) {
    const playlist = findPlaylist(playlistId);

    if (playlist === null) {
        return { ok: false, reason: 'missing' };
    }

    const songIndex = playlist.songs.indexOf(songId);
    if (songIndex === -1) {
        return { ok: false, reason: 'notfound' };
    }

    playlist.songs.splice(songIndex, 1);
    savePlaylistsToStorage();
    return { ok: true, reason: null, playlist: playlist };
}

const STORAGE_KEY = 'musicPlayerPlaylists';

export function savePlaylistsToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.playlists));
    } catch (error) {
        console.log(error);
    }
}

export function loadPlaylistsFromStorage() {
    try {
        const savedText = localStorage.getItem(STORAGE_KEY);

        if (!savedText) {
            state.playlists = getDefaultPlaylists();
            return;
        }

        const parsed = JSON.parse(savedText);

        if (!Array.isArray(parsed)) {
            state.playlists = getDefaultPlaylists();
            return;
        }

        const cleaned = [];
        for (const playlist of parsed) {
            const isValid = playlist
                && typeof playlist.id === 'number'
                && typeof playlist.name === 'string';

            if (!isValid) {
                continue;
            }

            const songIds = [];
            if (Array.isArray(playlist.songs)) {
                for (const id of playlist.songs) {
                    if (typeof id === 'number') {
                        songIds.push(id);
                    }
                }
            }

            cleaned.push({ id: playlist.id, name: playlist.name, songs: songIds });
        }

        if (cleaned.length === 0) {
            state.playlists = getDefaultPlaylists();
            return;
        }

        state.playlists = cleaned;
    } catch (error) {
        state.playlists = getDefaultPlaylists();
    }
}

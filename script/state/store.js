import { songs } from '../data/songs.js';

const DEFAULT_PLAYLISTS = [
    { id: 1, name: 'Favorites', songs: [1, 3, 5, 7] },
    { id: 2, name: 'Workout', songs: [2, 4, 8, 12] },
    { id: 3, name: 'Chill Vibes', songs: [6, 9, 14, 15] },
];

const state = {
    currentSongIndex: 0,
    isPlaying: false,
    currentPlaylistId: null,
    playlists: [
        { id: 1, name: "Favorites", songs: [1, 3, 5, 7] },
        { id: 2, name: "Workout", songs: [2, 4, 8, 12] },
        { id: 3, name: "Chill Vibes", songs: [6, 9, 14, 15] },
    ],
    filteredSongs: [...songs],
    filters: {
        genre: 'all',
        songQuery: '',
        playlistQuery: '',
    },
};

const listeners = new Set();

export function getState() {
    return state;
}

export function getSongs() {
    return songs;
}

export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function notify() {
    listeners.forEach((listener) => listener(state));
}

export function getCurrentSong() {
    return songs[state.currentSongIndex] || null;
}

export function getCurrentPlaylist() {
    return state.playlists.find((playlist) => playlist.id === state.currentPlaylistId) || null;
}

export function getFilteredPlaylists() {
    const query = state.filters.playlistQuery.toLowerCase();
    return state.playlists.filter((playlist) => playlist.name.toLowerCase().includes(query));
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

export function setSongFilter({ genre, songQuery } = {}) {
    if (typeof genre === 'string') {
        state.filters.genre = genre;
    }
    if (typeof songQuery === 'string') {
        state.filters.songQuery = songQuery;
    }
    applySongFilter();
}

export function setPlaylistQuery(playlistQuery) {
    state.filters.playlistQuery = playlistQuery || '';
}

export function applySongFilter() {
    const genre = state.filters.genre;
    const query = state.filters.songQuery.trim().toLowerCase();

    state.filteredSongs = songs.filter((song) => {
        const genreMatch = genre === 'all' || song.genre === genre;
        const searchMatch =
            query === '' ||
            song.name.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query);
        return genreMatch && searchMatch;
    });
}

export function createPlaylist(name) {
    const trimmed = name.trim();
    if (!trimmed) {
        return { ok: false, reason: 'empty', playlist: null };
    }

    if (state.playlists.some((playlist) => playlist.name.toLowerCase() === trimmed.toLowerCase())) {
        return { ok: false, reason: 'duplicate', playlist: null };
    }

    const nextId = state.playlists.length > 0 ? Math.max(...state.playlists.map((p) => p.id)) + 1 : 1;
    const playlist = { id: nextId, name: trimmed, songs: [] };
    state.playlists.push(playlist);
    savePlaylistsToStorage();
    return { ok: true, reason: null, playlist };
}

export function addSongToPlaylist(playlistId, songId) {
    const playlist = state.playlists.find((p) => p.id === playlistId);
    if (!playlist) {
        return { ok: false, reason: 'missing' };
    }
    if (playlist.songs.includes(songId)) {
        return { ok: false, reason: 'exists' };
    }

    playlist.songs.push(songId);
    savePlaylistsToStorage();
    return { ok: true, reason: null, playlist };
}

export function removeSongFromPlaylist(playlistId, songId) {
    const playlist = state.playlists.find((p) => p.id === playlistId);
    if (!playlist) {
        return { ok: false, reason: 'missing' };
    }

    const songIndex = playlist.songs.indexOf(songId);
    if (songIndex === -1) {
        return { ok: false, reason: 'notfound' };
    }

    playlist.songs.splice(songIndex, 1);
    savePlaylistsToStorage();
    return { ok: true, reason: null, playlist };
}

export function savePlaylistsToStorage() {
    try {
        localStorage.setItem('musicPlayerPlaylists', JSON.stringify(state.playlists));
    } catch {
        // ignore storage failures to keep app usable
    }
}

export function loadPlaylistsFromStorage() {
    try {
        const savedPlaylists = localStorage.getItem('musicPlayerPlaylists');
        if (!savedPlaylists) {
            state.playlists = DEFAULT_PLAYLISTS.map((playlist) => ({ ...playlist, songs: [...playlist.songs] }));
            return;
        }

        const parsed = JSON.parse(savedPlaylists);
        if (!Array.isArray(parsed)) {
            state.playlists = DEFAULT_PLAYLISTS.map((playlist) => ({ ...playlist, songs: [...playlist.songs] }));
            return;
        }

        state.playlists = parsed
            .filter((playlist) => playlist && typeof playlist.id === 'number' && typeof playlist.name === 'string')
            .map((playlist) => ({
                id: playlist.id,
                name: playlist.name,
                songs: Array.isArray(playlist.songs)
                    ? playlist.songs.filter((id) => typeof id === 'number')
                    : [],
            }));

        if (state.playlists.length === 0) {
            state.playlists = DEFAULT_PLAYLISTS.map((playlist) => ({ ...playlist, songs: [...playlist.songs] }));
        }
    } catch {
        state.playlists = DEFAULT_PLAYLISTS.map((playlist) => ({ ...playlist, songs: [...playlist.songs] }));
    }
}

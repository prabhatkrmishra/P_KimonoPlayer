import {
    getState,
    getSongs,
    getCurrentSong,
    setSongFilter,
    setPlaylistQuery,
    setCurrentPlaylistId,
    loadPlaylistsFromStorage,
    applySongFilter,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
} from './state/store.js';
import { createPlayerService } from './services/player.js';
import { initTheme } from './services/theme.js';
import { showNotification } from './services/notifications.js';
import { initSongList } from './components/song-list.js';
import { initNowPlaying } from './components/now-playing.js';
import { initPlaylists } from './components/playlists.js';
import { $ } from './utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {
    loadPlaylistsFromStorage();
    applySongFilter();
    initTheme();

    const player = createPlayerService();
    const songSearch = $('#song-search');

    // Selection updates the UI immediately; playback start is awaited separately
    // so the Now Playing card never lags behind a slow audio source.
    async function selectAndPlay(songId) {
        player.selectSongById(songId);
        const playing = player.play();
        renderAll();
        await playing;
        renderPlaybackState();
        renderSongList();
    }

    async function skipTo(direction) {
        const skipping = direction === 'next' ? player.playNext() : player.playPrev();
        renderAll();
        await skipping;
        renderPlaybackState();
    }

    const songList = initSongList({
        onGenreChange: (genre) => {
            setSongFilter({ genre });
            renderAll();
        },
        onSongQueryChange: (songQuery) => {
            if (songSearch && songSearch.value !== songQuery) songSearch.value = songQuery;
            setSongFilter({ songQuery });
            renderAll();
        },
        onSongSelect: (songId) => selectAndPlay(songId),
    });

    const nowPlaying = initNowPlaying({
        onTogglePlay: async () => {
            await player.togglePlayPause();
            renderPlaybackState();
            renderSongList();
        },
        onNext: () => skipTo('next'),
        onPrev: () => skipTo('prev'),
        onSeek: (percent) => {
            player.seekByPercent(percent);
            nowPlaying.renderProgress(player.getCurrentTime(), player.getDuration());
        },
        onAddToPlaylist: (playlistId) => {
            if (!playlistId) {
                showNotification('Please select a playlist first!');
                return;
            }

            const currentSong = getCurrentSong();
            if (!currentSong) return;

            const result = addSongToPlaylist(playlistId, currentSong.id);
            const playlistsState = getState().playlists;
            const playlist = playlistsState.find((p) => p.id === playlistId);

            if (!result.ok) {
                if (result.reason === 'exists') {
                    showNotification('This song is already in the selected playlist!');
                } else {
                    showNotification('Unable to add song to playlist.');
                }
                return;
            }

            if (playlist) {
                showNotification(`Added "${currentSong.name}" to "${playlist.name}"`);
            }
            renderPlaylistsAndOptions();
        },
    });

    const playlists = initPlaylists({
        onSelectPlaylist: (playlistId) => {
            setCurrentPlaylistId(playlistId);
            renderPlaylistsAndOptions();
        },
        onCreatePlaylist: (name) => {
            const result = createPlaylist(name);
            if (!result.ok) {
                if (result.reason === 'empty') {
                    showNotification('Please enter a playlist name!');
                } else if (result.reason === 'duplicate') {
                    showNotification('A playlist with this name already exists!');
                }
                return;
            }

            showNotification(`Created new playlist: "${result.playlist.name}"`);
            renderPlaylistsAndOptions();
        },
        onRemoveSong: (playlistId, songId) => {
            const result = removeSongFromPlaylist(playlistId, songId);
            if (!result.ok) return;

            const song = getSongs().find((s) => s.id === songId);
            const playlist = getState().playlists.find((p) => p.id === playlistId);
            if (song && playlist) {
                showNotification(`Removed "${song.name}" from "${playlist.name}"`);
            }
            renderPlaylistsAndOptions();
        },
        onPlaySong: (songId) => selectAndPlay(songId),
        onPlaylistSearchChange: (query) => {
            setPlaylistQuery(query);
            playlists.renderPlaylists();
        },
    });

    function renderSongList() {
        songList.render();
    }

    function renderPlaybackState() {
        nowPlaying.renderPlaybackState();
    }

    function renderPlaylistsAndOptions() {
        nowPlaying.renderPlaylistOptions(getState().playlists);
        playlists.render();
    }

    function renderAll() {
        nowPlaying.renderSong();
        nowPlaying.renderPlaybackState();
        nowPlaying.renderProgress(player.getCurrentTime(), player.getDuration());
        renderPlaylistsAndOptions();
        renderSongList();
    }

    player.onTimeUpdate(() => {
        nowPlaying.renderProgress(player.getCurrentTime(), player.getDuration());
    });

    player.onLoadedMetadata(() => {
        nowPlaying.renderProgress(player.getCurrentTime(), player.getDuration());
    });

    player.onEnded(() => skipTo('next'));

    document.addEventListener('keydown', async (e) => {
        const target = e.target;
        const isTypingTarget = target instanceof HTMLElement && target.matches('input, textarea, select');
        // Let focused buttons (except the play button) receive Space for their own action
        const isOtherButton = target instanceof HTMLElement
            && target.matches('button')
            && target.id !== 'play-btn';

        if (e.code === 'Space' && !isTypingTarget && !isOtherButton) {
            e.preventDefault();
            await player.togglePlayPause();
            renderPlaybackState();
            renderSongList();
        }        if (e.code === 'ArrowRight' && !isTypingTarget) {
            skipTo('next');
        }

        if (e.code === 'ArrowLeft' && !isTypingTarget) {
            skipTo('prev');
        }
    });

    // Initialize current song and UI
    player.renderOrLoadCurrentSong();
    renderAll();
});

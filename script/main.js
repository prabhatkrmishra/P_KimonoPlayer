
import {
    getState,
    getSongs,
    getCurrentSong,
    setSongFilter,
    setPlaylistQuery,
    setCurrentPlaylistId,
    deletePlayList,
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

document.addEventListener('DOMContentLoaded', function () {
    loadPlaylistsFromStorage();
    applySongFilter();
    initTheme();

    const player = createPlayerService();
    const songSearch = $('#song-search');

    async function selectAndPlay(songId) {
        player.selectSongById(songId);
        const playPromise = player.play();
        renderAll();
        await playPromise;
        renderPlaybackState();
        renderSongList();
    }

    async function skipTo(direction) {
        let skipPromise;
        if (direction === 'next') {
            skipPromise = player.playNext();
        } else {
            skipPromise = player.playPrev();
        }

        renderAll();
        await skipPromise;
        renderPlaybackState();
    }

    const songList = initSongList({
        onGenreChange: function (genre) {
            setSongFilter({ genre: genre });
            renderAll();
        },
        onSongQueryChange: function (songQuery) {
            if (songSearch && songSearch.value !== songQuery) {
                songSearch.value = songQuery;
            }
            setSongFilter({ songQuery: songQuery });
            renderAll();
        },
        onSongSelect: function (songId) {
            selectAndPlay(songId);
        },
    });

    const nowPlaying = initNowPlaying({
        onTogglePlay: async function () {
            await player.togglePlayPause();
            renderPlaybackState();
            renderSongList();
        },
        onNext: function () {
            skipTo('next');
        },
        onPrev: function () {
            skipTo('prev');
        },
        onSeek: function (percent) {
            player.seekByPercent(percent);
            nowPlaying.renderProgress(player.getCurrentTime(), player.getDuration());
        },
        onAddToPlaylist: function (playlistId) {
            if (!playlistId) {
                showNotification('Please select a playlist first!');
                return;
            }

            const currentSong = getCurrentSong();
            if (!currentSong) return;

            const result = addSongToPlaylist(playlistId, currentSong.id);

            if (!result.ok) {
                if (result.reason === 'exists') {
                    showNotification('This song is already in the selected playlist!');
                } else {
                    showNotification('Unable to add song to playlist.');
                }
                return;
            }

            const playlist = getState().playlists.find(function (p) {
                return p.id === playlistId;
            });
            if (playlist) {
                showNotification('Added "' + currentSong.name + '" to "' + playlist.name + '"');
            }
            renderPlaylistsAndOptions();
        },
    });

    const playlists = initPlaylists({
        onSelectPlaylist: function (playlistId) {
            setCurrentPlaylistId(playlistId);
            renderPlaylistsAndOptions();
        },
        onCreatePlaylist: function (name) {
            const result = createPlaylist(name);

            if (!result.ok) {
                if (result.reason === 'empty') {
                    showNotification('Please enter a playlist name!');
                } else if (result.reason === 'duplicate') {
                    showNotification('A playlist with this name already exists!');
                }
                return;
            }

            showNotification('Created new playlist: "' + result.playlist.name + '"');
            renderPlaylistsAndOptions();
        },
        onDeletePlayList: function (playlistId) {
            deletePlayList(playlistId);
            renderPlaylistsAndOptions();
        },
        onRemoveSong: function (playlistId, songId) {
            const result = removeSongFromPlaylist(playlistId, songId);
            if (!result.ok) return;

            const song = getSongs().find(function (s) {
                return s.id === songId;
            });
            const playlist = getState().playlists.find(function (p) {
                return p.id === playlistId;
            });
            if (song && playlist) {
                showNotification('Removed "' + song.name + '" from "' + playlist.name + '"');
            }
            renderPlaylistsAndOptions();
        },
        onPlaySong: function (songId) {
            selectAndPlay(songId);
        },
        onPlaylistSearchChange: function (query) {
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

    player.onTimeUpdate(function () {
        nowPlaying.renderProgress(player.getCurrentTime(), player.getDuration());
    });

    player.onLoadedMetadata(function () {
        nowPlaying.renderProgress(player.getCurrentTime(), player.getDuration());
    });

    player.onEnded(function () {
        skipTo('next');
    });

    document.addEventListener('keydown', async function (event) {
        const target = event.target;

        const isTypingTarget = target instanceof HTMLElement && target.matches('input, textarea, select');

        const isOtherButton = target instanceof HTMLElement
            && target.matches('button')
            && target.id !== 'play-btn';

        if (event.code === 'Space' && !isTypingTarget && !isOtherButton) {
            event.preventDefault();
            await player.togglePlayPause();
            renderPlaybackState();
            renderSongList();
        }

        if (event.code === 'ArrowRight' && !isTypingTarget) {
            skipTo('next');
        }

        if (event.code === 'ArrowLeft' && !isTypingTarget) {
            skipTo('prev');
        }
    });

    player.renderOrLoadCurrentSong();
    renderAll();
});

import { $ } from '../utils/dom.js';
import { formatTime } from '../utils/format.js';
import { getCurrentSong, getState } from '../state/store.js';

export function initNowPlaying(callbacks) {
    const songCard = $('#song-card');
    const currentSongImg = $('#current-song-img');
    const currentSongName = $('#current-song-name');
    const currentSongArtist = $('#current-song-artist');
    const currentSongGenre = $('#current-song-genre');
    const footerSong = $('#footer-song');
    const playBtn = $('#play-btn');
    const prevBtn = $('#prev-btn');
    const nextBtn = $('#next-btn');
    const progress = $('#progress');
    const currentTimeEl = $('#current-time');
    const totalTimeEl = $('#total-time');
    const progressBar = $('.progress-bar');
    const addToPlaylistBtn = $('#add-to-playlist-btn');
    const playlistSelect = $('#playlist-select');

    function renderSong() {
        const song = getCurrentSong();
        if (!song) return;

        if (currentSongImg) {
            currentSongImg.src = song.img;
            currentSongImg.alt = song.name;
        }
        if (currentSongName) {
            currentSongName.textContent = song.name;
        }
        if (currentSongArtist) {
            currentSongArtist.textContent = song.artist;
        }
        if (currentSongGenre) {
            currentSongGenre.textContent = song.genre;
        }
        if (footerSong) {
            footerSong.textContent = song.name + ' by ' + song.artist;
        }
    }

    function renderPlaybackState() {
        const isPlaying = getState().isPlaying;

        if (playBtn) {
            if (isPlaying) {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.title = 'Pause';
            } else {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.title = 'Play';
            }
        }

        songCard?.classList.toggle('playing', isPlaying);
    }

    function renderProgress(currentTime, duration) {
        const durationIsKnown = Number.isFinite(duration) && duration > 0;

        if (durationIsKnown) {
            const percent = (currentTime / duration) * 100;
            if (progress) {
                progress.style.width = percent + '%';
            }
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(currentTime);
            }
            if (totalTimeEl) {
                totalTimeEl.textContent = formatTime(duration);
            }
        } else {
            if (progress) {
                progress.style.width = '0%';
            }
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(currentTime || 0);
            }
            if (totalTimeEl) {
                totalTimeEl.textContent = '0:00';
            }
        }
    }

    function renderPlaylistOptions(playlists) {
        if (!playlistSelect) return;

        const selectedValue = playlistSelect.value;

        playlistSelect.innerHTML = '<option value="">Add to Playlist</option>';

        for (const playlist of playlists) {
            const option = document.createElement('option');
            option.value = String(playlist.id);
            option.textContent = playlist.name;
            playlistSelect.appendChild(option);
        }

        let selectionStillExists = false;
        for (const playlist of playlists) {
            if (String(playlist.id) === selectedValue) {
                selectionStillExists = true;
            }
        }
        if (selectedValue && selectionStillExists) {
            playlistSelect.value = selectedValue;
        }
    }

    function getSelectedPlaylistId() {
        if (!playlistSelect) return null;
        if (!playlistSelect.value) return null;

        const id = parseInt(playlistSelect.value, 10);
        if (Number.isNaN(id)) return null;
        return id;
    }

    playBtn?.addEventListener('click', function () {
        callbacks.onTogglePlay();
    });

    nextBtn?.addEventListener('click', function () {
        callbacks.onNext();
    });

    prevBtn?.addEventListener('click', function () {
        callbacks.onPrev();
    });

    progressBar?.addEventListener('click', function (event) {
        const barRect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - barRect.left;

        let percent = 0;
        if (barRect.width > 0) {
            percent = clickX / barRect.width;
        }
        callbacks.onSeek(percent);
    });

    addToPlaylistBtn?.addEventListener('click', function () {
        callbacks.onAddToPlaylist(getSelectedPlaylistId());
    });

    return {
        renderSong: renderSong,
        renderPlaybackState: renderPlaybackState,
        renderProgress: renderProgress,
        renderPlaylistOptions: renderPlaylistOptions,
    };
}

import { $ } from '../utils/dom.js';
import { formatTime } from '../utils/format.js';
import { getCurrentSong, getState } from '../state/store.js';

export function initNowPlaying({ onTogglePlay, onNext, onPrev, onSeek, onAddToPlaylist }) {
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
        if (currentSongName) currentSongName.textContent = song.name;
        if (currentSongArtist) currentSongArtist.textContent = song.artist;
        if (currentSongGenre) currentSongGenre.textContent = song.genre;
        if (footerSong) footerSong.textContent = `${song.name} by ${song.artist}`;
    }

    function renderPlaybackState() {
        const { isPlaying } = getState();

        if (playBtn) {
            playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
            playBtn.title = isPlaying ? 'Pause' : 'Play';
        }

        songCard?.classList.toggle('playing', isPlaying);
    }

    function renderProgress(currentTime, duration) {
        if (Number.isFinite(duration) && duration > 0) {
            const percent = (currentTime / duration) * 100;
            if (progress) progress.style.width = `${percent}%`;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
            if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
        } else {
            if (progress) progress.style.width = '0%';
            if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime || 0);
            if (totalTimeEl) totalTimeEl.textContent = '0:00';
        }
    }

    function renderPlaylistOptions(playlists) {
        if (!playlistSelect) return;
        const selectedValue = playlistSelect.value;

        playlistSelect.innerHTML = '<option value="">Add to Playlist</option>';

        playlists.forEach((playlist) => {
            const option = document.createElement('option');
            option.value = String(playlist.id);
            option.textContent = playlist.name;
            playlistSelect.appendChild(option);
        });

        // Preserve the user's selection across re-renders
        if (selectedValue && playlists.some((playlist) => String(playlist.id) === selectedValue)) {
            playlistSelect.value = selectedValue;
        }
    }

    function getSelectedPlaylistId() {
        if (!playlistSelect || !playlistSelect.value) return null;
        const id = parseInt(playlistSelect.value, 10);
        return Number.isNaN(id) ? null : id;
    }

    playBtn?.addEventListener('click', () => onTogglePlay());
    nextBtn?.addEventListener('click', () => onNext());
    prevBtn?.addEventListener('click', () => onPrev());

    progressBar?.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = rect.width ? clickX / rect.width : 0;
        onSeek(percent);
    });

    addToPlaylistBtn?.addEventListener('click', () => onAddToPlaylist(getSelectedPlaylistId()));

    return {
        renderSong,
        renderPlaybackState,
        renderProgress,
        renderPlaylistOptions,
    };
}

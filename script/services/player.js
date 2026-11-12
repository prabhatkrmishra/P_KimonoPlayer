import { createAudioService } from './audio.js';
import {
    getSongs,
    getState,
    getCurrentSong,
    setCurrentSongIndex,
    setIsPlaying,
} from '../state/store.js';

export function createPlayerService() {
    const audioService = createAudioService();
    const songs = getSongs();

    function renderOrLoadCurrentSong() {
        const song = getCurrentSong();
        if (!song) return;
        audioService.load(song.source);
    }

    function selectSongById(songId) {
        const index = songs.findIndex((song) => song.id === songId);
        if (index === -1) return false;

        setCurrentSongIndex(index);
        renderOrLoadCurrentSong();
        return true;
    }

    function selectSongByIndex(index) {
        if (index < 0 || index >= songs.length) return false;
        setCurrentSongIndex(index);
        renderOrLoadCurrentSong();
        return true;
    }

    async function play() {
        try {
            await audioService.play();
            setIsPlaying(true);
            return true;
        } catch {
            // Playback can fail (e.g. autoplay restrictions or unavailable source)
            setIsPlaying(false);
            return false;
        }
    }

    function pause() {
        audioService.pause();
        setIsPlaying(false);
    }

    async function togglePlayPause() {
        const state = getState();
        if (state.isPlaying) {
            pause();
            return false;
        }
        return play();
    }

    async function playNext() {
        const state = getState();
        const nextIndex = (state.currentSongIndex + 1) % songs.length;
        selectSongByIndex(nextIndex);
        if (state.isPlaying) {
            await play();
        }
        return nextIndex;
    }

    async function playPrev() {
        const state = getState();
        const prevIndex = (state.currentSongIndex - 1 + songs.length) % songs.length;
        selectSongByIndex(prevIndex);
        if (state.isPlaying) {
            await play();
        }
        return prevIndex;
    }

    function seekTo(time) {
        audioService.seek(time);
    }

    function seekByPercent(percent) {
        const duration = audioService.getDuration();
        if (!Number.isFinite(duration) || duration <= 0) return;
        const clamped = Math.max(0, Math.min(percent, 1));
        audioService.seek(clamped * duration);
    }

    function onTimeUpdate(handler) {
        audioService.onTimeUpdate(handler);
    }

    function onLoadedMetadata(handler) {
        audioService.onLoadedMetadata(handler);
    }

    function onEnded(handler) {
        audioService.onEnded(handler);
    }

    function getCurrentTime() {
        return audioService.getCurrentTime();
    }

    function getDuration() {
        return audioService.getDuration();
    }

    return {
        renderOrLoadCurrentSong,
        selectSongById,
        selectSongByIndex,
        play,
        pause,
        togglePlayPause,
        playNext,
        playPrev,
        seekTo,
        seekByPercent,
        onTimeUpdate,
        onLoadedMetadata,
        onEnded,
        getCurrentTime,
        getDuration,
    };
}

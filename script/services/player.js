
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
        for (let i = 0; i < songs.length; i++) {
            if (songs[i].id === songId) {
                setCurrentSongIndex(i);
                renderOrLoadCurrentSong();
                return true;
            }
        }
        return false;
    }

    function selectSongByIndex(index) {
        if (index < 0 || index >= songs.length) {
            return false;
        }
        setCurrentSongIndex(index);
        renderOrLoadCurrentSong();
        return true;
    }

    function play() {
        return audioService.play()
            .then(function () {
                setIsPlaying(true);
                return true;
            })
            .catch(function () {
                setIsPlaying(false);
                return false;
            });
    }

    function pause() {
        audioService.pause();
        setIsPlaying(false);
    }

    function togglePlayPause() {
        if (getState().isPlaying) {
            pause();
            return Promise.resolve(false);
        }
        return play();
    }

    function playNext() {
        let nextIndex = getState().currentSongIndex + 1;
        if (nextIndex >= songs.length) {
            nextIndex = 0;
        }
        selectSongByIndex(nextIndex);

        if (getState().isPlaying) {
            play();
        }
        return nextIndex;
    }

    function playPrev() {
        let prevIndex = getState().currentSongIndex - 1;
        if (prevIndex < 0) {
            prevIndex = songs.length - 1;
        }
        selectSongByIndex(prevIndex);

        if (getState().isPlaying) {
            play();
        }
        return prevIndex;
    }

    function seekTo(time) {
        audioService.seek(time);
    }

    function seekByPercent(percent) {
        const duration = audioService.getDuration();
        if (!Number.isFinite(duration) || duration <= 0) {
            return;
        }

        let safePercent = percent;
        if (safePercent < 0) safePercent = 0;
        if (safePercent > 1) safePercent = 1;

        audioService.seek(safePercent * duration);
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
        renderOrLoadCurrentSong: renderOrLoadCurrentSong,
        selectSongById: selectSongById,
        selectSongByIndex: selectSongByIndex,
        play: play,
        pause: pause,
        togglePlayPause: togglePlayPause,
        playNext: playNext,
        playPrev: playPrev,
        seekTo: seekTo,
        seekByPercent: seekByPercent,
        onTimeUpdate: onTimeUpdate,
        onLoadedMetadata: onLoadedMetadata,
        onEnded: onEnded,
        getCurrentTime: getCurrentTime,
        getDuration: getDuration,
    };
}

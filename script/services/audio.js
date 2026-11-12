import { $ } from '../utils/dom.js';

export function createAudioService() {
    const audio = $('#audio-player');
    let timeUpdateHandler = null;
    let endedHandler = null;
    let metadataHandler = null;

    return {
        element: audio,

        load(source) {
            if (!audio) return;
            audio.src = source;
            audio.load();
        },

        play() {
            if (!audio) return Promise.resolve();
            return audio.play();
        },

        pause() {
            if (!audio) return;
            audio.pause();
        },

        seek(time) {
            if (!audio || !Number.isFinite(time)) return;
            audio.currentTime = Math.max(0, Math.min(time, Number.isFinite(audio.duration) ? audio.duration : time));
        },

        getCurrentTime() {
            return audio?.currentTime || 0;
        },

        getDuration() {
            return audio?.duration || 0;
        },

        onTimeUpdate(handler) {
            if (!audio) return;
            if (timeUpdateHandler) {
                audio.removeEventListener('timeupdate', timeUpdateHandler);
            }
            timeUpdateHandler = handler;
            audio.addEventListener('timeupdate', timeUpdateHandler);
        },

        onEnded(handler) {
            if (!audio) return;
            if (endedHandler) {
                audio.removeEventListener('ended', endedHandler);
            }
            endedHandler = handler;
            audio.addEventListener('ended', endedHandler);
        },

        onLoadedMetadata(handler) {
            if (!audio) return;
            if (metadataHandler) {
                audio.removeEventListener('loadedmetadata', metadataHandler);
            }
            metadataHandler = handler;
            audio.addEventListener('loadedmetadata', metadataHandler);
        },
    };
}

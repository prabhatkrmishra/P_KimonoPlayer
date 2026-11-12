
import { $ } from '../utils/dom.js';

export function createAudioService() {
    const audio = $('#audio-player');

    function load(source) {
        if (!audio) return;
        audio.src = source;
        audio.load();
    }

    function play() {
        if (!audio) return Promise.resolve();
        return audio.play();
    }

    function pause() {
        if (!audio) return;
        audio.pause();
    }

    function seek(time) {
        if (!audio) return;
        if (!Number.isFinite(time)) return;

        let safeTime = time;
        if (safeTime < 0) {
            safeTime = 0;
        }
        if (Number.isFinite(audio.duration) && safeTime > audio.duration) {
            safeTime = audio.duration;
        }
        audio.currentTime = safeTime;
    }

    function getCurrentTime() {
        if (!audio) return 0;
        return audio.currentTime || 0;
    }

    function getDuration() {
        if (!audio) return 0;
        return audio.duration || 0;
    }

    function addSingleListener(eventName, oldHandler, newHandler) {
        if (!audio) return;
        if (oldHandler) {
            audio.removeEventListener(eventName, oldHandler);
        }
        audio.addEventListener(eventName, newHandler);
        return newHandler;
    }

    let timeUpdateHandler = null;
    let endedHandler = null;
    let metadataHandler = null;

    function onTimeUpdate(handler) {
        timeUpdateHandler = addSingleListener('timeupdate', timeUpdateHandler, handler);
    }

    function onEnded(handler) {
        endedHandler = addSingleListener('ended', endedHandler, handler);
    }

    function onLoadedMetadata(handler) {
        metadataHandler = addSingleListener('loadedmetadata', metadataHandler, handler);
    }

    return {
        element: audio,
        load: load,
        play: play,
        pause: pause,
        seek: seek,
        getCurrentTime: getCurrentTime,
        getDuration: getDuration,
        onTimeUpdate: onTimeUpdate,
        onEnded: onEnded,
        onLoadedMetadata: onLoadedMetadata,
    };
}

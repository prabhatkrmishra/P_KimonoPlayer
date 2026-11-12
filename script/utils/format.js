export function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '0:00';
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    let secsText = String(secs);
    if (secs < 10) {
        secsText = '0' + secsText;
    }

    return mins + ':' + secsText;
}

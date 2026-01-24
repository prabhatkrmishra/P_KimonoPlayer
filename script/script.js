const songs = [
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "pop", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, name: "Bohemian Rhapsody", artist: "Queen", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "rock", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, name: "Take Five", artist: "Dave Brubeck", img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "jazz", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: 4, name: "Sicko Mode", artist: "Travis Scott", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "hiphop", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: 5, name: "Strobe", artist: "Deadmau5", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "electronic", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: 6, name: "Moonlight Sonata", artist: "Beethoven", img: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "classical", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { id: 7, name: "Levitating", artist: "Dua Lipa", img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "pop", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { id: 8, name: "Back In Black", artist: "AC/DC", img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "rock", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { id: 9, name: "So What", artist: "Miles Davis", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "jazz", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { id: 10, name: "God's Plan", artist: "Drake", img: "https://images.unsplash.com/photo-1574231164645-d6f0e8553590?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "hiphop", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
    { id: 11, name: "Summer", artist: "Calvin Harris", img: "https://images.unsplash.com/photo-1526394931762-90052e97b376?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "electronic", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
    { id: 12, name: "Hotel California", artist: "Eagles", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "rock", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
    { id: 13, name: "Shape of You", artist: "Ed Sheeran", img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "pop", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
    { id: 14, name: "Fly Me To The Moon", artist: "Frank Sinatra", img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "jazz", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
    { id: 15, name: "Symphony No. 5", artist: "Beethoven", img: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80", genre: "classical", source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
];

const state = {
    currentSongIndex: 0,
    isPlaying: false,
    currentPlaylist: null,
    playlists: [
        { id: 1, name: "Favorites", songs: [1, 3, 5, 7] },
        { id: 2, name: "Workout", songs: [2, 4, 8, 12] },
        { id: 3, name: "Chill Vibes", songs: [6, 9, 14, 15] },
    ],
    filteredSongs: [...songs],
    selectedGenre: "all",
    searchQuery: "",
    playlistSearchQuery: ""
};

const audioPlayer = document.getElementById('audio-player');
const songsList = document.getElementById('songs-list');
const songCard = document.getElementById('song-card');
const currentSongImg = document.getElementById('current-song-img');
const currentSongName = document.getElementById('current-song-name');
const currentSongArtist = document.getElementById('current-song-artist');
const currentSongGenre = document.getElementById('current-song-genre');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const themeToggle = document.getElementById('theme-toggle');
const genreFilter = document.getElementById('genre-filter');
const playlistSelect = document.getElementById('playlist-select');
const addToPlaylistBtn = document.getElementById('add-to-playlist-btn');
const playlistsList = document.getElementById('playlists-list');
const playlistSongs = document.getElementById('playlist-songs');
const selectedPlaylistName = document.getElementById('selected-playlist-name');
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const newPlaylistName = document.getElementById('new-playlist-name');
const songSearch = document.getElementById('song-search');
const globalSearch = document.getElementById('global-search');
const playlistSearch = document.getElementById('playlist-search');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('current-time');
const totalTime = document.getElementById('total-time');
const footerSong = document.getElementById('footer-song');

function init() {
    showSongs();
    renderPlaylists();
    updatePlaylistSelect();
    setupEventListeners();

    if (songs.length > 0) {
        state.currentSongIndex = 0;
        renderCurrentSong();
    }
}

function showSongs() {
    songsList.innerHTML = '';

    if (state.filteredSongs.length === 0) {
        songsList.innerHTML = '<p class="empty-message">No songs found matching your criteria.</p>';
        return;
    }

    state.filteredSongs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        if (song.id === songs[state.currentSongIndex].id) {
            songItem.classList.add('playing');
        }

        songItem.innerHTML = `
            <img src="${song.img}" alt="${song.name}">
            <div class="song-details">
                <h4>${song.name}</h4>
                <p>${song.artist}</p>
                <span class="song-genre-tag">${song.genre}</span>
            </div>
        `;

        songItem.addEventListener('click', () => {
            const index = songs.findIndex(s => s.id === song.id);
            if (index !== -1) {
                state.currentSongIndex = index;
                renderCurrentSong();
                playSong();
                highlightCurrentSong();
            }
        });

        songsList.appendChild(songItem);
    });
}

function filterSongs() {
    state.filteredSongs = songs.filter(song => {
        const genreMatch = state.selectedGenre === 'all' || song.genre === state.selectedGenre;

        const searchMatch = state.searchQuery === '' ||
            song.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(state.searchQuery.toLowerCase());

        return genreMatch && searchMatch;
    });

    showSongs();
}

function highlightCurrentSong() {
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach(item => item.classList.remove('playing'));

    const currentSongId = songs[state.currentSongIndex].id;
    const currentSongItem = document.querySelector(`.song-item:nth-child(${state.filteredSongs.findIndex(s => s.id === currentSongId) + 1})`);
    if (currentSongItem) {
        currentSongItem.classList.add('playing');
    }
}

function renderCurrentSong() {
    const song = songs[state.currentSongIndex];

    currentSongImg.src = song.img;
    currentSongImg.alt = song.name;
    currentSongName.textContent = song.name;
    currentSongArtist.textContent = song.artist;
    currentSongGenre.textContent = song.genre;
    footerSong.textContent = `${song.name} by ${song.artist}`;

    audioPlayer.src = song.source;

    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(audioPlayer.duration);
    });

    highlightCurrentSong();
}

function playSong() {
    audioPlayer.play();
    state.isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.title = "Pause";
    songCard.classList.add('playing');

    audioPlayer.addEventListener('timeupdate', updateProgress);
}

function pauseSong() {
    audioPlayer.pause();
    state.isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.title = "Play";
    songCard.classList.remove('playing');
}

function playNextSong() {
    state.currentSongIndex = (state.currentSongIndex + 1) % songs.length;
    renderCurrentSong();
    if (state.isPlaying) {
        playSong();
    }
}

function playPrevSong() {
    state.currentSongIndex = (state.currentSongIndex - 1 + songs.length) % songs.length;
    renderCurrentSong();
    if (state.isPlaying) {
        playSong();
    }
}

function updateProgress() {
    const { currentTime: currTime, duration } = audioPlayer;

    if (duration) {
        const progressPercent = (currTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        currentTime.textContent = formatTime(currTime);
        totalTime.textContent = formatTime(duration);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);

    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span') || document.createElement('span');

    if (newTheme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = ' Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = ' Dark Mode';
    }

    if (!themeToggle.querySelector('span')) {
        themeToggle.appendChild(text);
    }

    localStorage.setItem('theme', newTheme);
}

function renderPlaylists() {
    playlistsList.innerHTML = '';

    const filteredPlaylists = state.playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(state.playlistSearchQuery.toLowerCase())
    );

    if (filteredPlaylists.length === 0) {
        playlistsList.innerHTML = '<p class="empty-message">No playlists found.</p>';
        return;
    }

    filteredPlaylists.forEach(playlist => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        if (state.currentPlaylist && state.currentPlaylist.id === playlist.id) {
            playlistItem.classList.add('active');
        }

        const songCount = playlist.songs.length;
        const songText = songCount === 1 ? 'song' : 'songs';

        playlistItem.innerHTML = `
            <div class="playlist-info">
                <span class="playlist-name">${playlist.name}</span>
                <span class="playlist-song-count">${songCount} ${songText}</span>
            </div>
        `;

        playlistItem.addEventListener('click', () => {
            state.currentPlaylist = playlist;
            renderPlaylistSongs();
            highlightSelectedPlaylist();
        });

        playlistsList.appendChild(playlistItem);
    });

    highlightSelectedPlaylist();
}

function highlightSelectedPlaylist() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => item.classList.remove('active'));

    if (state.currentPlaylist) {
        const selectedItem = Array.from(playlistItems).find(item => {
            const playlistNameElement = item.querySelector('.playlist-name');
            return playlistNameElement && playlistNameElement.textContent === state.currentPlaylist.name;
        });
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }
}

function renderPlaylistSongs() {
    playlistSongs.innerHTML = '';

    if (!state.currentPlaylist) {
        selectedPlaylistName.textContent = "Select a Playlist";
        playlistSongs.innerHTML = '<p class="empty-message">No playlist selected. Select a playlist to view its songs.</p>';
        return;
    }

    selectedPlaylistName.textContent = state.currentPlaylist.name;

    if (state.currentPlaylist.songs.length === 0) {
        playlistSongs.innerHTML = '<p class="empty-message">This playlist is empty. Add songs to it!</p>';
        return;
    }

    const playlistSongObjects = songs.filter(song =>
        state.currentPlaylist.songs.includes(song.id)
    );

    playlistSongObjects.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'playlist-song-item';

        songItem.innerHTML = `
            <div class="playlist-song-info">
                <div>
                    <strong>${song.name}</strong>
                    <p class="playlist-song-artist">${song.artist} • ${song.genre}</p>
                </div>
                <button class="remove-song-btn" data-song-id="${song.id}" title="Remove from playlist">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        songItem.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-song-btn')) {
                const index = songs.findIndex(s => s.id === song.id);
                if (index !== -1) {
                    state.currentSongIndex = index;
                    renderCurrentSong();
                    playSong();
                    highlightCurrentSong();
                }
            }
        });

        playlistSongs.appendChild(songItem);
    });

    document.querySelectorAll('.remove-song-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = parseInt(btn.getAttribute('data-song-id'));
            removeSongFromPlaylist(songId);
        });
    });
}

function addToPlaylist() {
    const playlistId = parseInt(playlistSelect.value);
    const currentSongId = songs[state.currentSongIndex].id;

    if (!playlistId) {
        alert('Please select a playlist first!');
        return;
    }

    const playlist = state.playlists.find(p => p.id === playlistId);

    if (playlist.songs.includes(currentSongId)) {
        alert('This song is already in the selected playlist!');
        return;
    }

    playlist.songs.push(currentSongId);

    renderPlaylists();
    if (state.currentPlaylist && state.currentPlaylist.id === playlistId) {
        renderPlaylistSongs();
    }

    showNotification(`Added "${songs[state.currentSongIndex].name}" to "${playlist.name}"`);

    savePlaylistsToStorage();
}

function removeSongFromPlaylist(songId) {
    if (!state.currentPlaylist) return;

    const songIndex = state.currentPlaylist.songs.indexOf(songId);
    if (songIndex !== -1) {
        state.currentPlaylist.songs.splice(songIndex, 1);

        renderPlaylistSongs();
        renderPlaylists();

        const song = songs.find(s => s.id === songId);
        showNotification(`Removed "${song.name}" from "${state.currentPlaylist.name}"`);

        savePlaylistsToStorage();
    }
}

function createPlaylist() {
    const name = newPlaylistName.value.trim();

    if (!name) {
        alert('Please enter a playlist name!');
        return;
    }

    if (state.playlists.some(playlist => playlist.name.toLowerCase() === name.toLowerCase())) {
        alert('A playlist with this name already exists!');
        return;
    }

    const newPlaylist = {
        id: state.playlists.length > 0 ? Math.max(...state.playlists.map(p => p.id)) + 1 : 1,
        name: name,
        songs: []
    };

    state.playlists.push(newPlaylist);

    newPlaylistName.value = '';

    renderPlaylists();
    updatePlaylistSelect();

    showNotification(`Created new playlist: "${name}"`);

    savePlaylistsToStorage();
}

function updatePlaylistSelect() {
    playlistSelect.innerHTML = '<option value="">Add to Playlist</option>';

    state.playlists.forEach(playlist => {
        const option = document.createElement('option');
        option.value = playlist.id;
        option.textContent = playlist.name;
        playlistSelect.appendChild(option);
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function savePlaylistsToStorage() {
    localStorage.setItem('musicPlayerPlaylists', JSON.stringify(state.playlists));
}

function loadPlaylistsFromStorage() {
    const savedPlaylists = localStorage.getItem('musicPlayerPlaylists');
    if (savedPlaylists) {
        state.playlists = JSON.parse(savedPlaylists);
    }
}

function loadThemeFromStorage() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span') || document.createElement('span');

        if (savedTheme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = ' Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = ' Dark Mode';
        }

        if (!themeToggle.querySelector('span')) {
            themeToggle.appendChild(text);
        }
    }
}

function setupEventListeners() {
    playBtn.addEventListener('click', () => {
        if (state.isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    nextBtn.addEventListener('click', playNextSong);

    prevBtn.addEventListener('click', playPrevSong);

    themeToggle.addEventListener('click', toggleTheme);

    genreFilter.addEventListener('change', (e) => {
        state.selectedGenre = e.target.value;
        filterSongs();
    });

    addToPlaylistBtn.addEventListener('click', addToPlaylist);

    createPlaylistBtn.addEventListener('click', createPlaylist);

    songSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        filterSongs();
    });

    globalSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        filterSongs();
    });

    playlistSearch.addEventListener('input', (e) => {
        state.playlistSearchQuery = e.target.value;
        renderPlaylists();
    });

    document.querySelector('.progress-bar').addEventListener('click', (e) => {
        const progressBar = e.target;
        const clickPosition = e.offsetX;
        const progressBarWidth = progressBar.clientWidth;
        const percentage = clickPosition / progressBarWidth;

        audioPlayer.currentTime = percentage * audioPlayer.duration;
        updateProgress();
    });

    audioPlayer.addEventListener('ended', playNextSong);

    newPlaylistName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createPlaylist();
        }
    });

    globalSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterSongs();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            if (state.isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        }

        if (e.code === 'ArrowRight') {
            playNextSong();
        }

        if (e.code === 'ArrowLeft') {
            playPrevSong();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPlaylistsFromStorage();
    loadThemeFromStorage();

    init();

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
// Banco de dados de músicas de exemplo (Royalty Free)
const songs = [
    {
        title: "Lost in the City Lights",
        artist: "Cosmo Sheldrake",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400"
    },
    {
        title: "Urban Neon",
        artist: "Midnight Drive",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400"
    },
    {
        title: "Retro Future vibes",
        artist: "Synthwave Deluxe",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400"
    }
];

// Seleção de elementos do DOM
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const disc = document.getElementById('disc');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume');
const playlistContainer = document.getElementById('playlist');

let songIndex = 0;
let isPlaying = false;

// Inicializar o Player
loadSong(songs[songIndex]);
buildPlaylist();

// Carrega as informações da música no HTML
function loadSong(song) {
    trackTitle.innerText = song.title;
    trackArtist.innerText = song.artist;
    audio.src = song.src;
    disc.style.backgroundImage = `url('${song.cover}')`;
}

// Alternar Play e Pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    disc.classList.add('playing');
    audio.play();
    updatePlaylistActiveStatus();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    disc.classList.remove('playing');
    audio.pause();
}

// Músicas Anterior e Próxima
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Atualizar barra de progresso e tempo corrido
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Formatação de tempo
        currentTimeEl.innerText = formatTime(currentTime);
        durationEl.innerText = formatTime(duration);
    }
}

// Transforma segundos em formato MM:SS
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Mudar ponto da música ao clicar na barra de progresso
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Mudar Volume
function changeVolume() {
    audio.volume = volumeSlider.value;
}

// Constroi a lista lateral de músicas
function buildPlaylist() {
    playlistContainer.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <div>${song.title}</div>
                <small style="color: #a0a0c0;">${song.artist}</small>
            </div>
        `;
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        playlistContainer.appendChild(li);
    });
    updatePlaylistActiveStatus();
}

// Destaca a música que está tocando no momento na barra lateral
function updatePlaylistActiveStatus() {
    const items = playlistContainer.querySelectorAll('li');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Event Listeners (Eventos de clique e interações)
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong); // Toca a próxima automaticamente ao acabar

progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', changeVolume);
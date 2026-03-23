class MusicPlayer {
  static REWIND_THRESHOLD = 3;

  #audio   = new Audio();
  #tracks  = [];
  #current = 0;
  #playing = false;

  #dom = {
    progress : document.querySelector('.progress'),
    play     : document.querySelector('.play'),
    prev     : document.querySelectorAll('.btn')[0],
    next     : document.querySelectorAll('.btn')[2],
    elapsed  : document.querySelectorAll('.time')[0],
    duration : document.querySelectorAll('.time')[1],
    song     : document.querySelector('.song'),
    artist   : document.querySelector('.artist'),
  };

  constructor(tracks) {
    this.#tracks = tracks;
    this.#bind();
    this.load(0);
  }

  get track() { return this.#tracks[this.#current]; }

  static parseName(path) {
    const name  = path.split('/').pop().replace(/\.[^.]+$/, '');
    const delim = name.indexOf(' - ');

    return delim === -1
      ? { artist: 'Unknown Artist', song: name }
      : { artist: name.slice(0, delim), song: name.slice(delim + 3) };
  }

  static formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return '0:00';

    const min = Math.floor(seconds / 60);
    const sec = String(Math.floor(seconds % 60)).padStart(2, '0');

    return `${min}:${sec}`;
  }

  load(index) {
    this.#current = ((index % this.#tracks.length) + this.#tracks.length) % this.#tracks.length;

    const { artist, song } = MusicPlayer.parseName(this.track);

    this.#audio.src              = this.track;
    this.#dom.artist.textContent = artist;
    this.#dom.song.textContent   = song;
    this.#dom.progress.style.width  = '0%';
    this.#dom.elapsed.textContent   = '0:00';
    this.#dom.duration.textContent  = '0:00';
  }

  toggle() {
    this.#playing ? this.#audio.pause() : this.#audio.play();
    this.#playing = !this.#playing;
    this.#dom.play.textContent = this.#playing ? '⏸' : '▶';
  }

  prev() {
    if (this.#audio.currentTime > MusicPlayer.REWIND_THRESHOLD) {
      this.#audio.currentTime = 0;
      return;
    }

    this.load(this.#current - 1);
    if (this.#playing) this.#audio.play();
  }

  next() {
    this.load(this.#current + 1);
    if (this.#playing) this.#audio.play();
  }

  #updateProgress() {
    const { currentTime, duration } = this.#audio;

    this.#dom.progress.style.width = `${(currentTime / duration * 100)}%`;
    this.#dom.elapsed.textContent  = MusicPlayer.formatTime(currentTime);
  }

  #bind() {
    this.#dom.play.addEventListener('click', () => this.toggle());
    this.#dom.prev.addEventListener('click', () => this.prev());
    this.#dom.next.addEventListener('click', () => this.next());

    this.#audio.addEventListener('loadedmetadata', () => {
      this.#dom.duration.textContent = MusicPlayer.formatTime(this.#audio.duration);
    });

    this.#audio.addEventListener('timeupdate', () => this.#updateProgress());
    this.#audio.addEventListener('ended',      () => this.next());
  }
}

// ── Init ────────────────────────────────────────────────────────────
// Add your files to the music/ folder.
// Format: "Artist - Song Name.mp3"

const player = new MusicPlayer([
  'music/Giraffe Squad - Wait For Me.mp3',
  'music/Gameboy Tetris, nublu, Cartoon, Jéja - Biology.mp3',
]);

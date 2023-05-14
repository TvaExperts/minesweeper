class AudioPlayer {
  constructor() {
    this.loopTrack = new Audio('./assets/sounds/loop.mp3');
  }

  playLoop = () => {
    if (/* this.loopTrack.loop */ true) return;
    this.loopTrack.loop = true;
    this.loopTrack.play();
  };
}

export default AudioPlayer;

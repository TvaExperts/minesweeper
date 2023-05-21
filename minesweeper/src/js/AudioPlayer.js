import win from '../../assets/sounds/win.wav';
import collapse from '../../assets/sounds/collapse.mp3';
import dig from '../../assets/sounds/dig.wav';
import flag from '../../assets/sounds/flag.wav';
import loop from '../../assets/sounds/loop.mp3';
import unflag from '../../assets/sounds/unflag.wav';
import wilgelm from '../../assets/sounds/wilgelm.wav';

class AudioPlayer {
  constructor(soundVolume, musicVolume) {
    this.music = new Audio(loop);
    this.music.loop = true;
    this.music.volume = musicVolume;
    this.sounds = {};
    this.sounds.win = new Audio(win);
    this.sounds.collapse = new Audio(collapse);
    this.sounds.dig = new Audio(dig);
    this.sounds.flag = new Audio(flag);
    this.sounds.unflag = new Audio(unflag);
    this.sounds.lose = new Audio(wilgelm);
    this.setNewSoundVolume(soundVolume);
  }

  setNewSoundVolume = (newVolume) => {
    this.sounds.win.volume = newVolume;
    this.sounds.collapse.volume = newVolume;
    this.sounds.flag.volume = newVolume;
    this.sounds.unflag.volume = newVolume;
    this.sounds.lose.volume = newVolume;
    this.sounds.dig.volume = newVolume;
  };

  increaseMusicVolume = () => {
    let newVolume = this.music.volume + 0.2;
    if (newVolume > 1) newVolume = 1;
    this.music.volume = newVolume;
    return newVolume;
  };

  decreaseMusicVolume = () => {
    let newVolume = this.music.volume - 0.2;
    if (newVolume < 0) newVolume = 0;
    this.music.volume = newVolume;
    return newVolume;
  };

  increaseSoundVolume = () => {
    let newVolume = this.sounds.win.volume + 0.2;
    if (newVolume > 1) newVolume = 1;
    this.setNewSoundVolume(newVolume);
    return newVolume;
  };

  decreaseSoundVolume = () => {
    let newVolume = this.sounds.win.volume - 0.2;
    if (newVolume < 0) newVolume = 0;
    this.setNewSoundVolume(newVolume);
    return newVolume;
  };

  playMusic = () => {
    if (!this.music.paused) return;
    this.music.play();
  };
}

export default AudioPlayer;

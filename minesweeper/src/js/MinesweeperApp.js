/* eslint-disable max-len */
import AudioPlayer from './AudioPlayer';
import Minesweeper from './Minesweeper';
import { GAME_STATE } from './consts';

class MinesweeperApp {
  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.startTimers();
  }

  initNewGame = () => {
    const mines = parseInt(document.querySelector('.mines').value, 10);
    const rows = parseInt(document.querySelector('.rows').value, 10);
    const columns = parseInt(document.querySelector('.columns').value, 10);
    this.minesweeper = new Minesweeper(columns * 30, rows * 30, rows, columns, mines, this.audioPlayer);
    this.minesweeper.initGrid();
    this.timerPlayTime = 0;
    this.timerPlayTimeOnPage = document.querySelector('.header__timer');
    this.timerPlayTimeOnPage.innerHTML = this.timerPlayTime;
  };

  startTimers = () => {
    setInterval(this.increasePlayTime, 1000);
  };

  increasePlayTime = () => {
    if (this.minesweeper.state === GAME_STATE.ACTIVE) {
      this.timerPlayTime += 1;
      this.timerPlayTimeOnPage.innerHTML = this.timerPlayTime;
    }
  };
}

export default MinesweeperApp;

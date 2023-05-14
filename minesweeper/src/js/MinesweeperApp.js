/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import AudioPlayer from './AudioPlayer';
import Painter from './Painter';
import Minesweeper from './Minesweeper';
import { GAME_STATE, APP_THEME, MAX_WIDTH, BORDER_WIDTH } from './consts';
import { showTimeInMinutes } from './utils';

class MinesweeperApp {
  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.painter = new Painter();
    this.minesweeper = new Minesweeper(this.painter, this.audioPlayer);
    this.startTimers();
    window.addEventListener('resize', this.checkResize);
  }

  loadData = async () => {
    await this.painter.loadAllImages();
  };

  calculateCellSize = (columns) => {
    const windowWidth = document.documentElement.clientWidth;
    if (windowWidth > MAX_WIDTH) return Math.floor((MAX_WIDTH - BORDER_WIDTH * 2) / columns);
    return Math.floor((windowWidth - BORDER_WIDTH * 2) / columns);
  };

  checkResize = () => {
    const cellSize = this.calculateCellSize(this.minesweeper.columns);
    if (cellSize === this.minesweeper.cellSize) return;
    this.painter.initGrid(
      cellSize,
      this.minesweeper.columns * cellSize,
      this.minesweeper.rows * cellSize,
      this.minesweeper.rows,
      this.minesweeper.columns,
      APP_THEME.LIGHT
    );
    this.painter.drawGrid(this.minesweeper.grid);
  };

  initNewGame = () => {
    const mines = parseInt(document.querySelector('.mines').value, 10);
    const rows = parseInt(document.querySelector('.rows').value, 10);
    const columns = parseInt(document.querySelector('.columns').value, 10);
    const cellSize = this.calculateCellSize(columns);
    this.painter.initGrid(cellSize, columns * cellSize, rows * cellSize, rows, columns, APP_THEME.LIGHT);
    this.minesweeper.initGame(rows, columns, mines);
    this.timerPlayTime = 0;
    this.timerPlayTimeOnPage = document.querySelector('.minesweeper-app__game-time-value');
    this.timerPlayTimeOnPage.innerHTML = showTimeInMinutes(this.timerPlayTime);
  };

  startTimers = () => {
    setInterval(this.increasePlayTime, 1000);
  };

  increasePlayTime = () => {
    if (this.minesweeper.state === GAME_STATE.ACTIVE) {
      this.timerPlayTime += 1;
      this.timerPlayTimeOnPage.innerHTML = showTimeInMinutes(this.timerPlayTime);
    }
  };
}

export default MinesweeperApp;

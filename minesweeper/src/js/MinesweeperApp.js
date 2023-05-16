/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import AudioPlayer from './AudioPlayer';
import Painter from './Painter';
import Minesweeper from './Minesweeper';
import { GAME_STATE, APP_THEME, BORDER_WIDTH, BORDER_HEIGHT } from './consts';
import { showTimeInMinutes } from './utils';

class MinesweeperApp {
  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.painter = new Painter();
    this.minesweeper = new Minesweeper(this.painter, this.audioPlayer);
    this.theme = APP_THEME.THEME_DARK;
    this.startTimers();
    window.addEventListener('resize', this.checkResize);
  }

  loadData = async () => {
    await this.painter.loadAllSVGImages();
  };

  calculateCellSize = (rows, columns) => {
    let cellSize = 100;
    let calcCellSize = null;
    const windowWidth = document.documentElement.clientWidth;
    calcCellSize = (windowWidth - BORDER_WIDTH * 2) / columns;
    if (cellSize > calcCellSize) cellSize = calcCellSize;
    const windowHeight = document.documentElement.clientHeight;
    calcCellSize = (windowHeight - BORDER_HEIGHT) / rows;
    if (cellSize > calcCellSize) cellSize = calcCellSize;
    return cellSize;
  };

  checkResize = () => {
    const cellSize = this.calculateCellSize(this.minesweeper.rows, this.minesweeper.columns);
    if (cellSize === this.minesweeper.cellSize) return;
    this.painter.initGrid(
      cellSize,
      this.minesweeper.columns * cellSize,
      this.minesweeper.rows * cellSize,
      this.minesweeper.rows,
      this.minesweeper.columns,
      this.theme
    );
    this.painter.drawGrid(this.minesweeper.grid);
  };

  initNewGame = () => {
    const mines = 10; // parseInt(document.querySelector('.mines').value, 10);
    const rows = 10; // parseInt(document.querySelector('.rows').value, 10);
    const columns = 10; // = parseInt(document.querySelector('.columns').value, 10);
    const cellSize = this.calculateCellSize(rows, columns);
    this.painter.initGrid(cellSize, columns * cellSize, rows * cellSize, rows, columns, this.theme);
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

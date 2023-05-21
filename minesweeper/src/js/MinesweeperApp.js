/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import AudioPlayer from './AudioPlayer';
import Painter from './Painter';
import Minesweeper from './Minesweeper';
import { GAME_STATE, DIFFICULTIES, MODAL_NAMES, BORDER_WIDTHS } from './consts';
import Rating from './Rating';
import Builder from './Builder';

class MinesweeperApp {
  constructor(appConfigs) {
    this.loadConfigsApp(appConfigs);
    this.audioPlayer = new AudioPlayer(this.musicVolume, this.soundVolume);
    this.builder = new Builder(this.generateListOfCallbacks());
    this.builder.buildPage(this.difficulty, this.minesCount, this.theme, this.soundVolume, this.musicVolume);
    this.addListenersOnPage();
    this.painter = new Painter();
    this.minesweeper = new Minesweeper(this, this.painter, this.audioPlayer, this.handleLose, this.handleWin);
    this.rating = new Rating();
    this.startTimers();
  }

  loadConfigsApp = (appConfigs) => {
    this.difficulty = appConfigs.difficulty;
    this.theme = appConfigs.theme;
    this.minesCount = appConfigs.minesCount;
    this.musicVolume = appConfigs.musicVolume;
    this.soundVolume = appConfigs.soundVolume;
  };

  addListenersOnPage = () => {
    window.addEventListener('resize', this.checkResize);
  };

  loadRating = (rating) => {
    if (rating) this.rating.list = rating;
  };

  generateListOfCallbacks = () => {
    const listOfCallbacks = {
      handleChengeMinesCount: this.handleChengeMinesCount,
      toggleAppTheme: this.toggleAppTheme,
      changeDifficultyClickHandler: this.changeDifficultyClickHandler,
      initNewGame: this.initNewGame,
      getRating: this.getRating,
      increaseMusicVolume: this.audioPlayer.increaseMusicVolume,
      decreaseMusicVolume: this.audioPlayer.decreaseMusicVolume,
      increaseSoundVolume: this.audioPlayer.increaseSoundVolume,
      decreaseSoundVolume: this.audioPlayer.decreaseSoundVolume,
    };
    return listOfCallbacks;
  };

  getRating = () => this.rating.list;

  handleChengeMinesCount = (newMinesCount) => {
    this.minesCount = newMinesCount;
    this.initNewGame();
  };

  toggleAppTheme = (theme) => {
    this.theme = theme;
    this.painter.theme = this.theme;
    this.painter.drawGrid(this.minesweeper.grid);
  };

  changeDifficultyClickHandler = (newDifficulty) => {
    this.difficulty = newDifficulty;
    this.minesCount = DIFFICULTIES[this.difficulty].mines;
    this.initNewGame();
  };

  handleWin = () => {
    const gameResult = {};
    gameResult.time = this.timerPlayTime;
    const date = new Date();
    gameResult.date = `${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0, -3)}`;
    gameResult.clicks = this.minesweeper.clicksCount;
    const place = this.rating.push(gameResult);
    if (place < 0) {
      Builder.updateEndModal(MODAL_NAMES.WIN, gameResult.time, this.rating.getBestTime());
      Builder.showModalById(MODAL_NAMES.WIN);
    } else {
      Builder.updateEndModal(MODAL_NAMES.WIN_PLACE, gameResult.time, this.rating.getBestTime(), place);
      Builder.showModalById(MODAL_NAMES.WIN_PLACE);
    }
    this.audioPlayer.sounds.win.play();
  };

  handleLose = () => {
    Builder.updateEndModal(MODAL_NAMES.LOSE, this.timerPlayTime, this.rating.getBestTime());
    Builder.showModalById(MODAL_NAMES.LOSE);
    this.audioPlayer.sounds.lose.play();
  };

  loadData = async () => {
    await this.painter.loadAllSVGImages();
  };

  calculateCellSize = (columns) => {
    let cellSize = 100;
    let calcCellSize = null;
    let windowWidth = document.documentElement.clientWidth;
    let { borderSize } = BORDER_WIDTHS.MOBILE;
    if (windowWidth > BORDER_WIDTHS.MOBILE.maxWidth) borderSize = BORDER_WIDTHS.TABLET.borderSize;
    if (windowWidth > BORDER_WIDTHS.TABLET.maxWidth) borderSize = BORDER_WIDTHS.DESKTOP.borderSize;
    if (windowWidth > BORDER_WIDTHS.DESKTOP.maxWidth) windowWidth = BORDER_WIDTHS.DESKTOP.maxWidth;
    calcCellSize = (windowWidth - borderSize * 2) / columns;
    if (cellSize > calcCellSize) cellSize = calcCellSize;
    return cellSize;
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
      this.theme
    );
    this.painter.drawGrid(this.minesweeper.grid);
  };

  initNewGame = (game) => {
    let grid = null;
    let time = 0;
    let clicksCount = 0;
    if (game && game.state === GAME_STATE.ACTIVE) {
      grid = game.grid;
      time = game.time;
      clicksCount = game.clicksCount;
    }
    const { rows, columns } = DIFFICULTIES[this.difficulty];
    this.minesweeper.initGame(rows, columns, this.minesCount, grid, clicksCount);
    const cellSize = this.calculateCellSize(columns);
    this.painter.initGrid(cellSize, columns * cellSize, rows * cellSize, rows, columns, this.theme);
    this.painter.drawGrid(this.minesweeper.grid);
    this.timerPlayTime = time;
    Builder.updateGameTime(this.timerPlayTime);
  };

  startTimers = () => {
    setInterval(this.increasePlayTime, 1000);
  };

  increasePlayTime = () => {
    if (this.minesweeper.state === GAME_STATE.ACTIVE) {
      this.timerPlayTime += 1;
      Builder.updateGameTime(this.timerPlayTime);
    }
  };

  buildSaveData = () => {
    const saveData = {};
    saveData.rating = this.rating.list;
    saveData.appConfigs = {};
    saveData.appConfigs.difficulty = this.difficulty;
    saveData.appConfigs.minesCount = this.minesCount;
    saveData.appConfigs.theme = this.theme;
    saveData.appConfigs.soundVolume = this.audioPlayer.sounds.win.volume;
    saveData.appConfigs.musicVolume = this.audioPlayer.music.volume;
    saveData.game = {};
    saveData.game.state = this.minesweeper.state;
    if (this.minesweeper.state === GAME_STATE.ACTIVE) {
      saveData.game.grid = this.minesweeper.grid;
      saveData.game.time = this.timerPlayTime;
      saveData.game.clicksCount = this.minesweeper.clicksCount;
    }
    return saveData;
  };
}

export default MinesweeperApp;

/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import AudioPlayer from './AudioPlayer';
import Painter from './Painter';
import Minesweeper from './Minesweeper';
import { GAME_STATE, APP_THEME, DIFFICULTIES, MODAL_NAMES, BORDER_WIDTHS } from './consts';
import { createElement } from './utils';
import Rating from './Rating';
import Builder from './Builder';

class MinesweeperApp {
  constructor(appConfigs) {
    this.loadConfigsApp(appConfigs);
    this.buildPage();
    this.audioPlayer = new AudioPlayer();
    this.painter = new Painter();
    this.minesweeper = new Minesweeper(this, this.painter, this.audioPlayer);
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
    document.querySelector('.minesweeper-app__configs').addEventListener('click', this.clickElementToShowModalByClassHandler);
    document.querySelector('.minesweeper-app__sound').addEventListener('click', this.clickElementToShowModalByClassHandler);
    document.querySelector('.configs-modal__mines-count-input').addEventListener('change', this.changeMinesCountHandler);
    document.querySelector('.configs-modal__rating-button').addEventListener('click', this.clickElementToShowModalByClassHandler);
    document.getElementById('theme-checkbox').addEventListener('change', this.toggleAppTheme);
    const difficultyButtons = document.querySelectorAll('.button--difficulty');
    difficultyButtons.forEach((difficultyButton) => {
      difficultyButton.addEventListener('click', this.changeDifficultyClickHandler);
    });
    const closeButtons = document.querySelectorAll('.modal__close');
    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', Builder.hideAllModals);
    });
    document.addEventListener('click', Builder.clickModalOverlay);
    document.querySelector('.minesweeper-app__new-game').addEventListener('click', this.initNewGame);
  };

  buildPage = () => {
    const main = createElement('main', ['main']);
    const app = Builder.buildApp();
    const modalConfigs = Builder.buildConfigsModal(this.difficulty, this.minesCount, this.theme);
    const modalSound = Builder.buildSoundModal();
    const modalRating = Builder.buildModalRating();
    const modalLose = Builder.buildEndModal(MODAL_NAMES.LOSE);
    const modalWin = Builder.buildEndModal(MODAL_NAMES.WIN);
    const modalWinPlace = Builder.buildEndModal(MODAL_NAMES.WIN_PLACE);
    main.append(app, modalConfigs, modalSound, modalRating, modalLose, modalWin, modalWinPlace);
    document.body.append(main);
    if (this.theme === APP_THEME.THEME_DARK) document.body.classList.add('theme-dark');
    this.addListenersOnPage();
  };

  loadRating = (rating) => {
    if (rating) this.rating.list = rating;
  };

  changeMinesCountHandler = () => {
    const input = document.querySelector('.configs-modal__mines-count-input');
    if (input.value < 10) input.value = 10;
    if (input.value > 99) input.value = 99;
    this.minesCount = input.value;
    this.initNewGame();
  };

  toggleAppTheme = () => {
    const checkbox = document.getElementById('theme-checkbox');
    if (checkbox.checked) {
      document.body.classList.add('theme-dark');
      this.theme = APP_THEME.THEME_DARK;
    } else {
      document.body.classList.remove('theme-dark');
      this.theme = APP_THEME.THEME_LIGHT;
    }
    this.painter.theme = this.theme;
    this.painter.drawGrid(this.minesweeper.grid);
  };

  changeDifficultyClickHandler = (event) => {
    Builder.deactivateAllDifficulstButtons();
    const clickedButton = event.target.closest('.button');
    clickedButton.classList.add('button--active');
    this.difficulty = clickedButton.id.slice(11);
    document.querySelector('.configs-modal__mines-count-input').value = DIFFICULTIES[this.difficulty].mines;
    this.minesCount = DIFFICULTIES[this.difficulty].mines;
    this.initNewGame();
  };

  getModalIdFromClassList = (classList) => {
    let modalClass = '';
    classList.forEach((cls) => {
      if (cls.indexOf('-modal-show') > 0) modalClass = cls.slice(0, -5);
    });
    return modalClass;
  };

  clickElementToShowModalByClassHandler = (event) => {
    const { classList } = event.target.closest('.modal-show');
    const modalId = this.getModalIdFromClassList(classList);
    if (modalId === MODAL_NAMES.RATING) Builder.updateRatingModal(this.rating.list);
    Builder.showModalById(modalId);
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
  };

  handleLose = () => {
    Builder.updateEndModal(MODAL_NAMES.LOSE, this.timerPlayTime, this.rating.getBestTime());
    Builder.showModalById(MODAL_NAMES.LOSE);
  };

  loadData = async () => {
    await this.painter.loadAllSVGImages();
  };

  calculateCellSize = (rows, columns) => {
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
    const cellSize = this.calculateCellSize(rows, columns);
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
    saveData.appConfigs.soundVolume = 50;
    saveData.appConfigs.musicVolume = 50;
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

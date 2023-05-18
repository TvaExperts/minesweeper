/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import AudioPlayer from './AudioPlayer';
import Painter from './Painter';
import Minesweeper from './Minesweeper';
import { GAME_STATE, APP_THEME, BORDER_WIDTH, BORDER_HEIGHT, DIFFICULTIES, MAX_WIDTH, MODAL_NAMES } from './consts';
import { showTimeInMinutes, createElement } from './utils';
import Rating from './Rating';

class MinesweeperApp {
  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.painter = new Painter();
    this.minesweeper = new Minesweeper(this, this.painter, this.audioPlayer);
    this.theme = APP_THEME.THEME_LIGHT;
    this.startTimers();
    this.difficulty = 'easy';
    this.minesCount = 10;
    this.rating = new Rating([]);
    this.updateRatingModal();
    window.addEventListener('resize', this.checkResize);
    document.querySelector('.minesweeper-app__configs').addEventListener('click', this.clickElementToShowModalByClassHandler);
    document.querySelector('.minesweeper-app__sound').addEventListener('click', this.clickElementToShowModalByClassHandler);
    document.querySelector('.configs-modal__mines-count-input').addEventListener('change', this.changeMinesCountHandler);
    document.querySelector('.configs-modal__rating-button').addEventListener('click', this.clickElementToShowModalByClassHandler);
    document.getElementById('theme-checkbox').addEventListener('change', this.toggleAppTheme);
    document.querySelectorAll('.modal').forEach((modal) => modal.addEventListener('click', this.clickModalOverlay));
    const difficultyButtons = document.querySelectorAll('.button--difficulty');
    difficultyButtons.forEach((difficultyButton) => {
      difficultyButton.addEventListener('click', this.changeDifficultyClickHandler);
    });
    const closeButtons = document.querySelectorAll('.modal__close');
    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', this.hideAllModals);
    });
  }

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

  hideAllModals = () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.classList.remove('open');
    });
  };

  deactivateAllDifficulstButtons = () => {
    const buttons = document.querySelectorAll('.button--difficulty');
    buttons.forEach((button) => button.classList.remove('button--active'));
  };

  changeDifficultyClickHandler = (event) => {
    this.deactivateAllDifficulstButtons();
    const clickedButton = event.target.closest('.button');
    clickedButton.classList.add('button--active');
    this.difficulty = clickedButton.id.slice(11);

    this.initNewGame();
  };

  clickModalOverlay = (event) => {
    if (event.target.classList.contains('open')) this.hideAllModals();
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
    this.showModalById(modalId);
  };

  updateEndModal = (modalName, time, place = 0) => {
    const modal = document.getElementById(modalName);
    if (place) modal.querySelector('.end-modal__place').innerHTML = `${place} место!`;
    modal.querySelector('.end-modal__time-value').innerHTML = showTimeInMinutes(time);
    const bestBlock = modal.querySelector('.win-modal__time-block--best');
    if (this.rating.rating.length) {
      bestBlock.querySelector('.end-modal__time-value').innerHTML = showTimeInMinutes(this.rating.rating[0].time);
    } else {
      bestBlock.querySelector('.end-modal__time-value').innerHTML = '--:--';
    }
  };

  updateRatingModal = () => {
    const modal = document.getElementById(MODAL_NAMES.RATING);
    const resultsList = modal.querySelector('.rating-modal__list');
    resultsList.innerHTML = '';
    for (let i = 0; i < 10; i += 1) {
      const li = createElement('li', ['rating-modal__list-item']);
      const place = createElement('div', ['rating-modal__item-place']);
      place.innerHTML = i + 1;
      const name = createElement('p', ['rating-modal__item-name']);
      const clicks = createElement('p', ['rating-modal__item-clicks']);
      const time = createElement('p', ['rating-modal__item-time']);
      if (this.rating.rating[i]) {
        name.innerHTML = this.rating.rating[i].name;
        clicks.innerHTML = this.rating.rating[i].clicks;
        time.innerHTML = showTimeInMinutes(this.rating.rating[i].time);
      } else {
        name.innerHTML = '-------';
        clicks.innerHTML = '---';
        time.innerHTML = '--:--';
      }
      li.append(place, name, clicks, time);
      resultsList.append(li);
    }
  };

  handleWin = () => {
    const gameResult = {};
    gameResult.time = this.timerPlayTime;
    gameResult.name = 'anton';
    gameResult.clicks = 99;
    const place = this.rating.push(gameResult);
    if (place < 0) {
      this.updateEndModal(MODAL_NAMES.WIN, gameResult.time);
      this.showModalById(MODAL_NAMES.WIN);
    } else {
      this.updateEndModal(MODAL_NAMES.WIN_PLACE, gameResult.time, place);
      this.showModalById(MODAL_NAMES.WIN_PLACE);
      this.updateRatingModal();
    }
  };

  handleLose = () => {
    this.updateEndModal(MODAL_NAMES.LOSE, this.timerPlayTime);
    this.showModalById(MODAL_NAMES.LOSE);
  };

  showModalById = (modalId) => {
    this.hideAllModals();
    const modal = document.getElementById(modalId);
    modal.classList.add('open');
  };

  loadData = async () => {
    await this.painter.loadAllSVGImages();
  };

  calculateCellSize = (rows, columns) => {
    let cellSize = 100;
    let calcCellSize = null;
    let windowWidth = document.documentElement.clientWidth;
    if (windowWidth > MAX_WIDTH) windowWidth = MAX_WIDTH;
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
    const { rows, columns } = DIFFICULTIES[this.difficulty];
    this.minesweeper.initGame(rows, columns, this.minesCount);
    const cellSize = this.calculateCellSize(rows, columns);
    this.painter.initGrid(cellSize, columns * cellSize, rows * cellSize, rows, columns, this.theme);
    this.painter.drawGrid(this.minesweeper.grid);
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

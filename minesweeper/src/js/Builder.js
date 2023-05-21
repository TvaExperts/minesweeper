import { createElement, showTimeInMinutes } from './utils';
import { MODAL_NAMES, APP_THEME, DIFFICULTIES } from './consts';

class Builder {
  constructor(appCallbacks) {
    this.appCallbacks = appCallbacks;
  }

  // ====================== buildPage

  buildPage = (difficulty, minesCount, theme, soundVolume, musicVolume) => {
    const main = createElement('main', ['main']);
    const app = this.buildApp();
    const modalConfigs = this.buildConfigsModal(difficulty, minesCount, theme);
    const modalSound = this.buildSoundModal(soundVolume, musicVolume);
    const modalRating = Builder.buildModalRating();
    const modalLose = Builder.buildEndModal(MODAL_NAMES.LOSE);
    const modalWin = Builder.buildEndModal(MODAL_NAMES.WIN);
    const modalWinPlace = Builder.buildEndModal(MODAL_NAMES.WIN_PLACE);
    main.append(app, modalConfigs, modalSound, modalRating, modalLose, modalWin, modalWinPlace);
    document.body.append(main);
    if (theme === APP_THEME.THEME_DARK) document.body.classList.add('theme-dark');
    document.addEventListener('click', Builder.clickModalOverlay);
  };

  buildApp = () => {
    const app = createElement('div', ['minesweeper-app']);
    const header = this.buildAppHeader();
    const canvas = createElement('canvas', ['minesweeper-app__minesweeper']);
    const frame = Builder.buildFrame([header, canvas]);
    app.append(frame);
    return app;
  };

  buildAppHeader = () => {
    const header = createElement('div', ['minesweeper-app__header']);
    const sound = createElement('div', ['minesweeper-app__sound', 'modal-show', 'sound-modal-show']);
    sound.addEventListener('click', this.clickElementToShowModalByClassHandler);
    const headerStatistics = createElement('div', ['minesweeper-app__header-statistics']);
    const flags = createElement('div', ['minesweeper-app__flags']);
    const flagImg = createElement('div', ['minesweeper-app__flag-img']);
    const flagCount = createElement('div', ['minesweeper-app__flags-count']);
    const minesLeftCount = createElement('span', ['minesweeper-app__mines-left-count'], '/20');
    flagCount.append(minesLeftCount);
    flags.append(flagImg, flagCount);
    const gameTime = createElement('div', ['minesweeper-app__game-time']);
    const gameTimeClock = createElement('div', ['minesweeper-app__game-time-clock']);
    const gameTimeValue = createElement('div', ['minesweeper-app__game-time-value']);
    gameTime.append(gameTimeClock, gameTimeValue);
    const gameClicks = createElement('div', ['minesweeper-app__game-clicks']);
    const gameClicksIcon = createElement('div', ['minesweeper-app__game-clicks-icon']);
    const gameClicksValue = createElement('div', ['minesweeper-app__game-clicks-value']);
    gameClicks.append(gameClicksIcon, gameClicksValue);
    headerStatistics.append(flags, gameTime, gameClicks);
    const newGame = createElement('div', ['minesweeper-app__new-game']);
    newGame.addEventListener('click', this.appCallbacks.initNewGame);
    const configs = createElement('div', ['minesweeper-app__configs', 'modal-show', 'configs-modal-show']);
    configs.addEventListener('click', this.clickElementToShowModalByClassHandler);
    header.append(sound, headerStatistics, newGame, configs);
    return header;
  };

  static buildFrame = (innerElements, isModal = false) => {
    const frame = createElement('div', ['frame']);
    if (isModal) frame.classList.add('frame--modal');
    const frameMiddle = createElement('div', ['frame__middle']);
    const frameInside = createElement('div', ['frame__inside']);
    frameInside.append(...innerElements);
    frameMiddle.append(frameInside);
    frame.append(frameMiddle);
    return frame;
  };

  clickElementToShowModalByClassHandler = (event) => {
    const { classList } = event.target.closest('.modal-show');
    const modalId = Builder.getModalIdFromClassList(classList);
    if (modalId === MODAL_NAMES.RATING) Builder.updateRatingModal(this.appCallbacks.getRating());
    Builder.showModalById(modalId);
  };

  static getModalIdFromClassList = (classList) => {
    let modalClass = '';
    classList.forEach((cls) => {
      if (cls.indexOf('-modal-show') > 0) modalClass = cls.slice(0, -5);
    });
    return modalClass;
  };

  static showModalById = (modalId) => {
    Builder.hideAllModals();
    const modal = document.getElementById(modalId);
    modal.classList.add('open');
  };

  // ====================== work with app

  static updateGameTime = (timeInSec) => {
    const timerElement = document.querySelector('.minesweeper-app__game-time-value');
    timerElement.innerHTML = showTimeInMinutes(timeInSec);
  };

  static updateFlagsCounter = (flagsCount, minesLeft) => {
    const minesLeftBlock = document.querySelector('.minesweeper-app__mines-left-count');
    minesLeftBlock.innerHTML = `/${minesLeft}`;
    const flagCount = document.querySelector('.minesweeper-app__flags-count');
    flagCount.innerHTML = flagsCount;
    flagCount.append(minesLeftBlock);
  };

  static updateClicksCounter = (clicksCount) => {
    const clickCountBlock = document.querySelector('.minesweeper-app__game-clicks-value');
    clickCountBlock.innerHTML = clicksCount;
  };

  // ====================== Modals

  static buildModalWrapper = (innerElements, titleText) => {
    const modalWrapper = createElement('div', ['modal__wrapper']);
    const modalContainer = createElement('div', ['modal__container']);
    const modalTitle = createElement('div', ['modal__title']);
    const modalTitleText = createElement('div', ['modal__title-text'], titleText);
    modalTitle.append(modalTitleText);
    const modalClose = createElement('div', ['modal__close']);
    modalClose.addEventListener('click', Builder.hideAllModals);
    modalContainer.append(modalTitle, ...innerElements, modalClose);
    const frame = Builder.buildFrame([modalContainer], true);
    modalWrapper.append(frame);
    return modalWrapper;
  };

  static hideAllModals = () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.classList.remove('open');
    });
  };

  static clickModalOverlay = (event) => {
    if (event.target.classList.contains('open')) this.hideAllModals();
  };

  // ====================== Sound Modal

  buildSoundModal = (soundVolume, musicVolume) => {
    const modal = createElement('div', ['modal']);
    modal.id = MODAL_NAMES.SOUND;
    const musicBar = Builder.buildVolumeBar('music-volume', 'музыка', musicVolume);
    musicBar.querySelector('.volume-bar__decrease').addEventListener('click', this.decreaseMusicVolume);
    musicBar.querySelector('.volume-bar__increase').addEventListener('click', this.increaseMusicVolume);
    const soundBar = Builder.buildVolumeBar('sounds-volume', 'громкость', soundVolume);
    soundBar.querySelector('.volume-bar__decrease').addEventListener('click', this.decreaseSoundVolume);
    soundBar.querySelector('.volume-bar__increase').addEventListener('click', this.increaseSoundVolume);
    const wrapper = Builder.buildModalWrapper([musicBar, soundBar], 'звук');
    modal.append(wrapper);
    return modal;
  };

  decreaseMusicVolume = () => {
    const newValue = this.appCallbacks.decreaseMusicVolume();
    document.getElementById('music-volume').querySelector('.volume-bar__volume').style.width = `${newValue * 100}%`;
  };

  increaseMusicVolume = () => {
    const newValue = this.appCallbacks.increaseMusicVolume();
    document.getElementById('music-volume').querySelector('.volume-bar__volume').style.width = `${newValue * 100}%`;
  };

  decreaseSoundVolume = () => {
    const newValue = this.appCallbacks.decreaseSoundVolume();
    document.getElementById('sounds-volume').querySelector('.volume-bar__volume').style.width = `${newValue * 100}%`;
  };

  increaseSoundVolume = () => {
    const newValue = this.appCallbacks.increaseSoundVolume();
    document.getElementById('sounds-volume').querySelector('.volume-bar__volume').style.width = `${newValue * 100}%`;
  };

  static buildVolumeBar = (idVolumeBar, titleText, volume) => {
    const volumeBar = createElement('div', ['volume-bar']);
    volumeBar.id = idVolumeBar;
    const volumeBarTitle = createElement('div', ['volume-bar__title'], titleText);
    const volumeBarControls = createElement('div', ['volume-bar__controls']);
    const volumeBarDecrease = createElement('div', ['volume-bar__decrease']);
    const volumeBarScale = createElement('div', ['volume-bar__scale']);
    const volumeBarScaleBorder = createElement('div', ['volume-bar__scale-border']);
    const volumeBarScaleInside = createElement('div', ['volume-bar__scale-inside']);
    const volumeBarVolume = createElement('div', ['volume-bar__volume']);
    volumeBarVolume.style.width = `${volume * 100}%`;
    const volumeBarIncrease = createElement('div', ['volume-bar__increase']);
    volumeBarScaleInside.append(volumeBarVolume);
    volumeBarScaleBorder.append(volumeBarScaleInside);
    volumeBarScale.append(volumeBarScaleBorder);
    volumeBarControls.append(volumeBarDecrease, volumeBarScale, volumeBarIncrease);
    volumeBar.append(volumeBarTitle, volumeBarControls);
    return volumeBar;
  };

  // ====================== Rating Modal

  static buildModalRating = () => {
    const modal = createElement('div', ['modal']);
    modal.id = MODAL_NAMES.RATING;
    const modalContent = createElement('div', ['rating-modal']);
    const header = createElement('div', ['rating-modal__header']);
    header.append(createElement('p', ['rating-modal__header-item'], ' Последние 10 игр'));
    header.append(createElement('p', ['rating-modal__header-item'], 'клики'));
    header.append(createElement('p', ['rating-modal__header-item'], 'время'));
    const resultsList = createElement('ul', ['rating-modal__list']);
    modalContent.append(header, resultsList);
    const wrapper = Builder.buildModalWrapper([modalContent], 'рейтинг');
    modal.append(wrapper);
    return modal;
  };

  static updateRatingModal = (results) => {
    const modal = document.getElementById(MODAL_NAMES.RATING);
    const resultsList = modal.querySelector('.rating-modal__list');
    resultsList.innerHTML = '';
    for (let i = 0; i < 10; i += 1) {
      const li = createElement('li', ['rating-modal__list-item']);
      const place = createElement('div', ['rating-modal__item-place'], i + 1);
      const name = createElement('p', ['rating-modal__item-name']);
      const clicks = createElement('p', ['rating-modal__item-clicks']);
      const time = createElement('p', ['rating-modal__item-time']);
      if (results[i]) {
        name.innerHTML = results[i].date;
        clicks.innerHTML = results[i].clicksCount;
        time.innerHTML = showTimeInMinutes(results[i].time);
      } else {
        name.innerHTML = '--------';
        clicks.innerHTML = '---';
        time.innerHTML = '--:--';
      }
      li.append(place, name, clicks, time);
      resultsList.append(li);
    }
  };

  // ====================== End Modal

  static buildEndModal = (modalName) => {
    const modal = createElement('div', ['modal']);
    modal.id = modalName;
    const modalContent = Builder.buildEndModalContent(modalName);
    const titleText = modalName === MODAL_NAMES.LOSE ? 'поражение' : 'победа';
    const wrapper = Builder.buildModalWrapper([modalContent], titleText);
    modal.append(wrapper);
    return modal;
  };

  static buildEndModalContent = (modalName) => {
    const modalContent = createElement('div', ['end-modal']);
    if (modalName === MODAL_NAMES.LOSE) modalContent.classList.add('end-modal--lose');
    const header = Builder.buildEndModalHeader(modalName);
    const statistics = Builder.buildEndModalStatistics();
    modalContent.append(header, statistics);
    return modalContent;
  };

  static buildEndModalHeader = (modalName) => {
    const header = createElement('div', ['end-modal__header']);
    const headerImg = createElement('div', ['end-modal__header-img']);
    switch (modalName) {
      case MODAL_NAMES.LOSE:
        header.innerHTML = 'Вы пройграли.<br>Попробуйте еще раз';
        break;
      case MODAL_NAMES.WIN:
        header.innerHTML = 'вы победили!';
        break;
      case MODAL_NAMES.WIN_PLACE:
        header.append(createElement('p', ['end-modal__greeting'], 'вы заняли'));
        header.append(createElement('p', ['end-modal__place'], 'n место!'));
        break;
      default:
    }
    header.prepend(headerImg);
    return header;
  };

  static buildEndModalStatistics = () => {
    const statistics = createElement('div', ['end-modal__statistics']);
    const timeBlock = createElement('div', ['end-modal__statistic-block']);
    const timeBlockImg = createElement('div', ['end-modal__statistic-icon']);
    const timeBlockValue = createElement('div', ['end-modal__statistic-value'], '--:--');
    const timeBlockText = createElement('div', ['end-modal__statistic-text'], 'ваше время');
    timeBlock.append(timeBlockImg, timeBlockValue, timeBlockText);
    const clicksBlock = createElement('div', ['end-modal__statistic-block', 'end-modal__statistic-block--clicks']);
    const clicksBlockImg = createElement('div', ['end-modal__statistic-icon']);
    const clicksBlockValue = createElement('div', ['end-modal__statistic-value'], '--');
    const clicksBlockText = createElement('div', ['end-modal__statistic-text'], 'кол-во кликов');
    clicksBlock.append(clicksBlockImg, clicksBlockValue, clicksBlockText);
    const timeBestBlock = createElement('div', ['end-modal__statistic-block', 'end-modal__statistic-block--best-time']);
    const timeBestBlockImg = createElement('div', ['end-modal__statistic-icon']);
    const timeBestBlockValue = createElement('div', ['end-modal__statistic-value'], '--:--');
    const timeBestBlockText = createElement('div', ['end-modal__statistic-text'], 'лучшее время');
    timeBestBlock.append(timeBestBlockImg, timeBestBlockValue, timeBestBlockText);
    statistics.append(timeBlock, clicksBlock, timeBestBlock);
    return statistics;
  };

  static updateEndModal = (modalName, time, clicksCount, bestTime, place) => {
    const modal = document.getElementById(modalName);
    if (place) modal.querySelector('.end-modal__place').innerHTML = `${place} место!`;
    modal.querySelector('.end-modal__statistic-value').innerHTML = showTimeInMinutes(time);
    const clicksBlock = modal.querySelector('.end-modal__statistic-block--clicks');
    clicksBlock.querySelector('.end-modal__statistic-value').innerHTML = clicksCount;
    const bestBlock = modal.querySelector('.end-modal__statistic-block--best-time');
    bestBlock.querySelector('.end-modal__statistic-value').innerHTML = showTimeInMinutes(bestTime);
  };

  // ====================== Configs Modal

  buildConfigsModal = (difficulty, minesCount, theme) => {
    const modal = createElement('div', ['modal']);
    modal.id = MODAL_NAMES.CONFIGS;
    const difficultyBlock = this.buildDifficultyBlock(difficulty, minesCount);
    const themeBlock = this.buildThemeBlock(theme);
    const ratingButton = createElement('div', ['configs-modal__rating-button', 'button', 'modal-show', 'rating-modal-show']);
    const buttonText = createElement('div', ['button__text'], 'рейтинг игроков');
    ratingButton.append(buttonText);
    ratingButton.addEventListener('click', this.clickElementToShowModalByClassHandler);
    const wrapper = Builder.buildModalWrapper([difficultyBlock, themeBlock, ratingButton], 'настройки');
    modal.append(wrapper);
    return modal;
  };

  buildDifficultyBlock = (difficulty, mines) => {
    const difficultyBlock = createElement('div', ['configs-modal__difficulty']);
    const title = createElement('div', ['configs-modal__difficulty-title'], 'сложность');
    const buttonEasy = Builder.buildButtonDifficulty('easy', 'просто');
    buttonEasy.addEventListener('click', this.changeDifficultyClickHandler);
    const buttonMedium = Builder.buildButtonDifficulty('medium', 'средне');
    buttonMedium.addEventListener('click', this.changeDifficultyClickHandler);
    const buttonHard = Builder.buildButtonDifficulty('hard', 'сложно');
    buttonHard.addEventListener('click', this.changeDifficultyClickHandler);
    switch (difficulty) {
      case 'medium':
        buttonMedium.classList.add('button--active');
        break;
      case 'hard':
        buttonHard.classList.add('button--active');
        break;
      default:
        buttonEasy.classList.add('button--active');
    }
    const minesCount = createElement('div', ['configs-modal__mines-count']);
    const minesCountText = createElement('label', ['configs-modal__mines-count-text'], 'мины:');
    minesCountText.for = 'minesCount';
    const minesCountInput = createElement('input', ['configs-modal__mines-count-input']);
    minesCountInput.value = mines;
    minesCountInput.type = 'nomber';
    minesCountInput.id = 'minesCount';
    minesCountInput.name = 'minesCount';
    minesCountInput.addEventListener('change', this.changeMinesCountHandler);
    minesCount.append(minesCountText, minesCountInput);
    difficultyBlock.append(title, buttonEasy, buttonMedium, buttonHard, minesCount);
    return difficultyBlock;
  };

  static buildButtonDifficulty = (difficulty, text) => {
    const button = createElement('div', ['configs-modal__difficulty-button', 'button', 'button--difficulty']);
    button.id = `difficulty-${difficulty}`;
    const buttonText = createElement('div', ['button__text'], text);
    button.append(buttonText);
    return button;
  };

  changeDifficultyClickHandler = (event) => {
    Builder.deactivateAllDifficulstButtons();
    const clickedButton = event.target.closest('.button');
    clickedButton.classList.add('button--active');
    const newDifficulty = clickedButton.id.slice(11);
    document.querySelector('.configs-modal__mines-count-input').value = DIFFICULTIES[newDifficulty].mines;
    this.appCallbacks.changeDifficultyClickHandler(newDifficulty);
  };

  static deactivateAllDifficulstButtons = () => {
    const buttons = document.querySelectorAll('.button--difficulty');
    buttons.forEach((button) => button.classList.remove('button--active'));
  };

  changeMinesCountHandler = () => {
    const input = document.querySelector('.configs-modal__mines-count-input');
    if (input.value < 10) input.value = 10;
    if (input.value > 99) input.value = 99;
    this.appCallbacks.handleChengeMinesCount(input.value);
  };

  buildThemeBlock = (theme) => {
    const themeBlock = createElement('div', ['configs-modal__theme-block']);
    const themeImg = createElement('div', ['configs-modal__theme-img']);
    const themeText = createElement('div', ['configs-modal__theme-text'], 'темная тема');
    const themeCheckboxBlock = createElement('label', ['configs-modal__theme-config', 'checkbox']);
    const themeCheckboxInput = createElement('input', ['checkbox__input']);
    themeCheckboxInput.type = 'checkbox';
    themeCheckboxInput.id = 'theme-checkbox';
    if (theme === APP_THEME.THEME_DARK) themeCheckboxInput.checked = true;
    themeCheckboxInput.addEventListener('change', this.toggleAppTheme);
    const themeCheckboxWrapper = createElement('div', ['checkbox__wrapper']);
    themeCheckboxBlock.append(themeCheckboxInput, themeCheckboxWrapper);
    themeBlock.append(themeImg, themeText, themeCheckboxBlock);
    return themeBlock;
  };

  toggleAppTheme = () => {
    const checkbox = document.getElementById('theme-checkbox');
    let theme;
    if (checkbox.checked) {
      document.body.classList.add('theme-dark');
      theme = APP_THEME.THEME_DARK;
    } else {
      document.body.classList.remove('theme-dark');
      theme = APP_THEME.THEME_LIGHT;
    }
    this.appCallbacks.toggleAppTheme(theme);
  };
}

export default Builder;

import { createElement, showTimeInMinutes } from './utils';
import { MODAL_NAMES, APP_THEME } from './consts';

class Builder {
  static buildApp = () => {
    const app = createElement('div', ['minesweeper-app']);
    const header = Builder.buildAppHeader();
    const canvas = createElement('canvas', ['minesweeper-app__minesweeper']);
    const frame = Builder.buildFrame([header, canvas]);
    app.append(frame);
    return app;
  };

  static buildAppHeader = () => {
    const header = createElement('div', ['minesweeper-app__header']);
    const sound = createElement('div', ['minesweeper-app__sound', 'modal-show', 'sound-modal-show']);
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
    const newGame = createElement('div', ['minesweeper-app__new-game']);
    const configs = createElement('div', ['minesweeper-app__configs', 'modal-show', 'configs-modal-show']);
    header.append(sound, flags, gameTime, gameClicks, newGame, configs);
    return header;
  };

  static buildFrame = (innerElements, modal = false) => {
    const frame = createElement('div', ['frame']);
    if (modal) frame.classList.add('frame--modal');
    const frameMiddle = createElement('div', ['frame__middle']);
    const frameInside = createElement('div', ['frame__inside']);
    frameInside.append(...innerElements);
    frameMiddle.append(frameInside);
    frame.append(frameMiddle);
    return frame;
  };

  static buildVolumeBar = (idVolumeBar, titleText) => {
    const volumeBar = createElement('div', ['volume-bar']);
    volumeBar.id = idVolumeBar;
    const volumeBarTitle = createElement('div', ['volume-bar__title'], titleText);
    const volumeBarControls = createElement('div', ['volume-bar__controls']);
    const volumeBarDecrease = createElement('div', ['volume-bar__decrease']);
    const volumeBarScale = createElement('div', ['volume-bar__scale']);
    const volumeBarScaleBorder = createElement('div', ['volume-bar__scale-border']);
    const volumeBarScaleInside = createElement('div', ['volume-bar__scale-inside']);
    const volumeBarVolume = createElement('div', ['volume-bar__volume']);
    const volumeBarIncrease = createElement('div', ['volume-bar__increase']);
    volumeBarScaleInside.append(volumeBarVolume);
    volumeBarScaleBorder.append(volumeBarScaleInside);
    volumeBarScale.append(volumeBarScaleBorder);
    volumeBarControls.append(volumeBarDecrease, volumeBarScale, volumeBarIncrease);
    volumeBar.append(volumeBarTitle, volumeBarControls);
    return volumeBar;
  };

  static buildButtonDifficulty = (difficulty, text) => {
    const button = createElement('div', ['configs-modal__difficulty-button', 'button', 'button--difficulty']);
    button.id = `difficulty-${difficulty}`;
    const buttonText = createElement('div', ['button__text'], text);
    button.append(buttonText);
    return button;
  };

  static buildDifficultyBlock = (difficulty, mines) => {
    const difficultyBlock = createElement('div', ['configs-modal__difficulty']);
    const title = createElement('div', ['configs-modal__difficulty-title'], 'сложность');
    const buttonEasy = Builder.buildButtonDifficulty('easy', 'просто');
    const buttonMedium = Builder.buildButtonDifficulty('medium', 'средне');
    const buttonHard = Builder.buildButtonDifficulty('hard', 'сложно');
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
    minesCount.append(minesCountText, minesCountInput);
    difficultyBlock.append(title, buttonEasy, buttonMedium, buttonHard, minesCount);
    return difficultyBlock;
  };

  static buildThemeBlock = (theme) => {
    const themeBlock = createElement('div', ['configs-modal__theme-block']);
    const themeImg = createElement('div', ['configs-modal__theme-img']);
    const themeText = createElement('div', ['configs-modal__theme-text'], 'темная тема');
    const themeCheckboxBlock = createElement('label', ['configs-modal__theme-config', 'checkbox']);
    const themeCheckboxInput = createElement('input', ['checkbox__input']);
    themeCheckboxInput.type = 'checkbox';
    themeCheckboxInput.id = 'theme-checkbox';
    if (theme === APP_THEME.THEME_DARK) themeCheckboxInput.checked = true;
    const themeCheckboxWrapper = createElement('div', ['checkbox__wrapper']);
    themeCheckboxBlock.append(themeCheckboxInput, themeCheckboxWrapper);
    themeBlock.append(themeImg, themeText, themeCheckboxBlock);
    return themeBlock;
  };

  static buildModalWrapper = (innerElements, titleText) => {
    const modalWrapper = createElement('div', ['modal__wrapper']);
    const modalContainer = createElement('div', ['modal__container']);
    const modalTitle = createElement('div', ['modal__title']);
    const modalTitleText = createElement('div', ['modal__title-text'], titleText);
    modalTitle.append(modalTitleText);
    const modalClose = createElement('div', ['modal__close']);
    modalContainer.append(modalTitle, ...innerElements, modalClose);
    const frame = Builder.buildFrame([modalContainer], true);
    modalWrapper.append(frame);
    return modalWrapper;
  };

  static buildSoundModal = () => {
    const modal = createElement('div', ['modal']);
    modal.id = MODAL_NAMES.SOUND;
    const musicBar = Builder.buildVolumeBar('music-volume', 'музыка');
    const soundBar = Builder.buildVolumeBar('sounds-volume', 'громкость');
    const wrapper = Builder.buildModalWrapper([musicBar, soundBar], 'звук');
    modal.append(wrapper);
    return modal;
  };

  static buildConfigsModal = (difficulty, minesCount, theme) => {
    const modal = createElement('div', ['modal']);
    modal.id = MODAL_NAMES.CONFIGS;
    const difficultyBlock = Builder.buildDifficultyBlock(difficulty, minesCount);
    const themeBlock = Builder.buildThemeBlock(theme);
    const ratingButton = createElement('div', ['configs-modal__rating-button', 'button', 'modal-show', 'rating-modal-show']);
    const buttonText = createElement('div', ['button__text'], 'рейтинг игроков');
    ratingButton.append(buttonText);
    const wrapper = Builder.buildModalWrapper([difficultyBlock, themeBlock, ratingButton], 'настройки');
    modal.append(wrapper);
    return modal;
  };

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
    const timeBlock = createElement('div', ['end-modal__time-block']);
    const timeBlockImg = createElement('div', ['end-modal__time-icon']);
    const timeBlockValue = createElement('div', ['end-modal__time-value'], '--:--');
    const timeBlockText = createElement('div', ['end-modal__time-text'], 'ваше время');
    timeBlock.append(timeBlockImg, timeBlockValue, timeBlockText);
    const timeBestBlock = createElement('div', ['end-modal__time-block', 'win-modal__time-block--best']);
    const timeBestBlockImg = createElement('div', ['end-modal__time-icon']);
    const timeBestBlockValue = createElement('div', ['end-modal__time-value'], '--:--');
    const timeBestBlockText = createElement('div', ['end-modal__time-text'], 'лучшее время');
    timeBestBlock.append(timeBestBlockImg, timeBestBlockValue, timeBestBlockText);
    statistics.append(timeBlock, timeBestBlock);
    return statistics;
  };

  static buildEndModalContent = (modalName) => {
    const modalContent = createElement('div', ['end-modal']);
    if (modalName === MODAL_NAMES.LOSE) modalContent.classList.add('end-modal--lose');
    const header = Builder.buildEndModalHeader(modalName);
    const statistics = Builder.buildEndModalStatistics();
    modalContent.append(header, statistics);
    return modalContent;
  };

  static buildEndModal = (modalName) => {
    const modal = createElement('div', ['modal']);
    modal.id = modalName;
    const modalContent = Builder.buildEndModalContent(modalName);
    const titleText = modalName === MODAL_NAMES.LOSE ? 'поражение' : 'победа';
    const wrapper = Builder.buildModalWrapper([modalContent], titleText);
    modal.append(wrapper);
    return modal;
  };

  static updateEndModal = (modalName, time, bestTime, place) => {
    const modal = document.getElementById(modalName);
    if (place) modal.querySelector('.end-modal__place').innerHTML = `${place} место!`;
    modal.querySelector('.end-modal__time-value').innerHTML = showTimeInMinutes(time);
    const bestBlock = modal.querySelector('.win-modal__time-block--best');
    bestBlock.querySelector('.end-modal__time-value').innerHTML = showTimeInMinutes(bestTime);
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
        clicks.innerHTML = results[i].clicks;
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

  static hideAllModals = () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.classList.remove('open');
    });
  };

  static clickModalOverlay = (event) => {
    if (event.target.classList.contains('open')) this.hideAllModals();
  };

  static deactivateAllDifficulstButtons = () => {
    const buttons = document.querySelectorAll('.button--difficulty');
    buttons.forEach((button) => button.classList.remove('button--active'));
  };

  static showModalById = (modalId) => {
    Builder.hideAllModals();
    const modal = document.getElementById(modalId);
    modal.classList.add('open');
  };
}

export default Builder;

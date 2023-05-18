const MAX_WIDTH = 920;
const BORDER_WIDTH = 68.5;
const BORDER_HEIGHT = 259;

const WATERSHED_COLOR_LIGHT_THEME = '#70A862';
const WATERSHED_COLOR_DARK_THEME = '#193712';

const DIFFICULTIES = {
  easy: {
    rows: 10,
    columns: 10,
  },
  medium: {
    rows: 15,
    columns: 15,
  },
  hard: {
    rows: 25,
    columns: 25,
  },
};

const GAME_STATE = {
  WAITING_START: 'waitingStart',
  ACTIVE: 'active',
  GAME_OVER: 'gameOver',
  WINNER: 'winner',
};

const APP_THEME = {
  THEME_LIGHT: 'THEME_LIGHT',
  THEME_DARK: 'THEME_DARK',
};

const MODAL_NAMES = {
  SOUND: 'sound-modal',
  CONFIGS: 'configs-modal',
  RATING: 'rating-modal',
  WIN: 'win-modal',
  WIN_PLACE: 'win-place-modal',
  LOSE: 'lose-modal',
};

// eslint-disable-next-line max-len
export {
  MAX_WIDTH,
  DIFFICULTIES,
  GAME_STATE,
  APP_THEME,
  BORDER_WIDTH,
  BORDER_HEIGHT,
  WATERSHED_COLOR_LIGHT_THEME,
  WATERSHED_COLOR_DARK_THEME,
  MODAL_NAMES,
};

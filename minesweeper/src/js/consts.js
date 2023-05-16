const MAX_WIDTH = 920;
const BORDER_WIDTH = 59;
const BORDER_HEIGHT = 259;

const WATERSHED_COLOR_LIGHT_THEME = '#70A862';
const WATERSHED_COLOR_DARK_THEME = '#193712';

const DIFFICULTIES = {
  easy: {
    name: 'Easy',
    rows: 10,
    colums: 10,
    mines: 10,
  },
  medium: {
    name: 'Medium',
    rows: 15,
    colums: 15,
    mines: 40,
  },
  hard: {
    name: 'Hard',
    rows: 25,
    colums: 25,
    mines: 99,
  },
  /* custom: {
    name: 'Custom',
    rows: 10,
    colums: 10,
    mines: 10,
  }, */
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

// eslint-disable-next-line max-len
export { MAX_WIDTH, DIFFICULTIES, GAME_STATE, APP_THEME, BORDER_WIDTH, BORDER_HEIGHT, WATERSHED_COLOR_LIGHT_THEME, WATERSHED_COLOR_DARK_THEME };

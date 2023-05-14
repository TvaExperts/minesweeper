const MAX_WIDTH = 920;
const BORDER_WIDTH = 59;

const DIFFICULTIES = {
  easy: {
    name: 'Easy',
    rows: 10,
    colums: 10,
    mines: 10,
  },
  medium: {
    name: 'Medium',
    rows: 10,
    colums: 10,
    mines: 10,
  },
  hard: {
    name: 'Hard',
    rows: 10,
    colums: 10,
    mines: 10,
  },
  custom: {
    name: 'Custom',
    rows: 10,
    colums: 10,
    mines: 10,
  },
};

const GAME_STATE = {
  WAITING_START: 'waitingStart',
  ACTIVE: 'active',
  GAME_OVER: 'gameOver',
  WINNER: 'winner',
};

const APP_THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

const GRID_IMAGES = {
  FLAG: './assets/svg/grid/flag.svg',
  1: './assets/svg/grid/1.svg',
  2: './assets/svg/grid/2.svg',
  3: './assets/svg/grid/3.svg',
  4: './assets/svg/grid/4.svg',
  5: './assets/svg/grid/5.svg',
  6: './assets/svg/grid/6.svg',
  7: './assets/svg/grid/7.svg',
  8: './assets/svg/grid/8.svg',
  RED_CELL: './assets/svg/grid/red-cell.svg',
  MINE: './assets/svg/grid/mine.svg',
  HIDEN_DARK: './assets/svg/grid/hiden-dark.svg',
  HIDEN_LIGHT: './assets/svg/grid/hiden-light.svg',
  OPENED_LIGHT: './assets/svg/grid/opened-light.svg',
  OPENED_DARK: './assets/svg/grid/opened-dark.svg',
};

// eslint-disable-next-line object-curly-newline
export { MAX_WIDTH, DIFFICULTIES, GAME_STATE, APP_THEME, GRID_IMAGES, BORDER_WIDTH };

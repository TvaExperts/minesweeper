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

const CELL_STATE = {
  HIDDEN: 'hidden',
  MARKED: 'marked',
  OPENED: 'opened',
};

const GAME_STATE = {
  WAITING_START: 'waitingStart',
  ACTIVE: 'active',
  GAME_OVER: 'gameOver',
};

const APP_THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

// eslint-disable-next-line object-curly-newline
export { DIFFICULTIES, CELL_STATE, GAME_STATE, APP_THEME };

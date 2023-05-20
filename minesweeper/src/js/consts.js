const BORDER_WIDTHS = {
  DESKTOP: {
    maxWidth: 920,
    borderSize: 65,
  },
  TABLET: {
    maxWidth: 850,
    borderSize: 51,
  },
  MOBILE: {
    maxWidth: 650,
    borderSize: 37,
  },
};

const WATERSHED_COLOR_LIGHT_THEME = '#70A862';
const WATERSHED_COLOR_DARK_THEME = '#193712';

const DIFFICULTIES = {
  easy: {
    rows: 10,
    columns: 10,
    mines: 10,
  },
  medium: {
    rows: 15,
    columns: 15,
    mines: 40,
  },
  hard: {
    rows: 25,
    columns: 25,
    mines: 99,
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

const DEFAULT_APP_CONFIGS = {
  rating: [],
  appConfigs: {
    difficulty: 'easy',
    minesCount: 10,
    theme: APP_THEME.THEME_LIGHT,
    soundVolume: 50,
    musicVolume: 50,
  },

  game: {
    state: GAME_STATE.WAITING_START,
  },
};

// eslint-disable-next-line max-len
export {
  DIFFICULTIES,
  GAME_STATE,
  APP_THEME,
  BORDER_WIDTHS,
  WATERSHED_COLOR_LIGHT_THEME,
  WATERSHED_COLOR_DARK_THEME,
  MODAL_NAMES,
  DEFAULT_APP_CONFIGS,
};

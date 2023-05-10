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

export { DIFFICULTIES, CELL_STATE };

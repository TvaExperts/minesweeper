import { CELL_STATE } from './consts';

class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.hasMine = false;
    this.danger = 0;
    this.state = CELL_STATE.HIDDEN;
  }
}

export default Cell;

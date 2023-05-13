class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.hasMine = false;
    this.hasFlag = false;
    this.danger = 0;
    this.isOpened = false;
  }
}

export default Cell;

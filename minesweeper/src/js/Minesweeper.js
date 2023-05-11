import Painter from './Painter';
import Cell from './Cell';
import { CELL_STATE, GAME_STATE, APP_THEME } from './consts';
import getRandomNum from './utils';

class Minesweeper {
  constructor(width, height, colums, rows, mines, audioPlayer) {
    this.rows = rows;
    this.columns = colums;
    this.mines = mines;
    this.audioPlayer = audioPlayer;
    this.painter = new Painter(width, height, rows, colums, APP_THEME.LIGHT);
    this.painter.canvas.addEventListener('pointerdown', this.clickDownPointerCellHandler);
    this.painter.canvas.addEventListener('contextmenu', this.preventDefault);
    this.grid = null;
    this.state = GAME_STATE.WAITING_START;
  }

  preventDefault = (event) => {
    event.preventDefault();
  };

  clickDownPointerCellHandler = (event) => {
    // eslint-disable-next-line max-len
    const { row, column } = this.painter.getCellCoordinatesByClickXY(event.offsetX, event.offsetY);
    switch (event.buttons) {
      case 2:
        this.clickContextCellHandler(row, column);
        break;
      case 4:
        this.clickWheelCellHandler(row, column);
        break;
      default:
        this.clickMouseCellHandler(row, column);
    }
  };

  clickWheelCellHandler = (row, column) => {
    this.grid[row][column].state = CELL_STATE.OPENED;
    this.painter.drawGrid(this.grid);
  };

  clickMouseCellHandler = (row, column) => {
    if (this.state === GAME_STATE.WAITING_START) {
      this.state = GAME_STATE.ACTIVE;
      this.generateMineMap(row, column);
      this.countDangerInAllGrid();
    }

    if (this.grid[row][column].state === CELL_STATE.HIDDEN) {
      this.checkStateAfterClick(row, column);
      this.painter.drawGrid(this.grid);
    }
  };

  checkStateAfterClick = (row, column) => {
    if (!this.isCellInGrid(row, column)) return;
    if (this.grid[row][column].state === CELL_STATE.OPENED) return;
    this.grid[row][column].state = CELL_STATE.OPENED;
    if (this.grid[row][column].hasMine) {
      console.log('Game Over!');
      this.state = GAME_STATE.GAME_OVER;
      return;
    }
    if (this.grid[row][column].danger === 0) {
      this.checkStateAfterClick(row + 1, column + 1);
      this.checkStateAfterClick(row + 1, column);
      this.checkStateAfterClick(row + 1, column - 1);
      this.checkStateAfterClick(row, column - 1);
      this.checkStateAfterClick(row - 1, column - 1);
      this.checkStateAfterClick(row - 1, column);
      this.checkStateAfterClick(row - 1, column + 1);
      this.checkStateAfterClick(row, column + 1);
    }
  };

  countDangerInAllGrid = () => {
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (!this.grid[row][column].hasMine) {
          this.grid[row][column].danger = this.countDangerInCell(row, column);
        }
      }
    }
    this.painter.drawGrid(this.grid);
  };

  // eslint-disable-next-line max-len
  isCellInGrid = (row, column) => row >= 0 && column >= 0 && row < this.rows && column < this.columns;

  isMineInCell = (row, column) => this.isCellInGrid(row, column) && this.grid[row][column].hasMine;

  countDangerInCell(row, column) {
    let danger = 0;
    if (this.isMineInCell(row + 1, column + 1)) danger += 1;
    if (this.isMineInCell(row + 1, column)) danger += 1;
    if (this.isMineInCell(row + 1, column - 1)) danger += 1;
    if (this.isMineInCell(row, column - 1)) danger += 1;
    if (this.isMineInCell(row - 1, column - 1)) danger += 1;
    if (this.isMineInCell(row - 1, column)) danger += 1;
    if (this.isMineInCell(row - 1, column + 1)) danger += 1;
    if (this.isMineInCell(row, column + 1)) danger += 1;
    return danger;
  }

  generateMineMap = (row, column) => {
    this.initGrid();
    let setedMinesCount = 0;
    while (setedMinesCount < this.mines) {
      const rndRow = getRandomNum(this.rows);
      const rndColumn = getRandomNum(this.columns);
      if (!this.grid[rndRow][rndColumn].hasMine) {
        if (!(row === rndRow && column === rndColumn)) {
          setedMinesCount += 1;
          this.grid[rndRow][rndColumn].hasMine = true;
        }
      }
    }
  };

  clickContextCellHandler = (row, column) => {
    switch (this.grid[row][column].state) {
      case CELL_STATE.MARKED:
        this.grid[row][column].state = CELL_STATE.HIDDEN;
        break;
      case CELL_STATE.HIDDEN:
        this.grid[row][column].state = CELL_STATE.MARKED;
        break;
      default:
    }
    this.painter.drawGrid(this.grid);
  };

  initGrid = () => {
    this.grid = [];
    for (let row = 0; row < this.rows; row += 1) {
      const rowArr = [];
      for (let column = 0; column < this.columns; column += 1) {
        rowArr.push(new Cell(row, column));
      }
      this.grid.push(rowArr);
    }
    this.painter.drawGrid(this.grid);
  };

  // calcDangerInCells = () => {};
}

export default Minesweeper;

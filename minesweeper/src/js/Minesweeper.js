import Painter from './Painter';
import Cell from './Cell';
import { CELL_STATE } from './consts';

class Minesweeper {
  constructor(width, height, rows, colums, mines, audioPlayer) {
    this.rows = rows;
    this.columns = colums;
    this.audioPlayer = audioPlayer;
    this.painter = new Painter(width, height, rows, colums);
    this.painter.canvas.addEventListener('pointerdown', this.clickDownPointerCellHandler);
    this.painter.canvas.addEventListener('contextmenu', this.preventDefault);
    this.grid = [];
  }

  static preventDefault = (event) => {
    event.preventDefault();
  };

  clickDownPointerCellHandler = (event) => {
    // eslint-disable-next-line max-len
    const clickCellCoordinates = this.painter.getCellCoordinatesByClickXY(event.offsetX, event.offsetY);
    switch (event.buttons) {
      case 2:
        this.clickContextCellHandler(clickCellCoordinates);
        break;
      case 4:
        this.clickWheelCellHandler(clickCellCoordinates);
        break;
      default:
        this.clickMouseCellHandler(clickCellCoordinates);
    }
  };

  clickWheelCellHandler = (cellCoordinates) => {
    this.grid[cellCoordinates.column][cellCoordinates.row].state = CELL_STATE.OPENED;
    this.painter.drawGrid(this.grid);
  };

  clickMouseCellHandler = (cellCoordinates) => {
    this.grid[cellCoordinates.column][cellCoordinates.row].state = CELL_STATE.OPENED;
    this.painter.drawGrid(this.grid);
  };

  clickContextCellHandler = (cellCoordinates) => {
    switch (this.grid[cellCoordinates.column][cellCoordinates.row].state) {
      case CELL_STATE.MARKED:
        this.grid[cellCoordinates.column][cellCoordinates.row].state = CELL_STATE.HIDDEN;
        break;
      case CELL_STATE.HIDDEN:
        this.grid[cellCoordinates.column][cellCoordinates.row].state = CELL_STATE.MARKED;
        break;
      default:
    }
    this.painter.drawGrid(this.grid);
  };

  initGrid = () => {
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

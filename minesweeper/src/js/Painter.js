/* eslint-disable max-len */
import PALETTE from './palette';
import { CELL_STATE } from './consts';

class Painter {
  constructor(width, height, rows, colums, theme) {
    this.canvas = document.querySelector('.canvas');
    this.width = width;
    this.canvas.width = width;
    this.height = height;
    this.canvas.height = height;
    this.rows = rows;
    this.columns = colums;
    this.theme = theme;
    this.cellSize = Math.round(width / colums);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = `bold ${this.cellSize * 0.85}px Arial Bold`;
  }

  getCellCoordinatesByClickXY = (x, y) => {
    const coordinates = {};
    coordinates.row = Math.floor(y / this.cellSize);
    coordinates.column = Math.floor(x / this.cellSize);
    return coordinates;
  };

  drawGrid = (grid) => {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if ((row + column) % 2 === 0) {
          switch (grid[row][column].state) {
            case CELL_STATE.HIDDEN:
              this.ctx.fillStyle = PALETTE[this.theme].CELL_HIDDEN_DARK;
              break;
            case CELL_STATE.OPENED:
              this.ctx.fillStyle = PALETTE[this.theme].CELL_OPENED_DARK;
              break;
            case CELL_STATE.MARKED:
              this.ctx.fillStyle = PALETTE[this.theme].CELL_MARKED;
              break;
            default:
              this.ctx.fillStyle = PALETTE[this.theme].CELL_OPENED_DARK;
          }
        } else {
          switch (grid[row][column].state) {
            case CELL_STATE.HIDDEN:
              this.ctx.fillStyle = PALETTE[this.theme].CELL_HIDDEN_LIGHT;
              break;
            case CELL_STATE.OPENED:
              this.ctx.fillStyle = PALETTE[this.theme].CELL_OPENED_LIGHT;
              break;
            case CELL_STATE.MARKED:
              this.ctx.fillStyle = PALETTE[this.theme].CELL_MARKED;
              break;
            default:
              this.ctx.fillStyle = PALETTE[this.theme].CELL_OPENED_LIGHT;
          }
        }

        /* if (grid[row][column].hasMine) {
          this.ctx.fillStyle = 'white';
        } */

        this.ctx.fillRect(column * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
        const curDanger = grid[row][column].danger;
        if (grid[row][column].state === CELL_STATE.OPENED) {
          this.ctx.fillStyle = PALETTE[this.theme].CELL_DIGITS[curDanger];
          this.ctx.fillText(curDanger.toString(), (column + 0.27) * this.cellSize, (row + 0.8) * this.cellSize);
        }
      }
    }
    this.drowBorderBetweenOpenAndHidenCells(grid);
  };

  fillRect = (color, x, y, width, height) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  };

  drowBorderBetweenOpenAndHidenCells = (grid) => {
    for (let row = 1; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (grid[row][column].state === CELL_STATE.OPENED && grid[row - 1][column].state === CELL_STATE.HIDDEN) {
          this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize, row * this.cellSize + 1, this.cellSize, 1);
          this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize, row * this.cellSize, this.cellSize, 1);
        }
        if (grid[row][column].state === CELL_STATE.HIDDEN && grid[row - 1][column].state === CELL_STATE.OPENED) {
          this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize, row * this.cellSize - 2, this.cellSize, 1);
          this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize, row * this.cellSize - 1, this.cellSize, 1);
        }
      }
    }
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 1; column < this.columns; column += 1) {
        if (grid[row][column].state === CELL_STATE.OPENED && grid[row][column - 1].state === CELL_STATE.HIDDEN) {
          this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize + 1, row * this.cellSize, 1, this.cellSize);
          this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize, row * this.cellSize, 1, this.cellSize);
        }
        if (grid[row][column].state === CELL_STATE.HIDDEN && grid[row][column - 1].state === CELL_STATE.OPENED) {
          this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize - 2, row * this.cellSize, 1, this.cellSize);
          this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize - 1, row * this.cellSize, 1, this.cellSize);
        }
      }
    }
  };
}

export default Painter;

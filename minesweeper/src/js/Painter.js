import PALETTE from './palette';
import { CELL_STATE } from './consts';

class Painter {
  constructor(width, height, rows, colums, theme = 'light') {
    this.canvas = document.querySelector('.canvas');
    this.width = width;
    this.canvas.width = width;
    this.height = height;
    this.canvas.height = height;
    this.rows = rows;
    this.columns = colums;
    this.theme = theme;
    this.cellSize = width / colums;
    this.ctx = this.canvas.getContext('2d');
  }

  getCellCoordinatesByClickXY = (x, y) => {
    const coordinates = {};
    coordinates.row = Math.floor(y / this.cellSize);
    coordinates.column = Math.floor(x / this.cellSize);
    return coordinates;
  };

  drawGrid = (grid) => {
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if ((row + column) % 2 === 0) {
          switch (grid[row][column].state) {
            case CELL_STATE.HIDDEN:
              this.ctx.fillStyle = PALETTE.LIGHT.CELL_HIDDEN_DARK;
              break;
            case CELL_STATE.OPENED:
              this.ctx.fillStyle = PALETTE.LIGHT.CELL_OPENED_DARK;
              break;
            case CELL_STATE.MARKED:
              this.ctx.fillStyle = PALETTE.LIGHT.CELL_MARKED;
              break;
            default:
              this.ctx.fillStyle = PALETTE.LIGHT.CELL_OPENED_DARK;
          }
        } else {
          switch (grid[row][column].state) {
            case CELL_STATE.HIDDEN:
              this.ctx.fillStyle = PALETTE.LIGHT.CELL_HIDDEN_LIGHT;
              break;
            case CELL_STATE.OPENED:
              this.ctx.fillStyle = PALETTE.LIGHT.CELL_OPENED_LIGHT;
              break;
            case CELL_STATE.MARKED:
              this.ctx.fillStyle = PALETTE.LIGHT.CELL_MARKED;
              break;
            default:
              this.ctx.fillStyle = PALETTE.LIGHT.CELL_OPENED_LIGHT;
          }
        }
        // eslint-disable-next-line max-len
        this.ctx.fillRect(row * this.cellSize, column * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  };
}

export default Painter;

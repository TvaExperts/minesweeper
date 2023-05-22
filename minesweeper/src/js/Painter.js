import { WATERSHED_COLOR, GAME_STATE } from './consts';
import SVG_IMAGES from './SVGs';

class Painter {
  constructor(elementCanvas) {
    this.canvas = elementCanvas;
    this.ctx = this.canvas.getContext('2d');
  }

  loadAllSVGImages = async () => {
    this.images = SVG_IMAGES;
    const promises = [];
    Object.keys(this.images).forEach((theme) => {
      Object.keys(this.images[theme]).forEach((svg) => {
        promises.push(this.loadSVGImage(theme, svg));
      });
    });
    await Promise.all(promises);
  };

  loadSVGImage = (theme, key) => new Promise((resolve) => {
    const img = document.createElement('img');
    img.src = this.images[theme][key];
    img.addEventListener('load', () => {
      this.images[theme][key] = img;
      resolve();
    });
  });

  initGrid = (cellSize, width, height, rows, colums, theme) => {
    this.width = width;
    this.canvas.width = width;
    this.height = height;
    this.canvas.height = height;
    this.rows = rows;
    this.columns = colums;
    this.theme = theme;
    this.cellSize = cellSize;
    this.borderSize = this.selectBorderSize();
  };

  selectBorderSize = () => {
    let borderSize = 5;
    if (this.cellSize < 50) borderSize = 4;
    if (this.cellSize < 40) borderSize = 3;
    if (this.cellSize < 30) borderSize = 2;
    return borderSize;
  };

  getCellCoordinatesByClickXY = (x, y) => {
    const coordinates = {};
    coordinates.row = Math.floor(y / this.cellSize);
    coordinates.column = Math.floor(x / this.cellSize);
    return coordinates;
  };

  drawGrid = (grid, gameState = GAME_STATE.ACTIVE) => {
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        this.drawCellBackground(grid[row][column]);
        if (grid[row][column].hasFlag) this.drawFlag(grid[row][column]);
        if (grid[row][column].isOpened && grid[row][column].danger) {
          this.drawDigit(grid[row][column]);
        }
        if (gameState !== GAME_STATE.ACTIVE) {
          if (grid[row][column].hasMine) {
            if (!grid[row][column].hasFlag) {
              if (grid[row][column].isOpened) {
                this.ctx.drawImage(
                  this.images[this.theme].CELL_RED,
                  column * this.cellSize,
                  row * this.cellSize,
                  this.cellSize,
                  this.cellSize,
                );
              }
              this.ctx.drawImage(
                this.images[this.theme].MINE,
                column * this.cellSize,
                row * this.cellSize,
                this.cellSize,
                this.cellSize,
              );
            }
          }
        }
      }
    }
    this.drawBorderBetweenOpenAndHidenCells(grid);
  };

  drawCellBackground = (cell) => {
    let bgImage;
    if ((cell.row + cell.column) % 2 === 0) {
      if (cell.isOpened) {
        bgImage = this.images[this.theme].CELL_OPENED_LIGHT;
      } else {
        bgImage = this.images[this.theme].CELL_HIDEN_LIGHT;
      }
    } else if (cell.isOpened) {
      bgImage = this.images[this.theme].CELL_OPENED_DARK;
    } else {
      bgImage = this.images[this.theme].CELL_HIDEN_DARK;
    }
    this.ctx.drawImage(
      bgImage,
      cell.column * this.cellSize,
      cell.row * this.cellSize,
      this.cellSize,
      this.cellSize,
    );
  };

  fillRect = (color, x, y, width, height) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  };

  drawFlag = (cell) => {
    this.ctx.drawImage(
      this.images[this.theme].FLAG,
      cell.column * this.cellSize,
      cell.row * this.cellSize,
      this.cellSize,
      this.cellSize,
    );
  };

  drawDigit = (cell) => {
    this.ctx.drawImage(
      this.images[this.theme][`DIGIT${cell.danger}`],
      cell.column * this.cellSize,
      cell.row * this.cellSize,
      this.cellSize,
      this.cellSize,
    );
  };

  drawBorderBetweenOpenAndHidenCells = (grid) => {
    for (let row = 1; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (grid[row][column].isOpened && !grid[row - 1][column].isOpened) {
          this.fillRect(
            WATERSHED_COLOR[this.theme],
            column * this.cellSize,
            row * this.cellSize,
            this.cellSize,
            this.borderSize,
          );
        }
        if (!grid[row][column].isOpened && grid[row - 1][column].isOpened) {
          this.fillRect(
            WATERSHED_COLOR[this.theme],
            column * this.cellSize,
            row * this.cellSize - this.borderSize,
            this.cellSize,
            this.borderSize,
          );
        }
      }
    }
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 1; column < this.columns; column += 1) {
        if (grid[row][column].isOpened && !grid[row][column - 1].isOpened) {
          this.fillRect(
            WATERSHED_COLOR[this.theme],
            column * this.cellSize,
            row * this.cellSize,
            this.borderSize,
            this.cellSize,
          );
        }
        if (!grid[row][column].isOpened && grid[row][column - 1].isOpened) {
          this.fillRect(
            WATERSHED_COLOR[this.theme],
            column * this.cellSize - this.borderSize,
            row * this.cellSize,
            this.borderSize,
            this.cellSize,
          );
        }
      }
    }
    this.drawSquaresInBorder(grid);
  };

  isCellInGrid = (row, column) => row >= 0
  && column >= 0
  && row < this.rows
  && column < this.columns;

  isSquareInGrid = (row, column) => this.isCellInGrid(row, column)
  && this.isCellInGrid(row - 1, column)
  && this.isCellInGrid(row - 1, column + 1)
  && this.isCellInGrid(row, column + 1);

  static isSquareWithPattern = (grid, row, column, lbCell, ltCell, rtCell, rbCell) => (
    grid[row][column].isOpened === lbCell
    && grid[row - 1][column].isOpened === ltCell
    && grid[row - 1][column + 1].isOpened === rtCell
    && grid[row][column + 1].isOpened === rbCell);

  drawSquaresInBorder = (grid) => {
    for (let row = 1; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (this.isSquareInGrid(row, column)) {
          if (Painter.isSquareWithPattern(grid, row, column, true, true, true, false)) {
            this.fillRect(
              WATERSHED_COLOR[this.theme],
              (column + 1) * this.cellSize - this.borderSize,
              row * this.cellSize - this.borderSize,
              this.borderSize,
              this.borderSize,
            );
          }
          if (Painter.isSquareWithPattern(grid, row, column, true, false, true, true)) {
            this.fillRect(
              WATERSHED_COLOR[this.theme],
              (column + 1) * this.cellSize,
              row * this.cellSize,
              this.borderSize,
              this.borderSize,
            );
          }
          if (Painter.isSquareWithPattern(grid, row, column, true, true, false, true)) {
            this.fillRect(
              WATERSHED_COLOR[this.theme],
              (column + 1) * this.cellSize - this.borderSize,
              row * this.cellSize,
              this.borderSize,
              this.borderSize,
            );
          }
          if (Painter.isSquareWithPattern(grid, row, column, false, true, true, true)) {
            this.fillRect(
              WATERSHED_COLOR[this.theme],
              (column + 1) * this.cellSize,
              row * this.cellSize - this.borderSize,
              this.borderSize,
              this.borderSize,
            );
          }
        }
      }
    }
  };
}

export default Painter;

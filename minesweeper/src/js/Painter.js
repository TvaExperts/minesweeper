/* eslint-disable no-await-in-loop */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */

import { GRID_IMAGES } from './consts';
import PALETTE from './palette';

class Painter {
  constructor() {
    this.canvas = document.querySelector('.canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  loadAllImages = async () => {
    this.images = GRID_IMAGES;
    const promises = Object.keys(this.images).map((key) => this.loadImage(key));
    await Promise.all(promises);
  };

  loadImage = (key) => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = this.images[key];
      img.addEventListener('load', () => {
        this.images[key] = img;
        resolve();
      });
    });
  };

  initGrid = (cellSize, width, height, rows, colums, theme) => {
    this.width = width;
    this.canvas.width = width;
    this.height = height;
    this.canvas.height = height;
    this.rows = rows;
    this.columns = colums;
    this.theme = theme;
    this.cellSize = cellSize;
  };

  getCellCoordinatesByClickXY = (x, y) => {
    const coordinates = {};
    coordinates.row = Math.floor(y / this.cellSize);
    coordinates.column = Math.floor(x / this.cellSize);
    return coordinates;
  };

  drawCellBackground = (cell) => {
    if ((cell.row + cell.column) % 2 === 0) {
      if (cell.isOpened) {
        this.ctx.drawImage(this.images.OPENED_LIGHT, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
      } else {
        this.ctx.drawImage(this.images.HIDEN_LIGHT, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
      }
    } else if (cell.isOpened) {
      this.ctx.drawImage(this.images.OPENED_DARK, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
    } else {
      this.ctx.drawImage(this.images.HIDEN_DARK, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
    }
  };

  drawMines = (grid) => {
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (grid[row][column].hasMine) {
          if (!grid[row][column].hasFlag) {
            if (grid[row][column].isOpened) {
              this.ctx.drawImage(this.images.RED_CELL, column * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
            }
            this.ctx.drawImage(this.images.MINE, column * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
          }
        }
      }
    }
  };

  drawGrid = (grid) => {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);
    let isGameOver = false;
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        this.drawCellBackground(grid[row][column]);
        if (grid[row][column].hasFlag) this.drawFlag(grid[row][column]);
        if (grid[row][column].isOpened && grid[row][column].danger) this.drawDigit(grid[row][column]);
        if (grid[row][column].isOpened && grid[row][column].hasMine) isGameOver = true;
      }
    }
    if (isGameOver) this.drawMines(grid);
    this.drawBorderBetweenOpenAndHidenCells(grid);
  };

  drawFlag = (cell) => {
    this.ctx.drawImage(
      this.images.FLAG,
      (cell.column + 0.2) * this.cellSize,
      (cell.row + 0.15) * this.cellSize,
      this.cellSize * 0.7,
      this.cellSize * 0.7
    );
  };

  drawDigit = (cell) => {
    this.ctx.drawImage(this.images[cell.danger], cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
  };

  fillRect = (color, x, y, width, height) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  };

  drawBorderBetweenOpenAndHidenCells = (grid) => {
    for (let row = 1; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (grid[row][column].isOpened && !grid[row - 1][column].isOpened) {
          this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize, row * this.cellSize, this.cellSize, 1);
          this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize, row * this.cellSize - 1, this.cellSize, 1);
        }
        if (!grid[row][column].isOpened && grid[row - 1][column].isOpened) {
          this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize, row * this.cellSize - 1, this.cellSize, 1);
          this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize, row * this.cellSize, this.cellSize, 1);
        }
      }
    }
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 1; column < this.columns; column += 1) {
        if (grid[row][column].isOpened && !grid[row][column - 1].isOpened) {
          this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize, row * this.cellSize, 1, this.cellSize);
          this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize - 1, row * this.cellSize, 1, this.cellSize);
        }
        if (!grid[row][column].isOpened && grid[row][column - 1].isOpened) {
          this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize - 1, row * this.cellSize, 1, this.cellSize);
          this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize, row * this.cellSize, 1, this.cellSize);
        }
      }
    }
  };
}

export default Painter;

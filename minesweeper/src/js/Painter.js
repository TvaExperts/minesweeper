/* eslint-disable no-await-in-loop */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */

// import { GRID_IMAGES } from './consts';
// import PALETTE from './palette';
import { WATERSHED_COLOR_LIGHT_THEME, WATERSHED_COLOR_DARK_THEME } from './consts';
import SVG_IMAGES from './SVGs';

class Painter {
  constructor() {
    this.canvas = document.querySelector('.canvas');
    this.ctx = this.canvas.getContext('2d');
    this.loadAllSVGImages();
    this.theme = 'THEME_DARK';
  }

  loadAllSVGImages = () => {
    this.images = SVG_IMAGES;
    Object.keys(this.images).forEach((theme) => {
      Object.keys(this.images[theme]).forEach((svg) => {
        const img = document.createElement('img');
        img.src = this.images[theme][svg];
        this.images[theme][svg] = img;
      });
    });
  };

  /* loadAllImages = async () => {
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
  }; */

  initGrid = (cellSize, width, height, rows, colums /* theme */) => {
    this.width = width;
    this.canvas.width = width;
    this.height = height;
    this.canvas.height = height;
    this.rows = rows;
    this.columns = colums;
    this.theme = 'THEME_DARK';
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
        this.ctx.drawImage(
          this.images[this.theme].CELL_OPENED_LIGHT,
          cell.column * this.cellSize,
          cell.row * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        // this.ctx.drawImage(this.images.OPENED_LIGHT, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
      } else {
        this.ctx.drawImage(
          this.images[this.theme].CELL_HIDEN_LIGHT,
          cell.column * this.cellSize,
          cell.row * this.cellSize,
          this.cellSize,
          this.cellSize
        );

        // this.ctx.drawImage(this.images.HIDEN_LIGHT, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
      }
    } else if (cell.isOpened) {
      this.ctx.drawImage(
        this.images[this.theme].CELL_OPENED_DARK,
        cell.column * this.cellSize,
        cell.row * this.cellSize,
        this.cellSize,
        this.cellSize
      );

      //  this.ctx.drawImage(this.images.OPENED_DARK, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
    } else {
      this.ctx.drawImage(
        this.images[this.theme].CELL_HIDEN_DARK,
        cell.column * this.cellSize,
        cell.row * this.cellSize,
        this.cellSize,
        this.cellSize
      );

      // this.ctx.drawImage(this.images.HIDEN_DARK, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
    }
  };

  drawMines = (grid, clickedRow, clickedColumn) => {
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (grid[row][column].hasMine) {
          if (!grid[row][column].hasFlag) {
            if (row === clickedRow && clickedColumn === column) {
              this.ctx.drawImage(this.images[this.theme].CELL_RED, column * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
            }
            this.ctx.drawImage(this.images[this.theme].MINE, column * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
          }
        }
      }
    }
  };

  drawGrid = (grid) => {
    // let isGameOver = false;
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        this.drawCellBackground(grid[row][column]);
        if (grid[row][column].hasFlag) this.drawFlag(grid[row][column]);
        if (grid[row][column].isOpened && grid[row][column].danger) this.drawDigit(grid[row][column]);
        // if (grid[row][column].isOpened && grid[row][column].hasMine) isGameOver = true;
      }
    }
    // if (isGameOver) this.drawMines(grid);
    this.drawBorderBetweenOpenAndHidenCells(grid);
  };

  drawFlag = (cell) => {
    this.ctx.drawImage(this.images[this.theme].FLAG, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
    // this.ctx.drawImage(this.images.FLAG, cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
  };

  drawDigit = (cell) => {
    // this.ctx.drawImage(this.images[cell.danger], cell.column * this.cellSize, cell.row * this.cellSize, this.cellSize, this.cellSize);
    this.ctx.drawImage(
      this.images[this.theme][`DIGIT${cell.danger}`],
      cell.column * this.cellSize,
      cell.row * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  };

  fillRect = (color, x, y, width, height) => {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  };

  drawBorderBetweenOpenAndHidenCells = (grid) => {
    const watershedColor = this.theme === 'THEME_LIGHT' ? WATERSHED_COLOR_LIGHT_THEME : WATERSHED_COLOR_DARK_THEME;
    for (let row = 1; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (grid[row][column].isOpened && !grid[row - 1][column].isOpened) {
          this.fillRect(watershedColor, column * this.cellSize, row * this.cellSize, this.cellSize, 3);
          // this.fillRect(PALETTE[this.theme].CELL_BORDER_INSIDE, column * this.cellSize, row * this.cellSize - 1, this.cellSize, 1);
        }
        if (!grid[row][column].isOpened && grid[row - 1][column].isOpened) {
          // this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize, row * this.cellSize - 1, this.cellSize, 1);
          this.fillRect(watershedColor, column * this.cellSize, row * this.cellSize - 3, this.cellSize, 3);
        }
      }
    }
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 1; column < this.columns; column += 1) {
        if (grid[row][column].isOpened && !grid[row][column - 1].isOpened) {
          // this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize, row * this.cellSize, 1, this.cellSize);
          this.fillRect(watershedColor, column * this.cellSize, row * this.cellSize, 3, this.cellSize);
        }
        if (!grid[row][column].isOpened && grid[row][column - 1].isOpened) {
          // this.fillRect(PALETTE[this.theme].CELL_BORDER_OUTSIDE, column * this.cellSize - 1, row * this.cellSize, 1, this.cellSize);
          this.fillRect(watershedColor, column * this.cellSize - 3, row * this.cellSize, 3, this.cellSize);
        }
      }
    }
    // this.drawSquaresInBorder();
  };

  // drawSquaresInBorder = () => {};
}

export default Painter;

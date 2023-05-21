/* eslint-disable max-len */

import Builder from './Builder';
import Cell from './Cell';
import { GAME_STATE } from './consts';
import { getRandomNum, preventDefault } from './utils';

class Minesweeper {
  constructor(app, painter, audioPlayer, loseHandler, winHandler) {
    this.audioPlayer = audioPlayer;
    this.painter = painter;
    this.loseHandler = loseHandler;
    this.winHandler = winHandler;
    this.painter.canvas.addEventListener('pointerdown', this.clickDownPointerCellHandler);
    this.painter.canvas.addEventListener('contextmenu', preventDefault);
  }

  initGame = (rows, columns, mines, grid, clicksCount) => {
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;
    this.flagCount = 0;
    this.clicksCount = 0;
    this.openedCellsCount = 0;
    this.initGrid(grid);
    if (grid) {
      this.state = GAME_STATE.ACTIVE;
      this.countStatsInLoadGrid();
      this.clicksCount = clicksCount;
    } else {
      this.state = GAME_STATE.WAITING_START;
    }
    let minesLeft = this.mines - this.flagCount;
    if (minesLeft < 0) minesLeft = 0;
    Builder.updateFlagsCounter(this.flagCount, minesLeft);
    Builder.updateClicksCounter(this.clicksCount);
  };

  countStatsInLoadGrid = () => {
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        if (this.grid[row][column].hasFlag) {
          this.flagCount += 1;
        }
        if (this.grid[row][column].isOpened) {
          this.openedCellsCount += 1;
        }
      }
    }
  };

  clickDownPointerCellHandler = (event) => {
    if (this.state === GAME_STATE.GAME_OVER || this.state === GAME_STATE.WINNER) return;
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
    if (!this.grid[row][column].isOpened) return;
    if (!this.grid[row][column].danger) return;
    const markedNeighborsCount = this.getMarkedNeighborsCount(row, column);
    if (markedNeighborsCount === this.grid[row][column].danger) {
      this.clicksCount += 1;
      Builder.updateClicksCounter(this.clicksCount);
      this.clickAllHidenNeighbors(row, column);
    }
    this.painter.drawGrid(this.grid, this.state);
    /* if (this.state !== GAME_STATE.GAME_OVER) this.painter.drawGrid(this.grid);
    if (this.state === GAME_STATE.WINNER) this.painter.drawMines(this.grid, row, column); */
  };

  getMarkedNeighborsCount = (row, column) => {
    let markedNeighborsCount = 0;
    if (this.isMarkedCell(row + 1, column + 1)) markedNeighborsCount += 1;
    if (this.isMarkedCell(row + 1, column)) markedNeighborsCount += 1;
    if (this.isMarkedCell(row + 1, column - 1)) markedNeighborsCount += 1;
    if (this.isMarkedCell(row, column - 1)) markedNeighborsCount += 1;
    if (this.isMarkedCell(row - 1, column - 1)) markedNeighborsCount += 1;
    if (this.isMarkedCell(row - 1, column)) markedNeighborsCount += 1;
    if (this.isMarkedCell(row - 1, column + 1)) markedNeighborsCount += 1;
    if (this.isMarkedCell(row, column + 1)) markedNeighborsCount += 1;
    return markedNeighborsCount;
  };

  clickAllHidenNeighbors = (row, column) => {
    if (this.isHidenCell(row + 1, column + 1)) this.checkStateAfterClick(row + 1, column + 1);
    if (this.isHidenCell(row + 1, column)) this.checkStateAfterClick(row + 1, column);
    if (this.isHidenCell(row + 1, column - 1)) this.checkStateAfterClick(row + 1, column - 1);
    if (this.isHidenCell(row, column - 1)) this.checkStateAfterClick(row, column - 1);
    if (this.isHidenCell(row - 1, column - 1)) this.checkStateAfterClick(row - 1, column - 1);
    if (this.isHidenCell(row - 1, column)) this.checkStateAfterClick(row - 1, column);
    if (this.isHidenCell(row - 1, column + 1)) this.checkStateAfterClick(row - 1, column + 1);
    if (this.isHidenCell(row, column + 1)) this.checkStateAfterClick(row, column + 1);
  };

  clickMouseCellHandler = (row, column) => {
    if (this.state === GAME_STATE.WAITING_START) {
      this.state = GAME_STATE.ACTIVE;
      this.generateMineMap(row, column);
      this.countDangerInAllGrid();
    }
    if (!this.grid[row][column].isOpened) {
      this.clicksCount += 1;
      Builder.updateClicksCounter(this.clicksCount);
      this.checkStateAfterClick(row, column);
      if (this.state === GAME_STATE.ACTIVE) this.painter.drawGrid(this.grid);
    }
  };

  checkStateAfterClick = (row, column, isRecursive = false) => {
    if (!this.isCellInGrid(row, column)) return;
    if (this.grid[row][column].isOpened) return;
    if (this.grid[row][column].hasFlag) return;
    if (this.state === GAME_STATE.WINNER) return;
    this.grid[row][column].isOpened = true;
    this.openedCellsCount += 1;
    if (this.grid[row][column].hasMine) {
      this.state = GAME_STATE.GAME_OVER;
      this.painter.drawGrid(this.grid, this.state);
      this.loseHandler();
      return;
    }
    if (!isRecursive) this.audioPlayer.sounds.dig.play();
    if (this.isWin()) {
      this.state = GAME_STATE.WINNER;
      this.painter.drawGrid(this.grid, this.state);
      this.winHandler();
      return;
    }
    if (this.grid[row][column].danger === 0) {
      if (!isRecursive) this.audioPlayer.sounds.collapse.play();
      this.checkStateAfterClick(row + 1, column + 1, true);
      this.checkStateAfterClick(row + 1, column, true);
      this.checkStateAfterClick(row + 1, column - 1, true);
      this.checkStateAfterClick(row, column - 1, true);
      this.checkStateAfterClick(row - 1, column - 1, true);
      this.checkStateAfterClick(row - 1, column, true);
      this.checkStateAfterClick(row - 1, column + 1, true);
      this.checkStateAfterClick(row, column + 1, true);
    }
  };

  isWin = () => this.rows * this.columns - this.mines === this.openedCellsCount;

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

  isCellInGrid = (row, column) => row >= 0 && column >= 0 && row < this.rows && column < this.columns;

  isMineInCell = (row, column) => this.isCellInGrid(row, column) && this.grid[row][column].hasMine;

  isMarkedCell = (row, column) => this.isCellInGrid(row, column) && this.grid[row][column].hasFlag;

  isHidenCell = (row, column) => this.isCellInGrid(row, column) && !this.grid[row][column].isOpened;

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
    if (this.state !== GAME_STATE.ACTIVE) return;
    if (this.grid[row][column].isOpened) return;
    if (this.grid[row][column].hasFlag) {
      this.grid[row][column].hasFlag = false;
      this.audioPlayer.sounds.unflag.play();
      this.flagCount -= 1;
    } else {
      this.grid[row][column].hasFlag = true;
      this.audioPlayer.sounds.flag.play();
      this.flagCount += 1;
    }
    let minesLeft = this.mines - this.flagCount;
    if (minesLeft < 0) minesLeft = 0;
    Builder.updateFlagsCounter(this.flagCount, minesLeft);
    this.painter.drawGrid(this.grid);
  };

  initGrid = (grid) => {
    if (grid) {
      this.grid = [];
      for (let row = 0; row < this.rows; row += 1) {
        const rowArr = [];
        for (let column = 0; column < this.columns; column += 1) {
          rowArr.push(grid[row][column]);
        }
        this.grid.push(rowArr);
      }
    } else {
      this.grid = [];
      for (let row = 0; row < this.rows; row += 1) {
        const rowArr = [];
        for (let column = 0; column < this.columns; column += 1) {
          rowArr.push(new Cell(row, column));
        }
        this.grid.push(rowArr);
      }
    }
  };
}

export default Minesweeper;

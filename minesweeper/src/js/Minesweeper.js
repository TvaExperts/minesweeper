/* eslint-disable max-len */

import Cell from './Cell';
import { GAME_STATE } from './consts';
import { getRandomNum, preventDefault } from './utils';

class Minesweeper {
  constructor(painter, audioPlayer) {
    this.audioPlayer = audioPlayer;
    this.painter = painter;
    this.painter.canvas.addEventListener('pointerdown', this.clickDownPointerCellHandler);
    this.painter.canvas.addEventListener('contextmenu', preventDefault);
    this.minesCounter = document.querySelector('.minesweeper-app__mines-left-count');
  }

  initGame = (rows, columns, mines) => {
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;
    this.state = GAME_STATE.WAITING_START;
    this.flagCount = 0;
    this.openedCells = 0;
    this.minesCounter.innerHTML = mines;
    this.initGrid();
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
      this.clickAllHidenNeighbors(row, column);
    }
    this.painter.drawGrid(this.grid);
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
      this.audioPlayer.playLoop();
      this.state = GAME_STATE.ACTIVE;
      this.generateMineMap(row, column);
      this.countDangerInAllGrid();
    }
    if (!this.grid[row][column].isOpened) {
      this.checkStateAfterClick(row, column);
      this.painter.drawGrid(this.grid);
    }
  };

  checkStateAfterClick = (row, column) => {
    if (!this.isCellInGrid(row, column)) return;
    if (this.grid[row][column].isOpened) return;
    if (this.grid[row][column].hasFlag) return;
    this.grid[row][column].isOpened = true;
    this.openedCells += 1;
    if (this.grid[row][column].hasMine) {
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
    if (this.isWin()) {
      this.state = GAME_STATE.WINNER;
      alert('Winn!');
    }
  };

  isWin = () => this.rows * this.columns - this.mines === this.openedCells;

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

  isHidenCell = (row, column) => this.isCellInGrid(row, column) && this.grid[row][column].isOpened === false;

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
      this.flagCount -= 1;
    } else {
      this.grid[row][column].hasFlag = true;
      this.flagCount += 1;
    }
    let minesLeft = this.mines - this.flagCount;
    if (minesLeft < 0) minesLeft = 0;
    this.minesCounter.innerHTML = minesLeft;
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
}

export default Minesweeper;

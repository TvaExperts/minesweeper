import './index.scss';
import MinesweeperApp from './js/MinesweeperApp';

const minesweeperApp = new MinesweeperApp();

const startNewGame = () => {
  minesweeperApp.initNewGame();
};

document.addEventListener('DOMContentLoaded', async () => {
  // minesweeperApp = new MinesweeperApp();
  await minesweeperApp.loadData();
  document.querySelector('.minesweeper-app__game-time-clock').addEventListener('click', startNewGame);
  startNewGame();
});

import './index.scss';
import MinesweeperApp from './js/MinesweeperApp';

let minesweeperApp;

const startNewGame = () => {
  minesweeperApp.initNewGame();
};

document.addEventListener('DOMContentLoaded', async () => {
  minesweeperApp = new MinesweeperApp();
  // await minesweeperApp.loadData();
  document.querySelector('.button-new-game').addEventListener('click', startNewGame);
  startNewGame();
});

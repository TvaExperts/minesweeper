import './index.scss';
import MinesweeperApp from './js/MinesweeperApp';

let minesweeperApp;

const startNewGame = () => {
  minesweeperApp.initNewGame();
};

document.addEventListener('DOMContentLoaded', () => {
  minesweeperApp = new MinesweeperApp();
  document.querySelector('.button-new-game').addEventListener('click', startNewGame);
  startNewGame();
});

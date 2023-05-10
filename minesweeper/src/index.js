import './index.scss';
import MinesweeperApp from './js/MinesweeperApp';

let minesweeperApp;

document.addEventListener('DOMContentLoaded', () => {
  minesweeperApp = new MinesweeperApp(null);
  console.log(minesweeperApp);
});

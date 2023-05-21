import './index.scss';
import { DEFAULT_APP_CONFIGS } from './js/consts';
import MinesweeperApp from './js/MinesweeperApp';

let minesweeperApp; // = new MinesweeperApp(localStorage.getItem('MinesweeperAppData')); // atob()

const decodeString = (str, gap) =>
  str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt() + gap))
    .join('');

const encodeString = (str, gap) =>
  str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt() - gap))
    .join('');

document.addEventListener('DOMContentLoaded', async () => {
  const storageData = localStorage.getItem('MinesweeperAppData');
  const savedData = storageData && JSON.parse(decodeString(storageData, 19));
  const dataForLoading = savedData || DEFAULT_APP_CONFIGS;
  minesweeperApp = new MinesweeperApp(dataForLoading.appConfigs);
  await minesweeperApp.loadData();
  console.log(encodeString('saveDataString', 19));
  minesweeperApp.loadRating(dataForLoading.rating);
  minesweeperApp.initNewGame(dataForLoading.game);
});

window.addEventListener('beforeunload', () => {
  const saveData = minesweeperApp.buildSaveData();

  const saveDataString = JSON.stringify(saveData);

  localStorage.setItem('MinesweeperAppData', encodeString(saveDataString, 19));
});

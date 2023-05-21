import './index.scss';
import { DEFAULT_APP_CONFIGS } from './js/consts';
import MinesweeperApp from './js/MinesweeperApp';

let minesweeperApp; // = new MinesweeperApp(localStorage.getItem('MinesweeperAppData')); // atob()

document.addEventListener('DOMContentLoaded', async () => {
  const savedData = JSON.parse(localStorage.getItem('MinesweeperAppData'));
  const dataForLoading = savedData || DEFAULT_APP_CONFIGS;
  minesweeperApp = new MinesweeperApp(dataForLoading.appConfigs);
  await minesweeperApp.loadData();

  minesweeperApp.loadRating(dataForLoading.rating);
  minesweeperApp.initNewGame(dataForLoading.game);
  // setTimeout(minesweeperApp.audioPlayer.playMusic, 1000);
});

window.addEventListener('beforeunload', () => {
  const saveData = minesweeperApp.buildSaveData();

  const saveDataString = JSON.stringify(saveData);
  localStorage.setItem('MinesweeperAppData', saveDataString);
  // localStorage.setItem('MinesweeperAppDataEncode', btoa(encodeURIComponent(saveDataString)));
});

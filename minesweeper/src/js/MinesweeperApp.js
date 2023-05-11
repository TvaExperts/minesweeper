import AudioPlayer from './AudioPlayer';
import Minesweeper from './Minesweeper';

class MinesweeperApp {
  constructor(initState) {
    this.audioPlayer = new AudioPlayer(initState);
    this.minesweeper = new Minesweeper(600, 300, 20, 10, 20, this.audioPlayer);
    this.minesweeper.initGrid();
    this.state = initState;
  }
}

export default MinesweeperApp;

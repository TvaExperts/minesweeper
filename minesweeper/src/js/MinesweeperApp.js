import AudioPlayer from './AudioPlayer';
import Minesweeper from './Minesweeper';

class MinesweeperApp {
  constructor(initState) {
    this.audioPlayer = new AudioPlayer(initState);
    this.minesweeper = new Minesweeper(500, 500, 10, 10, 15, this.audioPlayer);
    this.minesweeper.initGrid();
    this.state = initState;
  }
}

export default MinesweeperApp;

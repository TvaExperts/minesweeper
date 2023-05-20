class Rating {
  constructor() {
    this.list = [];
  }

  getBestTime = () => {
    let bestTime = Number.MAX_VALUE;
    this.list.forEach((result) => {
      if (result.time < bestTime) bestTime = result.time;
    });
    return bestTime === Number.MAX_VALUE ? -1 : bestTime;
  };

  getPlace = (time) => this.list.filter((result) => result.time <= time).length;

  push = (newGameResult) => {
    if (this.list.length === 10) this.list.shift();
    this.list.push(newGameResult);
    return this.getPlace(newGameResult.time);
  };
}

export default Rating;

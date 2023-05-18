class Rating {
  constructor(rating) {
    this.rating = rating;
  }

  addResultInRating = (gameResult) => {
    if (this.rating.length === 0) {
      return this.rating.push(gameResult);
    }
    const newPlace = this.rating.filter((item) => item.time < gameResult.time).length;
    this.rating.splice(newPlace, 0, gameResult);
    if (this.rating.length > 10) this.rating.pop();
    return newPlace + 1;
  };

  push = (gameResult) => {
    if (this.rating.length < 10 || this.rating[9].time > gameResult.time) {
      return this.addResultInRating(gameResult);
    }
    return -1;
  };
}

export default Rating;

class ReviewEntity {
  constructor(params) {
    const {
      authorName, ratingText, commentShort, commentLong, reviewDate
    } = params;

    this._authorName = authorName;
    this._starRating = ratingText
      .split(' ')[3]
      .replace('개를', '');
    this._comment = commentShort || commentLong;
    this._reviewDate = reviewDate
      .replace('년 ', '-')
      .replace('월 ', '-')
      .replace('일', '');
  }

  get authorName() { return this._authorName; }
  get starRating() { return this._starRating; }
  get comment() { return this._comment; }
  get reviewDate() { return this._reviewDate; }
}


module.exports = ReviewEntity;

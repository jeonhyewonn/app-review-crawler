const cheerio = require('cheerio');
const ReviewEntity = require('./entity/review');
const rawReviews = require('../data/app_reviews');


class ReviewParser {
  constructor() {
    this.rawReviews = rawReviews;
  }

  parse() {
    const results = [];
    for (const { body } of this.rawReviews) {
      const $ = cheerio.load(body);

      const authorName = $('div[class="bAhLNe kx8XBd"] span[class="X43Kjb"]').text();
      const ratingText = $('div[class="bAhLNe kx8XBd"] div[class="pf5lIe"] div').attr('aria-label');
      const commentShort = $('div[class="UD7Dzf"] span[jsname="bN97Pc"]').text();
      const commentLong = $('div[class="UD7Dzf"] span[jsname="fbQN7e"]').text();
      const reviewDate = $('div[class="bAhLNe kx8XBd"] span[class="p2TkOb"]').text();

      results.push(new ReviewEntity({
        authorName,
        ratingText,
        commentShort,
        commentLong,
        reviewDate
      }))
    }

    return results;
  }
}


module.exports = ReviewParser;

const Rdb = require('./adapter/rdb');
const ReviewParser = require('./parser');

const parser = new ReviewParser();
const db = new Rdb({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crawling'
});

async function run() {
  try {
    const results = parser.parse();
    const query =
      `INSERT INTO crazy_arcade_reviews 
      (author_name, star_rating, comment, review_date) 
      VALUES ?
      ON DUPLICATE KEY UPDATE author_name = VALUES(author_name)`;
    const values = [results.map(r => [r.authorName, r.starRating, r.comment, r.reviewDate])];
    await db.execute(query, values);
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await db.disconnect();
  }
}

run();
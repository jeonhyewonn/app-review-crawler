const mysql = require('mysql');


class Rdb {
  constructor(options) {
    this.queryTimeout = 1500;
    this.maxRetryCnt = 5;
    this.retryErrorCodes = new Set([
      'PROTOCOL_SEQUENCE_TIMEOUT',
      'ER_LOCK_DEADLOCK'
    ]);
    this.dbConfig = {
      host: options.host,
      user: options.user,
      password: options.password,
      database: options.database,
    };

    this.pool = this.connect();
  }

  connect() {
    return mysql.createPool(this.dbConfig);
  }

  async getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) return reject(err);
        return resolve(conn);
      });
    });
  }

  async disconnect() {
    if (this.pool && typeof this.pool.end !== 'function') {
      this.pool = null;
      return;
    }

    return new Promise((resolve, reject) => {
      this.pool.end(err => {
        if (err) return reject(err);

        this.pool = null;
        return resolve();
      });
    });
  }

  async execute(queryString, values, retryCnt = 1) {
    if (!queryString) throw new Error('queryString is empty!');
    if (retryCnt > this.maxRetryCnt) throw new Error('maxRetryQuery');

    const conn = await this.getConnection();

    return new Promise((resolve, reject) => {
      conn.query({
        values,
        sql: queryString,
        timeout: this.queryTimeout,
      }, (err, results) => {
        if (err) {
          conn.destroy();
          return this.retryErrorCodes.has(err.code)
            ? resolve(this.execute(queryString, values, retryCnt + 1))
            : reject(err);
        }

        conn.release();
        return resolve(results);
      });
    });
  }
}


module.exports = Rdb;
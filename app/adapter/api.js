const request = require('request');


class ApiAdapter {
  constructor() {
    this.maxRetryCnt = 3;
    this.retryErrorCodes = ['ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'];
  }

  async get(url, headers) {
    const options = {
      url: url,
      headers: headers,
      method: 'GET'
    };

    return this._request(options);
  }

  async _request(options, retryCnt = 0) {
    if (retryCnt > this.maxRetryCnt) throw new Error('over max retry cnt');

    return new Promise((resolve, reject) => {
      request(options, (err, result, body) => {
        if (err) {
          return this.retryErrorCodes.has(err.code)
            ? resolve(this._request(options, retryCnt + 1))
            : reject(err);
        }
        return resolve(body);
      });
    });
  }
}


module.exports = ApiAdapter;

const request = require('request');
const Timedcache = require('timed-cache');

const cache = new Timedcache();

const fetchObject = (url) => {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const URLResponseHandler = (err, res, body) => {
      if (err) {
        setTimeout(() => {
          retries += 1;
          if (retries > 3) {
            reject('Unable to fetch data');
          } else {
            /* eslint-disable no-console */
            console.warn(`[http-config-cache]: reattempting JSON fetch, after failed attempt #${retries}`);
            /* eslint-enable no-console */
            request(url, URLResponseHandler);
          }
        }, 750);
      } else {
        let configObject = null;
        try {
          configObject = JSON.parse(body);
        } catch (e) {
          reject('Data not valid JSON');
        }
        resolve(configObject);
      }
    };

    request(url, URLResponseHandler);
  });
};

module.exports = (url, time, ignoreCache) => {
  return new Promise((resolve, reject) => {
    const cacheResponse = cache.get(url);
    if (typeof cacheResponse === 'undefined' || ignoreCache) {
      fetchObject(url).then((cacheObject) => {
        const cacheConfig = {};

        if (typeof time === 'number') {
          cacheConfig.ttl = time;
        } else {
          cacheConfig.ttl = 10000;
        }

        cache.put(url, cacheObject, cacheConfig);
        resolve(cacheObject);
      }).catch((err) => {
        reject(err);
      });
    } else {
      resolve(cacheResponse);
    }
  });
};

'use strict';

var request = require('request');
var Timedcache = require('timed-cache');

var cache = new Timedcache();

var fetchObject = function fetchObject(url) {
  return new Promise(function (resolve, reject) {
    var retries = 0;

    var URLResponseHandler = function URLResponseHandler(err, res, body) {
      if (err) {
        setTimeout(function () {
          retries += 1;
          if (retries > 3) {
            reject('Unable to fetch data');
          } else {
            /* eslint-disable no-console */
            console.warn('[http-config-cache]: reattempting JSON fetch, after failed attempt #' + retries);
            /* eslint-enable no-console */
            request(url, URLResponseHandler);
          }
        }, 750);
      } else {
        var configObject = null;
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

module.exports = function (url, time, ignoreCache) {
  return new Promise(function (resolve, reject) {
    var cacheResponse = cache.get(url);
    if (typeof cacheResponse === 'undefined' || ignoreCache) {
      fetchObject(url).then(function (cacheObject) {
        var cacheConfig = {};

        if (typeof time === 'number') {
          cacheConfig.ttl = time;
        } else {
          cacheConfig.ttl = 600000;
        }

        cache.put(url, cacheObject, cacheConfig);
        resolve(cacheObject);
      }).catch(function (err) {
        reject(err);
      });
    } else {
      resolve(cacheResponse);
    }
  });
};
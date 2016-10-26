let assert = require('assert');
let cache = require('../src/');

describe('cache', () => {
	it('fetches JSON and returns as object', (done) => {
		cache('https://raw.githubusercontent.com/Restocks/http-config-cache/master/static/test.json').then((data) => {
			assert.deepEqual(data, {'foo': 'bar', me: false});
			done();
		}).catch((err) => {
			console.log(err);
		});
	});
});
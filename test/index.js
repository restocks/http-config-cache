let cache = require('../src/');

describe('cache', () => {
	it('fetches JSON and returns as object', (done) => {
		cache('https://cdn.restocks.io/test.json').then((err, data) => {
			assert.deepEqual(data, {foo: bar, me: false});
			done();
		});
	});
});
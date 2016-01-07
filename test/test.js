var debug = require('debug')('mocha-test');
var rest = require('restler');
var nock = require('nock');
var assert = require('assert');

var server = 'http://localhost:8081';
var eligibilityServiceResponse;
var customerAccountNumber;

describe('REWARDS API', function() {
	/*beforeEach(function() {
		  nock('http://localhost/eligibility-service')
			.get('/' + customerAccountNumber)
			.reply(200, 'CUSTOMER_ELIGIBLE');
	});*/

	it('should get the list of rewards for customer ' + 1, function(done) {
		rest.post(server + '/api/rewards/' + 1, {
			data: {channels: JSON.stringify(['SPORTS', 'KIDS'])}
		}).on('complete', function(data) {
			debug(data);
			assert.equal(data.error, false);
			assert.equal(typeof data.data, "object");
			assert.equal(data.data instanceof Array, true);

			if (data.error === false) {

			}
			done();
		});
	});

	it('should get the list of rewards for customer ' + 1, function(done) {
		rest.post(server + '/api/rewards/' + 1, {
			data: {channels: JSON.stringify(['SPORTS', 'NEWS', 'MUSIC', 'MOVIES'])}
		}).on('complete', function(data) {
			debug(data);
			assert.equal(data.error, false);
			if (data.error === false) {

			}
			done();
		});
	});

	it('should get the list of rewards for customer ' + 2, function(done) {
		rest.post(server + '/api/rewards/' + 2, {
			data: {channels: JSON.stringify(['SPORTS', 'KIDS'])}
		}).on('complete', function(data) {
			debug(data);
			assert.equal(data.error, true);
			if (data.error === false) {

			}
			done();
		});
	});

	it('should get the list of rewards for customer ' + 3, function(done) {
		rest.post(server + '/api/rewards/' + 3, {
			data: {channels: JSON.stringify(['SPORTS', 'KIDS'])}
		}).on('complete', function(data) {
			debug(data);
			assert.equal(data.error, true);
			if (data.error === false) {

			}
			done();
		});
	});

	it('should get the list of rewards for customer ' + 4, function(done) {
		rest.post(server + '/api/rewards/' + 4, {
			data: {channels: JSON.stringify(['SPORTS', 'KIDS'])}
		}).on('complete', function(data) {
			debug(data);
			assert.equal(data.error, true);
			if (data.error === false) {

			}
			done();
		});
	});

});
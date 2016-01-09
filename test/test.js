var debug = require('debug')('test');
var rest = require('restler');
var assert = require('assert');

var server = 'http://localhost:8084';
var eligibilityServiceResponse;
var customerAccountNumber;

describe('REWARDS API', function() {
	it('should get the list of rewards for customer ' + 123456, function(done) {
		rest.get(server + '/account/' + 123456 + '/subscriptions/SPORTS|KIDS').on('complete', function(response) {
			debug(response.eligibleRewardList.campaigns);
			assert.deepEqual(response.eligibleRewardList.success, true);
			assert.deepEqual(response.eligibleRewardList.reason, "CUSTOMER_ELIGIBLE");
			assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
			assert.deepEqual(response.eligibleRewardList.campaigns[0].campaign, "CAMPAIGN001");
			assert.deepEqual(response.eligibleRewardList.campaigns[0].rewards[0], "CHAMPIONS_LEAGUE_FINAL_TICKET");
			assert.deepEqual(response.eligibleRewardList.campaigns[1].campaign, "CAMPAIGN002");
			assert.deepEqual(response.eligibleRewardList.campaigns[1].rewards[0], "MARIO_KART_7");
			done();
		});
	});

	it('should get the list of rewards for customer ' + 123457, function(done) {
		rest.get(server + '/account/' + 123457 + '/subscriptions/SPORTS|MUSIC').on('complete', function(response) {
			debug(response);
			assert.deepEqual(response.eligibleRewardList.success, true);
			assert.deepEqual(response.eligibleRewardList.reason, "CUSTOMER_ELIGIBLE");
			assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
			assert.deepEqual(response.eligibleRewardList.campaigns[0].campaign, "CAMPAIGN001");
			assert.deepEqual(response.eligibleRewardList.campaigns[0].rewards[0], "CHAMPIONS_LEAGUE_FINAL_TICKET");
			assert.deepEqual(response.eligibleRewardList.campaigns[0].rewards[1], "KARAOKE_PRO_MICROPHONE");
			done();
		});
	});

	it('should get the list of rewards for customer ' + 123458, function(done) {
		rest.get(server + '/account/' + 123458 + '/subscriptions/NEWS').on('complete', function(response) {
			debug(response);
			assert.deepEqual(response.eligibleRewardList.success, true);
			assert.deepEqual(response.eligibleRewardList.reason, "CUSTOMER_ELIGIBLE");
			assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
			done();
		});
	});

	it('should get the list of rewards for customer ' + 123411, function(done) {
		rest.get(server + '/account/' + 123411 + '/subscriptions/MUSIC').on('complete', function(response) {
			debug(response);
			assert.equal(response.eligibleRewardList.success, false);
			assert.deepEqual(response.eligibleRewardList.reason, "CUSTOMER_NOT_ELIGIBLE");
			assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
			done();
		});
	});

	it('should get the list of rewards for customer ' + 123412, function(done) {
		rest.get(server + '/account/' + 123412 + '/subscriptions/MUSIC').on('complete', function(response) {
			debug(response);
			assert.equal(response.eligibleRewardList.success, false);
			assert.deepEqual(response.eligibleRewardList.reason, "TECHNICAL ERROR");
			assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
			done();
		});
	});

	it('should get the list of rewards for customer ' + 123412, function(done) {
		rest.get(server + '/account/' + 12341 + '/subscriptions/KIDS').on('complete', function(response) {
			debug(response);
			assert.equal(response.eligibleRewardList.success, false);
			assert.deepEqual(response.eligibleRewardList.reason, "INVALID ACCOUNT NUMBER");
			assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
			done();
		});
	});
});
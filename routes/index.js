var express = require('express');
var router = express.Router();
var debug = require('debug')('API');
var rest = require('restler');
var request = require('request');
var nock = require('nock');

nock('http://account-eligibility.com')
	.get('/account-eligibility/123456')
	.reply(200, JSON.stringify('CUSTOMER_ELIGIBLE'));

nock('http://account-eligibility.com')
	.get('/account-eligibility/123457')
	.reply(200, JSON.stringify('CUSTOMER_ELIGIBLE'));

nock('http://account-eligibility.com')
	.get('/account-eligibility/123458')
	.reply(200, JSON.stringify('CUSTOMER_ELIGIBLE'));

nock('http://account-eligibility.com')
	.get('/account-eligibility/123411')
	.reply(200, JSON.stringify('CUSTOMER_INELIGIBLE'));

nock('http://account-eligibility.com')
	.get('/account-eligibility/123412')
	.reply(200, JSON.stringify('TECHNICAL_ERROR'));

nock('http://account-eligibility.com')
	.get('/account-eligibility/12341')
	.reply(200, JSON.stringify('INVALID_ACCOUNT_NUMBER'));

var campaigns = [{
		SPORTS: 'CHAMPIONS_LEAGUE_FINAL_TICKET',
		KIDS: null,
		MUSIC: 'KARAOKE_PRO_MICROPHONE',
		NEWS: null,
		MOVIES: 'PIRATES_OF_THE_CARIBBEAN_COLLECTION'
	}, {
		CULTURE_AND_NEWS: "ENO_OPERA_TICKETS",
		KIDS: "MARIO_KART_7"
	}
];

/* GET home page. */
router.get('/account/:customerAccountNumber/subscriptions/:channels', function(req, res, next) {
	var channels = req.params.channels.split('|');
	var customerAccountNumber = req.params.customerAccountNumber;

	var combinedChannels = [];
	channels.forEach(function(channel1){
		channels.forEach(function(channel2){
			if (channel1 !== channel2)
				combinedChannels.push(channel1 + '_AND_' + channel2);
		});
	});
	channels = channels.concat(combinedChannels);

	debug(channels);
	debug(customerAccountNumber);
	var response = {
		eligibleRewardList: {
			campaigns: [],
			success: false
		}
	};

	request('http://account-eligibility.com/account-eligibility/' + customerAccountNumber, function (error, r, body) {
		debug(body);
		body = JSON.parse(body);
		switch(body) {
			case 'CUSTOMER_ELIGIBLE':
				response.eligibleRewardList.reason = 'CUSTOMER_ELIGIBLE';
				response.eligibleRewardList.success = true;
				campaigns.forEach(function(rewards, campaignIterator) {
					channels.forEach(function(channel) {
						if (rewards[channel] != undefined && rewards[channel] !== null) {
							var campaignNumber;
							if (response.eligibleRewardList.campaigns[campaignIterator] === undefined) {
								if (campaignIterator.toString().length === 1)
									campaignNumber = "00" + (campaignIterator + 1);
								else if(campaignIterator.toString().length === 2)
									campaignNumber = "0" + (campaignIterator + 1);

								response.eligibleRewardList.campaigns[campaignIterator] = {
									campaign: "CAMPAIGN" + campaignNumber,
									rewards: []
								};
							}

							response.eligibleRewardList.campaigns[campaignIterator].rewards.push(rewards[channel]);
						}
					});
				});
			break;

			case 'CUSTOMER_INELIGIBLE':
				response.eligibleRewardList.reason = 'CUSTOMER_NOT_ELIGIBLE';
			break;

			case 'TECHNICAL_ERROR':
				response.eligibleRewardList.reason = 'TECHNICAL ERROR';
			break;

			case 'INVALID_ACCOUNT_NUMBER':
				response.eligibleRewardList.reason = 'INVALID ACCOUNT NUMBER';
			break;
		}
		res.json(response);
	});
});

module.exports = router;

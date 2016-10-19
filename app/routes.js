var express = require('express');
var router = express.Router();
var debug = require('debug')('API');
var request = require('request');
var _ = require('lodash');
var routes = require('./routes.js');
require('dotenv').config({ silent: true })

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

router.get('/api/eligibility/:accountNumber', function(req, res, next) {
	const responses = [
		'CUSTOMER_ELIGIBLE',
		'CUSTOMER_INELIGIBLE',
		'TECHNICAL_ERROR',
		'INVALID_ACCOUNT_NUMBER'];


	res.json({
		data: responses[_.random(0, responses.length - 1)]
	});
});

router.get('/api/account/:accountNumber/subscriptions/:channels', function(req, res, next) {
	var channels = req.params.channels.split('|');
	var accountNumber = req.params.accountNumber;

	var combinedChannels = [];
	channels.forEach(function(channel1){
		channels.forEach(function(channel2){
			if (channel1 !== channel2)
				combinedChannels.push(channel1 + '_AND_' + channel2);
		});
	});
	channels = channels.concat(combinedChannels);

	var response = {
		eligibleRewardList: {
			campaigns: [],
			success: false
		}
	};

	request(process.env.ELIGIBILITY_ENDPOINT + '/' + accountNumber, function (error, r, body) {
		var data = JSON.parse(body);
		switch(data.data) {
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

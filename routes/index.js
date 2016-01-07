var express = require('express');
var router = express.Router();
var debug = require('debug')('API');
var rest = require('restler');
var request = require('request');

var rewards = {
	SPORTS: 'CHAMPIONS_LEAGUE_FINAL_TICKET',
	KIDS: null,
	MUSIC: 'KARAOKE_PRO_MICROPHONE',
	NEWS: null,
	MOVIES: 'PIRATES_OF_THE_CARIBBEAN_COLLECTION'
}

/* GET home page. */
router.post('/api/rewards/:customerAccountNumber', function(req, res, next) {
	var channels = JSON.parse(req.body.channels);
	debug(channels);
	debug(req.params.customerAccountNumber);
	var customerRewards = [];

	request('http://localhost:8081/api/eligibility-service/' + req.params.customerAccountNumber, function (error, response, body) {
		body = JSON.parse(body);
		debug(body);
		switch(body) {
			case 'CUSTOMER_ELIGIBLE':
				channels.forEach(function(channel){
					if (rewards[channel] !== null)
						customerRewards.push(rewards[channel]);
				});

				res.json({
					error: false,
					data: customerRewards
				});
			break;

			default:
				res.json({
					error: true,
					errorType: body
				});
		}
	})
});

router.get('/api/eligibility-service/:customerAccountNumber', function(req, res, next) {
	switch (req.params.customerAccountNumber) {
		case '1':
			res.json('CUSTOMER_ELIGIBLE');
		break;

		case '2':
			res.json('CUSTOMER_INELIGIBLE');
		break;

		case '3':
			res.json('EXCEPTION');
		break;

		default:
			res.json('INVALID_ACCOUNT_NUMBER');
		break;
	}
});

module.exports = router;

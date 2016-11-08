import express from 'express';
import debugModule from 'debug';
import dotenvModule from 'dotenv';

import eligibilityMockController from './api/eligibility-mock';
import subscriptionsController from './api/subscriptions';

const router = express.Router();
const routes = require('./routes.js');
const debug = debugModule('server');
const dotenv = dotenvModule.config({ silent: true });

router.get('/', (req, res, next) => {
	res.send("Check the readme for example use for the API.");
});

router.get('/api/eligibility/:accountNumber', eligibilityMockController);
router.get('/api/account/:accountNumber/subscriptions/:channels', subscriptionsController);

export default router;

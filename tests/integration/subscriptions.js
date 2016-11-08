/* global it, describe */

import restler from 'restler';
import assert from 'assert';
import _debug from 'debug';
import dotenv from 'dotenv';
import nock from 'nock';
import '../../app/server';

dotenv.config({ silent: true });
const debug = _debug('api-test');

const serverUrl = `http://localhost:${process.env.PORT}`;
const eligibilityUrl = `${process.env.ELIGIBILITY_ENDPOINT}`;
const customerAccountNumber = 123456789;

describe('REWARDS API', () => {
  it('should get the list of rewards for a customer with 2 campaigns', (done) => {
    nock(eligibilityUrl, { allowUnmocked: true })
      .get(`/api/eligibility/${customerAccountNumber}`)
      .reply(200, { data: 'CUSTOMER_ELIGIBLE' });

    restler.get(`${serverUrl}/api/account/${customerAccountNumber}/subscriptions/SPORTS|KIDS`).on('complete', (response) => {
      debug(response);
      assert.deepEqual(response.eligibleRewardList.success, true);
      assert.deepEqual(response.eligibleRewardList.reason, 'CUSTOMER_ELIGIBLE');
      assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
      assert.deepEqual(response.eligibleRewardList.campaigns[0].campaign, 'CAMPAIGN001');
      assert.deepEqual(response.eligibleRewardList.campaigns[0].rewards[0], 'CHAMPIONS_LEAGUE_FINAL_TICKET');
      assert.deepEqual(response.eligibleRewardList.campaigns[1].campaign, 'CAMPAIGN002');
      assert.deepEqual(response.eligibleRewardList.campaigns[1].rewards[0], 'MARIO_KART_7');
      done();
    });
  });

  it('should get the list of rewards for a customer with 1 campaign', (done) => {
    nock(eligibilityUrl, { allowUnmocked: true })
      .get(`/api/eligibility/${customerAccountNumber}`)
      .reply(200, { data: 'CUSTOMER_ELIGIBLE' });

    restler.get(`${serverUrl}/api/account/${customerAccountNumber}/subscriptions/SPORTS|MUSIC`).on('complete', (response) => {
      debug(response);
      assert.deepEqual(response.eligibleRewardList.success, true);
      assert.deepEqual(response.eligibleRewardList.reason, 'CUSTOMER_ELIGIBLE');
      assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
      assert.deepEqual(response.eligibleRewardList.campaigns[0].campaign, 'CAMPAIGN001');
      assert.deepEqual(response.eligibleRewardList.campaigns[0].rewards[0], 'CHAMPIONS_LEAGUE_FINAL_TICKET');
      assert.deepEqual(response.eligibleRewardList.campaigns[0].rewards[1], 'KARAOKE_PRO_MICROPHONE');
      done();
    });
  });

  it('should get the list of rewards for a customer with no campaings', (done) => {
    nock(eligibilityUrl, { allowUnmocked: true })
      .get(`/api/eligibility/${customerAccountNumber}`)
      .reply(200, { data: 'CUSTOMER_ELIGIBLE' });

    restler.get(`${serverUrl}/api/account/${customerAccountNumber}/subscriptions/NEWS`).on('complete', (response) => {
      debug(response);
      assert.deepEqual(response.eligibleRewardList.success, true);
      assert.deepEqual(response.eligibleRewardList.reason, 'CUSTOMER_ELIGIBLE');
      assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
      done();
    });
  });

  it('should not get the list of rewards for customer that is not eligible for rewards', (done) => {
    nock(eligibilityUrl, { allowUnmocked: true })
      .get(`/api/eligibility/${customerAccountNumber}`)
      .reply(200, { data: 'CUSTOMER_INELIGIBLE' });

    restler.get(`${serverUrl}/api/account/${customerAccountNumber}/subscriptions/MUSIC`).on('complete', (response) => {
      debug(response);
      assert.equal(response.eligibleRewardList.success, false);
      assert.deepEqual(response.eligibleRewardList.reason, 'CUSTOMER_NOT_ELIGIBLE');
      assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
      done();
    });
  });

  it('should handle a technical error', (done) => {
    nock(eligibilityUrl, { allowUnmocked: true })
      .get(`/api/eligibility/${customerAccountNumber}`)
      .reply(200, { data: 'TECHNICAL_ERROR' });

    restler.get(`${serverUrl}/api/account/${customerAccountNumber}/subscriptions/MUSIC`).on('complete', (response) => {
      debug(response);
      assert.equal(response.eligibleRewardList.success, false);
      assert.deepEqual(response.eligibleRewardList.reason, 'TECHNICAL ERROR');
      assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
      done();
    });
  });

  it('should handle invalid account numbers', (done) => {
    nock(eligibilityUrl, { allowUnmocked: true })
      .get(`/api/eligibility/${customerAccountNumber}`)
      .reply(200, { data: 'INVALID_ACCOUNT_NUMBER' });

    restler.get(`${serverUrl}/api/account/${customerAccountNumber}/subscriptions/KIDS`).on('complete', (response) => {
      debug(response);
      assert.equal(response.eligibleRewardList.success, false);
      assert.deepEqual(response.eligibleRewardList.reason, 'INVALID ACCOUNT NUMBER');
      assert.deepEqual(response.eligibleRewardList.campaigns instanceof Array, true);
      done();
    });
  });
});

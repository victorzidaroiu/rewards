import request from 'request';
import _debug from 'debug';
import dotenv from 'dotenv';
import splitChannels from '../helpers/split-channels';

const debug = _debug('server');
dotenv.config({ silent: true });

const campaigns = [{
  SPORTS: 'CHAMPIONS_LEAGUE_FINAL_TICKET',
  KIDS: null,
  MUSIC: 'KARAOKE_PRO_MICROPHONE',
  NEWS: null,
  MOVIES: 'PIRATES_OF_THE_CARIBBEAN_COLLECTION',
}, {
  CULTURE_AND_NEWS: 'ENO_OPERA_TICKETS',
  KIDS: 'MARIO_KART_7',
}];

export default(req, res) => {
  const channels = splitChannels(req.params.channels);
  const accountNumber = req.params.accountNumber;
  const toSend = {
    eligibleRewardList: {
      campaigns: [],
      success: false,
    },
  };

  request(`${process.env.ELIGIBILITY_ENDPOINT}/api/eligibility/${accountNumber}`, (error, r, body) => {
    try {
      const eligibilityResponse = JSON.parse(body);
      switch (eligibilityResponse.data) {
        case 'CUSTOMER_ELIGIBLE':
          toSend.eligibleRewardList.reason = 'CUSTOMER_ELIGIBLE';
          toSend.eligibleRewardList.success = true;
          campaigns.forEach((rewards, campaignIterator) => {
            channels.forEach((channel) => {
              if (rewards[channel] !== undefined && rewards[channel] !== null) {
                let campaignNumber;
                if (toSend.eligibleRewardList.campaigns[campaignIterator] === undefined) {
                  if (campaignIterator.toString().length === 1) {
                    campaignNumber = `00${(campaignIterator + 1)}`;
                  } else if (campaignIterator.toString().length === 2) {
                    campaignNumber = `0${(campaignIterator + 1)}`;
                  }

                  toSend.eligibleRewardList.campaigns[campaignIterator] = {
                    campaign: `CAMPAIGN${campaignNumber}`,
                    rewards: [],
                  };
                }

                toSend.eligibleRewardList.campaigns[campaignIterator]
                  .rewards.push(rewards[channel]);
              }
            });
          });
          break;

        case 'CUSTOMER_INELIGIBLE':
          toSend.eligibleRewardList.reason = 'CUSTOMER_NOT_ELIGIBLE';
          break;

        case 'TECHNICAL_ERROR':
          toSend.eligibleRewardList.reason = 'TECHNICAL ERROR';
          break;

        default:
        case 'INVALID_ACCOUNT_NUMBER':
          toSend.eligibleRewardList.reason = 'INVALID ACCOUNT NUMBER';
          break;
      }
      res.json(toSend);
    } catch (e) {
      debug(e);
    }
  });
};

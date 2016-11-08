import _ from 'lodash';

export default (req, res) => {
  const responses = [
    'CUSTOMER_ELIGIBLE',
    'CUSTOMER_INELIGIBLE',
    'TECHNICAL_ERROR',
    'INVALID_ACCOUNT_NUMBER',
  ];


  res.json({
    data: responses[_.random(0, responses.length - 1)],
  });
};

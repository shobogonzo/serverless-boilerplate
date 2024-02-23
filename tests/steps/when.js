require('dotenv').config();

const we_invoke_confirmUserSignup = async (
  username,
  firstName,
  lastName,
  email
) => {
  const handler = require('../../functions/confirm-user-signup.js').handler;
  const context = {};
  const event = {
    version: '1',
    region: process.env.AWS_REGION,
    userPoolId: process.env.USER_POOL_ID,
    userName: username,
    triggerSource: 'PostConfirmation_ConfirmSignUp',
    request: {
      userAttributes: {
        sub: username,
        'cognito:email_alias': email,
        'cognito:user_status': 'CONFIRMED',
        email_verified: 'false',
        given_name: firstName,
        family_name: lastName,
        email: email,
      },
    },
    response: {},
  };

  await handler(event, context);
};

module.exports = {
  we_invoke_confirmUserSignup,
};

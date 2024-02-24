const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  InitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
require('dotenv').config();
const chance = require('chance').Chance();

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

const a_user_signs_up = async (password, firstName, lastName, email) => {
  const cognitoClient = new CognitoIdentityProviderClient();
  const userPoolId = process.env.USER_POOL_ID;
  const clientId = process.env.USER_POOL_CLIENT_ID;

  const suffix = chance.string({
    length: 6,
    pool: 'abcdefghijklmnopqrstuvwxyz',
  });
  const username = `${firstName.charAt(0)}${lastName}-${suffix}`.toLowerCase();

  await cognitoClient.send(
    new SignUpCommand({
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
      ],
    })
  );
  console.log(`[${email}] - user has signed up [${username}]`);

  await cognitoClient.send(
    new AdminConfirmSignUpCommand({
      UserPoolId: userPoolId,
      Username: username,
    })
  );
  console.log(`[${email}] - confirmed sign up [${username}]`);

  return {
    username,
    firstName,
    lastName,
    email,
  };
};

module.exports = {
  we_invoke_confirmUserSignup,
  a_user_signs_up,
};

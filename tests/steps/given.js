const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  InitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const chance = require('chance').Chance();
require('dotenv').config();

const a_random_user = () => {
  const firstName = chance.first({ nationality: 'en' });
  const lastName = chance.last({ nationality: 'en' });
  const suffix = chance.string({
    length: 4,
    pool: 'abcdefghijklmnopqrstuvwxyz',
  });
  const password = chance.string({ length: 8 });
  const email = `${firstName}-${lastName}-${suffix}@test.com`;

  return {
    firstName,
    lastName,
    password,
    email,
  };
};

const an_authenticated_user = async () => {
  const { email, password } = a_random_user();

  const cognitoClient = new CognitoIdentityProviderClient();
  const userPoolId = process.env.USER_POOL_ID;
  const clientId = process.env.USER_POOL_CLIENT_ID;

  const signUpResp = await cognitoClient.send(
    new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    })
  );

  const username = signUpResp.UserSub;
  console.log(`[${email}] - user has signed up [${username}]`);

  await cognitoClient.send(
    new AdminConfirmSignUpCommand({
      UserPoolId: userPoolId,
      Username: username,
    })
  );

  console.log(`[${email}] - confirmed sign up`);

  const auth = await cognitoClient.send(
    new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
  );

  console.log(`$[${email}] - signed in`);

  return {
    username,
    email,
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken,
  };
};

module.exports = {
  a_random_user,
  an_authenticated_user,
};

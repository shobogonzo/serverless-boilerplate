const {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DeleteCommand,
  DynamoDBDocumentClient,
} = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const an_authenticated_user = async (user) => {
  const cognito = new CognitoIdentityProviderClient();
  await cognito.send(
    new AdminDeleteUserCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: user.username,
    })
  );

  await docClient.send(
    new DeleteCommand({
      TableName: process.env.SHOBO_TABLE,
      Key: {
        PK: `USER#${user.username}`,
      },
    })
  );
  console.log(`[${user.username}] - user deleted`);
};

module.exports = {
  an_authenticated_user,
};

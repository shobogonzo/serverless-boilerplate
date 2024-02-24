/*
    Expected Input
    https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html#cognito-user-pools-lambda-trigger-event-parameter-shared

    {
      version: '1',
      triggerSource: 'PostConfirmation_ConfirmSignUp',
      region: 'us-east-1',
      userPoolId: 'us-east-1_XgzZmqL3b',
      userName: 'jboone-asdfas',
      request: {
        userAttributes: {
          sub: '3da239a6-1f47-53aa-8fb0-e1b70ec1d439',
          'cognito:email_alias': 'John-Boone-mrqi@test.com',
          'cognito:user_status': 'CONFIRMED',
          email_verified: 'false',
          name: 'John Boone mrqi',
          email: 'John-Boone-mrqi@test.com'
        }
      },
      response: {}
    }
*/

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const middy = require('@middy/core');
const {
  Logger,
  injectLambdaContext,
} = require('@aws-lambda-powertools/logger');

const { SERVICE_NAME, SHOBO_TABLE } = process.env;
const logger = new Logger({ serviceName: SERVICE_NAME });

const lambdaHandler = async (event) => {
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    return event;
  }

  const firstName = event.request.userAttributes['given_name'];
  const lastName = event.request.userAttributes['family_name'];
  const email = event.request.userAttributes.email;

  const user = {
    PK: `USER#${event.userName}`,
    firstName,
    lastName,
    email,
    createdAt: new Date().toJSON(),
  };
  logger.info(user);

  await docClient.send(
    new PutCommand({
      TableName: SHOBO_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(PK)',
    })
  );

  return event;
};

module.exports.handler = middy()
  .use(injectLambdaContext(logger))
  .handler(lambdaHandler);

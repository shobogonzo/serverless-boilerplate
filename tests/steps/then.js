const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const user_exists_in_DynamoDB = async (username) => {
  const ddbClient = new DynamoDBClient();
  const docClient = DynamoDBDocumentClient.from(ddbClient);

  console.log(
    `looking for user [${username}] in table [${process.env.ENTITIES_TABLE}]`
  );
  const resp = await docClient.send(
    new GetCommand({
      TableName: process.env.ENTITIES_TABLE,
      Key: { PK: `USER#${username}` },
    })
  );

  expect(resp.Item).toBeTruthy();

  return resp.Item;
};

module.exports = {
  user_exists_in_DynamoDB,
};

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} = require('@aws-sdk/lib-dynamodb');
const dynamodb = new DynamoDB({ region: 'us-east-1' });
const dynamodbClient = DynamoDBDocumentClient.from(dynamodb);
require('dotenv').config();
const chance = require('chance').Chance();

const entities = [
  { PK: chance.guid(), name: 'Mac' },
  { PK: chance.guid(), name: 'Dennis' },
  { PK: chance.guid(), name: 'Charlie' },
  { PK: chance.guid(), name: 'De' },
  { PK: chance.guid(), name: 'Frank' },
];

const putRequests = entities.map((entity) => ({
  PutRequest: {
    Item: entity,
  },
}));

const command = new BatchWriteCommand({
  RequestItems: {
    [process.env.SHOBO_TABLE]: putRequests,
  },
});

dynamodbClient
  .send(command)
  .then(() => console.log('entities seeded'))
  .catch((err) => console.error(err));

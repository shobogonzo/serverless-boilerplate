const given = require('../../steps/given');
const when = require('../../steps/when');
const then = require('../../steps/then');
const teardown = require('../../steps/teardown');

describe('When a user signs up', () => {
  let user;

  beforeAll(async () => {
    const { password, firstName, lastName, email } = given.a_random_user();

    user = await when.a_user_signs_up(password, firstName, lastName, email);
  });

  afterAll(async () => {
    await teardown.an_authenticated_user(user);
  });

  it("The user's profile should be saved in DynamoDB", async () => {
    const ddbUser = await then.user_exists_in_DynamoDB(user.username);

    expect(ddbUser).toMatchObject({
      PK: `USER#${user.username}`,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g
      ),
    });
  });
});

const given = require('../../steps/given');
const when = require('../../steps/when');
const then = require('../../steps/then');
const chance = require('chance').Chance();

describe('When confirmUserSignup runs', () => {
  it("The user's profile should be saved in DynamoDB", async () => {
    const { firstName, lastName, email } = given.a_random_user();
    const username = chance.guid();

    await when.we_invoke_confirmUserSignup(
      username,
      firstName,
      lastName,
      email
    );

    const ddbUser = await then.user_exists_in_DynamoDB(username);
    expect(ddbUser).toMatchObject({
      PK: `USER#${username}`,
      firstName,
      lastName,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g
      ),
    });
  });
});

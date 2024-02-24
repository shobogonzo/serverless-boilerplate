const given = require('../../steps/given');
const when = require('../../steps/when');
const teardown = require('../../steps/teardown');

describe('Given an authenticated user', () => {
  let user, profile;

  beforeAll(async () => {
    user = await given.an_authenticated_user();
  });

  afterAll(async () => {
    await teardown.an_authenticated_user(user);
  });

  it('The user can fetch their profile with getMyProfile', async () => {
    profile = await when.a_user_calls_getMyProfile(user);

    expect(profile).toMatchObject({
      id: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g
      ),
    });
  });

  // it('The user can edit their profile with editMyProfile', async () => {
  //   const newFirstName = chance.first({ nationality: 'en' });
  //   const newLastName = chance.first({ nationality: 'en' });
  //   const input = {
  //     firstName: newFirstName,
  //     lastName: newLastName,
  //   };

  //   const newProfile = await when.a_user_calls_editMyProfile(user, input);

  //   expect(newProfile).toMatchObject({
  //     ...profile,
  //     firstName: newFirstName,
  //     lastName: newLastName,
  //   });
  // });
});

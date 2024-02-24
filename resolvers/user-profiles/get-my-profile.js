export function request(ctx) {
  return {
    operation: 'GetItem',
    key: {
      PK: util.dynamodb.toDynamoDB(`USER#${ctx.identity.username}`),
    },
  };
}

export function response(ctx) {
  return {
    id: ctx.result.PK.split('#')[1],
    firstName: ctx.result.firstName,
    lastName: ctx.result.lastName,
    email: ctx.result.email,
    createdAt: ctx.result.createdAt,
  };
}

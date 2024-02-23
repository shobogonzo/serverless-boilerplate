export function request(ctx) {
  return {
    operation: 'GetItem',
    query: {
      key: { PK: util.dynamodb.toDynamoDB(`ENTITY#${ctx.args.entityId}`) },
    },
  };
}

export function response(ctx) {
  if (ctx.result.items.length == 0) {
    return null;
  } else {
    return ctx.result.items[0];
  }
}

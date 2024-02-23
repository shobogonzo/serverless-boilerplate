export function request(ctx) {
  const entityId = util.autoId();
  const command = {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      PK: `ENTITY#${entityId}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      ...ctx.args.entity,
    }),
    condition: 'attribute_not_exists(PK)',
  };
  return command;
}

export function response(ctx) {
  const entity = { ...ctx.result, entityId: ctx.result.PK.split('#')[1] };
  return entity;
}

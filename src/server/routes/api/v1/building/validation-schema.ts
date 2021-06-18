// These schemas are implemented following:
// https://www.fastify.io/docs/latest/Validation-and-Serialization/#validation
export default {
  createBuildingSchema: {
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
        },
      },
    },
  },
};

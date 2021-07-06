// These schemas are implemented following:
// https://www.fastify.io/docs/latest/Validation-and-Serialization/#validation
export default {
  createParkingSlotSchema: {
    body: {
      type: 'object',
      required: ['name', 'parkingType', 'isAvailable'],
      properties: {
        name: {
          type: 'string',
        },
        parkingType: {
          type: 'string',
        },
        isAvailable: {
          type: 'boolean',
        },
      },
    },
  },
  updateParkingSlotSchema: {
    body: {
      type: 'object',
      required: ['name', 'isAvailable'],
      properties: {
        name: {
          type: 'string',
        },
        isAvailable: {
          type: 'boolean',
        },
      },
    },
  },
};

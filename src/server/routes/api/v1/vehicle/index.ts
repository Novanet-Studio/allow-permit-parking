import httpResponse from '../../../../utils/http-response';
import validationSchema from './validation-schema';

import type {
  FastifyError,
  FastifyInstance,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

type Vehicle = {
  driverId: string;
  license: string;
  color: string;
  model: string;
  brand: string;
};

export default function (
  fastify: FastifyInstance,
  _: FastifyRegisterOptions<unknown>,
  done: (err?: FastifyError) => void,
): void {
  fastify.post(
    '/:id',
    { schema: validationSchema.createVehicleSchema },
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: {
          license: string;
          color: string;
          model: string;
          brand: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const createdVehicle = await fastify.services.vehicle.create(
          request.params.id,
          request.body as Vehicle,
        );

        return createdVehicle.toPresentationLayer();
      } catch (error) {
        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}

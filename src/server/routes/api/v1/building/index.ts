import httpResponse from '../../../../utils/http-response';
import validationSchema from './validation-schema';
import { ResidenceWithIDNotFound } from '../../../../error/residence.service';

import type {
  FastifyError,
  FastifyInstance,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

type Building = {
  name: string;
};

export default function (
  fastify: FastifyInstance,
  _: FastifyRegisterOptions<unknown>,
  done: (err?: FastifyError) => void,
): void {
  fastify.post(
    '/:id',
    { schema: validationSchema.createBuildingSchema },
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: {
          name: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const building = await fastify.services.building.create(
          request.params.id,
          request.body as Building,
        );

        return httpResponse.created(reply, building.toPresentationLayer());
      } catch (error) {
        if (error instanceof ResidenceWithIDNotFound) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}

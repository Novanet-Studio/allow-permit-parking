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

export default function (
  fastify: FastifyInstance,
  _: FastifyRegisterOptions<unknown>,
  done: (err?: FastifyError) => void,
): void {
  fastify.post(
    '/',
    { schema: validationSchema.createResidenceSchema },
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const residence = await fastify.services.residence.create({
          ...request.body,
        });

        return httpResponse.created(reply, residence.toPresentationLayer());
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

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
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const residences = await fastify.services.residence.getAll();

      return httpResponse.ok(reply, residences);
    } catch (error) {
      return httpResponse.internalServerError(reply, error);
    }
  });

  fastify.get(
    '/:id',
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const residence = await fastify.services.residence.findById(
          request.params.id,
        );

        return httpResponse.ok(reply, residence.toPresentationLayer());
      } catch (error) {
        return httpResponse.internalServerError(reply, error);
      }
    },
  );

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

        if (error.detail.includes('already exists')) {
          return httpResponse.badRequestMessage(reply, `${request.body.name} already exists`, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  fastify.put(
    '/:id',
    { schema: validationSchema.updateResidenceSchema },
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
        const residence = await fastify.services.residence.update({
          id: request.params.id,
          ...request.body,
        });

        return httpResponse.ok(reply, residence.toPresentationLayer());
      } catch (error) {
        if (error instanceof ResidenceWithIDNotFound) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  fastify.delete(
    '/:id',
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const removed = await fastify.services.residence.remove(
          request.params.id,
        );

        return httpResponse.ok(reply, removed.toPresentationLayer());
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

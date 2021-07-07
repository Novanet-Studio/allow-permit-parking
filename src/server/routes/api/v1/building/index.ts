import httpResponse from '../../../../utils/http-response';
import validationSchema from './validation-schema';
import { ResidenceWithIDNotFound } from '../../../../error/residence.service';
import { BuildingWithIDNotFound } from '../../../../error/building.service';

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
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const allBuildings = await fastify.services.building.getAll();
      const buildings = allBuildings.map((building) =>
        building.toPresentationLayer(),
      );

      return httpResponse.ok(reply, buildings);
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
        const building = await fastify.services.building.findById(
          request.params.id,
        );

        return httpResponse.ok(reply, building.toPresentationLayer());
      } catch (error) {
        return httpResponse.internalServerError(reply, error);
      }
    },
  );

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
        const removed = await fastify.services.building.remove(
          request.params.id,
        );

        return httpResponse.ok(reply, removed.toPresentationLayer());
      } catch (error) {
        if (error instanceof BuildingWithIDNotFound) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}

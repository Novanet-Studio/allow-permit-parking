import httpResponse from '../../../../utils/http-response';
import { ParkingLotWithIDNotFound } from '../../../../error/parking-lot.service';
import validationSchema from './validation-schema';

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
      const allParkingLots = await fastify.services.parkingLot.getAll();
      const parkingLots = allParkingLots.map((parkingLot) =>
        parkingLot.toPresentationLayer(),
      );

      return httpResponse.ok(reply, parkingLots);
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
        const parkingLot = await fastify.services.parkingLot.findById(
          request.params.id,
        );

        return httpResponse.ok(reply, parkingLot.toPresentationLayer());
      } catch (error) {
        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  fastify.post(
    '/:id',
    { schema: validationSchema.createParkingSlotSchema },
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
        const parkingLot = await fastify.services.parkingLot.create(
          request.params.id,
          request.body,
        );

        return httpResponse.created(reply, parkingLot.toPresentationLayer());
      } catch (error) {
        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  fastify.put(
    '/:id',
    { schema: validationSchema.updateParkingSlotSchema },
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
        const parkingLot = await fastify.services.parkingLot.update({
          id: request.params.id,
          ...request.body,
        });

        return httpResponse.ok(reply, parkingLot.toPresentationLayer());
      } catch (error) {
        if (error instanceof ParkingLotWithIDNotFound) {
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
        const removed = await fastify.services.parkingLot.remove(
          request.params.id,
        );

        return httpResponse.ok(reply, removed.toPresentationLayer());
      } catch (error) {
        if (error instanceof ParkingLotWithIDNotFound) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}

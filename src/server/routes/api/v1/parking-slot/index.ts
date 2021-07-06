import httpResponse from '../../../../utils/http-response';
import validationSchema from './validation-schema';
import { ParkingSlotWithIDNotFound } from '../../../../error/parking-slot.service';
import { ResidenceWithIDNotFound } from '../../../../error/residence.service';
import { ParkingType } from '../../../../models/parking-slot';

import type {
  FastifyError,
  FastifyInstance,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

type ParkingSlot = {
  name: string;
  parkingType: string;
  isAvailable: boolean;
  residenceId: string;
};

export default function (
  fastify: FastifyInstance,
  _: FastifyRegisterOptions<unknown>,
  done: (err?: FastifyError) => void,
): void {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const allParkingSlots = await fastify.services.parkingSlot.getAll();
      const parkingLots = allParkingSlots.map((parkingSlot) =>
        parkingSlot.toPresentationLayer(),
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
        const parkingSlot = await fastify.services.parkingSlot.findById(
          request.params.id,
        );

        return httpResponse.ok(reply, parkingSlot.toPresentationLayer());
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
          parkingType: ParkingType;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const parkingSlot = await fastify.services.parkingSlot.create(
          request.params.id,
          request.body as ParkingSlot,
        );

        return httpResponse.created(reply, parkingSlot.toPresentationLayer());
      } catch (error) {
        if (error instanceof ResidenceWithIDNotFound) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

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
        const parkingSlot = await fastify.services.parkingSlot.update({
          id: request.params.id,
          ...request.body,
        });

        return httpResponse.ok(reply, parkingSlot.toPresentationLayer());
      } catch (error) {
        if (error instanceof ParkingSlotWithIDNotFound) {
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
        const removed = await fastify.services.parkingSlot.remove(
          request.params.id,
        );

        return httpResponse.ok(reply, removed.toPresentationLayer());
      } catch (error) {
        if (error instanceof ParkingSlotWithIDNotFound) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}

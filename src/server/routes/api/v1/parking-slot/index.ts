import httpResponse from '../../../../utils/http-response';
import validationSchema from './validation-schema';
import { ParkingLotWithIDNotFound } from '../../../../error/parking-lot.service';
import { ParkingSlotWithIDNotFound } from '../../../../error/parking-slot.service';
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
  parkingLotId: string;
  parkingType: ParkingType;
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

      return httpResponse.created(reply, parkingLots);
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

        return httpResponse.created(reply, parkingSlot.toPresentationLayer());
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
        if (error instanceof ParkingLotWithIDNotFound) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  fastify.put(
    '/:id/slot/:slot_id',
    { schema: validationSchema.updateParkingSlotSchema },
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
          slot_id: string;
        };
        Body: {
          name: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const parkingSlot = await fastify.services.parkingSlot.update({
          id: request.params.slot_id,
          parkingLotId: request.params.id,
          ...request.body,
        });

        return httpResponse.ok(reply, parkingSlot.toPresentationLayer());
      } catch (error) {
        if (
          error instanceof ParkingLotWithIDNotFound ||
          error instanceof ParkingSlotWithIDNotFound
        ) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  fastify.delete(
    '/:id/slot/:slot_id',
    async (
      request: FastifyRequest<{
        Params: {
          id: string;
          slot_id: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const removed = await fastify.services.parkingSlot.remove(
          request.params.slot_id,
        );

        return httpResponse.ok(reply, removed.toPresentationLayer());
      } catch (error) {
        if (
          error instanceof ParkingLotWithIDNotFound ||
          error instanceof ParkingSlotWithIDNotFound
        ) {
          return httpResponse.badRequestMessage(reply, error.message, error);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}

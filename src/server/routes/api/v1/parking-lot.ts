import httpResponse from '../../../utils/http-response';
import type {
  FastifyError,
  FastifyInstance,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { ParkingLotNotFound } from '../../../error/parking-lot.service';

export default function (
  fastify: FastifyInstance,
  _: FastifyRegisterOptions<unknown>,
  done: (err?: FastifyError) => void,
): void {
  fastify.post(
    '/',
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const parkingLot = await fastify.services.parkingLot.create(
          request.body,
        );

        reply.status(201);

        return parkingLot;
      } catch (error) {
        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  fastify.post(
    '/:id',
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
        await fastify.services.parkingLot.update({
          id: request.params.id,
          ...request.body,
        });

        reply.status(201);

        return 'Parking Lot updated!';
      } catch (error) {
        if (error instanceof ParkingLotNotFound) {
          return httpResponse.badRequestMessage(
            reply,
            'Parking Lot not found',
            error,
          );
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}

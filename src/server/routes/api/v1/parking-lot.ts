import httpResponse from '../../../utils/http-response';
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

  done();
}

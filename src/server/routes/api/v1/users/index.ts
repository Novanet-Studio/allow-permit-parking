import httpResponse from '../../../../utils/http-response';
import {
  AdminUserAlreadyExists,
  InvalidUserRole,
} from '../../../../error/user.service';
import { Role } from '../../../../models/user';
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
      const allUsers = await fastify.services.user.getAll();
      const users = allUsers.map((user) => user.toPresentationLayer());

      return httpResponse.created(reply, users);
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
        const user = await fastify.services.user.findById(request.params.id);

        return httpResponse.created(reply, user.toPresentationLayer());
      } catch (error) {
        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  fastify.post(
    '/',
    { schema: validationSchema.createUserSchema },
    async (
      request: FastifyRequest<{
        Body: {
          email: string;
          password: string;
          role: Role;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const user = await fastify.services.user.create(request.body);

        return httpResponse.created(reply, user.toPresentationLayer());
      } catch (error) {
        if (error instanceof InvalidUserRole) {
          return httpResponse.badRequestMessage(reply, error.message);
        }

        if (error instanceof AdminUserAlreadyExists) {
          return httpResponse.forbiddenMessage(reply, error.message);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}

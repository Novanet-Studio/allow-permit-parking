import basicAuth, { BasicAuthError } from '../../../utils/basic-auth';
import {
  InvalidCreadentials,
  UserByEmailNotFound,
} from '../../../error/user.service';
import httpResponse from '../../../utils/http-response';
import validationSchema from './validation-schema';

import type {
  FastifyError,
  FastifyInstance,
  FastifyRegisterOptions,
  FastifyReply,
} from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route';
import type { Server, IncomingMessage, ServerResponse } from 'http';

const setTokenCookie = (
  reply: FastifyReply,
  token: string,
): FastifyReply<
  Server,
  IncomingMessage,
  ServerResponse,
  RouteGenericInterface,
  unknown
> => {
  return reply.setCookie(process.env.JWT_TOKEN_COOKIE_NAME, token, {
    domain: process.env.APPLICATION_DOMAIN,
    secure: process.env.NODE_ENV === 'production' && true,
    httpOnly: true,
    sameSite: true,
    path: '/',
  });
};

const setRefreshTokenCookie = (
  reply: FastifyReply,
  token: string,
): FastifyReply<
  Server,
  IncomingMessage,
  ServerResponse,
  RouteGenericInterface,
  unknown
> => {
  return reply.setCookie(process.env.JWT_REFRESH_TOKEN_COOKIE_NAME, token, {
    domain: process.env.APPLICATION_DOMAIN,
    secure: process.env.NODE_ENV === 'production' && true,
    httpOnly: true,
    sameSite: true,
    path: '/',
  });
};

export default function (
  fastify: FastifyInstance,
  _: FastifyRegisterOptions<unknown>,
  done: (err?: FastifyError) => void,
): void {
  fastify.route({
    url: '/login',
    method: 'POST',
    schema: {
      headers: validationSchema.login.headers,
    },
    handler: async (request, reply): Promise<void> => {
      try {
        if (request.headers.authorization) {
          const authorization = request.headers.authorization;
          const credentials = basicAuth(authorization);
          const {
            token,
            refreshToken,
          } = await fastify.services.auth.authenticate(credentials);

          setTokenCookie(reply, token);
          setRefreshTokenCookie(reply, refreshToken);

          return httpResponse.okMessage(reply, 'Authenticated');
        }

        return httpResponse.badRequestMessage(
          reply,
          'Missing authentication header',
        );
      } catch (error) {
        fastify.log.error(error);

        if (error instanceof BasicAuthError) {
          return httpResponse.badRequestMessage(
            reply,
            'Missing HTTP Header: "Authorization"',
            error,
          );
        }

        if (
          error instanceof UserByEmailNotFound ||
          error instanceof InvalidCreadentials
        ) {
          return httpResponse.forbiddenMessage(
            reply,
            'Invalid credentials',
            error,
          );
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  });

  fastify.route({
    url: '/logout',
    method: 'POST',
    handler: async (request, reply): Promise<void> => {
      try {
        const token = request.cookies[process.env.JWT_TOKEN_COOKIE_NAME];

        await fastify.services.auth.terminateSession(token);
        reply.clearCookie(process.env.JWT_TOKEN_COOKIE_NAME);
        reply.clearCookie(process.env.JWT_REFRESH_TOKEN_COOKIE_NAME);

        return httpResponse.okMessage(reply, 'Session Refreshed');
      } catch (error) {
        fastify.log.error(error);
        return httpResponse.internalServerError(reply, error);
      }
    },
  });

  fastify.route({
    url: '/refresh',
    method: 'POST',
    handler: async (request, reply): Promise<void> => {
      try {
        const currentToken =
          request.cookies[process.env.JWT_REFRESH_TOKEN_COOKIE_NAME];
        const token = await fastify.services.auth.refreshToken(currentToken);

        return httpResponse.okMessage(
          setTokenCookie(reply, token),
          'Session Refreshed',
        );
      } catch (error) {
        return httpResponse.internalServerError(reply, error);
      }
    },
  });

  done();
}

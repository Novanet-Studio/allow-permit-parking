import fp from 'fastify-plugin';

import AuthService from '../service/auth';
import LoggerService from '../service/logger';
import UserService from '../service/user';

import type { FastifyInstance, RegisterOptions } from 'fastify';
import type { IAuthService } from '../service/auth';
import type { ILoggerService } from '../service/logger';
import type { IUserService } from '../service/user';

export type Services = {
  auth: IAuthService;
  logger: ILoggerService;
  user: IUserService;
};

export default fp(
  async (
    fastify: FastifyInstance,
    _: RegisterOptions,
    next: (err?: Error) => void,
  ): Promise<void> => {
    const logger = new LoggerService(fastify.log);
    const user = new UserService(logger);
    const auth = new AuthService(logger, user);

    fastify.decorate('services', {
      auth,
      logger,
      user,
    });

    next();
  },
  {
    name: 'services',
    dependencies: ['mongoose'],
  },
);
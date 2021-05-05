import fastify, { FastifyInstance } from 'fastify';

import mongoPlugin from './plugins/mongo';
import nextPlugin from './plugins/next';
import routes from './routes';

export default async (): Promise<FastifyInstance> => {
  const server = fastify({
    logger: true,
  });

  await server.register(mongoPlugin);
  await server.register(routes);
  await server.register(nextPlugin);

  return server;
};

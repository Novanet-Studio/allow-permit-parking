import fp from 'fastify-plugin';
import mongo from 'mongoose';
import type { FastifyInstance } from 'fastify';
import type { PluginOptions } from 'fastify-plugin';

async function mongoose(
  fastify: FastifyInstance,
  _: PluginOptions,
  next: (err?: Error) => void,
) {
  fastify.decorate(
    'mongoose',
    mongo.connect('mongodb://localhost:27017/fastify-parking', {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  );

  next();
}

export default fp(mongoose, {
  fastify: '3.x',
  name: 'mongoose-fastify-plugin',
});

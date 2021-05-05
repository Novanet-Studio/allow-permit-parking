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
  const userSchema = new fastify.mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
  });

  const user = fastify.mongoose.model('User', userSchema);

  fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({
      message: 'This is an API Route!',
      hint:
        'Every request to api/v1 will be handled by Fastify without using the NextJS plugin',
    });
  });

  fastify.get(
    '/users',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return { message: await user.find() };
    },
  );

  done();
}

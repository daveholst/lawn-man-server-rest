const fastify = require('fastify')({
  logger: {
    prettyPrint: {
      translateTime: true,
      ignore: 'pid,hostname,reqId,responseTime,req,res',
      messageFormat: '{msg} [id={reqId} {req.method} {req.url}]',
    },
  },
});

const db = require('./config/dbConfig');

const PORT = process.env.PORT || 3001;

// fastify.get('/', async (request, reply) => {
//   return {message: test}
// })

fastify
  .register(require('fastify-cors'), {
    origin: '*',
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
  })
  .register(require('./routes/user'), { prefix: '/api/user' })
  .register(require('./routes/fertiliser'), { prefix: '/api/fert' })
  .register(require('fastify-jwt'), {
    secret: 'supersecret',
    sign: {
      expiresIn: '10h',
    },
  })
  .register(require('fastify-sensible'));

const start = async () => {
  try {
    await db.once('open', () => fastify.log.info('connected to database '));
    await fastify.listen(PORT, '0.0.0.0');
    // fastify.log.info(`server is running at ${address}`)
  } catch (error) {
    fastify.log.error(error);
  }
};

start();

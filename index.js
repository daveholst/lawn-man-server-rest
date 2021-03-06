require('dotenv').config();

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

// start mqtt client

fastify
  .register(require('fastify-cors'), {
    origin: '*',
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
  })
  .register(require('./routes/user'), { prefix: '/api/user' })
  .register(require('./routes/fertiliser'), { prefix: '/api/fert' })
  .register(require('./routes/prog'), { prefix: '/api/prog' })
  .register(require('fastify-jwt'), {
    // TODO move this out to a ENV variable
    secret: 'supersecret',
    sign: {
      expiresIn: '10h',
    },
  })
  .register(require('fastify-sensible'));

const start = async () => {
  try {
    await db.once('open', () => fastify.log.info('connected to database '));
    // TODO: Automate this for local dev env.?? use the .env?
    await fastify.listen(PORT, '0.0.0.0');
    // await fastify.listen(PORT);
    // fastify.log.info(`server is running at ${address}`)
  } catch (error) {
    fastify.log.error(error);
  }
};

start();

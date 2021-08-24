const fastify = require('fastify')({
  logger:true
})

const PORT = process.env.PORT || 3001;

// fastify.get('/', async (request, reply) => {
//   return {message: test}
// })

fastify.register(require('./routes/index'))


const start = async () => {
  try {
    await fastify.listen(PORT)
    fastify.log.info(`server is running at ${address}`)
  } catch (error) {
    fastify.log.error(error)
  }
}

start()
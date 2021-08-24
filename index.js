const fastify = require('fastify')({
  logger:true
})

const PORT = process.env.PORT || 3001;

// fastify.get('/', async (request, reply) => {
//   return {message: test}
// })

fastify.register(require('./routes/user/user'))


fastify.listen(PORT, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
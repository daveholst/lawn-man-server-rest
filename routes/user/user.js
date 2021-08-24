async function userRoutes(fastify, options) {
  fastify.get('/user', async (request, reply) => {
    return {message: 'hello user!'}
  })
}

module.exports = userRoutes
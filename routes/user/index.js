
module.exports = async function (fastify, options) {
  fastify.get('/login', loginHandler)
}

async function loginHandler(request, reply) {
  return {
    message: 'hello user!',
  }

}
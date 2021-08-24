const { User } = require('../../models')

module.exports = async function (fastify, options) {
  fastify.post('/login', loginHandler)
}

async function loginHandler(request, reply) {
  return {
    message: 'hello user!',
    body: request.body
  }

}
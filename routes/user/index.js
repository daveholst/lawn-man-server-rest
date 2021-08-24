const { User } = require('../../models')

module.exports = async function (fastify, options) {
  fastify.post('/login', loginHandler)

  async function loginHandler(request, reply) {
    const {email, password} = request.body
    try {
      const user = await User.findOne({ email })

      if (!user) {
        reply.send(new Error('No user with that email!'))
      }

      const isPwCorrect = await user.isCorrectPassword(password)
      if (!isPwCorrect) {
        reply.send(new Error('Wrong Password'))
      }

      // const token = fastify.jwt.sign()
      const token = fastify.jwt.sign({email})
      return {
        user: user,
        token
      }

    } catch (e) {
      fastify.log.error(e)
    }

  }
}

const { User } = require('../../models');

module.exports = async function (fastify, options) {
  async function loginHandler(request, reply) {
    const { password: loginPassword, email: loginEmail } = request.body;
    try {
      const user = await User.findOne({ email: loginEmail });
      const { email, _id } = user;

      if (!user) {
        reply.send(new Error('No user with that email!'));
      }

      const isPwCorrect = await user.isCorrectPassword(loginPassword);
      if (!isPwCorrect) {
        reply.send(new Error('Wrong Password'));
      }

      const token = await fastify.jwt.sign({ email, _id });
      return {
        user,
        token,
      };
    } catch (e) {
      fastify.log.error(e);
    }
  }

  async function getMeHandler(request, reply) {
    try {
      const validToken = await request.jwtVerify();

      if (validToken) {
        const result = await User.findOne({ _id: validToken._id });
        return result;
      }
      throw fastify.httpErrors.unauthorized();
    } catch (e) {
      fastify.log.error(e);
    }
  }

  async function signUpHandler(request, reply) {
    try {
      const newUserData = request.body;
      console.log(newUserData);
      const user = await User.create(newUserData);
      const { email, _id } = user;
      const token = await fastify.jwt.sign({ email, _id });
      return {
        user,
        token,
      };
    } catch (e) {
      fastify.log.error(e);
      throw fastify.httpErrors.badRequest(e);
    }
  }

  fastify.post('/login', loginHandler);
  fastify.post('/signup', signUpHandler);
  fastify.get('/me', getMeHandler);
};

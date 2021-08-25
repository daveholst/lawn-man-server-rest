const { User } = require('../../models');

module.exports = async function (fastify, options) {
  async function loginHandler(request, reply) {
    const { password: loginPassword, email: loginEmail } = request.body;
    console.log(request.body);
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

      // const token = fastify.jwt.sign()
      const token = fastify.jwt.sign({ email, _id });
      return {
        user,
        token,
      };
    } catch (e) {
      fastify.log.error(e);
    }
  }

  async function getMeHandler(request, reply) {
    // check token
    const isValidToken = await request.jwtVerify();
    console.log(isValidToken);

    if (isValidToken) {
      const result = await User.findOne({ _id: isValidToken._id });
      console.log(result);
      return result;
    }
  }

  fastify.post('/login', loginHandler);
  fastify.get('/me', getMeHandler);
};

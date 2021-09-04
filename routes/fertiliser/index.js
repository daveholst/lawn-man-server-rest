const { Fertiliser } = require('../../models');

module.exports = async function (fastify, options) {
  async function getFertilisersHandler(request, reply) {
    try {
      const validToken = await request.jwtVerify();
      if (validToken) {
        const result = await Fertiliser.find({});
        return result;
      }

      // throw fastify.httpErrors.unauthorized();
    } catch (e) {
      reply.send(e);
      fastify.log.error(e);
    }
  }

  fastify.get('/all', getFertilisersHandler);
};

const { Fertiliser } = require('../../models');

module.exports = async function (fastify, options) {
  // get all fertilisers from DB
  async function getFertilisersHandler(request, reply) {
    try {
      const validToken = await request.jwtVerify();
      if (validToken) {
        const result = await Fertiliser.find({});
        return result;
      }
    } catch (e) {
      reply.send(e);
      fastify.log.error(e);
    }
  }
  // routes
  fastify.get('/all', getFertilisersHandler);
};

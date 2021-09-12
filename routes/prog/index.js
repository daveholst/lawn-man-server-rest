const runManualProgram = require('../../utils/runManualProg');
const runManualFill = require('../../utils/fillTank');
const { User } = require('../../models');

module.exports = async function (fastify, options) {
  // run manual programme
  async function runManualProgramHandler(request, reply) {
    fastify.log.info(request.body);
    try {
      const validToken = await request.jwtVerify();
      if (validToken) {
        const { propertyId, fertRuntime, stationNumber } = request.body;
        const userResult = await User.findOne({ _id: validToken._id });
        // get the property info
        const property = userResult.properties.find(
          (el) => el.id === propertyId
        );
        // send it to the run manual program
        runManualProgram({
          property,
          stationNumber,
          fertRuntime,
        });
        reply.send({ property, stationNumber, fertRuntime });
      }
    } catch (e) {
      reply.send(e);
      fastify.log.error(e);
    }
  }
  async function runManualFillHandler(request, reply) {
    fastify.log.info(request.body);
    try {
      const validToken = await request.jwtVerify();
      if (validToken) {
        const { quantity } = request.body;
        const target = runManualFill(quantity);

        reply.send({ target });
      }
    } catch (e) {
      reply.send(e);
      fastify.log.error(e);
    }
  }
  // routes
  fastify.post('/manual', runManualProgramHandler);
  fastify.post('/fill', runManualFillHandler);
};

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

  async function addPropertyHandler(request, reply) {
    try {
      const newPropertyData = request.body;
      const validToken = await request.jwtVerify();
      if (validToken) {
        const user = await User.findOneAndUpdate(
          { _id: validToken._id },
          { $addToSet: { properties: newPropertyData } },
          { new: true, runValidators: true }
        );
        const { email, _id } = user;
        const token = await fastify.jwt.sign({ email, _id });
        return {
          user,
          token,
        };
      }
      throw fastify.httpErrors.unauthorized();
    } catch (e) {
      fastify.log.error(e);
    }
  }

  async function addZonesHandler(request, reply) {
    try {
      const newZoneData = request.body;
      const validToken = await request.jwtVerify();
      if (validToken) {
        const user = await User.findOneAndUpdate(
          {
            $and: [
              { _id: validToken._id },
              { 'properties.propertyName': newZoneData.propertyName },
            ],
          },
          { $addToSet: { 'properties.$.zones': { $each: newZoneData.zones } } },
          { new: true, runValidators: true }
        );
        const { email, _id } = user;
        const token = await fastify.jwt.sign({ email, _id });
        return { token, user };
      }
      throw fastify.httpErrors.unauthorized();
    } catch (e) {
      fastify.log.error(e);
    }
  }

  async function editZoneHandler(request, reply) {
    try {
      const newZoneData = request.body;
      const validToken = await request.jwtVerify();
      if (validToken) {
        const user = await User.findOneAndUpdate(
          {
            _id: validToken._id,
          },
          { $set: { 'properties.$[e1].zones.$[e2]': newZoneData.zoneData } },
          {
            arrayFilters: [
              { 'e1.propertyName': newZoneData.propertyName },
              { 'e2._id': newZoneData.zoneId },
            ],
          }
        );
        const { email, _id } = user;
        const token = await fastify.jwt.sign({ email, _id });
        return { token, user };
      }

      throw fastify.httpErrors.unauthorized();
    } catch (e) {
      fastify.log.error(e);
    }
  }

  fastify.get('/me', getMeHandler);
  fastify.post('/login', loginHandler);
  fastify.post('/signup', signUpHandler);
  fastify.post('/property', addPropertyHandler);
  fastify.post('/zones', addZonesHandler);
  fastify.put('/zones', editZoneHandler);
};

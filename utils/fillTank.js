const axios = require('axios').default;
// const mqttClient = require('./mqtt');
const mqttClient = require('../config/mqttConfig');
const { juiceBoxStatus } = require('./juiceBoxStatus');

// TODO this is hardcoded :(

function borePumpOn(time) {
  axios.get(`https://sprinklers.holst.solutions/cr`, {
    params: {
      pw: 'a6d82bced638de3def1e9bbb4983225c',
      t: `0,0,0,0,0,0,0,0,${time}`,
    },
  });
}

function fillTank(waterQty) {
  const targetWeight = juiceBoxStatus.tankWeight + waterQty;
  console.log(targetWeight);
  // start listening/ sub to changes in tankWeight
  borePumpOn('300'); // bore pump on for 60seconds??
  mqttClient.publish('juicebox1/relay2', 'on');

  const intID = setInterval(() => {
    if (juiceBoxStatus.tankWeight > targetWeight) {
      // stop valves
      mqttClient.publish('juicebox1/relay2', 'off');
      borePumpOn('0'); // bore pump on for 60seconds??

      clearInterval(intID);
    } else {
      console.log('still filling!');
    }
  }, 500);

  return targetWeight;
}

module.exports = fillTank;

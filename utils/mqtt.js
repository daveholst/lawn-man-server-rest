const mqtt = require('mqtt');

const juiceBoxStatus = {
  tankWeight: 0,
};

const mqttClient = mqtt.connect(process.env.MQTTSERVER || 'mqtt://10.104.0.3', {
  username: process.env.MQTTUSR,
  password: process.env.MQTTPWD,
});

mqttClient.subscribe('juicebox1/#');

mqttClient.on('message', (topic, msg) => {
  const msgString = msg.toString();
  console.log(msgString);
  juiceBoxStatus.tankWeight = Number(msgString);
});

module.exports = { juiceBoxStatus, mqttClient };

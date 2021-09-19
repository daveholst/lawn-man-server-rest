const mqtt = require('mqtt');

const mqttClient = mqtt.connect(process.env.MQTTSERVER || 'mqtt://10.104.0.3', {
  username: process.env.MQTTUSR,
  password: process.env.MQTTPWD,
});

module.exports = mqttClient;

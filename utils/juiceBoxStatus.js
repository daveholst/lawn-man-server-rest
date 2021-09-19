const mqttClient = require('../config/mqttConfig');

const juiceBoxStatus = {
  rawTankWeight: 0,
  calibrationOffset: 0,
  calibratedTankWeight() {
    return this.rawTankWeight + this.calibrationOffset;
  },
  flowRate: 0,
  lastUpdated: Date.now(),
};

const flowValues = [];

function flowCalculator(reading) {
  const currentTime = new Date();
  const readings = 4;
  // check if first start up and populate
  if (flowValues.length < readings) {
    flowValues.push({
      weight: reading,
      timeStamp: currentTime,
    });
    return undefined;
  }
  // drop the first/oldest data.
  flowValues.shift();
  flowValues.push({
    weight: reading,
    timeStamp: currentTime,
  });
  console.log(flowValues);
  // calculate the 'rolling' windowed? average/
  const averagesArray = [];
  for (let i = 0; i < flowValues.length - 1; i += 1) {
    const weightChange = flowValues[i + 1].weight - flowValues[i].weight;
    const timeChange =
      flowValues[i + 1].timeStamp.getTime() / 1000 -
      flowValues[i].timeStamp.getTime() / 1000;
    averagesArray.push((weightChange / timeChange) * 60);
    console.log('weight change: ', weightChange, 'time change: ', timeChange);
    console.log(averagesArray);
  }
  const averagesArraySum = averagesArray.reduce((a, b) => a + b, 0);
  const averagesArrayAverage = averagesArraySum / averagesArray.length;
  return Math.floor(averagesArrayAverage);
}

mqttClient.subscribe('juicebox1/#');

mqttClient.on('message', (topic, msg) => {
  const msgString = msg.toString();
  if (topic === 'juicebox1/tankWeight') {
    juiceBoxStatus.rawTankWeight = Number(msgString);
    juiceBoxStatus.lastUpdated = Date.now();
    console.log(
      'flow calc',
      flowCalculator(juiceBoxStatus.rawTankWeight),
      'mL / min'
    );
  }
});

module.exports = { juiceBoxStatus, mqttClient };

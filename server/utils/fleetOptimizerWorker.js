const { parentPort } = require("worker_threads");

const fleetOptimizerWorker = (vehicles, totalWaste) => {
  let maxUsage = 3;
  let pairs = [];
  for (let vehicle of vehicles) {
    let fuelCostPerCapacity =
      vehicle._doc.fuel_cost_loaded / vehicle._doc.capacity;
    pairs.push([
      fuelCostPerCapacity,
      vehicle._doc.vehicleId,
      vehicle._doc.capacity,
      0,
    ]);
  }
  pairs.sort((a, b) => {
    if (a[0] !== b[0]) {
      return a[0] - b[0];
    } else {
      return b[2] - a[2];
    }
  });
  let remainingWaste = totalWaste;
  let vehiclesUsed = [];
  while (remainingWaste > 0) {
    let foundVehicle = false;
    for (let i = 0; i < pairs.length; i++) {
      let [ratio, vehicleID, capacityOfVehicle, usageCount] = pairs[i];
      if (usageCount < maxUsage && remainingWaste > 0) {
        let wasteCarried = Math.min(remainingWaste, capacityOfVehicle);
        remainingWaste -= wasteCarried;
        vehiclesUsed.push(vehicleID);
        pairs[i] = [ratio, vehicleID, capacityOfVehicle, usageCount + 1];
        foundVehicle = true;
        break;
      }
    }
    if (!foundVehicle) {
      break;
    }
  }
  return vehiclesUsed;
};

parentPort.on("message", async (message) => {
  const { vehicles, totalWaste } = message;
  const usedVehicle = fleetOptimizerWorker(vehicles, totalWaste);
  parentPort.postMessage(usedVehicle);
});

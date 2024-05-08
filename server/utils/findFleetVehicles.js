const STSVehicle = require("../models/stsVehicleModel");
const Vehicle = require("../models/vehicleModel");

const findFleetVehicles = async (vehicleIds) => {
  try {
    const vehicleIdCounts = {};
    let finalVehicles = [];
    vehicleIds.forEach((vehicleId) => {
      vehicleIdCounts[vehicleId] = (vehicleIdCounts[vehicleId] || 0) + 1;
    });
    const uniqueVehicleIds = [...new Set(vehicleIds)];
    const vehicles = await Vehicle.find({
      vehicleId: { $in: uniqueVehicleIds },
    });
    vehicles.forEach((vehicle) => {
      const numTrip = vehicleIdCounts[vehicle.vehicleId] || 0;
      const vehicleWithNumTrip = { numTrip, ...vehicle.toObject() };
      finalVehicles.push(vehicleWithNumTrip);
    });

    return finalVehicles;
  } catch (err) {
    console.error("Error finding vehicles:", err);
    throw err;
  }
};

module.exports = findFleetVehicles;

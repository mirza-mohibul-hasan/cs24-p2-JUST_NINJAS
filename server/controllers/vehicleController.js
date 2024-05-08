const Vehicle = require("../models/vehicleModel");
const addVehicle = async (req, res) => {
  try {
    const vehicleId = req.body?.vehicleId;
    const addedBy = req.body?.addedBy;
    const capacity = req.body?.capacity;
    const fuel_cost_loaded = req.body?.fuel_cost_loaded;
    const fuel_cost_unloaded = req.body?.fuel_cost_unloaded;
    const registration_number = req.body?.registration_number;
    const type = req.body?.type;
    const query = { vehicleId: vehicleId };
    const existingVehicle = await Vehicle.findOne(query);
    if (existingVehicle) {
      return res.json({
        success: false,
        message: "VEHICLE ALREADY EXISTS",
      });
    } else {
      const vehicle = {
        vehicleId: vehicleId,
        capacity: capacity,
        fuel_cost_loaded: fuel_cost_loaded,
        fuel_cost_unloaded: fuel_cost_unloaded,
        registration_number: registration_number,
        type: type,
        addedBy: addedBy,
        regAt: new Date(),
      };
      const newVehicle = new Vehicle(vehicle);
      const result = await newVehicle.save();
      console.log(result);
      res.status(201).json({
        success: true,
        message: "Added Successfully",
      });
    }
  } catch (error) {
    console.error("Error Adding vehicle:", error);
    res.status(500).json({
      success: true,
      message: "An error occurred while creating the user",
    });
  }
};
module.exports = { addVehicle };

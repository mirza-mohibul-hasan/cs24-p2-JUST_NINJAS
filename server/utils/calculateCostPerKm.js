const calculateCostPerKm = async (
  weightOfWaste,
  capacity,
  fuel_cost_loaded,
  fuel_cost_unloaded
) => {
  if (weightOfWaste >= capacity) {
    return fuel_cost_loaded;
  } else if (weightOfWaste <= 0) {
    return fuel_cost_unloaded;
  } else {
    return (
      fuel_cost_unloaded +
      (weightOfWaste / capacity) * (fuel_cost_loaded - fuel_cost_unloaded)
    );
  }
};
module.exports = calculateCostPerKm;

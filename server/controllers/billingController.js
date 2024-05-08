const Billing = require("../models/billingModel");

const allBills = async (req, res) => {
  try {
    const bills = await Billing.find();
    res.send(bills);
  } catch (error) {
    console.error("Error Adding vehicle:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating",
    });
  }
};

module.exports = { allBills };

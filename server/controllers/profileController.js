const User = require("../models/userModel");
const getProfile = async (req, res) => {
  try {
    if (req.session?.user) {
      const user = req.session.user;
      delete user?.password;
      res.send({ loggedIn: true, user: user });
    } else {
      res.send({ loggedIn: false });
    }
  } catch (error) {
    console.error("Error logged in user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the user" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const newemail = req.body?.newemail;
    const newname = req.body?.newname;
    const newnid = req.body?.newnid;
    const newaddress = req.body?.newaddress;

    const userId = req.session?.user?._id;
    const email = req.session?.user?.email;
    const name = req.session?.user?.name;
    const nid = req.session?.user?.nid;
    const address = req.session?.user?.address;
    const updatedEmail = newemail ? newemail : email;
    const updatedName = newname ? newname : name;
    const updatedNid = newnid ? newnid : nid;
    const updatedAddress = newaddress ? newaddress : address;
    const query = { _id: userId };

    const user = await User.findOne(query);

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const update = {
      $set: {
        email: updatedEmail,
        name: updatedName,
        nid: updatedNid,
        address: updatedAddress,
      },
    };

    const result = await User.updateOne(query, update);

    if (result.modifiedCount === 1) {
      req.session.user.email = updatedEmail;
      req.session.user.name = updatedName;
      req.session.user.nid = updatedNid;
      req.session.user.address = updatedAddress;
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        updatedProfile: {
          email: updatedEmail,
          name: updatedName,
          nid: updatedNid,
          address: updatedAddress,
        },
      });
    } else {
      throw new Error("Failed to update user profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile" });
  }
};
module.exports = { getProfile, updateProfile };

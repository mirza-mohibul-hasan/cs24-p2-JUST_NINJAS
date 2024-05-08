const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const saltRound = 10;
const User = require("../models/userModel");
const STSManager = require("../models/stsmanagerModel");
const LandfillManager = require("../models/landfillmanagerModel");
const allUser = async (req, res) => {
  try {
    let filter = {};
    const searchTerm = req.query.search;
    if (searchTerm) {
      filter = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    let sort = {};
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder;
    if (sortBy && sortOrder) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const users = await User.find(filter).sort(sort);

    users.forEach((user) => {
      delete user.password;
    });
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const specificUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID parameter is missing" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addUser = async (req, res) => {
  try {
    const email = req.body?.email;
    const name = req.body?.name;
    const nid = req.body?.nid;
    const address = req.body?.address;
    const password = req.body?.password;
    const query = { email: email };
    const existingUser = await User.findOne(query);
    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    } else {
      const hash = await bcrypt.hash(password, saltRound);
      const filename = req.file ? req.file.filename : null;
      const user = {
        name: name,
        email: email,
        nid: nid,
        address: address,
        password: hash,
        role: "unassigned",
        createdAt: new Date(),
        avatar: filename,
      };
      const result = await User.create(user);
      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: true,
      message: "An error occurred while creating the user",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const newemail = req.body?.newemail;
    const newname = req.body?.newname;
    const newnid = req.body?.newnid;
    const newaddress = req.body?.newaddress;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is missing" });
    }
    if (newemail) {
      const existingUser = await User.findOne({ email: newemail });
      if (existingUser && existingUser._id.toString() !== id) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
    }
    const user = await User.findById(id);
    if (!user) {
      return res.json({ message: "User not found" });
    }
    if (req.session?.user?.role == "sysadmin" || req.session?.user?._id == id) {
      user.email = newemail || user.email;
      user.name = newname || user.name;
      user.nid = newnid || user.nid;
      user.address = newaddress || user.address;

      const updatedUser = await user.save();

      if (updatedUser) {
        return res.status(200).json({
          success: true,
          message: "Updated successfully",
        });
      } else {
        throw new Error("Failed to update user profile");
      }
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params?.id;
    if (!id) {
      return res.status(400).json({ error: "ID parameter is missing" });
    }
    await STSManager.updateOne({ managers: id }, { $pull: { managers: id } });
    await LandfillManager.updateOne(
      { managers: id },
      { $pull: { managers: id } }
    );

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const deletionResult = await User.deleteOne({ _id: id });
    console.log(deletionResult);
    if (deletionResult) {
      const filename = user.avatar;
      if (filename) {
        const filePath = path.join(__dirname, "../profilepic", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn(`Avatar file ${filePath} not found, skipping deletion.`);
        }
      }
      return res.json({ success: true, message: "User deleted successfully" });
    } else {
      return res.json({ success: false, message: "User deleted failed" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const userRoles = async (req, res) => {
  try {
    const users = await User.find({}, "_id role");
    res.json(users);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateRole = async (req, res) => {
  try {
    const id = req.params?.id;
    const newRole = req.body.newRole;
    const oldRole = req.body.oldRole;
    if (!newRole || !oldRole) {
      return res.json({
        success: false,
        message: "Role is missing",
      });
    }
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID parameter is missing" });
    }
    if (oldRole === "stsmanager") {
      const result = await STSManager.updateOne(
        { managers: id },
        { $pull: { managers: id } }
      );

      if (result.modifiedCount === 0) {
        console.log("User was not found in stsmanagers collection.");
      } else {
        console.log("User removed from stsmanagers collection.");
      }
    }
    if (oldRole === "landmanager") {
      const result = await LandfillManager.updateOne(
        { managers: id },
        { $pull: { managers: id } }
      );

      if (result.modifiedCount === 0) {
        console.log("User was not found in Land managers collection.");
      } else {
        console.log("User removed from Landmanagers collection.");
      }
    }
    const query = { _id: id };
    const update = { $set: { role: newRole } };

    const result = await User.updateOne(query, update);

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Role update failed" });
    }
    res.json({ success: true, message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  allUser,
  specificUser,
  addUser,
  updateUser,
  deleteUser,
  userRoles,
  updateRole,
};

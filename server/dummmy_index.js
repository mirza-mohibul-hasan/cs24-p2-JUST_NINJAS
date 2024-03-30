const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    },
  })
);
// JWT Verification
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.send({
      success: false,
      message: "We need a token, please give it to us next time",
    });
  } else {
    const token = authorization.split(" ")[1];
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        console.log(err);
        res.json({ auth: false, message: "Auth Failed" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};
const verifyAdmin = (req, res, next) => {
  const user = req.session?.user;
  if (!user) {
    return res.json({
      success: false,
      message: "User not authenticated",
    });
  }
  if (user?.role !== "sysadmin") {
    return res.json({
      success: false,
      message: "Access forbidden. Admin role required",
    });
  }
  next();
};

// Mongo start here
const uri =
  "mongodb+srv://ecoSyncAdmin:XGIDfiEREF6zaDju@cluster0.clbkfrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    /* Working Zone Start */
    // Collections
    const saltRound = 10;
    const db = client.db("ecoSyncDB");
    const userCollection = db.collection("users");
    const roleCollection = db.collection("roles");
    const vehicleCollection = db.collection("vehicles");
    const stsCollection = db.collection("sts");
    const stsmanagerCollection = db.collection("stsmanager");
    const stsVehicleCollection = db.collection("sts_vehicles");
    const stsVehicleEntryCollection = db.collection("sts_vehicle_entry");
    const landfillManagerCollection = db.collection("landfill_with_managers");
    const landfieldVehicleEntryCollection = db.collection(
      "landfield_vehicle_entry"
    );
    const landfillCollection = db.collection("landfill");
    /* Common API */
    app.get("/rbac/roles", verifyJWT, async (req, res) => {
      try {
        const email = req.session?.user?.email;
        const query = { email: email };
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
          res.send({ role: existingUser?.role });
        }
      } catch (error) {
        console.error("Permission Denied:", error);
        res.status(500).json({
          message: "Permission Denied",
        });
      }
    });
    app.post("/rbac/roles", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const role = req.body?.role;
        if (!role) {
          return res.json({ success: false, message: "Role is required" });
        }
        const query = { role: role };
        const existRole = await roleCollection.findOne(query);
        if (existRole) {
          return res.json({ success: false, message: "Role already exists" });
        }
        const result = await roleCollection.insertOne(req.body);
        if (result.insertedId) {
          return res.status(201).json({
            success: true,
            message: "Role created successfully",
            roleId: result.insertedId,
          });
        } else {
          return res
            .status(500)
            .json({ success: false, message: "Failed to get inserted ID" });
        }
      } catch (error) {
        console.error("Failed creating role:", error);
        res.status(500).json({
          message: "Failed creating role",
        });
      }
    });
    /* Users related api */
    // Create a user
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "profilepic"));
      },
      filename: function (req, file, cb) {
        const timestamp = Date.now();
        const userEmail = req.body.email;
        const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, "");
        const extension = path.extname(file.originalname);
        const filename = `${sanitizedEmail}_${timestamp}${extension}`;
        cb(null, filename);
      },
    });
    const fileFilter = function (req, file, cb) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"), false);
      }
    };
    const upload = multer({ storage: storage, fileFilter: fileFilter });
    app.post(
      "/auth/create",
      verifyJWT,
      verifyAdmin,
      upload.single("avatar"),
      async (req, res) => {
        try {
          const email = req.body?.email;
          const name = req.body?.name;
          const nid = req.body?.nid;
          const address = req.body?.address;
          const password = req.body?.password;
          const avatar = req.file;
          const query = { email: email };
          const existingUser = await userCollection.findOne(query);
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
            const result = await userCollection.insertOne(user);
            res.status(201).json({
              success: true,
              message: "User created successfully",
              userId: result.insertedId,
            });
          }
        } catch (error) {
          console.error("Error creating user:", error);
          res.status(500).json({
            success: true,
            message: "An error occurred while creating the user",
          });
        }
      }
    );
    /* Login Logout Related API */
    app.post("/auth/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const existingUser = await userCollection.findOne({ email });
        if (existingUser?.role === "unassigned") {
          return res.json({
            success: false,
            message: "You don't have permission to Login",
          });
        }
        if (existingUser) {
          bcrypt.compare(password, existingUser.password, (error, response) => {
            if (error) {
              console.log("Login error in bcrypt", error);
              return res.status(500).json({ message: "Internal server error" });
            }
            if (response) {
              const id = existingUser._id.toString();
              const token = jwt.sign({ id }, "jwtSecret", {
                expiresIn: "24h",
              });
              req.session.user = existingUser;
              res.status(200).json({
                success: true,
                token: token,
                message: "User Login successfully",
              });
            } else {
              res.json({
                success: false,
                message: "Wrong password",
              });
            }
          });
        } else {
          res.json({ success: false, message: "User not found" });
        }
      } catch (error) {
        console.error("Error logging in user:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    app.get("/auth/logout", (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          res.send({ success: false, message: "Logout Failed" });
        } else {
          res.clearCookie("userId");
          res.json({ success: true, message: "Logout successful" });
        }
      });
    });
    // Reset Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "ecosyncninjas@gmail.com",
        pass: "fsvc bqpe jwni aspz",
      },
    });
    const generateOTP = () => {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const otpTimestamp = Date.now();
      return { otp, otpTimestamp };
    };
    app.post("/auth/reset-password/initiate", async (req, res) => {
      const email = req.body?.email;
      const existingUser = await userCollection.findOne({ email });
      if (!existingUser) {
        return res.json({ success: false, message: "User not found" });
      }
      const { otp, otpTimestamp } = generateOTP();
      // console.log(otp, otpTimestamp);
      req.session.resetEmail = email;
      req.session.otp = otp;
      req.session.otpTimestamp = otpTimestamp;
      console.log(req.session);
      const mailOptions = {
        from: "ecosyncninjas@gmail.com",
        to: email,
        subject: "EcoSync password reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res
            .status(500)
            .json({ success: false, message: "Failed to send OTP email" });
        } else {
          console.log("Email sent: " + info.response);
          // console.log(req.session);
          res.json({ success: true, message: "OTP sent successfully" });
        }
      });
    });
    app.post("/auth/reset-password/confirm", async (req, res) => {
      const { resetEmail, otp: storedOTP, otpTimestamp } = req.session;
      const newPassword = req.body?.newpasssword;
      const currentTime = Date.now(); // Current time in milliseconds
      const timeDifference = currentTime - otpTimestamp;
      const timeThreshold = 60 * 1000;
      if (timeDifference > timeThreshold) {
        delete req.session.resetEmail;
        delete req.session.otp;
        delete req.session.otpTimestamp;
        return res.json({ success: false, message: "OTP has expired" });
      }
      if (resetEmail === req.body?.email && storedOTP === req.body?.otp) {
        try {
          const hash = await bcrypt.hash(newPassword, saltRound);
          const result = await userCollection.updateOne(
            { email: resetEmail },
            { $set: { password: hash } }
          );

          if (result.modifiedCount === 0) {
            return res.json({
              success: false,
              message: "Password reset failed",
            });
          }

          delete req.session.resetEmail;
          delete req.session.otp;

          return res
            .status(200)
            .json({ success: true, message: "Password reset successful" });
        } catch (error) {
          console.error("Error updating password:", error);
          return res
            .status(500)
            .json({ success: false, message: "Error updating password" });
        }
      } else {
        return res.json({ success: false, message: "Invalid email or OTP" });
      }
    });
    app.put("/auth/change-password", async (req, res) => {
      try {
        const oldpassword = req.body?.oldpassword;
        const newpassword = req.body?.newpassword;
        const email = req.session?.user?.email;
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          const match = await bcrypt.compare(
            oldpassword,
            existingUser.password
          );
          if (match) {
            const hash = await bcrypt.hash(newpassword, saltRound);
            const result = await userCollection.updateOne(
              { email: email },
              { $set: { password: hash } }
            );

            if (result.modifiedCount === 0) {
              return res.json({
                success: false,
                message: "Password change failed",
              });
            }
            req.session.user.password = hash;
            return res
              .status(200)
              .json({ success: true, message: "Password change successful" });
          } else {
            return res.json({
              success: false,
              message: "Old password is incorrect",
            });
          }
        } else {
          res.json({ success: false, message: "User not found" });
        }
      } catch (error) {
        console.error("Error changing password:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    /* User Management Endpoints */
    app.get("/profilepic/:imageName", (req, res) => {
      const imageName = req.params.imageName;
      const imagePath = `profilepic/${imageName}`;

      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          res.status(404).send("File not found");
        } else {
          const readStream = fs.createReadStream(imagePath);
          readStream.pipe(res);
        }
      });
    });
    app.get("/users", async (req, res) => {
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

        const users = await userCollection.find(filter).sort(sort).toArray();

        users.forEach((user) => {
          delete user.password;
        });

        res.send(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    // User roles
    app.get("/users/roles", async (req, res) => {
      try {
        const roles = await roleCollection.find().toArray();
        res.status(200).json(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/users/:id", async (req, res) => {
      // console.log("Single User details");
      try {
        const id = req.params.id;
        if (!id) {
          return res.status(400).json({ error: "ID parameter is missing" });
        }
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID parameter" });
        }
        const query = { _id: new ObjectId(id) };
        const user = await userCollection.findOne(query);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        delete user.password;
        res.json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.delete("/users/:id", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const id = req.params?.id;
        if (!id) {
          return res.status(400).json({ error: "ID parameter is missing" });
        }
        const result1 = await stsmanagerCollection.updateOne(
          { managers: id },
          { $pull: { managers: id } }
        );
        const result2 = await landfillManagerCollection.updateOne(
          { managers: id },
          { $pull: { managers: id } }
        );

        const query = { _id: new ObjectId(id) };
        const user = await userCollection.findOne(query);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const profilePicFilename = user.avatar;
        await userCollection.deleteOne(query);
        const filename = user.avatar;
        if (filename) {
          fs.unlinkSync(path.join(__dirname, "profilepic", filename));
        }
        res.json({ success: true, message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.put("/users/:userId", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const newemail = req.body?.newemail;
        const newname = req.body?.newname;
        const newnid = req.body?.newnid;
        const newaddress = req.body?.newaddress;

        const userId = req.params.userId;
        const query = { _id: new ObjectId(userId) };

        const user = await userCollection.findOne(query);

        if (!user) {
          return res.json({ message: "User not found" });
        }
        const email = user?.email;
        const name = user?.name;
        const nid = user?.nid;
        const address = user?.address;

        const updatedEmail = newemail ? newemail : email;
        const updatedName = newname ? newname : name;
        const updatedNid = newnid ? newnid : nid;
        const updatedAddress = newaddress ? newaddress : address;

        const update = {
          $set: {
            email: updatedEmail,
            name: updatedName,
            nid: updatedNid,
            address: updatedAddress,
          },
        };

        const result = await userCollection.updateOne(query, update);

        if (result.modifiedCount === 1) {
          return res.status(200).json({
            success: true,
            message: "Updated successfully",
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
    });
    // verifyJWT, verifyAdmin,
    app.put("/users/:id/roles", async (req, res) => {
      try {
        const id = req.params?.id;
        const newRole = req.body.newRole;
        const oldRole = req.body.oldRole;
        console.log(id, oldRole, newRole);
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
          const result = await stsmanagerCollection.updateOne(
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
          const result = await landfillManagerCollection.updateOne(
            { managers: id },
            { $pull: { managers: id } }
          );

          if (result.modifiedCount === 0) {
            console.log("User was not found in stsmanagers collection.");
          } else {
            console.log("User removed from stsmanagers collection.");
          }
        }
        const query = { _id: new ObjectId(id) };
        const update = { $set: { role: newRole } };

        const result = await userCollection.updateOne(query, update);

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
    });

    /* Profile Management Endpoints */
    app.get("/profile", async (req, res) => {
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
    });
    app.put("/profile", async (req, res) => {
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
        const query = { _id: new ObjectId(userId) };

        const user = await userCollection.findOne(query);

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

        const result = await userCollection.updateOne(query, update);

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
    });

    /* Data Entry Endpoints */
    // create vehicle
    app.post("/vehicle/add", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const vehicleId = req.body?.vehicleId;
        const addedBy = req.body?.addedBy;
        const capacity = req.body?.capacity;
        const fuel_cost_loaded = req.body?.fuel_cost_loaded;
        const fuel_cost_unloaded = req.body?.fuel_cost_unloaded;
        const registration_number = req.body?.registration_number;
        const type = req.body?.type;
        const query = { vehicleId: vehicleId };
        const existingVehicle = await vehicleCollection.findOne(query);
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
          const result = await vehicleCollection.insertOne(vehicle);
          res.status(201).json({
            success: true,
            message: "Added Successfully",
            userId: result.insertedId,
          });
        }
      } catch (error) {
        console.error("Error Adding vehicle:", error);
        res.status(500).json({
          success: true,
          message: "An error occurred while creating the user",
        });
      }
    });
    app.post("/sts/add", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const stsId = req.body?.stsId;
        const addedBy = req.body?.addedBy;
        const capacity = req.body?.capacity;
        const latitude = req.body?.latitude;
        const longitude = req.body?.longitude;
        const ward_num = req.body?.ward_num;
        const query = { stsId: stsId };
        // const existingSts = await stsCollection.findOne(query);
        // if (existingVehicle) {
        //   return res.json({
        //     success: false,
        //     message: "VEHICLE ALREADY EXISTS",
        //   });
        // } else {
        const sts = {
          stsId: stsId,
          capacity: capacity,
          latitude: latitude,
          longitude: longitude,
          ward_num: ward_num,
          addedBy: addedBy,
          regAt: new Date(),
        };
        const result = await stsCollection.insertOne(sts);
        res.status(201).json({
          success: true,
          message: "Added Successfully",
          userId: result.insertedId,
        });
        // }
      } catch (error) {
        console.error("Error Adding vehicle:", error);
        res.status(500).json({
          success: true,
          message: "An error occurred while creating the user",
        });
      }
    });
    app.post("/landfill/add", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const landfillId = req.body?.landFillId;
        const addedBy = req.body?.addedBy;
        const capacity = req.body?.capacity;
        const latitude = req.body?.latitude;
        const longitude = req.body?.longitude;
        const starttime = req.body?.starttime;
        const endtime = req.body?.endtime;
        const areaName = req.body?.areaName;
        const landfill = {
          landfillId: landfillId,
          capacity: capacity,
          latitude: latitude,
          longitude: longitude,
          starttime: starttime,
          endtime: endtime,
          addedBy: addedBy,
          areaName: areaName,
          regAt: new Date(),
        };
        const result = await landfillCollection.insertOne(landfill);
        res.status(201).json({
          success: true,
          message: "Added Successfully",
        });
        // }
      } catch (error) {
        console.error("Error Adding vehicle:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while creating the user",
        });
      }
    });
    // All STS
    app.get("/sts", async (req, res) => {
      try {
        const sts = await stsCollection.find().toArray();
        res.send(sts);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/stsmanager", async (req, res) => {
      const result = await stsmanagerCollection.find().toArray();
      res.send(result);
    });
    // const { ObjectId } = require("mongodb"); // Import ObjectId from MongoDB package

    app.get("/assignedstsmanager/:stsId", async (req, res) => {
      try {
        const result = await stsmanagerCollection.findOne({
          stsId: req.params.stsId,
        });
        if (!result) {
          return res.send([]);
        }
        const managerIds = result.managers;
        const managerObjectIds = managerIds.map(
          (managerId) => new ObjectId(managerId)
        );
        const managersInfo = await userCollection
          .find({ _id: { $in: managerObjectIds } })
          .toArray();

        res.send(managersInfo);
      } catch (error) {
        console.error("Error fetching manager information:", error);
        res.status(500).send("Internal server error");
      }
    });
    app.get("/availablestsmanager", async (req, res) => {
      try {
        const users = await userCollection
          .find({ role: "stsmanager" })
          .toArray();
        const userIds = users.map((user) => user._id);
        let managerIds = [];
        await stsmanagerCollection.find().forEach((doc) => {
          managerIds = [...managerIds, ...doc.managers];
        });
        const managerObjectIds = managerIds.map(
          (managerId) => new ObjectId(managerId)
        );
        const managersNotInStsManager = await userCollection
          .find({ _id: { $nin: managerObjectIds }, role: "stsmanager" })
          .toArray();

        res.send(managersNotInStsManager);
      } catch (error) {
        console.error(
          "Error fetching stsmanagers not in stsmanagerCollection:",
          error
        );
        res.status(500).send("Internal server error");
      }
    });

    // check manager or not
    app.get("/sts/manager-info/:managerId", async (req, res) => {
      const managerId = req.params.managerId;
      try {
        const managerExists = await stsmanagerCollection.findOne({
          managers: managerId,
        });
        res.send(managerExists);
      } catch (error) {
        console.error("Error checking manager ID:", error);
        res.status(500).send("Internal server error");
      }
    });
    // assign manager to sts
    app.post("/sts/assign-manager", async (req, res) => {
      const stsId = req.body.stsId;
      const managerId = req.body.managerId;
      const query = { stsId: stsId };
      const existing = await stsmanagerCollection.findOne(query);
      if (existing) {
        const result = await stsmanagerCollection.updateOne(
          { stsId: stsId },
          { $addToSet: { managers: managerId } }
        );
        res.send({
          success: true,
          message: "Manager added successfully.",
          result,
        });
      } else {
        const result = await stsmanagerCollection.insertOne({
          stsId: stsId,
          managers: [managerId],
        });
        res.send({
          success: true,
          message: "Manager added successfully.",
          result,
        });
      }
    });
    // Remove a manager from sts
    app.delete("/sts/remove-manager", async (req, res) => {
      const { stsId, managerId } = req.body;
      // console.log(stsId, managerId);
      try {
        const stsExists = await stsmanagerCollection.findOne({ stsId: stsId });
        if (!stsExists) {
          return res.send({ message: "STS not found." });
        }
        const updatedSTS = await stsmanagerCollection.updateOne(
          { stsId: stsId },
          { $pull: { managers: managerId } }
        );

        res.status(200).send({
          success: true,
          message: "Manager removed successfully.",
          updatedSTS,
        });
      } catch (error) {
        console.error("Error removing manager ID:", error);
        res.status(500).send("Internal server error");
      }
    });

    /* Dataentry Endpoints => STS Vehicle Mangement */

    app.get("/sts/vehicles", async (req, res) => {
      const result = await stsVehicleCollection.find().toArray();
      res.send(result);
    });
    // co
    app.get("/sts/assigned-vehicle/:stsId", async (req, res) => {
      try {
        const result = await stsVehicleCollection.findOne({
          stsId: req.params.stsId,
        });
        if (!result) {
          return res.send([]);
        }
        const vehivleIds = result.vehicles;
        const vehiclesInfo = await vehicleCollection
          .find({ vehicleId: { $in: vehivleIds } })
          .toArray();

        res.send(vehiclesInfo);
      } catch (error) {
        console.error("Error fetching Vehicle information:", error);
        res.status(500).send("Internal server error");
      }
    });
    app.get("/sts/available-vehicles", async (req, res) => {
      try {
        const vehicles = await vehicleCollection.find().toArray();
        let vehiclesIds = [];
        await stsVehicleCollection.find().forEach((doc) => {
          vehiclesIds = [...vehiclesIds, ...doc.vehicles];
        });
        const vehiclessNotInStsVehicles = await vehicleCollection
          .find({ vehicleId: { $nin: vehiclesIds } })
          .toArray();

        res.send(vehiclessNotInStsVehicles);
      } catch (error) {
        console.error(
          "Error fetching stsmanagers not in stsmanagerCollection:",
          error
        );
        res.status(500).send("Internal server error");
      }
    });
    // assign Vehicle to sts
    app.post("/sts/assign-vehicle", async (req, res) => {
      const stsId = req.body.stsId;
      const vehicleId = req.body.vehicleId;
      const query = { stsId: stsId };
      const existing = await stsVehicleCollection.findOne(query);
      if (existing) {
        const result = await stsVehicleCollection.updateOne(
          { stsId: stsId },
          { $addToSet: { vehicles: vehicleId } }
        );
        res.send({
          success: true,
          message: "Manager added successfully.",
          result,
        });
      } else {
        const result = await stsVehicleCollection.insertOne({
          stsId: stsId,
          vehicles: [vehicleId],
        });
        res.send({
          success: true,
          message: "Vehicle added successfully.",
          result,
        });
      }
    });
    // // Remove a vehicle from sts
    app.delete("/sts/remove-vehicle", async (req, res) => {
      const { stsId, vehicleId } = req.body;
      // console.log(stsId, managerId);
      try {
        const stsExists = await stsVehicleCollection.findOne({ stsId: stsId });
        if (!stsExists) {
          return res.send({ message: "STS not found." });
        }
        const updatedSTS = await stsVehicleCollection.updateOne(
          { stsId: stsId },
          { $pull: { vehicles: vehicleId } }
        );

        res.status(200).send({
          success: true,
          message: "Vehicle removed successfully.",
          updatedSTS,
        });
      } catch (error) {
        console.error("Error removing manager ID:", error);
        res.status(500).send("Internal server error");
      }
    });

    /* Data Entry Endpoints => Manage Landfill */

    app.get("/landfill/all-landfill", async (req, res) => {
      try {
        const landfill = await landfillCollection.find().toArray();
        res.send(landfill);
      } catch (error) {
        console.error("Error fetching Landfill:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/landfill/all-landfill-manager", async (req, res) => {
      const result = await landfillManagerCollection.find().toArray();
      res.send(result);
    });
    // const { ObjectId } = require("mongodb"); // Import ObjectId from MongoDB package

    app.get(
      "/landfill/assigned-landfill-manager/:landfillId",
      async (req, res) => {
        try {
          const result = await landfillManagerCollection.findOne({
            landfillId: req.params.landfillId,
          });
          if (!result) {
            return res.send([]);
          }
          const managerIds = result.managers;
          const managerObjectIds = managerIds.map(
            (managerId) => new ObjectId(managerId)
          );
          const managersInfo = await userCollection
            .find({ _id: { $in: managerObjectIds } })
            .toArray();

          res.send(managersInfo);
        } catch (error) {
          console.error("Error fetching manager information:", error);
          res.status(500).send("Internal server error");
        }
      }
    );
    app.get("/landfill/available-landfill-manager", async (req, res) => {
      try {
        const users = await userCollection
          .find({ role: "landmanager" })
          .toArray();
        const userIds = users.map((user) => user._id);
        let managerIds = [];
        await landfillManagerCollection.find().forEach((doc) => {
          managerIds = [...managerIds, ...doc.managers];
        });
        const managerObjectIds = managerIds.map(
          (managerId) => new ObjectId(managerId)
        );
        const managersNotInLandfillManager = await userCollection
          .find({ _id: { $nin: managerObjectIds }, role: "landmanager" })
          .toArray();

        res.send(managersNotInLandfillManager);
      } catch (error) {
        console.error(
          "Error fetching landmanager not in landmanagerCollection:",
          error
        );
        res.status(500).send("Internal server error");
      }
    });

    // // check landfill manager or not
    app.get("/landfill/manager-info/:managerId", async (req, res) => {
      const managerId = req.params.managerId;
      try {
        const managerInfo = await landfillManagerCollection.findOne({
          managers: managerId,
        });
        const landfillInfo = await landfillCollection.findOne({
          landfillId: managerInfo.landfillId,
        });
        res.send({ managerInfo, landfillInfo });
      } catch (error) {
        console.error("Error checking manager ID:", error);
        res.status(500).send("Internal server error");
      }
    });
    // assign manager to sts
    app.post("/landfil/assign-manager", async (req, res) => {
      const landfillId = req.body.landfillId;
      const managerId = req.body.managerId;
      const query = { landfillId: landfillId };
      const existing = await landfillManagerCollection.findOne(query);
      if (existing) {
        const result = await landfillManagerCollection.updateOne(
          { landfillId: landfillId },
          { $addToSet: { managers: managerId } }
        );
        res.send({
          success: true,
          message: "Manager added successfully.",
          result,
        });
      } else {
        const result = await landfillManagerCollection.insertOne({
          landfillId: landfillId,
          managers: [managerId],
        });
        res.send({
          success: true,
          message: "Manager added successfully.",
          result,
        });
      }
    });
    // // Remove a manager from sts
    app.delete("/landfill/remove-manager", async (req, res) => {
      const { landfillId, managerId } = req.body;
      // console.log(landfillId, managerId);
      try {
        const landfilExists = await landfillManagerCollection.findOne({
          landfillId: landfillId,
        });
        if (!landfilExists) {
          return res.send({ message: "Landfill not found." });
        }
        const updatedLandfill = await landfillManagerCollection.updateOne(
          { landfillId: landfillId },
          { $pull: { managers: managerId } }
        );

        res.status(200).send({
          success: true,
          message: "Manager removed successfully.",
          updatedLandfill,
        });
      } catch (error) {
        console.error("Error removing manager ID:", error);
        res.status(500).send("Internal server error");
      }
    });

    /* STS MANAGERS WORKS */
    app.post("/sts-manager/add-entry", async (req, res) => {
      try {
        const stsId = req.body?.stsId;
        const timeOfArrival = req.body?.timeOfArrival;
        const timeOfDeparture = req.body?.timeOfDeparture;
        const vehicleId = req.body?.vehicleId;
        const weightOfWaste = req.body?.weightOfWaste;
        const stsEntryId = req.body?.stsEntryId;
        const addedBy = req.body?.addedBy;
        const newEntry = {
          vehicleId: vehicleId,
          stsId: stsId,
          timeOfArrival: timeOfArrival,
          timeOfDeparture: timeOfDeparture,
          weightOfWaste: weightOfWaste,
          stsEntryId: stsEntryId,
          addedBy: addedBy,
          regAt: new Date(),
        };
        const result = await stsVehicleEntryCollection.insertOne(newEntry);
        res.status(201).json({
          success: true,
          message: "Added Successfully",
        });
      } catch (error) {
        console.error("Error Adding vehicle:", error);
        res.status(500).json({
          success: true,
          message: "An error occurred while creating the user",
        });
      }
    });
    app.post("/landfill-manager/add-entry", async (req, res) => {
      try {
        const landfillId = req.body?.landfillId;
        const timeOfArrival = req.body?.timeOfArrival;
        const timeOfDeparture = req.body?.timeOfDeparture;
        const weightOfWaste = req.body?.weightOfWaste;
        const landfillEntryId = req.body?.landfillEntryId;
        const addedBy = req.body?.addedBy;
        const newEntry = {
          landfillId: landfillId,
          timeOfArrival: timeOfArrival,
          timeOfDeparture: timeOfDeparture,
          weightOfWaste: weightOfWaste,
          landfillEntryId: landfillEntryId,
          addedBy: addedBy,
          regAt: new Date(),
        };
        const result = await landfieldVehicleEntryCollection.insertOne(
          newEntry
        );
        res.status(201).json({
          success: true,
          message: "Added Successfully",
        });
      } catch (error) {
        console.error("Error Adding vehicle:", error);
        res.status(500).json({
          success: true,
          message: "An error occurred while creating the user",
        });
      }
    });
    /* Working Zone End */
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    /* await client.close(); */
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("EcoSync is currently running");
});
app.listen(port, () => {
  console.log(`EcoSync Server is running on port ${port}`);
});

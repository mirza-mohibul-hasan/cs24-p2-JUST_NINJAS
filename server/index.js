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
    app.get("/auth/loginstatus", async (req, res) => {
      // debug
      // console.log("Session", req.session);
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
      const readStream = fs.createReadStream(`profilepic/${imageName}`);
      readStream.pipe(res);
    });
    app.get("/users", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        let filter = {};

        // Search functionality
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

    app.get("/users/:id", async (req, res) => {
      try {
        const id = req.params?.id;
        console.log(id);
        if (!id) {
          return res.json({ error: "ID parameter is missing" });
        }
        const query = { _id: new ObjectId(id) };
        const user = await userCollection.findOne(query);
        if (!user) {
          return res.status(401).json({ message: "user Not found" });
        }
        delete user?.password;
        res.json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
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

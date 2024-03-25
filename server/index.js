const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    /* Users related api */
    // Create a user
    app.post("/auth/create", async (req, res) => {
      try {
        const email = req.body?.email;
        const password = req.body?.password;
        const query = { email: email };
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
          return res.json({ message: "Email already exists" });
        } else {
          bcrypt.hash(password, saltRound, (err, hash) => {
            if (err) {
              console.log("Register Error in bcrypt", err);
            }
            const result = userCollection.insertOne({
              email: email,
              password: hash,
              role: "sysadmin",
            });
            res.status(201).json({
              message: "User created successfully",
              userId: result.insertedId,
            });
          });
        }
      } catch (error) {
        console.error("Error creating user:", error);
        res
          .status(500)
          .json({ message: "An error occurred while creating the user" });
      }
    });
    app.post("/auth/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const existingUser = await userCollection.findOne({ email });
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
              console.log(existingUser);
              res.status(200).json({
                success: true,
                token: token,
                message: "User Login successfully",
              });
            } else {
              res.status(401).json({
                success: false,
                message: "Wrong username or password",
              });
            }
          });
        } else {
          res.status(404).json({ success: false, message: "User not found" });
        }
      } catch (error) {
        console.error("Error logging in user:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    app.get("/auth/logout", (req, res) => {
      console.log("Log out pressed");
      req.session.destroy((err) => {
        if (err) {
          res.status(500).send({ message: "Logout Failed" });
        } else {
          res.clearCookie("userId");
          res.json({ message: "Logout successful" });
        }
      });
    });
    app.get("/auth/loginstatus", async (req, res) => {
      console.log("Session", req.session);
      console.log("USer", req.session.user);
      try {
        if (req.session?.user) {
          res.send({ loggedIn: true, user: req.session.user });
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

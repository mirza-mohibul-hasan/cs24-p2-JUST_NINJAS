const jwt = require("jsonwebtoken");
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

module.exports = verifyJWT;

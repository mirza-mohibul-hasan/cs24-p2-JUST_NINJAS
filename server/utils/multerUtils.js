const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../profilepic"));
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

module.exports = { storage, fileFilter, upload };

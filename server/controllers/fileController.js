const fs = require("fs");
const getProfileImage = (req, res) => {
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
};
module.exports = { getProfileImage };

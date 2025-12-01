const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, "uploads/images/");
    } else {
      cb(null, "uploads/videos/");
    }
  },
  filename: (req, file, cb) => {
    // Save the file with original name
    cb(null, Date.now() + "-" + file.originalname);
  }
});

exports.upload = multer({
  storage
});

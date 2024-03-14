const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profile") {
      cb(null, './uploads/profiles/') // Specify the destination directory for uploaded file for profile
    }
    if (file.fieldname === "blog") {
      cb(null, "uploads/blogs/"); // Specify the destination directory for uploaded files
    }
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + "_" + file.originalname); // Use the original file name for storing the file
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

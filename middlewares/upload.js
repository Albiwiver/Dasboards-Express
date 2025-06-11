const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "text/csv" ||
    path.extname(file.originalname) === ".csv"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos CSV"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

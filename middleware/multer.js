var multer = require("multer");
var path = require("path");
// declare all characters
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateString = (length) => {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    let name = generateString(10).trim();
    cb(null, Date.now() + name + path.extname(file.originalname));
  },
});

//Image allow jpeg,png,jpg
const fileFilter = (req, file, cb) => {

  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/svg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);  
  }
};

//Image 5 mb allows
var upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5, //5mb
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload,
};

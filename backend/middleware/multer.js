// middleware/multer.js
const multer = require("multer");
const storage = multer.memoryStorage(); // buffer instead of saving to disk
const upload = multer({ storage });
module.exports = upload;

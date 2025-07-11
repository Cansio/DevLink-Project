const multer = require("multer");
const path = require("path");

// ✅ Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in uploads/
  },
  filename: (req, file, cb) => {
    const uniqueName = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ✅ Define file filter and limits
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, .png images are allowed"));
    }
  },
});

module.exports = upload;

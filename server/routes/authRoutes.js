const express = require("express");
const { registerUser, loginUser, getProfile, updateProfile, uploadProfilePicture } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const {validateRegister,validateLogin} = require("../middleware/validation");
const handlevalidation = require("../middleware/handlevalidation");

const router = express.Router();

app.get('/', (req, res) => {
  res.send('DevLink backend is running ✅');
});

router.post("/register",validateRegister, handlevalidation, registerUser);
router.post("/login",validateLogin, handlevalidation, loginUser);
router.put("/update", authMiddleware, updateProfile);
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/upload-profile-pic",
  authMiddleware,
  uploadMiddleware.single("profilePic"),
  uploadProfilePicture
);

module.exports = router;

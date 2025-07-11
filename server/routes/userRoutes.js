const express = require("express");
const router = express.Router();
const { changePassword, getPublicProfileWithPosts} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

//router.get("/:id", getPublicProfile);
router.put("/change-password", authMiddleware, changePassword);
router.get("/public/:id", getPublicProfileWithPosts);

module.exports = router;
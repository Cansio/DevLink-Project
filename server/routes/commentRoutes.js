const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsForPost,
  deleteComment,
  updateComment
} = require("../controllers/commentController");

router.post("/:postId", auth, addComment);
router.get("/:postId", getCommentsForPost);
router.delete("/:id", auth, deleteComment);
router.put("/:id", auth, updateComment);


module.exports = router;

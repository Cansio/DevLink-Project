const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {validatePost} = require("../middleware/validation")
const auth = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  getAllPosts,
  toggleLike
} = require("../controllers/postController");
const handlevalidation = require("../middleware/handlevalidation");

router.get("/all", getAllPosts); // ✅ Always place fixed/static routes BEFORE dynamic ones

//router.post("/", auth, createPost);
//router.put("/:id", auth, updatePost);
router.get("/", auth, getPosts);
router.get("/:id", auth, getPostById);
router.put("/:id/like", auth, toggleLike);
router.put( "/:id",auth,upload.single("image"),updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/comments", auth, addComment);
router.post("/", auth, upload.single("image"), validatePost, handlevalidation, createPost);


module.exports = router;

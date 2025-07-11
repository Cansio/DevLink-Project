const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    const comment = await Comment.create({
      text,
      user: req.user.id,
      post: postId,
    });

    const populated = await comment.populate("user", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

exports.getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("Fetch comments error:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// DELETE Comment
exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id).populate("post"); // so we can check who owns the post
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user.id;
    const isOwner = comment.user.toString() === userId;
    const isPostOwner = comment.post.user.toString() === userId;

    if (!isOwner && !isPostOwner) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment" });
  }
};


// EDIT Comment
exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user.id;
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    comment.text = text;
    await comment.save();

    res.json({ message: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ message: "Error updating comment" });
  }
};



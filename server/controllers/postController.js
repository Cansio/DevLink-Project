const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const { title, description } = req.body;
  const image = req.file?.filename || ""; // ✅ Handle uploaded file

  try {
    const post = await Post.create({
      title,
      description,
      image,
      user: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};


exports.getPosts = async (req, res) => {
  const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(posts);
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
    console.log(err);
  }
};


exports.updatePost = async (req, res) => {
  const { title, description } = req.body;
  const image = req.file?.filename;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    post.title = title || post.title;
    post.description = description || post.description;
    if (image) post.image = image;

    await post.save();
    res.json({ message: "Post updated", post });
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

exports.deletePost = async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post deleted" });
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();
    res.status(201).json({ message: "Comment added", post });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get all posts by all users (for explore feed)
exports.getAllPosts = async (req, res) => {
  const { search } = req.query;

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  try {
    const posts = await Post.find(query)
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: alreadyLiked ? "Unliked" : "Liked", likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Like action failed" });
  }
};



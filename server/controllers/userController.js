const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Post = require("../models/Post");
const Comment = require("../models/Comment")


// const getPublicProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error loading user profile" });
//   }
// };

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update password" });
  }
};

// GET /api/users/public/:id
const getPublicProfileWithPosts = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Get the user's public details
    const user = await User.findById(id).select("name email bio profilePic");
    try{
      if (!user) return res.status(404).json({ message: "User not found" });
    }
    catch(err)
    {
      console.log(err);
    }
    // 2. Fetch all posts of the user
    const posts = await Post.find({ user: id }).populate("user", "name");

    // 3. Fetch all comments for those posts
    const comments = await Comment.find({ post: { $in: posts.map(p => p._id) } });

    // 4. Prepare final post data without createdAt
    const postData = posts.map((post) => {
      const commentsForPost = comments.filter(
        (c) => c.post.toString() === post._id.toString()
      );

      return {
        _id: post._id,
        title: post.title,
        description: post.description,
        image: post.image,
        likesCount: post.likes.length,
        commentsCount: commentsForPost.length,
      };
    });

    // 5. Final response
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic, // frontend handles avatar fallback
      },
      totalPostCount: posts.length,
      posts: postData,
    });
  } catch (err) {
    console.error("Error fetching public profile with posts:", err);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};


module.exports = { changePassword, getPublicProfileWithPosts };
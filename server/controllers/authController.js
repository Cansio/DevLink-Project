const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password, bio } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      bio: bio || "", // optional field
    });

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user: { name: user.name, email: user.email } });
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, bio },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: req.file.filename },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile picture uploaded", user });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, uploadProfilePicture};

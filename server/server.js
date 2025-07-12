const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const userRoutes = require("./routes/userRoutes")
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'https://devlink-frontend.onrender.com',
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

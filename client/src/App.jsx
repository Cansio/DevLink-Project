import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "react-bootstrap"; // ✅ Add this
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import PostDetails from "./pages/PostDetails";
import Explore from "./pages/explore";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <>
      <Navbar />

      {/* ✅ Bootstrap Container for consistent spacing */}
      <Container className="mt-4">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users/:id" element={<PublicProfile />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;

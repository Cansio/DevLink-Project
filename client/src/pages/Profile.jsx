import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", profilePic: "", bio: "" });
  const [form, setForm] = useState({ name: "", email: "", bio: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        console.log("Logged-in user ID:", res.data._id);
        setUser(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          bio: res.data.bio || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/auth/update", form);
      setUser(res.data.user);
      toast.success("Profile updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update profile");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("profilePic", image);

    try {
      const res = await API.put("/auth/upload-profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data.user);
      setImage(null);
      setPreview("");
      setMessage("Profile picture updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Upload error", err);
      toast.error("Failed to upload picture");
    }
  };

  return (
    <Container className="my-5" style={{ paddingTop: "80px" }}>
      <Card className="p-4 shadow-lg">
        <h2 className="mb-4">👤 My Profile</h2>

        {/* Update Form */}
        <Form onSubmit={handleUpdate}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group controlId="bio" className="mb-4">
            <Form.Label>Bio <small className="text-muted">(Optional)</small></Form.Label>
            <Form.Control
              name="bio"
              as="textarea"
              rows={3}
              value={form.bio}
              onChange={handleChange}
              placeholder="Write a short bio (max 300 chars)"
              maxLength={300}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update Profile
          </Button>
        </Form>

        {/* Display Current Bio */}
        {user.bio && (
          <div className="mt-4">
            <h5>📝 Bio</h5>
            <p className="text-muted">{user.bio}</p>
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="mt-5">
          <h5 className="mb-3">Profile Picture</h5>

          <Row>
            <Col md={6} className="mb-3">
              {user.profilePic ? (
                <Image
                  src={`http://localhost:5000/uploads/${user.profilePic}`}
                  roundedCircle
                  fluid
                  className="border border-2 shadow"
                  style={{
                    maxWidth: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Alert variant="secondary">No profile picture uploaded.</Alert>
              )}
            </Col>

            {preview && (
              <Col md={6}>
                <Image
                  src={preview}
                  roundedCircle
                  fluid
                  className="border border-primary"
                  style={{
                    maxWidth: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </Col>
            )}
          </Row>

          <Form.Group controlId="upload" className="mt-3">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Button variant="success" className="mt-2" onClick={handleUpload}>
            Upload Picture
          </Button>
        </div>

        {/* Toast Message */}
        {message && (
          <Alert className="mt-3" variant="success">
            {message}
          </Alert>
        )}

        {/* Account Options */}
        <div className="mt-4">
          <h5>Account Settings</h5>
          <Link to="/change-password" className="text-primary">
            🔐 Change Password
          </Link>
        </div>
      </Card>
    </Container>
  );
}

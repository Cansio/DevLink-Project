import { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      toast.success("Registered Successfully!");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => toast.error(e.msg));
      } else {
        toast.error("Registration failed.");
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/bgd.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card
        className="p-4 shadow"
        style={{
          width: "100%",
          maxWidth: "400px",
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "white",
        }}
      >
        <h2 className="text-center mb-4">Register</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Bio <small className="text-muted">(Optional)</small></Form.Label>
            <Form.Control
              name="bio"
              as="textarea"
              rows={2}
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              maxLength={300}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Sign Up
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

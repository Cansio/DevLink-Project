import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Card, Form, Button } from "react-bootstrap";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success(res.data.message || "✅ Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");

      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "❌ Error changing password";
      toast.error(errorMsg);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ paddingTop: '80px', minHeight: "calc(100vh - 80px)" }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          borderRadius: "10px",
        }}
        className="shadow"
      >
        <h3 className="mb-4 text-center">🔐 Change Password</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Change Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

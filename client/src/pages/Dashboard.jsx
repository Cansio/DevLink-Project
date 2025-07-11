import { useEffect, useState } from "react";
import API from "../api/axios";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await API.put(`/posts/${editingId}`, form);
      } else {
        await API.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({ title: "", description: "" });
      setImage(null);
      setEditingId(null);
      fetchPosts();
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  const startEdit = (post) => {
    setForm({ title: post.title, description: post.description });
    setEditingId(post._id);
    setImage(null);
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <Container className="mt-5" style={{ paddingTop: '80px' }}>
      <h2 className="text-center mb-4">📬 My Posts</h2>

      {/* ➕ Post Form */}
      <Card className="mb-5 shadow">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write your post"
              />
            </Form.Group>

            {!editingId && (
              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group>
            )}

            <Button type="submit" variant="primary">
              {editingId ? "Update Post" : "Add Post"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* 📋 Post List */}
      {posts.length === 0 ? (
        <p className="text-muted">No posts found.</p>
      ) : (
        <Row xs={1} md={2} lg={2} className="g-4">
          {posts.map((post) => (
            <Col key={post._id}>
              <Card className="h-100 shadow">
                <Card.Body>
                  <Card.Title>
                    <Link to={`/posts/${post._id}`} className="text-decoration-none">
                      {post.title}
                    </Link>
                  </Card.Title>
                  <Card.Text>{post.description}</Card.Text>

                  {post.image && (
                    <Card.Img
                      variant="bottom"
                      src={`http://localhost:5000/uploads/${post.image}`}
                      alt="Post"
                      className="rounded mt-2"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  )}
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  <Button variant="outline-primary" onClick={() => startEdit(post)}>
                    ✏️ Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => deletePost(post._id)}>
                    🗑 Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

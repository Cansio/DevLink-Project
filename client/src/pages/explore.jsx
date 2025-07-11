import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
} from "react-bootstrap";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [likeState, setLikeState] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  const fetchPosts = async (query = "") => {
    try {
      const res = await API.get(`/posts/all?search=${query}`);
      setPosts(res.data);

      const newLikeState = {};
      res.data.forEach((post) => {
        newLikeState[post._id] = post.likes?.length || 0;
      });
      setLikeState(newLikeState);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(search);
  };

  const handleLike = async (postId) => {
    try {
      const res = await API.put(`/posts/${postId}/like`);
      setLikeState((prev) => ({
        ...prev,
        [postId]: res.data.likesCount,
      }));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId) => {
    try {
      await API.post(`/comments/${postId}`, {
        text: newComments[postId],
      });
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      loadComments(postId);
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  const loadComments = async (postId) => {
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    posts.forEach((post) => {
      loadComments(post._id);
    });
  }, [posts]);

  return (
    <Container className="my-5" style={{ paddingTop: "80px" }}>
      <h2 className="text-center mb-4">🌐 Explore Posts</h2>

      {/* 🔍 Search Bar */}
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
        </InputGroup>
      </Form>

      {/* 📝 Post List */}
      <Row xs={1} md={2} className="g-4">
        {posts.map((post) => (
          <Col key={post._id}>
            <Card className="shadow-sm h-100">
              {post.image && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/uploads/${post.image}`}
                  alt="Post"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.content}</Card.Text>

                <Card.Text className="text-muted">
                  Posted by:{" "}
                  <Link to={`/users/${post.user._id}`}>
                    {post.user.name}
                  </Link>
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    👍 Likes: {likeState[post._id] ?? post.likes.length}
                  </small>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleLike(post._id)}
                  >
                    Like / Unlike
                  </Button>
                </div>

                {/* 💬 Comments Section */}
                <div>
                  <strong>Comments:</strong>
                  <div className="mt-2 mb-2">
                    {comments[post._id]?.map((c, i) => (
                      <div key={i} className="text-sm text-muted mb-1">
                        <strong>{c.user.name}:</strong> {c.text}
                      </div>
                    ))}
                  </div>

                  <InputGroup className="mt-2">
                    <Form.Control
                      size="sm"
                      placeholder="Write a comment..."
                      value={newComments[post._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post._id, e.target.value)
                      }
                    />
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => submitComment(post._id)}
                    >
                      Comment
                    </Button>
                  </InputGroup>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { getUserIdFromToken } from "../utils/getUserFromToken";
import {
  Container,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const currentUserId = getUserIdFromToken();

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data);
      setLikes(res.data.likes.length);
    } catch (err) {
      console.error("Error loading post", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/${id}/like`);
      setLikes(res.data.likesCount);
    } catch (err) {
      console.error("Failed to like", err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      await API.post(`/comments/${id}`, { text: comment });
      setComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to comment", err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditText(text);
  };

  const handleEditSubmit = async () => {
    try {
      await API.put(`/comments/${editingCommentId}`, { text: editText });
      setEditingCommentId(null);
      setEditText("");
      fetchComments();
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  if (!post) {
    return (
      <Container
        className="text-center d-flex flex-column align-items-center justify-content-center"
        style={{ paddingTop: "80px", minHeight: "100vh" }}
      >
        <Spinner animation="border" />
        <p className="mt-3">Loading post...</p>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "80px", paddingBottom: "40px" }}>
      <Card className="shadow mb-4">
        <Card.Body>
          <Card.Title as="h2" className="mb-3">{post.title}</Card.Title>
          <Card.Text>{post.description}</Card.Text>

          {post.image && (
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt="Post"
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          )}

          <div className="d-flex align-items-center mb-4">
            <Button variant="outline-primary" size="sm" onClick={handleLike}>
              👍 Like / Unlike
            </Button>
            <span className="ms-3 text-muted">Likes: {likes}</span>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Add a Comment:</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              className="mt-2"
              onClick={handleComment}
              variant="success"
            >
              Comment
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>

      <h4 className="mb-3">💬 Comments</h4>
      {comments.length > 0 ? (
        comments.map((c) => {
          const isCommentOwner = c.user?._id === currentUserId;
          const isPostOwner = post.user._id === currentUserId;

          return (
            <Card className="mb-3 shadow-sm" key={c._id}>
              <Card.Body>
                <Card.Title as="h6" className="mb-2">
                  {c.user?.name || "User"}
                </Card.Title>

                {editingCommentId === c._id ? (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="mb-2"
                    />
                    <Button
                      size="sm"
                      onClick={handleEditSubmit}
                      variant="success"
                      className="me-2"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Card.Text className="mb-1">{c.text}</Card.Text>
                    <small className="text-muted">
                      {new Date(c.createdAt).toLocaleString()}
                    </small>
                    <div className="mt-2">
                      {isCommentOwner && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(c._id, c.text)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                      )}
                      {(isCommentOwner || isPostOwner) && (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <Alert variant="info">No comments yet.</Alert>
      )}
    </Container>
  );
}

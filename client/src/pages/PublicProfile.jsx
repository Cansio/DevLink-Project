import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Image,
  Badge,
} from "react-bootstrap";

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState(0);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/public/${id}`);
      setUser(res.data.user);
      setPosts(res.data.posts);
      setTotalPostCount(res.data.totalPostCount);
    } catch (err) {
      console.log("Requested user ID:", id);
      console.error("Error loading profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading user profile...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      {/* 🧑 Profile Header */}
      <Card className="p-4 shadow mb-4">
        <Row className="align-items-center">
          <Col md={3} className="text-center mb-3 mb-md-0">
            {user.profilePic ? (
              <Image
                src={`http://localhost:5000/uploads/${user.profilePic}`}
                roundedCircle
                fluid
                style={{ width: "130px", height: "130px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle"
                style={{ width: "130px", height: "130px", fontSize: "50px" }}
              >
                👤
              </div>
            )}
          </Col>
          <Col md={9}>
            <h3 className="fw-bold mb-1">{user.name}</h3>
            <p className="text-muted mb-2">📧 {user.email}</p>
            {user.bio && <p className="fst-italic text-dark">📝 {user.bio}</p>}
            <p className="text-muted">
              📦 Total Posts: <strong>{totalPostCount}</strong>
            </p>
          </Col>
        </Row>
      </Card>

      {/* 📝 Post List */}
      <Row>
        <Col>
          <h4 className="mb-3">Posts by {user.name}</h4>

          {posts.length === 0 ? (
            <Alert variant="info">No posts yet by this user.</Alert>
          ) : (
            <Row xs={1} md={2} className="g-4">
              {posts.map((post) => (
                <Col key={post._id}>
                  <Card className="h-100 shadow-sm">
                    {post.image && (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000/uploads/${post.image}`}
                        alt="Post"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{post.title}</Card.Title>
                      <Card.Text>{post.description}</Card.Text>

                      <div className="d-flex justify-content-between mt-3">
                        <Badge bg="primary">👍 {post.likesCount}</Badge>
                        <Badge bg="secondary">💬 {post.commentsCount}</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

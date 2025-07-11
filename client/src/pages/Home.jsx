import { Container, Row, Col } from "react-bootstrap";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: "url('/bgd.jpg')", // ✅ Ensure this path is correct
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",           // ✅ Full width
        margin: "0",
        padding: "0",
        overflowX: "hidden",      // ✅ Hide overflow
      }}
    >
      <Container fluid className="text-white text-center py-5">
        <h1 className="display-4 fw-bold">Welcome to DevLink</h1>
        <p className="lead mb-5">
          The place where developers share ideas, collaborate on projects, and grow together.
        </p>

        <Row className="justify-content-center mb-4 px-2">
          <Col md={3} className="bg-dark p-3 m-2 rounded">
            <h5>💡 Share Knowledge</h5>
            <p>Post your thoughts, tutorials, or solutions to help the dev community.</p>
          </Col>
          <Col md={3} className="bg-dark p-3 m-2 rounded">
            <h5>🤝 Connect with Developers</h5>
            <p>Browse public profiles, follow developers, and collaborate on cool ideas.</p>
          </Col>
          <Col md={3} className="bg-dark p-3 m-2 rounded">
            <h5>📢 Explore Projects</h5>
            <p>Discover new projects and see what others in the community are working on.</p>
          </Col>
        </Row>

        <p className="mt-3">
          🚀 Ready to start your journey?{" "}
          <strong>Sign up and join the DevLink community today!</strong>
        </p>
      </Container>
    </div>
  );
}

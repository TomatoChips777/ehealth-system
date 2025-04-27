import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // 👈 Import Link

function Home() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Welcome to the Student Health Portal</h2>
              <p className="text-center text-muted mb-5">
                Manage your medical records, book appointments, and stay healthy with our student clinic services.
              </p>

              <Row className="text-center">
                <Col md={4} className="mb-3">
                  <Link to="/student-prescriptions">
                    <Button variant="primary" className="w-100" size="lg">
                      View Prescriptions
                    </Button>
                  </Link>
                </Col>
                <Col md={4} className="mb-3">
                  <Link to="/student-details">
                    <Button variant="success" className="w-100" size="lg">
                      Medical Records
                    </Button>
                  </Link>
                </Col>
                <Col md={4} className="mb-3">
                  <Link to="/student-appointment">
                    <Button variant="info" className="w-100" size="lg">
                      Book Appointment
                    </Button>
                  </Link>
                </Col>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

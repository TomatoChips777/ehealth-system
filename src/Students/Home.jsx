import { Container, Row, Col, Card, Button } from 'react-bootstrap';

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
                  <Button variant="primary" className="w-100" size="lg">
                    View Profile
                  </Button>
                </Col>
                <Col md={4} className="mb-3">
                  <Button variant="success" className="w-100" size="lg">
                    Medical Records
                  </Button>
                </Col>
                <Col md={4} className="mb-3">
                  <Button variant="info" className="w-100" size="lg">
                    Book Appointment
                  </Button>
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

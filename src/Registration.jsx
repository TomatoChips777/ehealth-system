import { useState } from 'react';
import { Button, Form, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationScreen = () => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const [newPatient, setNewPatient] = useState({
    student_id: '',
    full_name: '',
    email: '',
    course: '',
    year: '',
    birthdate: '',
    sex: '',
    contact_number: '',
    address: '',
    contact_person: '',
    contact_person_number: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    try {
      const payload = {
        ...newPatient,
        username: newPatient.email,
        name: newPatient.full_name,
      };
      const response = await axios.post(`${import.meta.env.VITE_ADD_PATIENT}`, payload);
      if (response.data.success) {
        alert('Registration successful!');
        navigate('/login');
      } else if (response.data.errors) {
        setFieldErrors(response.data.errors); // Set field-specific errors
      } else {
        setError(response.data.message || 'Failed to add patient.');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f7f7f7' }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card
            className="p-4 shadow"
            style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}
          >
            <Card.Body>
              <h2 className="text-center mb-4" style={{ fontWeight: '600' }}>
                Register
              </h2>

              <Form onSubmit={handleRegister}>
                <Row>
                {error && (
                <Alert variant="danger" style={{ borderRadius: '10px' }}>
                  {error}
                </Alert>
              )}
                  <Col md={6}>
                    <Form.Group controlId="student_id" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Student ID"
                        name="student_id"
                        value={newPatient.student_id}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="full_name" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Full Name"
                        name="full_name"
                        value={newPatient.full_name}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={newPatient.email}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="password" className="mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={newPatient.password}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="course" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Course (e.g., BSIT)"
                        name="course"
                        value={newPatient.course}
                        onChange={handleChange}
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="year" className="mb-3">
                      <Form.Select
                        name="year"
                        value={newPatient.year}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px', padding: '10px' }}
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="birthdate" className="mb-3">
                      <Form.Control
                        type="date"
                        name="birthdate"
                        value={newPatient.birthdate}
                        onChange={handleChange}
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="sex" className="mb-3">
                      <Form.Select
                        name="sex"
                        value={newPatient.sex}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px', padding: '10px' }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="contact_number" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Contact Number"
                        name="contact_number"
                        value={newPatient.contact_number}
                        onChange={handleChange}
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="address" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={newPatient.address}
                        onChange={handleChange}
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="contact_person" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Emergency Contact Person"
                        name="contact_person"
                        value={newPatient.contact_person}
                        onChange={handleChange}
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="contact_person_number" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Emergency Contact Number"
                        name="contact_person_number"
                        value={newPatient.contact_person_number}
                        onChange={handleChange}
                        style={{ borderRadius: '10px', padding: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-3"
                  style={{
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: '500',
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                  }}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
                </Button>
              </Form>

              

              <div className="text-center mt-3">
                <small>
                  Already have an account? <a href="/login">Login</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationScreen;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';

function ConsultationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;

  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    email: '',
    complaint: '',
    diagnosis: '',
    recommendation: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        ...formData,
        full_name: patient.full_name,
        student_id: patient.student_id,
        email: patient.email,
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Consultation submitted:', formData);
    navigate('/');
  };

  if (!patient) {
    return <p>No patient data. Go back and select a patient.</p>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>Consultation Form</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control type="text" readOnly value={formData.student_id} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" readOnly value={formData.full_name} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" readOnly value={formData.email} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Complaint</Form.Label>
              <Form.Control as="textarea" rows={2} name="complaint" value={formData.complaint} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control as="textarea" rows={2} name="diagnosis" value={formData.diagnosis} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recommendation</Form.Label>
              <Form.Control as="textarea" rows={2} name="recommendation" value={formData.recommendation} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit Consultation</Button>{' '}
            <Button variant="secondary" onClick={() => navigate('/patients')}>Cancel</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ConsultationForm;

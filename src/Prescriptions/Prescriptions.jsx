import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Col, Row, Container, Alert, InputGroup } from 'react-bootstrap';

const medications = [
  { id: 1, name: 'Paracetamol', type: 'Tablet', unit: 'mg' },
  { id: 2, name: 'Ibuprofen', type: 'Tablet', unit: 'mg' },
  { id: 3, name: 'Salbutamol', type: 'Inhaler', unit: 'mcg' },
  { id: 4, name: 'Cetirizine', type: 'Tablet', unit: 'mg' },
];

function Prescriptions() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_PATIENTS}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSelectedStudent(null);
      return;
    }
  
    const match = students.find((s) =>
      [s.full_name, s.student_id, s.email]
        .some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setSelectedStudent(match || null);
  }, [searchQuery, students]);
  

  const handleMedicineChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMedicines((prev) =>
      checked ? [...prev, value] : prev.filter((medicine) => medicine !== value)
    );
  };

  const handleSubmit = () => {
    if (!selectedStudent) {
      setError('Please search and select a valid student.');
      return;
    }
    if (!dosage || !frequency || !duration) {
      setError('Please fill in all required fields.');
      return;
    }

    const prescription = {
      student: selectedStudent,
      medicines: selectedMedicines,
      dosage,
      frequency,
      duration,
      notes,
    };

    console.log('Prescription Submitted:', prescription);
    setError('');
  };

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Student Information</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Search Student</Form.Label>
                <InputGroup>
                <Form.Control
  type="text"
  placeholder="Search by name, student ID, or email..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

                </InputGroup>
              </Form.Group>

              {selectedStudent ? (
                <>
                  <p><strong>Name:</strong> {selectedStudent.full_name}</p>
                  <p><strong>Age:</strong> {selectedStudent.age}</p>
                  <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                  <p><strong>Condition:</strong> {selectedStudent.condition}</p>
                  <p><strong>Student ID:</strong> {selectedStudent.student_id}</p>
                  <p><strong>Course:</strong> {selectedStudent.course}</p>
                  <p><strong>Emergency Contact:</strong> {selectedStudent.emergencyContact}</p>
                </>
              ) : (
                searchQuery && <Alert variant="warning">No student found with that name.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header as="h5">Create Prescription</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select Medicines</Form.Label>
                  {medications.map((medicine) => (
                    <Form.Check
                      key={medicine.id}
                      type="checkbox"
                      label={`${medicine.name} (${medicine.type})`}
                      value={medicine.name}
                      onChange={handleMedicineChange}
                    />
                  ))}
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dosage</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 500mg"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Frequency</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 3 times a day"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 7 days"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleSubmit}>
                  Submit Prescription
                </Button>
              </Form>
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedStudent && selectedMedicines.length > 0 && (
        <Card className="mt-4">
          <Card.Header as="h5">Prescription Summary</Card.Header>
          <Card.Body>
            <h6>Student: {selectedStudent.full_name}</h6>
            <p><strong>Condition:</strong> {selectedStudent.condition}</p>
            <ul>
              {selectedMedicines.map((medicine) => (
                <li key={medicine}>{medicine}</li>
              ))}
            </ul>
            <p><strong>Dosage:</strong> {dosage}</p>
            <p><strong>Frequency:</strong> {frequency}</p>
            <p><strong>Duration:</strong> {duration}</p>
            <p><strong>Notes:</strong> {notes}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Prescriptions;

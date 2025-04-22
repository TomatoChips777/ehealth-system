import React, { useState } from 'react';
import { Button, Form, Card, Col, Row, Container, Alert } from 'react-bootstrap';

// Dummy data
const students = [
  { id: 1, name: 'John Doe', age: 20, gender: 'Male', condition: 'Flu', studentId: 'S12345', course: 'Computer Science', emergencyContact: 'Jane Doe - (555) 123-4567' },
  { id: 2, name: 'Jane Smith', age: 21, gender: 'Female', condition: 'Headache', studentId: 'S12346', course: 'Psychology', emergencyContact: 'Mark Smith - (555) 987-6543' },
  { id: 3, name: 'Michael Johnson', age: 19, gender: 'Male', condition: 'Asthma', studentId: 'S12347', course: 'Engineering', emergencyContact: 'Samantha Johnson - (555) 222-3333' },
];

const medications = [
  { id: 1, name: 'Paracetamol', type: 'Tablet', unit: 'mg' },
  { id: 2, name: 'Ibuprofen', type: 'Tablet', unit: 'mg' },
  { id: 3, name: 'Salbutamol', type: 'Inhaler', unit: 'mcg' },
  { id: 4, name: 'Cetirizine', type: 'Tablet', unit: 'mg' },
];

function Prescriptions() {
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Handle medicine selection
  const handleMedicineChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMedicines((prev) =>
      checked ? [...prev, value] : prev.filter((medicine) => medicine !== value)
    );
  };

  // Handle form submission
  const handleSubmit = () => {
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

    // Submit Prescription (for demonstration purposes, just log it)
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
                <Form.Label>Select Student</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedStudent.id}
                  onChange={(e) => {
                    const student = students.find((s) => s.id === parseInt(e.target.value));
                    setSelectedStudent(student);
                  }}
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.condition}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <p><strong>Age:</strong> {selectedStudent.age}</p>
              <p><strong>Gender:</strong> {selectedStudent.gender}</p>
              <p><strong>Condition:</strong> {selectedStudent.condition}</p>
              <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
              <p><strong>Course:</strong> {selectedStudent.course}</p>
              <p><strong>Emergency Contact:</strong> {selectedStudent.emergencyContact}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header as="h5">Create Prescription</Card.Header>
            <Card.Body>
              <Form>
                {/* Medicine Selection */}
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

                {/* Dosage, Frequency, Duration */}
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dosage</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Dosage (e.g., 500mg)"
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
                        placeholder="Enter Frequency (e.g., 3 times a day)"
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
                        placeholder="Enter Duration (e.g., 7 days)"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Additional Notes */}
                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" onClick={handleSubmit}>
                  Submit Prescription
                </Button>
              </Form>

              {/* Error Message */}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Prescription Summary */}
      {selectedMedicines.length > 0 && (
        <Card className="mt-4">
          <Card.Header as="h5">Prescription Summary</Card.Header>
          <Card.Body>
            <h6>Student: {selectedStudent.name}</h6>
            <p><strong>Condition:</strong> {selectedStudent.condition}</p>
            <ul>
              {selectedMedicines.map((medicine) => (
                <li key={medicine}>{medicine}</li>
              ))}
            </ul>
            <p><strong>Dosage:</strong> {dosage}</p>
            <p><strong>Frequency:</strong> {frequency}</p>
            <p><strong>Duration:</strong> {duration}</p>
            <p><strong>Additional Notes:</strong> {notes}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Prescriptions;

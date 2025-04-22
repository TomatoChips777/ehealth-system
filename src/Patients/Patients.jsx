import React, { useState } from 'react';
import { Button, Card, Form, Col, Row, Container, Table, Modal } from 'react-bootstrap';

// Dummy data for patients
const initialPatients = [
  { id: 1, name: 'John Doe', age: 45, gender: 'Male', condition: 'Flu', contact: '123-456-7890' },
  { id: 2, name: 'Jane Smith', age: 34, gender: 'Female', condition: 'Headache', contact: '987-654-3210' },
  { id: 3, name: 'Michael Johnson', age: 50, gender: 'Male', condition: 'Diabetes', contact: '555-123-9876' },
  { id: 4, name: 'Emily Davis', age: 29, gender: 'Female', condition: 'Asthma', contact: '444-222-1111' },
];

function Patients() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', condition: '', contact: '' });

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // View patient details
  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  // Close the details modal
  const closeDetails = () => {
    setShowDetails(false);
  };

  // Open the Add Patient Modal
  const handleAddPatient = () => {
    setShowModal(true);
  };

  // Handle patient form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new patient
  const handleAddNewPatient = () => {
    setPatients([...patients, { ...newPatient, id: patients.length + 1 }]);
    setNewPatient({ name: '', age: '', gender: '', condition: '', contact: '' });
    setShowModal(false);
  };

  // Handle delete patient
  const handleDeletePatient = (id) => {
    const updatedPatients = patients.filter((patient) => patient.id !== id);
    setPatients(updatedPatients);
  };

  return (
    <Container className="" fluid>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header as="h5">Patient List</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by Name or Condition"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Form.Group>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Condition</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.condition}</td>
                        <td>{patient.contact}</td>
                        <td>
                          <Button variant="info" onClick={() => handleViewDetails(patient)}>
                            View Details
                          </Button>{' '}
                          <Button variant="danger" onClick={() => handleDeletePatient(patient.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No patients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <Button variant="primary" onClick={handleAddPatient}>
                Add New Patient
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patient Details Modal */}
      <Modal show={showDetails} onHide={closeDetails}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Condition:</strong> {selectedPatient.condition}</p>
              <p><strong>Contact:</strong> {selectedPatient.contact}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Patient Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newPatient.name}
                onChange={handleChange}
                placeholder="Enter patient name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={newPatient.age}
                onChange={handleChange}
                placeholder="Enter patient age"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={newPatient.gender}
                onChange={handleChange}
              >
                <option>Male</option>
                <option>Female</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Control
                type="text"
                name="condition"
                value={newPatient.condition}
                onChange={handleChange}
                placeholder="Enter patient's condition"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                value={newPatient.contact}
                onChange={handleChange}
                placeholder="Enter patient contact number"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddNewPatient}>
            Save Patient
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Patients;

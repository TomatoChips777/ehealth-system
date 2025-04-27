import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Col, Row, Container, Alert, InputGroup, Modal } from 'react-bootstrap';
import CalculateAge from '../extra/CalculateAge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import generatePrescriptionPDF from './PrescriptionPDF';
function Prescriptions() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(patient || null);
  const [prescriptions, setPrescriptions] = useState([
    { medicine: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);

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
    if (patient) {
      setSelectedStudent(patient);
      setSearchQuery(patient.student_id);
    } else if (searchQuery.trim() === '') {
      setSelectedStudent(null);
    } else {
      const match = students.find((s) =>
        [s.full_name, s.student_id, s.email, s.user_id]
          .some((field) =>
            String(field || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setSelectedStudent(match || null);
    }
  }, [searchQuery, students, patient]);

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const addPrescriptionField = () => {
    setPrescriptions([...prescriptions, { medicine: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removePrescriptionField = (index) => {
    if (prescriptions.length === 1) return; // Always keep at least one
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updatedPrescriptions);

  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      setError('Please search and select a valid student.');
      return;
    }

    if (prescriptions.some(p => !p.medicine || !p.dosage || !p.frequency || !p.duration)) {
      setError('Please fill in all fields for each medicine.');
      return;
    }

    const prescriptionData = {
      user_id: selectedStudent.user_id,
      prescriptions,
      notes,
      prescribed_by: user.id,
    };

    try {
      await axios.post(`${import.meta.env.VITE_ADD_PRESCRIPTION}`, prescriptionData);
      setError('');
      setPrescriptionData(prescriptionData);
      console.log(prescriptionData);
      setShowDownloadModal(true);

      // CLEAR FORM AFTER SUCCESS
      setSelectedStudent(null);
      setPrescriptions([{ medicine: '', dosage: '', frequency: '', duration: '' }]);
      setNotes('');
      setSearchQuery('');

    } catch (error) {
      console.error('Error saving prescription:', error);
      setError('Failed to save prescription. Please try again.');
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Student Info */}
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
                  <p><strong>Student ID:</strong> {selectedStudent.student_id}</p>
                  <p><strong>Name:</strong> {selectedStudent.full_name}</p>
                  <p><strong>Age:</strong> {CalculateAge(selectedStudent.birthdate)}</p>
                  <p><strong>Gender:</strong> {selectedStudent.sex}</p>
                  <p><strong>Cours/Year:</strong> {selectedStudent.course} - {selectedStudent.year}</p>
                  <p><strong>Emergency Contact:</strong> {selectedStudent.contact_number}</p>
                </>
              ) : (
                searchQuery && <Alert variant="warning">No student found.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        {/* Create Prescription */}
        <Col md={8}>
          <Card>
            <Card.Header as="h5">Create Prescription</Card.Header>
            <Card.Body>
              <Form>
                {/* Medicine Inputs */}
                <Form.Group className="mb-3">
                  <Form.Label>Medicines</Form.Label>
                  {prescriptions.map((prescription, index) => (
                    <Row key={index} className="mb-2">
                      <Col md={3}>
                        <Form.Control
                          type="text"
                          placeholder="Medicine Name"
                          value={prescription.medicine}
                          onChange={(e) => handlePrescriptionChange(index, 'medicine', e.target.value)}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          type="text"
                          placeholder="Dosage"
                          value={prescription.dosage}
                          onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          type="text"
                          placeholder="Frequency"
                          value={prescription.frequency}
                          onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          type="text"
                          placeholder="Duration"
                          value={prescription.duration}
                          onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                        />
                      </Col>
                      <Col md={2}>
                        <Button
                          variant="danger"
                          onClick={() => removePrescriptionField(index)}
                          disabled={prescriptions.length === 1}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button variant="success" onClick={addPrescriptionField}>
                    + Add More
                  </Button>
                </Form.Group>

                {/* Notes */}
                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>

                {/* Submit */}
                <Button variant="primary" onClick={handleSubmit}>
                  Submit Prescription
                </Button>
              </Form>
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Prescription Summary */}
      {selectedStudent && prescriptions.length > 0 && (
        <Card className="mt-4">
          <Card.Header as="h5">Prescription Summary</Card.Header>
          <Card.Body>
            <h6>Student: {selectedStudent.full_name}</h6>
            <p><strong>Condition:</strong> {selectedStudent.condition}</p>
            <ul>
              {prescriptions.map((pres, index) => (
                <li key={index}>
                  {pres.medicine} - {pres.dosage} - {pres.frequency} - {pres.duration}
                </li>
              ))}
            </ul>
            <p><strong>Notes:</strong> {notes}</p>
          </Card.Body>
        </Card>
      )}

      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} centered backdrop="static" keyboard={false} >
        <Modal.Header closeButton>
          <Modal.Title>Prescription Saved</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h5 className="text-success mb-3">Successfully added prescription!</h5>
            <p>Would you like to download the prescription now?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowDownloadModal(false);
          }}>
            No
          </Button>
          <Button variant="primary" onClick={() => {
            generatePrescriptionPDF(prescriptionData.user_id, prescriptionData.prescriptions, prescriptionData.notes);
            setShowDownloadModal(false);
          }}>
            Yes, Download
          </Button>
        </Modal.Footer>
      </Modal>


    </Container>
  );
}

export default Prescriptions;

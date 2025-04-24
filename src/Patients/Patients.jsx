import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Col, Row, Container, Table, Modal } from 'react-bootstrap';
import { PersonFill, FileEarmarkText, FileLock, Trash, Eye } from 'react-bootstrap-icons';
import FormatDate from '../extra/DateFormat';
import { useNavigate } from 'react-router-dom';

function Patients({ handleLinkClick }) {
  const navigate = useNavigate(); 
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    birthdate: '',
    medicalHistory: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5; // Limit per page

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_PATIENTS}`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when search term changes
  };

  // Filter patients based on search term
const filteredPatients = patients.filter(
  (patient) =>
    (patient.full_name && patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Get current patients for the current page
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // View patient details
  const handleViewDetails = (patient) => {
    navigate('/patient-details', { state: { patient } });
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
    setNewPatient({
      name: '',
      age: '',
      gender: '',
      contact: '',
      birthdate: '',
      medicalHistory: '',
    });
    setShowModal(false);
  };

  // Handle delete patient
  const handleDeletePatient = (id) => {
    const updatedPatients = patients.filter((patient) => patient.id !== id);
    setPatients(updatedPatients);
  };

  // Handle Prescription
  const handlePrescription = (patient) => {
    handleLinkClick('Prescriptions');
    navigate('/prescriptions', { state: { patient } });
  };

  const handleConsultation = (patient) => {
    navigate('/consultation', { state: { patient } });
  };

  const handleAnnualReport = (patient) => {
    navigate('/annualreport', { state: { patient } });
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
              Patient List
              <Button variant="success" size="sm" onClick={handleAddPatient}>
                Add New Patient
              </Button>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by Name or Email"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Form.Group>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Date of birth</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.length > 0 ? (
                    currentPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.student_id}</td>
                        <td>{patient.full_name}</td>
                        <td>{FormatDate(patient.birthdate, false)}</td>
                        <td>{patient.sex}</td>
                        <td>{patient.email}</td>
                        <td className="text-center">
                          <Button
                            variant="info"
                            size="sm"
                            className="rounded-0 me-2"
                            onClick={() => handleViewDetails(patient)}
                          >
                            <Eye />
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-0 me-2"
                            onClick={() => handleAnnualReport(patient)}
                          >
                            <PersonFill />
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            className="rounded-0 me-2"
                            onClick={() => handleConsultation(patient)}
                          >
                            <PersonFill />
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            className="rounded-0"
                            onClick={() => handlePrescription(patient)}
                          >
                            <FileEarmarkText />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No patients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-0"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-0"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add New Patient Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPatientName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient's full name"
                name="name"
                value={newPatient.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPatientAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter patient's age"
                name="age"
                value={newPatient.age}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPatientGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={newPatient.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPatientContact">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient's contact number"
                name="contact"
                value={newPatient.contact}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPatientBirthdate">
              <Form.Label>Birthdate</Form.Label>
              <Form.Control
                type="date"
                name="birthdate"
                value={newPatient.birthdate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPatientHistory">
              <Form.Label>Medical History</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="medicalHistory"
                value={newPatient.medicalHistory}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddNewPatient}>
            Add Patient
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Patients;

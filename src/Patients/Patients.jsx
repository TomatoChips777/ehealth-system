import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Col, Row, Container, Table, Modal } from 'react-bootstrap';
import { PersonFill, FileEarmarkText, FileLock, Trash, Eye } from 'react-bootstrap-icons';
import FormatDate from '../extra/DateFormat';
import { useNavigate } from 'react-router-dom';

function Patients({handleLinkClick}) {
  const navigate = useNavigate(); 
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', condition: '', contact: '' });

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
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
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


  // Handle Prescription
  const handlePrescription = (patient) => {
    // Placeholder function: Open Prescription Modal or navigate to Prescription page
    // console.log("Prescription for patient:", patient.name);
    handleLinkClick('Prescriptions');
    navigate('/prescriptions', { state: { patient } });

  };

  const handleConsultation = (patient) =>{
      navigate('/consultation', { state: { patient } });
  }

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
              <Button variant="primary" size="sm" onClick={handleAddPatient}>
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
                        <td>{FormatDate(patient.birthdate,false)}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.email}</td>
                        <td className="text-center">
                          <Button
                            variant="info"
                            size="sm"
                            className="rounded-0"
                            onClick={() => handleViewDetails(patient)}
                          >
                            <Eye />
                          </Button>{' '}
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-0"
                            onClick={() => handleAnnualReport(patient)}
                          >
                            <PersonFill />
                          </Button>{' '}
                          <Button
                            variant="warning"
                            size="sm"
                            className="rounded-0"
                            onClick={() => handleConsultation(patient)}
                          >
                            <PersonFill />
                          </Button>{' '}
                          
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
    </Container>
  );
}

export default Patients;

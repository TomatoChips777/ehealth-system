import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Col, Row, Container, Table, Modal } from 'react-bootstrap';
import { Eye, ClipboardPlus, PersonVcard, FileEarmarkMedical } from 'react-bootstrap-icons';
import FormatDate from '../extra/DateFormat';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
function Patients({ handleLinkClick }) {
  const [baseLink, setBaseLink] = useState('Patients');
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    student_id: "",
    full_name: "",
    course: "",
    year: "",
    birthdate: "",
    sex: "",
    contact_number: "",
    address: "",
    contact_person: "",
    contact_person_number: "",
  });


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 20; 

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_PATIENTS}`);
      setPatients(response.data);
      const uniqueCourses = [...new Set(response.data.map(p => p.course).filter(Boolean))].sort();
      setCourses(uniqueCourses);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateUser', () => {
      fetchData();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when search term changes
  };

  // NEW STATES for filters
  const [filterSex, setFilterSex] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [courses, setCourses] = useState([]);

  // Updated filter
  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (patient.full_name && patient.full_name.toLowerCase().includes(search)) ||
      (patient.student_id && patient.student_id.toLowerCase().includes(search)) ||
      (patient.email && patient.email.toLowerCase().includes(search)) ||
      (patient.course && patient.course.toLowerCase().includes(search)) ||
      (patient.year && patient.year.toLowerCase().includes(search)) ||
      (patient.contact_number && patient.contact_number.toLowerCase().includes(search));

    const matchesSex = filterSex ? patient.sex === filterSex : true;
    const matchesCourse = filterCourse ? patient.course === filterCourse : true;
    const matchesYear = filterYear ? patient.year === filterYear : true;

    return matchesSearch && matchesSex && matchesCourse && matchesYear;
  });


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
  // const handleAddNewPatient = () => {
  //   setPatients([...patients, { ...newPatient, id: patients.length + 1 }]);
  //   setNewPatient({
  //     name: '',
  //     age: '',
  //     gender: '',
  //     contact: '',
  //     birthdate: '',
  //     medicalHistory: '',
  //   });
  //   setShowModal(false);
  // };


  const handleAddNewPatient = async () => {
    try {
      const payload = {
        username: newPatient.email,
        password: "",
        email: newPatient.email,
        name: newPatient.full_name,
        student_id: newPatient.student_id,
        full_name: newPatient.full_name,
        course: newPatient.course,
        year: newPatient.year,
        birthdate: newPatient.birthdate,
        sex: newPatient.sex,
        contact_number: newPatient.contact_number,
        address: newPatient.address,
        contact_person: newPatient.contact_person,
        contact_person_number: newPatient.contact_person_number,
      };

      await axios.post(`${import.meta.env.VITE_ADD_PATIENT}`, payload);
      console.log(newPatient);
      alert('Patient added successfully!');
      setShowModal(false);
      fetchPatients(); // Refresh the table
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient.');
    }
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
    handleLinkClick('Consultations');
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
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Search by Name, ID, Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>

                <Col md={3}>
                  <Form.Select value={filterSex} onChange={(e) => setFilterSex(e.target.value)}>
                    <option value="">All Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Col>

                <Col md={3}>
                  <Form.Select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                    <option value="">All Courses</option>
                    {courses.map((course, idx) => (
                      <option key={idx} value={course}>
                        {course}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                    <option value="">All Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </Form.Select>
                </Col>
              </Row>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Course/Year</th>
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
                        <td>{patient.course} - {patient.year}</td>
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
                            <ClipboardPlus />
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            className="rounded-0 me-2"
                            onClick={() => handleConsultation(patient)}
                          >
                            <PersonVcard />
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            className="rounded-0"
                            onClick={() => handlePrescription(patient)}
                          >
                            <FileEarmarkMedical />
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
                  variant="primary"
                  size="sm"
                  className="rounded-0"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <Button
                  variant="primary"
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
            <Row>
              {/* Student ID */}
              <Col md={6}>
                <Form.Group controlId="formStudentId" className="mb-3">
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter student ID"
                    name="student_id"
                    value={newPatient.student_id}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Full Name */}
              <Col md={6}>
                <Form.Group controlId="formFullName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    name="full_name"
                    value={newPatient.full_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Email */}
              <Col md={6}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={newPatient.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Course */}
              <Col md={6}>
                <Form.Group controlId="formCourse" className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course (e.g., BSIT)"
                    name="course"
                    value={newPatient.course}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Year */}
              <Col md={6}>
                <Form.Group controlId="formYear" className="mb-3">
                  <Form.Label>Year Level</Form.Label>
                  <Form.Select
                    name="year"
                    value={newPatient.year}
                    onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Birthdate */}
              <Col md={6}>
                <Form.Group controlId="formBirthdate" className="mb-3">
                  <Form.Label>Birthdate</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthdate"
                    value={newPatient.birthdate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Sex */}
              <Col md={6}>
                <Form.Group controlId="formSex" className="mb-3">
                  <Form.Label>Sex</Form.Label>
                  <Form.Select
                    name="sex"
                    value={newPatient.sex}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Contact Number */}
              <Col md={6}>
                <Form.Group controlId="formContactNumber" className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact number"
                    name="contact_number"
                    value={newPatient.contact_number}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Address */}
              <Col md={6}>
                <Form.Group controlId="formAddress" className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    name="address"
                    value={newPatient.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Emergency Contact Person */}
              <Col md={6}>
                <Form.Group controlId="formContactPerson" className="mb-3">
                  <Form.Label>Emergency Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter emergency contact person"
                    name="contact_person"
                    value={newPatient.contact_person}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Emergency Contact Number */}
              <Col md={6}>
                <Form.Group controlId="formContactPersonNumber" className="mb-3">
                  <Form.Label>Emergency Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter emergency contact number"
                    name="contact_person_number"
                    value={newPatient.contact_person_number}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter a password"
                    name="password"
                    value={newPatient.password}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
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

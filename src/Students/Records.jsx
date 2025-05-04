import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Badge, ListGroup, Table, Image, Button, ButtonGroup, Modal, Form } from 'react-bootstrap';
import { PersonFill } from 'react-bootstrap-icons';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import CalculateAge from '../extra/CalculateAge';
import FormatDate from '../extra/DateFormat';
import StudentLogs from '../Patients/components/StudentLogs';
import StudentPrescriptions from '../Patients/components/StudentPrescription';
import { useAuth } from '../../AuthContext';
import EditUserModal from '../extra/EditUserModal';
import { io } from 'socket.io-client';
function Records() {
  const { user } = useAuth();
  const [exam, setExam] = useState({});
  const [findings, setFindings] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);
  const [studentPrescriptions, setStudentPrescriptions] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [viewMode, setViewMode] = useState('APE');
  const [patient, setPatient] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const bodyParts = [
    'Skin', 'Lungs', 'Nose', 'Heart', 'Mouth', 'Abdomen', 'Pharynx', 'Rectum',
    'Tonsils', 'Genitalia', 'Gums', 'Spine', 'Lymph nodes', 'Arms', 'Neck',
    'Legs', 'Chest', 'Feet'
  ];
  const fetchData = async () => {
    try {
      const [examRes, logsRes, prescriptionRes, userData] = await Promise.all([
        axios.get(`${import.meta.env.VITE_GET_ANNUAL_PHYSICAL_EXAM_BY_ID}/${user?.id}`),
        axios.get(`${import.meta.env.VITE_GET_STUDENT_LOGS_BY_ID}/${user?.id}`),
        axios.get(`${import.meta.env.VITE_GET_PRESCRIPTIONS_BY_USER}/${user?.id}`),
        axios.get(`${import.meta.env.VITE_GET_USER_DETAILS}/${user?.id}`),

      ]);
      setPatient(userData.data[0] || {});

      const allExams = examRes.data.exam || [];
      setExams(allExams);

      if (allExams.length > 0) {
        const latest = allExams[0];
        setSelectedExamId(latest.id);
        setExam(latest);
        setFindings(Array.isArray(latest.findings) ? latest.findings : []);
      }

      setStudentLogs(logsRes.data || []);
      setStudentPrescriptions(prescriptionRes.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateAPE', (user_id) => {
      if (user.id == user_id.user_id) {
        fetchData();
      }
    });

    socket.on('updateUser', () => {
      console.log("Yes");
        fetchData();
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);


  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };
  const handleExamChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setSelectedExamId(selectedId);

    const selected = exams.find(exam => exam.id === selectedId);
    if (selected) {
      setExam(selected);
      setFindings(Array.isArray(selected.findings) ? selected.findings : []);
    }
  };
  const handleSave = () => {
    fetchData();

  };
  const safePatient = patient || [];
  const safeExam = exam || {};
  const safeFindings = findings || [];

  return (
    <Container className="pb-5">
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <PersonFill size={28} />
            <h5 className="mb-0">{safePatient.full_name}</h5>
            <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(patient)}>
              <i className="bi bi-pencil"></i>
            </Button>
          </div>

          <ButtonGroup>
            <Button variant={viewMode === 'APE' ? 'success' : 'outline-success'} onClick={() => setViewMode('APE')}>APE</Button>
            <Button variant={viewMode === 'Logs' ? 'success' : 'outline-success'} onClick={() => setViewMode('Logs')}>Logs</Button>
            <Button variant={viewMode === 'Prescriptions' ? 'success' : 'outline-success'} onClick={() => setViewMode('Prescriptions')}>Prescriptions</Button>
          </ButtonGroup>
        </Card.Header>

        <Card.Body>
          {/* Basic Student Info */}
          <Row className="mb-3">
            {/* Left Column: Patient Basic Info */}
            <Col md={4}>
              <Card className="mb-3 shadow-sm">
                <Card.Body className="text-center">
                  <Image
                    src={safePatient.profile_pic}
                    roundedCircle
                    fluid
                    style={{ maxHeight: '100px' }}
                    className="mb-2"
                  />
                  <h6 className="fw-bold">{safePatient.full_name || safePatient.name}</h6>
                  <p className="text-muted small mb-1">{safePatient.email}</p>
                  <ListGroup variant="flush" className="text-start mt-3">
                    <ListGroup.Item><strong>Student ID:</strong> {safePatient.student_id}</ListGroup.Item>
                    <ListGroup.Item><strong>Age:</strong> {CalculateAge(safePatient.birthdate)}</ListGroup.Item>
                    <ListGroup.Item><strong>Sex:</strong> {safePatient.sex}</ListGroup.Item>
                    <ListGroup.Item><strong>Course & Year:</strong> {safePatient.course} - {safePatient.year}</ListGroup.Item>
                    <ListGroup.Item><strong>Address:</strong> {safePatient.address}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact #:</strong> {safePatient.contact_number}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact Person:</strong> {safePatient.contact_person}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact Person #:</strong> {safePatient.contact_person_number}</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              {/* View Modes */}
              {viewMode === 'APE' && (
                <>
                  <Card className="mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Annual Physical Exam</h6>
                      <div className="d-flex align-items-center gap-2">
                        <select
                          className="form-select form-select-sm w-auto"
                          value={selectedExamId || ''}
                          onChange={handleExamChange}
                        >
                          {exams.map((e) => (
                            <option key={e.id} value={e.id}>
                              {FormatDate(e.date_examined, false)} - {e.physician || 'Physician'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <h6 className="text-muted mb-3">Vital Signs</h6>
                      <Row>
                        <Col md={6}>
                          <ListGroup variant="flush">
                            <ListGroup.Item><strong>BP:</strong> {safeExam.bp}</ListGroup.Item>
                            <ListGroup.Item><strong>HR:</strong> {safeExam.heart_rate}</ListGroup.Item>
                            <ListGroup.Item><strong>RR:</strong> {safeExam.rr}</ListGroup.Item>
                            <ListGroup.Item><strong>Temp:</strong> {safeExam.temp}</ListGroup.Item>
                          </ListGroup>
                        </Col>
                        <Col md={6}>
                          <ListGroup variant="flush">
                            <ListGroup.Item><strong>Height:</strong> {safeExam.height}</ListGroup.Item>
                            <ListGroup.Item><strong>Weight:</strong> {safeExam.weight}</ListGroup.Item>
                            <ListGroup.Item><strong>BMI:</strong> {safeExam.bmi}</ListGroup.Item>
                          </ListGroup>
                        </Col>
                      </Row>
                      <hr />
                      {/* Vision and Others */}
                      <h6 className="text-muted mb-3">Other Health Information</h6>
                      <Table bordered size="sm" responsive>
                        <tbody>
                          <tr><th>Vision OD</th><td>{safeExam.vision_od}</td></tr>
                          <tr><th>Vision OS</th><td>{safeExam.vision_os}</td></tr>
                          <tr><th>Hearing (Right)</th><td>{safeExam.hearing_right}</td></tr>
                          <tr><th>Hearing (Left)</th><td>{safeExam.hearing_left}</td></tr>
                          <tr><th>Asthma History</th><td>{safeExam.asthma}</td></tr>
                          <tr><th>Allergies</th><td>{safeExam.allergies}</td></tr>
                          <tr><th>Medical Condition</th><td>{safeExam.medical_condition}</td></tr>
                        </tbody>
                      </Table>

                      <hr />

                      {/* Findings */}
                      <h6 className="text-muted mb-3">Body Parts Findings</h6>
                      <Table bordered size="sm" responsive>
                        <thead>
                          <tr>
                            <th>Body Part</th>
                            <th>Status</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bodyParts.map((part, idx) => {
                            const finding = safeFindings.find(f => f.body_part === part);
                            const status = finding ? finding.status : 'NA';
                            const notes = finding ? finding.notes : '-';
                            return (
                              <tr key={idx}>
                                <td>{part}</td>
                                <td className="text-center">
                                  <Badge bg={status === 'A' ? 'danger' : status === 'N' ? 'success' : 'secondary'}>
                                    {status}
                                  </Badge>
                                </td>
                                <td>{notes}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </>
              )}

              {viewMode === 'Logs' && (
                <>
                  <h5 className="mb-3">Student Logs</h5>
                  <StudentLogs logs={studentLogs} />
                </>
              )}

              {viewMode === 'Prescriptions' && (
                <>
                  <StudentPrescriptions prescriptions={studentPrescriptions} />
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <EditUserModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        initialData={selectedPatient}
        onSave={handleSave}
      />
    </Container>
  );
}

export default Records;

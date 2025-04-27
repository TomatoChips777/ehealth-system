
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Modal } from 'react-bootstrap';
import axios from 'axios';
import PhysicalExamDetails from './PhysicalExamDetails';
import StudentLogs from '../Patients/components/StudentLogs';

function Consultation() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;
  const [showAPE, setShowAPE] = useState(false);
  const [apeData, setApeData] = useState(null);
  const [studentLogs, setStudentLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    full_name: '',
    student_id: '',
    email: '',
    complaint: '',
    intervention: '',
    remarks: '',
    sex: '',
    birthdate: '',
    course: '',
  });

  const [showModal, setShowModal] = useState(false);
  const fetchStudents = async () => {
    try {
      const patientRes = await axios.get(`${import.meta.env.VITE_GET_PATIENTS}`);
      setStudents(patientRes.data);

      const userId = patientRes.data[0]?.user_id || formData.user_id;
      if (!userId) {
        console.error("No user ID found to fetch logs.");
        return;
      }

      const logsRes = await axios.get(`${import.meta.env.VITE_GET_STUDENT_LOGS_BY_ID}/${userId}`);
      setStudentLogs(logsRes.data);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  useEffect(() => {


    fetchStudents();
  }, []);

  useEffect(() => {
    if (patient) {
      setFormData((prev) => ({
        ...prev,
        user_id: patient.user_id,
        full_name: patient.full_name,
        student_id: patient.student_id,
        email: patient.email,
        complaint: patient.complaint,
        sex: patient.sex,
        birthdate: patient.birthdate,
        course: patient.course_and_year,
      }));
    }
  }, [patient]);

  useEffect(() => {
    if (!patient) {
      if (formData.student_id.trim() === '') {
        setFormData(prev => ({
          ...prev,
          user_id: '',
          full_name: '',
          email: '',
          complaint: '',
          intervention: '',
          remarks: '',
          sex: '',
          birthdate: '',
          course: '',
        }));
        setShowAPE(false);
      } else {
        const matched = students.find(s => s.student_id.startsWith(formData.student_id));
        if (matched) {
          setFormData(prev => ({
            ...prev,
            user_id: matched.user_id,
            full_name: matched.full_name,
            email: matched.email,
            sex: matched.sex,
            birthdate: matched.birthdate,
            course: matched.course_and_year,
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            user_id: '',
            full_name: '',
            email: '',
            sex: '',
            birthdate: '',
            course: '',
          }));
        }
      }
    }
  }, [formData.student_id, students, patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newForm = {
      user_id: formData.user_id,
      complaint: formData.complaint,
      intervention: formData.intervention,
      remarks: formData.remarks
    };

    try {

      const response = await axios.post(`${import.meta.env.VITE_POST_STUDENT_LOGS}`, newForm);
      fetchStudents();
      setShowModal(true);
    } catch (error) {
      console.log("errors", error);
    }


    // console.log('Consultation submitted:', formData);

  };

  const handleModalClose = () => setShowModal(false);

  const handleGoToPrescription = () => {
    navigate('/prescriptions', { state: { patient: formData } });
  };

  const handleGoBackToPatient = () => {
    navigate('/patient');
  };

  const handleToggleAPE = () => {
    setShowAPE(prevState => !prevState);
  };

  return (
    <Container className='d-flex justify-content-between'>
      <Card style={{ flex: 1 }}>
        <Card.Header className="d-flex justify-content-between">
          <strong>Consultation Form</strong>
          {formData.full_name && (
            <Button variant="success" size="sm" onClick={handleToggleAPE} className="text-nowrap">
              {showAPE
                ? `Hide Logs & APE`
                : `Show Logs & APE`
              }
            </Button>
          )}

        </Card.Header>
        <Card.Body className="d-flex flex-column">
          <Form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
            <div className="flex-grow-1">
              <Form.Group className="mb-3">
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  placeholder="Search Student ID"
                  readOnly={!!patient}
                />
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
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Intervention</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="intervention"
                  value={formData.intervention}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Submit Consultation
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <div className="ms-1">
        {showAPE &&
          <>
            <StudentLogs logs={studentLogs} />
            <PhysicalExamDetails patient={patient || formData} />
          </>
        }
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Continue to Prescription?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to proceed to the prescription, or go back to the patient list?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGoBackToPatient}>
            Back to Patient
          </Button>
          <Button variant="primary" onClick={handleGoToPrescription}>
            Go to Prescription
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default Consultation;

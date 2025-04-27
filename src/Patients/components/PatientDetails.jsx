// import React, { useState, useEffect } from 'react';
// import { Card, Container, Row, Col, Badge, ListGroup, Table, Image, Button } from 'react-bootstrap';
// import { PersonFill } from 'react-bootstrap-icons';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import CalculateAge from '../../extra/CalculateAge';
// import FormatDate from '../../extra/DateFormat';
// import StudentLogs from './StudentLogs';

// function PatientDetails() {
// const navigate = useNavigate();
// const location = useLocation();
// const { patient } = location.state || {};

// const [exam, setExam] = useState({});
// const [findings, setFindings] = useState([]);
// const [studentLogs, setStudentLogs] = useState([]);
// const [exams, setExams] = useState([]);
// const [selectedExamId, setSelectedExamId] = useState(null);

// const bodyParts = [
//   'Skin', 'Lungs', 'Nose', 'Heart', 'Mouth', 'Abdomen', 'Pharynx', 'Rectum',
//   'Tonsils', 'Genitalia', 'Gums', 'Spine', 'Lymph nodes', 'Arms', 'Neck',
//   'Legs', 'Chest', 'Feet'
// ];


// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const [examRes, logsRes] = await Promise.all([
//         axios.get(`${import.meta.env.VITE_GET_ANNUAL_PHYSICAL_EXAM_BY_ID}/${patient?.user_id}`),
//         axios.get(`${import.meta.env.VITE_GET_STUDENT_LOGS_BY_ID}/${patient?.user_id}`)
//       ]);

//       const allExams = examRes.data.exam || [];
//       setExams(allExams);

//       if (allExams.length > 0) {
//         const latest = allExams[0];
//         setSelectedExamId(latest.id);
//         setExam(latest);
//         setFindings(Array.isArray(latest.findings) ? latest.findings : []);
//       }

//       setStudentLogs(logsRes.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   fetchData();
// }, [patient?.user_id]);

// const handleExamChange = (e) => {
//   const selectedId = parseInt(e.target.value);
//   setSelectedExamId(selectedId);

//   const selected = exams.find(exam => exam.id === selectedId);
//   if (selected) {
//     setExam(selected);
//     setFindings(Array.isArray(selected.findings) ? selected.findings : []);
//   }
// };

// const handleAnnualReport = () => navigate('/annualreport', { state: { basic_info: patient } });
// const handleEditAnualReport = () => navigate('/annualreport', { state: { patient: { ...patient, exams } } });

// const safePatient = patient || {};
// const safeExam = exam || {};
// const safeFindings = findings || [];

//   return (
//     <Container className="pb-5">
//       {/* Patient Basic Info */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Header className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center gap-2">
//             <PersonFill size={28} />
//             <h5 className="mb-0">{safePatient.full_name}</h5>
//           </div>
//           <div className="d-flex gap-2">
//           <div className="d-flex justify-content-end">
//             <select
//               className="form-select form-select-sm w-auto"
//               value={selectedExamId || ''}
//               onChange={handleExamChange}
//             >
//               {exams.map((e) => (
//                 <option key={e.id} value={e.id}>
//                   {FormatDate(e.date_examined, false)} - {e.physician || 'Physician'}
//                 </option>
//               ))}
//             </select>
//           </div>
//             <Button size="sm" variant="success" onClick={handleAnnualReport}>New Report</Button>
//             <Button size="sm" variant="warning" onClick={handleEditAnualReport}>Edit</Button>
//           </div>
//         </Card.Header>

//         <Card.Body>
//           <Row className="mb-3">
//             <Col md={3} className="text-center">
//               <Image
//                 src={safePatient.profile_pic}
//                 roundedCircle
//                 fluid
//                 style={{ maxHeight: '100px' }}
//                 className="mb-2"
//               />
//               <p className="fw-bold mb-0">{safePatient.full_name}</p>
//               <small className="text-muted">{safePatient.email}</small>
//             </Col>

//             <Col md={9}>
//               <Row>
//                 <Col md={6}>
//                   <ListGroup variant="flush">
//                     <ListGroup.Item><strong>Student ID:</strong> {safePatient.student_id}</ListGroup.Item>
//                     <ListGroup.Item><strong>Age:</strong> {CalculateAge(safePatient.birthdate)}</ListGroup.Item>
//                     <ListGroup.Item><strong>Sex:</strong> {safePatient.sex}</ListGroup.Item>
//                     <ListGroup.Item><strong>Address:</strong> {safePatient.address}</ListGroup.Item>
//                   </ListGroup>
//                 </Col>
//                 <Col md={6}>
//                   <ListGroup variant="flush">
//                     <ListGroup.Item><strong>Contact No.:</strong> {safePatient.contact_number}</ListGroup.Item>
//                     <ListGroup.Item><strong>Contact Person:</strong> {safePatient.contact_person}</ListGroup.Item>
//                     <ListGroup.Item><strong>Contact Person No.:</strong> {safePatient.contact_person_number}</ListGroup.Item>
//                   </ListGroup>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>

//           {/* Exam Selection */}


//           <hr />

//           {/* Vitals */}
//           <h6 className="text-muted mb-3">Vital Signs</h6>
//           <Row>
//             <Col md={6}>
//               <ListGroup variant="flush">
//                 <ListGroup.Item><strong>BP:</strong> {safeExam.bp}</ListGroup.Item>
//                 <ListGroup.Item><strong>HR:</strong> {safeExam.heart_rate}</ListGroup.Item>
//                 <ListGroup.Item><strong>RR:</strong> {safeExam.rr}</ListGroup.Item>
//                 <ListGroup.Item><strong>Temp:</strong> {safeExam.temp}</ListGroup.Item>
//               </ListGroup>
//             </Col>
//             <Col md={6}>
//               <ListGroup variant="flush">
//                 <ListGroup.Item><strong>Height:</strong> {safeExam.height}</ListGroup.Item>
//                 <ListGroup.Item><strong>Weight:</strong> {safeExam.weight}</ListGroup.Item>
//                 <ListGroup.Item><strong>BMI:</strong> {safeExam.bmi}</ListGroup.Item>
//               </ListGroup>
//             </Col>
//           </Row>

//           <hr />

//           {/* Vision, Hearing, Medical Conditions */}
//           <h6 className="text-muted mb-3">Other Health Information</h6>
//           <Table bordered size="sm" responsive>
//             <tbody>
//               <tr><th>Vision OD</th><td>{safeExam.vision_od}</td></tr>
//               <tr><th>Vision OS</th><td>{safeExam.vision_os}</td></tr>
//               <tr><th>Hearing (Right)</th><td>{safeExam.hearing_right}</td></tr>
//               <tr><th>Hearing (Left)</th><td>{safeExam.hearing_left}</td></tr>
//               <tr><th>Asthma History</th><td>{safeExam.asthma}</td></tr>
//               <tr><th>Allergies</th><td>{safeExam.allergies}</td></tr>
//               <tr><th>Medical Condition</th><td>{safeExam.medical_condition}</td></tr>
//             </tbody>
//           </Table>

//           <hr />

//           {/* Body Parts Findings */}
//           <h6 className="text-muted mb-3">Body Parts Findings</h6>
//           <Table bordered size="sm" responsive>
//             <thead>
//               <tr>
//                 <th>Body Part</th>
//                 <th className="text-center">Status</th>
//                 <th>Notes</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bodyParts.map((part, idx) => {
//                 const finding = safeFindings.find(f => f.body_part === part);
//                 const status = finding ? finding.status : 'NA';
//                 const notes = finding ? finding.notes : '-';
//                 return (
//                   <tr key={idx}>
//                     <td>{part}</td>
//                     <td className="text-center">
//                       <Badge bg={status === 'A' ? 'danger' : status === 'N' ? 'success' : 'secondary'}>
//                         {status}
//                       </Badge>
//                     </td>
//                     <td>{notes}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>

//           <hr />
//           {/* Summary Section */}
//           <h6 className="text-muted mb-3">Summary</h6>
//           <p><strong>Remarks:</strong> {safeExam.remarks}</p>
//           <p><strong>Assessment:</strong> {safeExam.assessment}</p>
//           <p><strong>Recommendation:</strong> {safeExam.recommendation}</p>

//           <div className="d-flex justify-content-between mt-3 mb-2">
//             <small><strong>Date Examined:</strong> {FormatDate(safeExam.date_examined, false)}</small>
//             <small><strong>Physician Signature:</strong> _____________________</small>
//           </div>

//           {/* Student Logs */}
//           {studentLogs.length > 0 && (
//             <>
//               <StudentLogs logs={studentLogs} />
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// }

// export default PatientDetails;
import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Badge, ListGroup, Table, Image, Button, ButtonGroup } from 'react-bootstrap';
import { PersonFill } from 'react-bootstrap-icons';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import CalculateAge from '../../extra/CalculateAge';
import FormatDate from '../../extra/DateFormat';
import StudentLogs from './StudentLogs';
import StudentPrescriptions from './StudentPrescription';

function PatientDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patient } = location.state || {};


  const [exam, setExam] = useState({});
  const [findings, setFindings] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);
  const [studentPrescriptions, setStudentPrescriptions] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [viewMode, setViewMode] = useState('APE');

  const bodyParts = [
    'Skin', 'Lungs', 'Nose', 'Heart', 'Mouth', 'Abdomen', 'Pharynx', 'Rectum',
    'Tonsils', 'Genitalia', 'Gums', 'Spine', 'Lymph nodes', 'Arms', 'Neck',
    'Legs', 'Chest', 'Feet'
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, logsRes, prescriptionRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_GET_ANNUAL_PHYSICAL_EXAM_BY_ID}/${patient?.user_id}`),
          axios.get(`${import.meta.env.VITE_GET_STUDENT_LOGS_BY_ID}/${patient?.user_id}`),
          axios.get(`${import.meta.env.VITE_GET_PRESCRIPTIONS_BY_USER}/${patient?.user_id}`)
        ]);

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

    fetchData();
  }, [patient?.user_id]);

  const handleExamChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setSelectedExamId(selectedId);

    const selected = exams.find(exam => exam.id === selectedId);
    if (selected) {
      setExam(selected);
      setFindings(Array.isArray(selected.findings) ? selected.findings : []);
    }
  };
  const handleAnnualReport = () => navigate('/annualreport', { state: { basic_info: patient } });
  const handleEditAnualReport = () => navigate('/annualreport', { state: { patient: { ...patient, exams } } });

  const safePatient = patient || {};
  const safeExam = exam || {};
  const safeFindings = findings || [];

  return (
    <Container className="pb-5">
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <PersonFill size={28} />
            <h5 className="mb-0">{safePatient.full_name}</h5>
          </div>
          <div className="d-flex gap-2">
            <ButtonGroup>
              <Button variant={viewMode === 'APE' ? 'success' : 'outline-success'} onClick={() => setViewMode('APE')}>APE</Button>
              <Button variant={viewMode === 'Logs' ? 'success' : 'outline-success'} onClick={() => setViewMode('Logs')}>Logs</Button>
              <Button variant={viewMode === 'Prescriptions' ? 'success' : 'outline-success'} onClick={() => setViewMode('Prescriptions')}>Prescriptions</Button>
            </ButtonGroup>
          </div>
        </Card.Header>

        <Card.Body>
          <Row className="mb-3">
            <Col md={3} className="text-center">
              <Image
                src={safePatient.profile_pic}
                roundedCircle
                fluid
                style={{ maxHeight: '100px' }}
                className="mb-2"
              />
              <p className="fw-bold mb-0">{safePatient.full_name}</p>
              <small className="text-muted">{safePatient.email}</small>
            </Col>

            <Col md={9}>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Student ID:</strong> {safePatient.student_id}</ListGroup.Item>
                    <ListGroup.Item><strong>Age:</strong> {CalculateAge(safePatient.birthdate)}</ListGroup.Item>
                    <ListGroup.Item><strong>Sex:</strong> {safePatient.sex}</ListGroup.Item>
                  <ListGroup.Item><strong>Course & Year:</strong> {safePatient.course} - {safePatient.year}</ListGroup.Item>

                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                  <ListGroup.Item><strong>Address:</strong> {safePatient.address}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact No.:</strong> {safePatient.contact_number}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact Person:</strong> {safePatient.contact_person}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact Person No.:</strong> {safePatient.contact_person_number}</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>

          {viewMode === 'APE' && (
            <>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Annual Physical Exam</h5>
                  <div className="d-flex gap-2 align-items-center">
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
                    <Button size="sm" variant="success" onClick={handleAnnualReport}>
                      New Report
                    </Button>
                    <Button size="sm" variant="warning" onClick={handleEditAnualReport}>
                      Edit
                    </Button>
                  </div>
                </Card.Header>

                <Card.Body>
                  {/* Vital Signs */}
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

                  {/* Vision, Hearing, Medical Conditions */}
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

                  {/* Body Parts Findings */}
                  <h6 className="text-muted mb-3">Body Parts Findings</h6>
                  <Table bordered size="sm" responsive>
                    <thead>
                      <tr>
                        <th>Body Part</th>
                        <th className="text-center">Status</th>
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

                  <hr />

                  {/* Summary */}
                  <h6 className="text-muted mb-3">Summary</h6>
                  <p><strong>Remarks:</strong> {safeExam.remarks}</p>
                  <p><strong>Assessment:</strong> {safeExam.assessment}</p>
                  <p><strong>Recommendation:</strong> {safeExam.recommendation}</p>

                  <div className="d-flex justify-content-between mt-3">
                    <small><strong>Date Examined:</strong> {FormatDate(safeExam.date_examined, false)}</small>
                    <small><strong>Physician Signature:</strong> _____________________</small>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}

          {viewMode === 'Logs' && (
            <>
              {studentLogs.length > 0 ? (
                <StudentLogs logs={studentLogs} />
              ) : (
                <p className="text-muted">No logs available.</p>
              )}
            </>
          )}

          {viewMode === 'Prescriptions' && (
            <>
              {studentPrescriptions.length > 0 ? (
                <StudentPrescriptions prescriptions={studentPrescriptions} />
              ) : (
                <p className="text-muted">No prescriptions found.</p>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PatientDetails;

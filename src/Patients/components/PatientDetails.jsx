import React from 'react';
import { Card, Container, Row, Col, Badge, ListGroup, Table, Image } from 'react-bootstrap';
import { PersonFill } from 'react-bootstrap-icons';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, CartesianGrid, Bar, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';
function PatientDetails() {
  const location = useLocation(); // Use `useLocation` to get the state passed via navigate
  const { patient, exam, findings }= location.state || {};
  console.log(patient)
  const dummyPatient = {
    student_id: '123456',
    full_name: 'Jane Doe',
    email: 'jane.doe@example.com',
    profile_pic: 'https://via.placeholder.com/120x120.png?text=Profile'
  };

  const dummyExam = {
    bp: '120/80',
    temp: '36.6',
    heart_rate: '72',
    rr: '18',
    height: '165 cm',
    weight: '60 kg',
    bmi: '22.5',
    asthma: 'No history',
    allergies: 'None reported',
    medical_condition: 'None',
    vision_od: '20/20',
    vision_os: '20/25',
    hearing_right: 'Normal',
    hearing_left: 'Normal',
    remarks: 'Fit for school activities',
    assessment: 'Normal',
    recommendation: 'Annual follow-up recommended',
    date_examined: '2024-03-01'
  };

  const dummyFindings = {
    Skin: { status: 'A', note: 'Rash on left arm' },
    Lungs: { status: 'N', note: '' },
    Nose: { status: 'NA', note: '' },
    Heart: { status: 'N', note: '' },
    Mouth: { status: 'N', note: '' },
    Abdomen: { status: 'N', note: '' },
    Pharynx: { status: 'N', note: '' },
    Rectum: { status: 'NA', note: '' },
    Tonsils: { status: 'N', note: '' },
    Genitalia: { status: 'NA', note: '' },
    Gums: { status: 'N', note: '' },
    Spine: { status: 'N', note: '' },
    Lymph_nodes: { status: 'N', note: '' },
    Arms: { status: 'N', note: '' },
    Neck: { status: 'N', note: '' },
    Legs: { status: 'N', note: '' },
    Chest: { status: 'N', note: '' },
    Feet: { status: 'N', note: '' }
  };

  const safePatient = patient || dummyPatient;
  const safeExam = exam || dummyExam;
  const safeFindings = findings || dummyFindings;

  const findingsStats = Object.entries(safeFindings).reduce((acc, [_, { status }]) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(findingsStats).map(([status, count]) => {
    const parts = Object.entries(safeFindings)
      .filter(([_, finding]) => finding.status === status)
      .map(([part]) => part.replace('_', ' ')).join(', ');
    return {
      name: status,
      value: count,
      details: parts || 'None'
    };
  });
  const COLORS = ['#28a745', '#ffc107', '#dc3545'];

  return (
    <Container className="" fluid>
      <Card className="mb-4 shadow">
        <Card.Header as="h4" className="d-flex align-items-center gap-2">
          <PersonFill size={28} />
          {safePatient.full_name}'s Medical Overview
        </Card.Header>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <Image src={safePatient.profile_pic} roundedCircle fluid className="mb-3" style={{ maxHeight: '120px' }} />
              <div><strong>{safePatient.full_name}</strong></div>
              <div className="text-muted">{safePatient.email}</div>
            </Col>
            <Col md={9}>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Student ID:</strong> {safePatient.student_id}</ListGroup.Item>
                    <ListGroup.Item><strong>Age:</strong> {patient.age}</ListGroup.Item>
                    <ListGroup.Item><strong>Sex:</strong> {patient.sex}</ListGroup.Item>
                    <ListGroup.Item><strong>Address:</strong> {patient.address}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact Number:</strong> {patient.contact_number}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact Person:</strong> {patient.contact_person}</ListGroup.Item>
                    <ListGroup.Item><strong>Contact Person's Number:</strong> {patient.contact_person_number}</ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>BP:</strong> {safeExam.bp}</ListGroup.Item>
                    <ListGroup.Item><strong>HR:</strong> {safeExam.heart_rate}</ListGroup.Item>
                    <ListGroup.Item><strong>RR:</strong> {safeExam.rr}</ListGroup.Item>
                    <ListGroup.Item><strong>Temp:</strong> {safeExam.temp}</ListGroup.Item>
                    <ListGroup.Item><strong>Height:</strong> {safeExam.height}</ListGroup.Item>
                    <ListGroup.Item><strong>Weight:</strong> {safeExam.weight}</ListGroup.Item>
                    <ListGroup.Item><strong>BMI:</strong> {safeExam.bmi}</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className="shadow">
        <Card.Header as="h5" >Summary of Physical Examination</Card.Header>
        <Card.Body>
          <Table bordered responsive className="mb-3">
            <thead>
              <tr>
                <th>Body Part</th>
                <th className='text-center'>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(safeFindings).map(([part, { status, note }]) => (
                <tr key={part}>
                  <td>{part.replace('_', ' ')}</td>
                  <td className='text-center'>
                    <Badge bg={status === 'A' ? 'danger' : status === 'N' ? 'success' : 'secondary'} className='rounded-0'>
                      {status}
                    </Badge>
                  </td>
                  <td>{note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <hr className='border-3 border-success  '/>
          <Table bordered responsive className="mb-3">
            <tbody>
              <tr><th>Vision OD</th><td>{safeExam.vision_od}</td></tr>
              <tr><th>Vision OS</th><td>{safeExam.vision_os}</td></tr>
              <tr><th>Hearing (Right)</th><td>{safeExam.hearing_right}</td></tr>
              <tr><th>Hearing (Left)</th><td>{safeExam.hearing_left}</td></tr>
              <tr><th>Asthma History</th><td>{safeExam.asthma}</td></tr>
              <tr><th>Allergies</th><td>{safeExam.allergies}</td></tr>
              <tr><th>Medical Condition</th><td>{safeExam.medical_condition}</td></tr>
              <tr><th>Remarks</th><td>{safeExam.remarks}</td></tr>
            </tbody>
          </Table>

          <p><strong>Assessment:</strong> {safeExam.assessment}</p>
          <p><strong>Recommendation:</strong> {safeExam.recommendation}</p>
          <p><strong>Date Examined:</strong> {safeExam.date_examined}</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PatientDetails;

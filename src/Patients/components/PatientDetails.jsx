import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Badge, ListGroup, Table, Image } from 'react-bootstrap';
import { PersonFill } from 'react-bootstrap-icons';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import CalculateAge from '../../extra/CalculateAge';
import FormatDate from '../../extra/DateFormat';

function PatientDetails() {
  const location = useLocation();
  const { patient } = location.state || {};
  const [exam, setExam] = useState({});
  const [findings, setFindings] = useState([]);

  const bodyParts = [
    'Skin', 'Lungs', 'Nose', 'Heart', 'Mouth', 'Abdomen', 'Pharynx', 'Rectum',
    'Tonsils', 'Genitalia', 'Gums', 'Spine', 'Lymph nodes', 'Arms', 'Neck',
    'Legs', 'Chest', 'Feet'
  ];


  useEffect(() => {
    const fetchAnnualPhysicalExams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_GET_ANNUAL_PHYSICAL_EXAM_BY_ID}/${patient?.id}`);
        const examData = response.data.exam || {};
        setExam(examData);
        // Ensure findings are an array, even if it's a single object
        setFindings(Array.isArray(examData.findings) ? examData.findings : [examData.findings]);
      } catch (error) {
        console.error('Error fetching annual physical exams:', error);
      }
    };

    fetchAnnualPhysicalExams();
  }, [patient?.id]);

  const safePatient = patient || [];
  const safeExam = exam || [];
  const safeFindings = findings || [];

  return (
    <Container>
      <Card className="mb-4 shadow">
        <Card.Header as="h4" className="d-flex align-items-center gap-2">
          <PersonFill size={28} />
          {safePatient.full_name}'s Medical Overview
        </Card.Header>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <Image
                src={safePatient.profile_pic}
                roundedCircle
                fluid
                className="mb-3"
                style={{ maxHeight: '120px' }}
              />
              <div>
                <strong>{safePatient.full_name}</strong>
              </div>
              <div className="text-muted">{safePatient.email}</div>
            </Col>
            <Col md={9}>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Student ID:</strong> {safePatient.student_id}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Age:</strong> {CalculateAge(safePatient.birthdate)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Sex:</strong> {safePatient.sex}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Address:</strong> {safePatient.address}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Contact Number:</strong> {safePatient.contact_number}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Contact Person:</strong> {safePatient.contact_person}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Contact Person's Number:</strong> {safePatient.contact_person_number}
                    </ListGroup.Item>
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
          <hr/>
          <Table bordered responsive className="mb-3">
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


          <Table bordered responsive className="mb-3">
            <thead>
              <tr>
                <th>Body Part</th>
                <th className="text-center">Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {bodyParts.map((bodyPart, index) => {
                // Find the corresponding finding for the body part
                const finding = safeFindings.find(finding => finding.body_part === bodyPart);

                // If a finding is not found, set default values
                const status = finding ? finding.status : 'NA';
                const notes = finding ? finding.notes : '-';

                return (
                  <tr key={index}>
                    <td>{bodyPart}</td>
                    <td className="text-center">
                      <Badge bg={status === 'A' ? 'danger' : status === 'N' ? 'success' : 'secondary'} className="rounded-0">
                        {status}
                      </Badge>
                    </td>
                    <td>{notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <p><strong>Remarks:</strong> {safeExam.remarks}</p>
          <p><strong>Assessment:</strong> {safeExam.assessment}</p>
          <p><strong>Recommendation:</strong> {safeExam.recommendation}</p>
          <div className='d-flex justify-content-between'>
          <p><strong>Date Examined:</strong> {FormatDate(safeExam.date_examined, false)} </p>
          <p><strong> Physician’s Signature:</strong> _____________________ </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default PatientDetails;

import React, { useState, useEffect } from 'react';
import { Card, Container, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import FormatDate from '../extra/DateFormat';

function PhysicalExamDetails({patient}) {
  const [exam, setExam] = useState({});
  const [findings, setFindings] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const bodyParts = [
    'Skin', 'Lungs', 'Nose', 'Heart', 'Mouth', 'Abdomen', 'Pharynx', 'Rectum',
    'Tonsils', 'Genitalia', 'Gums', 'Spine', 'Lymph nodes', 'Arms', 'Neck',
    'Legs', 'Chest', 'Feet'
  ];

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_GET_ANNUAL_PHYSICAL_EXAM_BY_ID}/${patient?.user_id}`);
        const allExams = response.data.exam || [];

        setExams(allExams);
        if (allExams.length > 0) {
          const latest = allExams[0];
          setSelectedExamId(latest.id);
          setExam(latest);
          setFindings(Array.isArray(latest.findings) ? latest.findings : []);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, [patient?.id]);

  const handleExamChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setSelectedExamId(selectedId);
    const selected = exams.find(exam => exam.id === selectedId);
    if (selected) {
      setExam(selected);
      setFindings(Array.isArray(selected.findings) ? selected.findings : []);
    }
  };

  const safeExam = exam || {};
  const safeFindings = findings || [];

  return (
      <Card className=" shadow">
        <Card.Header className="d-flex justify-content-between align-items-center">
        <strong> Physical Exam Details</strong>
          <select
            className="ms-2 form-select form-select-sm w-auto"
            value={selectedExamId || ''}
            onChange={handleExamChange}
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                {FormatDate(e.date_examined, false)} - {e.physician || 'Physician'}
              </option>
            ))}
          </select>
        </Card.Header>
        <Card.Body style={{ fontSize: '0.8rem' }}>

          <Table bordered responsive className="mb-3">
            <tbody>
              <tr><th>BP</th><td>{safeExam.bp}</td></tr>
              <tr><th>HR</th><td>{safeExam.heart_rate}</td></tr>
              <tr><th>RR</th><td>{safeExam.rr}</td></tr>
              <tr><th>Temp</th><td>{safeExam.temp}</td></tr>
              <tr><th>Height</th><td>{safeExam.height}</td></tr>
              <tr><th>Weight</th><td>{safeExam.weight}</td></tr>
              <tr><th>BMI</th><td>{safeExam.bmi}</td></tr>
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
                const finding = safeFindings.find(f => f.body_part === bodyPart);
                const status = finding ? finding.status : 'NA';
                const notes = finding ? finding.notes : '-';

                return (
                  <tr key={index}>
                    <td>{bodyPart}</td>
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

          <p><strong>Remarks:</strong> {safeExam.remarks}</p>
          <p><strong>Assessment:</strong> {safeExam.assessment}</p>
          <p><strong>Recommendation:</strong> {safeExam.recommendation}</p>
            <p><strong>Date Examined:</strong> {FormatDate(safeExam.date_examined, false)}</p>
            <p><strong>Physician’s Signature:</strong> _____________________</p>
        </Card.Body>
      </Card>
  );
}

export default PhysicalExamDetails;

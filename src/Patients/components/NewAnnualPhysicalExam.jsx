import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CalculateAge from '../../extra/CalculateAge';

function NewAnnualPhysicalExam() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;
  const [formData, setFormData] = useState({
    patient_id: patient?.id || '',
    name: patient?.full_name || '',
    age: CalculateAge(patient.birthdate),
    sex: patient.sex || '',
    address: patient.address || '',
    contact_number: patient.contact_number || '',
    contact_person: patient.contact_person || '',
    contact_person_number: patient.contact_person_number || '',
    bp: '',
    temp: '',
    heart_rate: '',
    rr: '',
    height: '',
    weight: '',
    bmi: '',
    asthma: '',
    allergies: '',
    medical_condition: '',
    vision_od: '',
    vision_os: '',
    hearing_right: '',
    hearing_left: '',
    remarks: '',
    assessment: '',
    recommendation: '',
  });

  const [findings, setFindings] = useState({});
  const [loading, setLoading] = useState(true);
  const [existingExamData, setExistingExamData] = useState(null); // To track if exam data exists

  const categories = [
    "Skin", "Lungs", "Nose", "Heart", "Mouth", "Abdomen", "Pharynx", "Rectum", "Tonsils",
    "Genitalia", "Gums", "Spine", "Lymph nodes", "Arms", "Neck", "Legs", "Chest", "Feet"
  ];
  useEffect(() => {

    fetchExamData();
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFindingChange = (e, part, type) => {
    const value = e.target.value;
    setFindings(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        [type]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      ...formData,
      findings
    };

    try {
      if (existingExamData) {
        // If data already exists, send PUT request to update
        console.log(existingExamData);
        const response = await axios.put(`${import.meta.env.VITE_UPDATE_ANNUAL_PHYSICAL_EXAM}/${existingExamData.id}`, requestData);
        alert("Annual Physical Exam updated successfully.");
        fetchExamData();
      } else {
        // If no data exists, send POST request to create
        const response = await axios.post(`${import.meta.env.VITE_ANNUAL_PHYSICAL_EXAM}`, requestData);
        alert("Annual Physical Exam added successfully.");
        fetchExamData();
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <Container>
      <Card>
        <Card.Header as="h5">Annual Physical Examination Form</Card.Header>
        <Card.Body>
          {loading ? (
            <div>Loading exam data...</div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-3"><Form.Label>Age</Form.Label><Form.Control name="age" value={formData.age} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-3"><Form.Label>Sex</Form.Label><Form.Control name="sex" value={formData.sex} onChange={handleChange} /></Form.Group></Col>
              </Row>

              {/* Other form fields here... */}
              <h6 className="mt-4">Vitals</h6>
              <Row>
                {["bp", "temp", "heart_rate", "rr"].map((vital, i) => (
                  <Col md={3} key={i}><Form.Group className="mb-3"><Form.Label>{vital.replace("_", " ").toUpperCase()}</Form.Label><Form.Control name={vital} value={formData[vital]} onChange={handleChange} /></Form.Group></Col>
                ))}
              </Row>

              <Row>
                {["height", "weight", "bmi"].map((metric, i) => (
                  <Col md={4} key={i}><Form.Group className="mb-3"><Form.Label>{metric.toUpperCase()}</Form.Label><Form.Control name={metric} value={formData[metric]} onChange={handleChange} /></Form.Group></Col>
                ))}
              </Row>

              {/* History */}
              <h6 className="mt-4">Medical History</h6>
              <Form.Group className="mb-3"><Form.Label>History of Asthma</Form.Label><Form.Control name="asthma" value={formData.asthma} onChange={handleChange} /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Allergies</Form.Label><Form.Control name="allergies" value={formData.allergies} onChange={handleChange} /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Existing Medical Condition</Form.Label><Form.Control name="medical_condition" value={formData.medical_condition} onChange={handleChange} /></Form.Group>

              {/* Vision & Hearing */}
              <h6 className="mt-4">Vision and Hearing</h6>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>With Glasses - OD</Form.Label><Form.Control name="vision_od" value={formData.vision_od} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>With Glasses - OS</Form.Label><Form.Control name="vision_os" value={formData.vision_os} onChange={handleChange} /></Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Hearing - Right</Form.Label><Form.Control name="hearing_right" value={formData.hearing_right} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Hearing - Left</Form.Label><Form.Control name="hearing_left" value={formData.hearing_left} onChange={handleChange} /></Form.Group></Col>
              </Row>
              {/* Physical Exam Findings */}
              <h6 className="mt-4">Physical Exam Findings</h6>
              {categories.map((part, index) => (
                <Row key={index} className="align-items-center mb-2">
                  <Col md={3}><strong>{part}</strong></Col>
                  <Col md={3}>
                    <Form.Select value={findings[part]?.status || ''} onChange={(e) => handleFindingChange(e, part, "status")}>
                      <option value="NA">NA - Not Assessed</option>
                      <option value="N">N - Normal</option>
                      <option value="A">A - Abnormal</option>
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      placeholder="If abnormal, describe"
                      value={findings[part]?.note || ''}
                      onChange={(e) => handleFindingChange(e, part, "note")}
                    />
                  </Col>
                </Row>
              ))}

              {/* Remarks, Assessment, Recommendation */}
              <Form.Group className="mt-4 mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control as="textarea" rows={2} name="remarks" value={formData.remarks} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Assessment</Form.Label>
                <Form.Select name="assessment" value={formData.assessment} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Normal">Normal Physical Exam</option>
                  <option value="With Limitations">With Limitations</option>
                  <option value="Needs Attention">Needs Attention</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Recommendation</Form.Label>
                <Form.Control as="textarea" rows={2} name="recommendation" value={formData.recommendation} onChange={handleChange} />
              </Form.Group>

              <div className="d-flex justify-content-between">
                              <Button variant='secondary' size='sm' onClick={() => goBack()}>Go Back</Button>
                
                <Button type="submit" variant="primary">
                  {existingExamData ? 'Update' : 'Submit Form'}
                </Button>
              </div>
            </Form>
          )}
          
        </Card.Body>
      </Card>
    </Container>
  );
}

export default NewAnnualPhysicalExam;

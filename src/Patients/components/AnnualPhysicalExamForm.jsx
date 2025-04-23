import React, { useState } from 'react';
import { Container, Form, Row, Col, Button, Card } from 'react-bootstrap';

function AnnualPhysicalExamForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    address: '',
    contact_number: '',
    contact_person: '',
    contact_person_number: '',
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
    date_examined: ''
  });

  const [findings, setFindings] = useState({});

  const categories = [
    "Skin", "Lungs", "Nose", "Heart", "Mouth", "Abdomen", "Pharynx", "Rectum", "Tonsils",
    "Genitalia", "Gums", "Spine", "Lymph nodes", "Arms", "Neck", "Legs", "Chest", "Feet"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFindingChange = (e, part, type) => {
    const value = type === "status" ? e.target.value : e.target.value;
    setFindings(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        [type]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Findings:", findings);
  };

  return (
    <Container className="">
      <Card>
        <Card.Header as="h5">Annual Physical Examination Form</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} /></Form.Group></Col>
              <Col md={3}><Form.Group className="mb-3"><Form.Label>Age</Form.Label><Form.Control name="age" value={formData.age} onChange={handleChange} /></Form.Group></Col>
              <Col md={3}><Form.Group className="mb-3"><Form.Label>Sex</Form.Label><Form.Control name="sex" value={formData.sex} onChange={handleChange} /></Form.Group></Col>
            </Row>

            <Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control name="address" value={formData.address} onChange={handleChange} /></Form.Group>

            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Contact Number</Form.Label><Form.Control name="contact_number" value={formData.contact_number} onChange={handleChange} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Contact Person</Form.Label><Form.Control name="contact_person" value={formData.contact_person} onChange={handleChange} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Contact Person's Number</Form.Label><Form.Control name="contact_person_number" value={formData.contact_person_number} onChange={handleChange} /></Form.Group></Col>
            </Row>

            {/* Vitals */}
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

            {/* Physical Examination Table */}
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
                <option value="Normal">Essentially Normal Physical Examination Findings</option>
                <option value="With Limitations">With Limitation of Activities</option>
                <option value="Needs Attention">Requires Special Attention</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recommendation</Form.Label>
              <Form.Control as="textarea" rows={2} name="recommendation" value={formData.recommendation} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date Examined</Form.Label>
              <Form.Control type="date" name="date_examined" value={formData.date_examined} onChange={handleChange} />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary">Submit Form</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default AnnualPhysicalExamForm;

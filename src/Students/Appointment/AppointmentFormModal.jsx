import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import AutoCompleteInput from './AutoCompleteInput';
import FormatDate from '../../extra/DateFormat';
const formatTime12Hour = (timeString) => {
  const [hour, minute] = timeString.split(':');
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12.toString().padStart(2, '0')}:${minute} ${suffix}`;
};

const AppointmentFormModal = ({
  show,
  onHide,
  title,
  formData,
  studentName,
  complaint,
  selectedDate,
  selectedTime,
  availableDates,
  availableTimes,
  suggestedStudents,
  students,
  setStudentName,
  setFormData,
  setComplaint,
  setSelectedDate,
  setSelectedTime,
  handleChange,
  handleDateChange,
  onSubmit,
  formatLocalDate,
  setSuggestedStudents,
}) => (
  
  <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <AutoCompleteInput
            label="Student ID"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            options={students}
            getOptionLabel={(s) => s.student_id}
            onBlur={() => {
              const found = students.find((s) => s.student_id === formData.student_id);
              if (!found) {
                setFormData((prev) => ({ ...prev, student_id: '' }));
                setStudentName('');
              }
            }}
            disabled={false}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                value={studentName}
                placeholder="Enter name"
                disabled
              />
              {suggestedStudents.length > 0 && (
                <div className="autocomplete-dropdown">
                  {suggestedStudents.map((s) => (
                    <div
                      key={s.id}
                      className="autocomplete-item"
                      onClick={() => {
                        setStudentName(s.full_name);
                        setFormData((prev) => ({
                          ...prev,
                          student_id: s.student_id,
                          user_id: s.user_id,
                        }));
                        setSuggestedStudents([]);
                      }}
                    >
                      {s.full_name}
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Complaint</Form.Label>
              <Form.Control
                type="text"
                value={complaint}
                placeholder="Enter complaint"
                onChange={(e) => setComplaint(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Date</Form.Label>
              <Form.Select
                value={selectedDate ? formatLocalDate(selectedDate) : ''}
                onChange={handleDateChange}
              >
                <option value="">Select a date</option>
                {availableDates.map((date, idx) => (
                  <option key={idx} value={date}>
                    {FormatDate(date, false)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
              {selectedDate && 
              <Col md={6}>
              <Form.Group>
                <Form.Label>Select Time</Form.Label>
                <Form.Select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((time, idx) => (
                    <option key={idx} value={time}>{formatTime12Hour(time)}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
              }
          
        </Row>
        <div className="text-end">
          <Button variant="success" onClick={onSubmit}>Submit</Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>
);

export default AppointmentFormModal;

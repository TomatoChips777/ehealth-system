// components/RescheduleModal.js
import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import FormatDate from '../extra/DateFormat';


// Add 'handleCancelAppointment' to props
const RescheduleModal = ({
  show,
  onHide,
  studentName,
  setStudentName,
  complaint,
  setComplaint,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  setShowRescheduleModal,
  handleRescheduleAppointment,
  availableDates,
  availableTimes,
  formatLocalDate,
  formatTime12Hour,
  handleDateChange,
  handleCancelClick,

}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Reschedule Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Student Name</Form.Label>
                <Form.Control
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter name"
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Chief Complaint</Form.Label>
                <Form.Control
                  type="text"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="Enter complaint"
                  disabled
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
                  {availableDates.map((date, idx) => (
                    <option key={idx} value={date}>
                      {FormatDate(date, false)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Select Time</Form.Label>
                <Form.Select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">Select Time</option>
                  {availableTimes.map((time, idx) => (
                    <option key={idx} value={time}>
                      {formatTime12Hour(time)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => setShowRescheduleModal(false)}>
          Cancel
        </Button>
        {/* <Button variant="danger" onClick={handleCancelClick}>
          Cancel Appointment
        </Button> */}
        <Button variant="primary" onClick={handleRescheduleAppointment}>
          Reschedule Appointment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default RescheduleModal;

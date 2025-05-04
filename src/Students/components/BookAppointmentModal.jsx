import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';
const BookAppointmentModal = ({
  show,
  onHide,
  complaint,
  setComplaint,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  availableTimes,
  formatTime12Hour,
  formatLocalDate,
  handleDateChange,
  handleBookAppointment,
  availableDates,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Chief Complaint</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
          </Form.Group>
          <Row>
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
            {/* <Col>
              <Form.Group className="mb-3">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate ? formatLocalDate(selectedDate) : ''}
                  onChange={handleDateChange}
                />
              </Form.Group>
            </Col> */}
            <Col>
              {selectedDate && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Time</Form.Label>
                  <Form.Select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Select time</option>
                    {availableTimes.map((time, idx) => (
                      <option key={idx} value={time}>
                        {formatTime12Hour(time)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleBookAppointment}>Book</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookAppointmentModal;

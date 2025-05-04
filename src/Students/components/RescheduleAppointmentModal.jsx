import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';
const RescheduleAppointmentModal = ({
  show,
  onHide,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  availableTimes,
  formatTime12Hour,
  formatLocalDate,
  handleDateChange,
  handleRescheduleAppointment,
  availableDates,
}) => {
  console.log(availableDates, availableTimes);
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reschedule Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col >
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
            <Col>
              {selectedDate && (
                <Form.Group className="mb-3">
                  <Form.Label>Select New Time</Form.Label>
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
        <Button variant="primary" onClick={handleRescheduleAppointment}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RescheduleAppointmentModal;

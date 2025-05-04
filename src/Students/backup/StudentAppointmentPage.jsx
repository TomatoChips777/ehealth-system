import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Button,
  Modal,
  Form,
  Table,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FormatDate from '../extra/DateFormat';
import { useAuth } from '../../AuthContext';
const StudentAppointmentPage = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [complaint, setComplaint] = useState('');
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  const timeSlots = [
    '08:30:00', '09:00:00', '09:30:00', '10:00:00', '10:30:00',
    '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00',
    '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00',
    '16:00:00', '16:30:00',
  ];

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_APPOINTMENTS}/student/${user.id}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatTime12Hour = (timeString) => {
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12.toString().padStart(2, '0')}:${minute} ${suffix}`;
  };

  const formatLocalDate = (date) => {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toISOString().split('T')[0];
  };

  const isWeekday = (date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6;
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (isWeekday(newDate)) {
      setSelectedDate(newDate);
    } else {
      alert('Please select a weekday.');
    }
  };

  const calculateAvailableTimes = (date, appointmentToExclude = null) => {
    const formattedDate = date.toISOString().split('T')[0];

    const takenTimes = appointments
      .filter(app => app.date === formattedDate && app.id !== (appointmentToExclude ? appointmentToExclude.id : null))
      .map(app => app.time);

    return timeSlots.filter(slot => !takenTimes.includes(slot));
  };

  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes(calculateAvailableTimes(selectedDate, currentAppointment));
    }
  }, [selectedDate, appointments, currentAppointment]);

  const [availableTimes, setAvailableTimes] = useState([]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !complaint) {
      alert('Please fill in all fields.');
      return;
    }

    const newAppointment = {
      student_id: user.id,
      user_id: user.id,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      complaint: complaint,
    };

    try {
      await axios.post(`${import.meta.env.VITE_POST_APPOINTMENT}`, newAppointment);
      fetchAppointments();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time.');
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_UPDATE_APPOINTMENT}/${currentAppointment.id}`, {
        ...currentAppointment,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
      });
      fetchAppointments();
      setShowRescheduleModal(false);
      resetForm();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const handleRescheduleClick = (appointment) => {
    setCurrentAppointment(appointment);
    setSelectedDate(new Date(appointment.date));
    setSelectedTime(appointment.time);
    setShowRescheduleModal(true);
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setConfirmMessage('Are you sure you want to cancel this appointment?');
    setConfirmAction('cancel');
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (confirmAction === 'cancel') {
      try {
        await axios.put(`${import.meta.env.VITE_CANCEL_APPOINTMENT}/${selectedAppointment.id}`);
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment.');
      }
    }
    setShowConfirmModal(false);
    resetForm();
  };

  const resetForm = () => {
    setComplaint('');
    setSelectedDate(null);
    setSelectedTime('');
    setCurrentAppointment(null);
    setSelectedAppointment(null);
  };

  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  return (
    <Container fluid>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between">
          <strong>My Appointments</strong>
          <Button variant="success" size="sm" onClick={() => setShowModal(true)}>
            + New Appointment
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Complaint</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((app) => (
                <tr key={app.id}>
                  <td>{FormatDate(app.date, false)}</td>
                  <td>{formatTime12Hour(app.time)}</td>
                  <td>{app.complaint}</td>
                  <td className="text-center">
                    <Button size="sm" variant="primary" onClick={() => handleRescheduleClick(app)} className="me-2">
                      Reschedule
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleCancelClick(app)}>
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-between">
            <span>Page {currentPage} of {totalPages}</span>
            <div>
              <Button
                size="sm"
                variant="primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="me-2"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Create Appointment Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Complaint</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your complaint"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Select Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedDate ? formatLocalDate(selectedDate) : ''}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
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
          <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBookAppointment}>
            Book
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reschedule Modal */}
      <Modal show={showRescheduleModal} onHide={() => { setShowRescheduleModal(false); resetForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reschedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Select New Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedDate ? formatLocalDate(selectedDate) : ''}
                    onChange={handleDateChange}
                  />
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
          <Button variant="secondary" onClick={() => { setShowRescheduleModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRescheduleAppointment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentAppointmentPage;

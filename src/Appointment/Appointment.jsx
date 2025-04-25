import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Modal, Form } from 'react-bootstrap';
import FormatDate from '../extra/DateFormat';

const AppointmentPage = () => {
  const doctorSchedule = [
    '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    student_name: '',
    chief_complaint: '',
    time: '',
    date: '',
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    id: null,
    date: '',
    time: ''
  });
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_APPOINTMENTS}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    const day = selectedDate.getDay();

    if (day === 0 || day === 6) {
      alert('Weekends are not allowed. Please select a weekday.');
      return;
    }

    if (selectedDate < new Date(today.toDateString())) {
      alert('You cannot select a past date.');
      return;
    }

    setNewAppointment((prev) => ({ ...prev, date: e.target.value, time: '' }));
  };

  const handleAddAppointment = () => {
    const { student_name, chief_complaint, date, time } = newAppointment;

    if (!date || !time || !student_name || !chief_complaint) {
      alert('Please fill in all fields.');
      return;
    }

    const newAppointmentData = {
      id: appointments.length + 1,
      student_name,
      chief_complaint,
      time,
      date,
      status: 'pending',
    };

    setAppointments([...appointments, newAppointmentData]);
    setShowModal(false);
    setNewAppointment({ student_name: '', chief_complaint: '', time: '', date: '' });
  };

  // const handleReschedule = (appointment) => {
  //   const availableSlots = doctorSchedule.filter(
  //     (slot) =>
  //       !appointments.some(
  //         (appt) => appt.date === appointment.date && appt.time === slot
  //       )
  //   );

  //   const newTime = prompt(
  //     `Available slots for ${FormatDate(appointment.date, false)}:\n` +
  //       availableSlots.join('\n') +
  //       `\n\nEnter new time exactly as shown (e.g., 10:30 AM):`
  //   );

  //   if (newTime && availableSlots.includes(newTime)) {
  //     const updatedAppointments = appointments.map((appt) =>
  //       appt.id === appointment.id ? { ...appt, time: newTime } : appt
  //     );
  //     setAppointments(updatedAppointments);
  //   } else if (newTime) {
  //     alert('Invalid or already booked slot.');
  //   }
  // };

  const handleReschedule = (appointment) => {
    setRescheduleData({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time
    });
    setShowRescheduleModal(true);
  };
  const handleRescheduleInputChange = (e) => {
    const { name, value } = e.target;
    setRescheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveReschedule = () => {
    const updatedAppointments = appointments.map((appt) =>
      appt.id === rescheduleData.id
        ? { ...appt, date: rescheduleData.date, time: rescheduleData.time }
        : appt
    );
    setAppointments(updatedAppointments);
    setShowRescheduleModal(false);
  };
  
  
  return (
    <>
      <Card className="mb-4">
        <Card.Header>
          <h3>Manage Student Appointments</h3>
        </Card.Header>
        <Card.Body>
          <Button variant="success" onClick={() => setShowModal(true)}>
            Add New Appointment
          </Button>

          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Complaint</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.student_name}</td>
                  <td>{FormatDate(appointment.date, false)}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.chief_complaint}</td>
                  <td className="text-center">
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleReschedule(appointment)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => alert('Proceed to Consultation')}
                    >
                      Consultation
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => alert('Appointment cancelled')}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal to Add New Appointment */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book New Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>Select Date (Weekdays Only)</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newAppointment.date}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
            <Form.Group controlId="formStudentName" className="mt-3">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                name="student_name"
                value={newAppointment.student_name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formChiefComplaint" className="mt-3">
              <Form.Label>Chief Complaint</Form.Label>
              <Form.Control
                type="text"
                name="chief_complaint"
                value={newAppointment.chief_complaint}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTime" className="mt-3">
              <Form.Label>Select Time Slot</Form.Label>
              <Form.Select
                name="time"
                value={newAppointment.time}
                onChange={handleInputChange}
                disabled={!newAppointment.date}
              >
                <option value="">Select a time</option>
                {doctorSchedule
                  .filter(
                    (slot) =>
                      !appointments.some(
                        (appt) =>
                          appt.date === newAppointment.date && appt.time === slot
                      )
                  )
                  .map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddAppointment}>
            Add Appointment
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showRescheduleModal} onHide={() => setShowRescheduleModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Reschedule Appointment</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="rescheduleDate">
        <Form.Label>Select New Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={rescheduleData.date}
          onChange={handleRescheduleInputChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </Form.Group>
      <Form.Group controlId="rescheduleTime" className="mt-3">
        <Form.Label>Select New Time Slot</Form.Label>
        <Form.Select
          name="time"
          value={rescheduleData.time}
          onChange={handleRescheduleInputChange}
          disabled={!rescheduleData.date}
        >
          <option value="">Select a time</option>
          {doctorSchedule
            .filter(
              (slot) =>
                !appointments.some(
                  (appt) =>
                    appt.date === rescheduleData.date &&
                    appt.time === slot &&
                    appt.id !== rescheduleData.id // don't block self
                )
            )
            .map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
        </Form.Select>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowRescheduleModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSaveReschedule}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default AppointmentPage;

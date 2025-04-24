import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import FormatDate from '../extra/DateFormat';

const AppointmentPage = () => {
  const doctorSchedule = [
    '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', 
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];
  const [appointments, setAppointments] = useState([]);
  // const [appointments, setAppointments] = useState([
  //   { id: 1, student_name: 'John Doe', time: '09:00 AM', chief_complaint: 'Headache', status: 'pending' },
  //   { id: 2, student_name: 'Jane Smith', time: '09:30 AM', chief_complaint: 'Fever', status: 'approved' }
  // ]);

  const fetchAppointments = async ()=>{
    try{

      const response = await axios.get(`${import.meta.env.VITE_GET_APPOINTMENTS}`);
      setAppointments(response.data);
    }catch(error){

    }
  };

  useEffect(() =>{
    fetchAppointments();
  },[]);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    student_name: '',
    chief_complaint: '',
    time: ''
  });

  // Handle input changes in the appointment form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Add new appointment
  const handleAddAppointment = () => {
    const nextAvailableSlot = getNextAvailableSlot();
    if (nextAvailableSlot) {
      const newAppointmentData = {
        id: appointments.length + 1,
        student_name: newAppointment.student_name,
        chief_complaint: newAppointment.chief_complaint,
        time: nextAvailableSlot,
        status: 'pending',
      };
      setAppointments([...appointments, newAppointmentData]);
      setShowModal(false); // Close the modal after adding the appointment
    } else {
      alert('No available slots.');
    }
  };

  // Get next available slot
  const getNextAvailableSlot = () => {
    const bookedSlots = appointments.map((appt) => appt.time);
    const availableSlots = doctorSchedule.filter((slot) => !bookedSlots.includes(slot));
    return availableSlots.length > 0 ? availableSlots[0] : null;
  };

  // Handle reschedule (to modify appointment time)
  const handleReschedule = (appointment) => {
    const nextAvailableSlot = getNextAvailableSlot();
    if (nextAvailableSlot) {
      const updatedAppointments = appointments.map((appt) =>
        appt.id === appointment.id ? { ...appt, time: nextAvailableSlot } : appt
      );
      setAppointments(updatedAppointments);
    } else {
      alert('No available slots for rescheduling.');
    }
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
                      onClick={() => handleReschedule(appointment)}
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
            <Form.Group controlId="formStudentName">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                name="student_name"
                value={newAppointment.student_name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formChiefComplaint">
              <Form.Label>Chief Complaint</Form.Label>
              <Form.Control
                type="text"
                name="chief_complaint"
                value={newAppointment.chief_complaint}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>Time Slot</Form.Label>
              <Form.Control
                type="text"
                name="time"
                value={getNextAvailableSlot()}
                readOnly
              />
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
    </>
  );
};

export default AppointmentPage;

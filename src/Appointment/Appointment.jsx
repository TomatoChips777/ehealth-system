import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form } from 'react-bootstrap';

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2025-04-24',
      time: '09:00',
      student_name: 'John Doe',
      student_age: 20,
      student_course_year: '2nd Year CS',
      chief_complaint: 'Headache',
      intervention: 'Painkillers',
      remarks: 'Follow up in 2 weeks'
    },
    {
      id: 2,
      date: '2025-04-25',
      time: '10:00',
      student_name: 'Jane Smith',
      student_age: 22,
      student_course_year: '3rd Year Biology',
      chief_complaint: 'Fever',
      intervention: 'Rest and hydration',
      remarks: 'Monitor temperature'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    student_name: '',
    student_age: '',
    student_course_year: '',
    chief_complaint: '',
    intervention: '',
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = () => {
    setAppointments([...appointments, { ...newAppointment, id: appointments.length + 1 }]);
    setShowModal(false); // Close the modal after adding
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
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
                <th>Date</th>
                <th>Time</th>
                <th>Student Name</th>
                <th>Complaint</th>
                <th>Intervention</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.student_name}</td>
                  <td>{appointment.chief_complaint}</td>
                  <td>{appointment.intervention}</td>
                  <td>{appointment.remarks}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteAppointment(appointment.id)}>
                      Delete
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
          <Modal.Title>Add New Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newAppointment.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={newAppointment.time}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formStudentName">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                name="student_name"
                value={newAppointment.student_name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formStudentAge">
              <Form.Label>Student Age</Form.Label>
              <Form.Control
                type="number"
                name="student_age"
                value={newAppointment.student_age}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCourseYear">
              <Form.Label>Course & Year</Form.Label>
              <Form.Control
                type="text"
                name="student_course_year"
                value={newAppointment.student_course_year}
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
            <Form.Group controlId="formIntervention">
              <Form.Label>Intervention</Form.Label>
              <Form.Control
                type="text"
                name="intervention"
                value={newAppointment.intervention}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                name="remarks"
                value={newAppointment.remarks}
                onChange={handleInputChange}
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

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
import FormatDate from '../extra/DateFormat';
import { useNavigate } from 'react-router-dom';
import AutoCompleteInput from './AutoCompleteInput';
const AppointmentPage = ({ handleLinkClick }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [studentName, setStudentName] = useState('');
  const [complaint, setComplaint] = useState('');
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const [suggestedStudents, setSuggestedStudents] = useState([]);
  const formatDateLocal = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [formData, setFormData] = useState({ student_id: '', user_id: '' });
  const [students, setStudents] = useState([]);


  const searchStudents = async (query) => {
    if (!query.trim()) {
      setStudents([]);
      setSuggestedStudents([]);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_SEARCH_STUDENTS}?query=${query}`);
      const fetchedStudents = response.data;

      if (fetchedStudents.length > 0) {
        // If students are found, update the suggestions
        setSuggestedStudents(fetchedStudents);
      } else {
        // If no students are found, clear suggestions and any associated state
        setSuggestedStudents([]);
        setFormData(prev => ({
          ...prev,
          student_id: '', // Clear the student ID if no match
        }));
        setStudentName(''); // Clear the student name
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Clear any previous data on error
      setSuggestedStudents([]);
      setFormData(prev => ({
        ...prev,
        student_id: '', // Clear student ID
      }));
      setStudentName(''); // Clear student name
    }
  };


  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'student_id') {
      await searchStudents(value);
    }
  };

  const formatTime12Hour = (timeString) => {
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12.toString().padStart(2, '0')}:${minute} ${suffix}`;
  };

  const timeSlots = [
    '08:30:00', '09:00:00', '09:30:00', '10:00:00', '10:30:00',
    '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00',
    '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00',
    '16:00:00', '16:30:00', '17:00:00',
  ];

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

  const isWeekday = (date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6;
  };


  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (isWeekday(newDate)) {
      setSelectedDate(newDate);
    } else {
      alert('Please select a weekday');
    }
  };

  // Ensure the displayed date uses local timezone formatting
  const formatLocalDate = (date) => {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toISOString().split('T')[0];
  };


  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !studentName || !complaint) {
      alert('Please fill in all fields');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const newAppointment = {
      student_id: formData.student_id,
      user_id: formData.user_id,
      date: formattedDate,
      time: selectedTime,
      complaint: complaint,
    };

    console.log(newAppointment);
    try {
      const response = await axios.post(`${import.meta.env.VITE_POST_APPOINTMENT}`, newAppointment);
      fetchAppointments();
      handleCloseCreateModal();
      setShowModal(false);
    } catch (error) {

    }

  };

  const handleRescheduleAppointment = async () => {
    if (!selectedDate || !selectedTime || !studentName || !complaint) {
      alert('Please fill in all fields');
      return;
    }
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const updatedAppointment = {
      ...currentAppointment,
      studentName,
      date: formattedDate,
      time: selectedTime,
      complaint,
    };
    console.log(updatedAppointment);


    try {
      const response = await axios.put(`${import.meta.env.VITE_UPDATE_APPOINTMENT}/${currentAppointment.id}`, updatedAppointment);
      setAppointments(appointments.map(app => app.id === currentAppointment.id ? updatedAppointment : app));
      setStudentName('');
      setComplaint('');
      setSelectedDate(null);
      setSelectedTime('');
      setShowRescheduleModal(false);
      console.log("Test");
    } catch (error) {
      setShowRescheduleModal(false);
      console.log(error);
    }

  };


  const handleReschedule = (appointment) => {
    setCurrentAppointment(appointment);
    setStudentName(appointment.full_name);
    setComplaint(appointment.complaint);
    setSelectedDate(new Date(appointment.date));
    setSelectedTime(appointment.time);
    setShowRescheduleModal(true);
  };

  const calculateAvailableTimes = (date, appointmentToExclude = null) => {
    const formattedDate = date.toISOString().split('T')[0];

    // Filter out the current appointment's time from available times when rescheduling
    const takenTimes = appointments
      .filter(app => formatDateLocal(app.date) === formattedDate && app.id !== (appointmentToExclude ? appointmentToExclude.id : null))
      .map(app => app.time);

    return timeSlots.filter(slot => !takenTimes.includes(slot));
  };

  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes(calculateAvailableTimes(selectedDate, currentAppointment));  // Pass currentAppointment to exclude its time
      if (!currentAppointment) {
        setSelectedTime('');
      } else {
        setSelectedTime(currentAppointment.time);  // Ensure the selected time is set correctly
      }
    }
  }, [selectedDate, appointments, currentAppointment]);

  const handleConsultation = (patient) => {
    handleLinkClick('Consultations');
    navigate('/consultation', { state: { patient } });
  };
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const query = searchQuery.toLowerCase();
      return (
        appointment.full_name.toLowerCase().includes(query) ||
        appointment.complaint.toLowerCase().includes(query) ||
        appointment.student_id.toLowerCase().includes(query) ||
        formatDateLocal(appointment.date).includes(query)
      );
    });
  }, [appointments, searchQuery]);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setConfirmMessage('Are you sure you want to cancel this appointment?');
    setConfirmAction('cancel');
    setShowConfirmModal(true);
  };
  
  const handleConsultationClick = (appointment) => {
    setSelectedAppointment(appointment);
    setConfirmMessage('Proceed to consultation?');
    setConfirmAction('consultation');
    setShowConfirmModal(true);
  };
  

  const handleConfirm = async () => {
    if (confirmAction === 'cancel') {
      try {
        await axios.put(`${import.meta.env.VITE_CANCEL_APPOINTMENT}/${selectedAppointment.id}`);
        setAppointments(prevAppointments => prevAppointments.filter(app => app.id !== selectedAppointment.id));
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    } else if (confirmAction === 'consultation') {
      try {
        // Mark appointment (if needed, otherwise just navigate)
        await axios.put(`${import.meta.env.VITE_MARK_APPOINTMENT}/${selectedAppointment.id}`);
        navigate('/consultation', { state: { patient: selectedAppointment  } });
      } catch (error) {
        console.error('Error proceeding to consultation:', error);
        alert('Failed to proceed. Please try again.');
      }
    }
    setShowConfirmModal(false);
    setSelectedAppointment(null);
    setConfirmAction(null);
  };

  const handleCLoseModal = () => {
    setShowRescheduleModal(false);
    setStudentName('');
    setComplaint('');
    setSelectedDate(null);
    setSelectedTime('');
  };
  const handleCloseCreateModal = () => {
    setShowModal(false);
    setFormData({ student_id: '' });
    setStudentName('');
    setComplaint('');
    setSelectedDate(null);
    setSelectedTime('');
    setSuggestedStudents([]);
  };


  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);

  // Page numbers for navigation
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  return (
    <Container fluid>
      {/* Card for Appointment Table */}
      <Card className=" shadow-sm">
        <Card.Header className='d-flex justify-content-between'>
          <strong>Appointments List</strong>
          <Form.Control
            type="text"
            placeholder="Search by student name or complaint"
            className="mx-3"
            style={{ maxWidth: '700px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="success" size='sm' onClick={() => setShowModal(true)}>
            + Create Appointment
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Complaint</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((app) => (
                <tr key={app.id}>
                  <td>{app.student_id}</td>
                  <td>{app.full_name}</td>
                  <td>{FormatDate(app.date, false)}</td>
                  <td>{formatTime12Hour(app.time)}</td>
                  <td>{app.complaint}</td>
                  <td className='text-center'>
                    <Button variant='primary' size='sm' className='me-2' onClick={() => handleReschedule(app)}>Reschedule</Button>
                    {/* <Button variant='success' size='sm' className='me-2' onClick={() => handleConsultation(app)}>Consultation</Button>
                    <Button variant='danger' size='sm' onClick={() => handleCancel(app.id)}>Cancel</Button> */}
                    <Button variant='success' size='sm' className='me-2' onClick={() => handleConsultationClick(app)}>Consultation</Button>
                    <Button variant='danger' size='sm' onClick={() => handleCancelClick(app)}>Cancel</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div>
              <Button
                variant="primary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="me-2"
              >
                Previous
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
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



      <Modal
        show={showModal}
        onHide={handleCloseCreateModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Appointment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            {/* Student ID Input with AutoComplete */}
            <Form.Group>
              <AutoCompleteInput
                label="Student ID"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                options={students}
                getOptionLabel={(student) => student.student_id}
                onBlur={() => {
                  const studentExists = students.find(
                    (student) => student.student_id === formData.student_id
                  );
                  if (!studentExists) {
                    setFormData(prev => ({ ...prev, student_id: '' }));
                    setStudentName('');
                  }
                }}
                disabled={false}
              />
            </Form.Group>

            {/* Student Name and Complaint Fields */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Student Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentName}
                    placeholder="Enter name"
                    disabled
                    onChange={(e) => setStudentName(e.target.value)}
                  />

                  {/* Suggested Students Dropdown */}
                  {suggestedStudents.length > 0 && (
                    <div className="autocomplete-dropdown">
                      {suggestedStudents.map((student) => (
                        <div
                          key={student.id}
                          className="autocomplete-item"
                          onClick={() => {
                            setStudentName(student.full_name);
                            setFormData(prev => ({
                              ...prev,
                              student_id: student.student_id,
                              user_id: student.user_id,
                            }));
                            setSuggestedStudents([]);
                          }}
                        >
                          {student.full_name}
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

            {/* Date and Time Selection */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedDate ? formatLocalDate(selectedDate) : ''}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>

              {selectedDate && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Select Time</Form.Label>
                    <Form.Select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map((time, index) => (
                        <option key={index} value={time}>
                          {formatTime12Hour(time)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
            </Row>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBookAppointment}>
            Book Appointment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Rescheduling Appointment */}
      <Modal show={showRescheduleModal} onHide={() => handleCLoseModal()} centered>
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
                  <Form.Label>Complaint</Form.Label>
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
                  <Form.Control
                    type="date"
                    // value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                    value={selectedDate ? formatLocalDate(selectedDate) : ''}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>

              {selectedDate && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Select Time</Form.Label>
                    <Form.Select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">{formatTime12Hour(selectedTime)}</option>
                      {availableTimes.map((time, index) => (
                        <option key={index} value={time}>
                          {formatTime12Hour(time)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRescheduleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRescheduleAppointment}>
            Reschedule Appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentPage;

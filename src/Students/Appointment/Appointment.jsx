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
import FormatDate from '../../extra/DateFormat';
import { useNavigate } from 'react-router-dom';
import AutoCompleteInput from './AutoCompleteInput';
import AppoinmentCalendar from '../components/Calendar';
import AppointmentFormModal from './AppointmentFormModal';
import RescheduleModal from './RescheduleModal';
import { io } from 'socket.io-client';
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
  const [availableDates, setAvailableDates] = useState([]);
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
  
        setSuggestedStudents(fetchedStudents);
      } else {
        
        setSuggestedStudents([]);
        setFormData(prev => ({
          ...prev,
          student_id: '', 
        }));
        setStudentName(''); 
      }
    } catch (error) {
      console.error('Error fetching students:', error);
     
      setSuggestedStudents([]);
      setFormData(prev => ({
        ...prev,
        student_id: '', 
      }));
      setStudentName(''); 
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

  const fetchAvailableDates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_AVAILABILITY}`);

      const formattedDates = response.data.map(entry => formatDateLocal(entry.date));

      setAvailableDates(formattedDates);

    } catch (error) {
      console.error('Error fetching available dates:', error);
    }

  };

  const fetchAvailableTimes = async (date) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_AVAILABLE_TIMES}?date=${date}`);
      
      // Get all available slots from API
      const availableSlots = response.data.availability
        .filter(slot => slot.is_available === 1)
        .map(slot => slot.time_slot);
  
      // Filter out time slots already booked on the selected date
      const bookedTimes = appointments
        .filter(app => formatLocalDate(app.date) === date)
        .map(app => app.time);
  
      const filteredSlots = availableSlots.filter(time => !bookedTimes.includes(time));
  
      setAvailableTimes(filteredSlots);
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };



  const formatLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_APPOINTMENTS}`);
      const pendingAppointments = response.data.filter(appointment => appointment.status === 'pending');
      setAppointments(pendingAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  

  useEffect(() => {
    fetchAppointments();
    fetchAvailableDates();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateNotifications', () => {
      fetchAppointments();
      fetchAvailableDates();
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  const handleDateChange = (e) => {
    const date = e.target.value;
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    fetchAvailableTimes(date);
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
    const formattedDate = formatLocalDate(selectedDate);
    console.log(formattedDate);
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
    const date = new Date(appointment.date);
    setSelectedDate(date);
    setSelectedTime(appointment.time);
    fetchAvailableTimes(formatLocalDate(date));
    setShowRescheduleModal(true);
  };
  
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
        navigate('/consultation', { state: { patient: selectedAppointment } });
      } catch (error) {
        console.error('Error proceeding to consultation:', error);
        alert('Failed to proceed. Please try again.');
      }
    }
    setShowConfirmModal(false);
    setSelectedAppointment(null);
    setConfirmAction(null);
  };

  const handleCloseModal = () => {
    setShowRescheduleModal(false);
    setFormData({ student_id: '' });
    setStudentName('');
    setComplaint('');
    setSelectedDate(null);
    setSelectedTime('');
    setSuggestedStudents([]);
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
      <AppoinmentCalendar />
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
      <AppointmentFormModal
        show={showModal}
        onHide={handleCloseCreateModal}
        title="Create Appointment"
        formData={formData}
        studentName={studentName}
        complaint={complaint}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        availableDates={availableDates}
        availableTimes={availableTimes}
        suggestedStudents={suggestedStudents}
        students={students}
        setStudentName={setStudentName}
        setFormData={setFormData}
        setComplaint={setComplaint}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        handleChange={handleChange}
        handleDateChange={handleDateChange}
        onSubmit={handleBookAppointment}
        formatLocalDate={formatLocalDate}
        setSuggestedStudents={setSuggestedStudents}

      />

      <RescheduleModal 
      show={showRescheduleModal}
      onHide={() => handleCloseModal()}
      studentName={studentName}
      setStudentName={setStudentName}
      complaint={complaint}
      setComplaint={setComplaint}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      setShowRescheduleModal={setShowRescheduleModal}
      handleRescheduleAppointment={handleRescheduleAppointment}
      availableDates={availableDates}
      availableTimes={availableTimes}
      formatLocalDate={formatDateLocal}
      formatTime12Hour={formatTime12Hour}
      handleDateChange={handleDateChange}
      />
    </Container>
  );
};
export default AppointmentPage;

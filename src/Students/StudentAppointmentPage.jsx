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
import BookAppointmentModal from './components/BookAppointmentModal';
import RescheduleAppointmentModal from './components/RescheduleAppointmentModal';
import ConfirmModal from './components/ConfirmModal';
import AppoinmentCalendar from './components/Calendar';
import { io } from 'socket.io-client';
const StudentAppointmentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);

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

const formatDateLocal = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

 
    const [availableDates, setAvailableDates] = useState([]);
    
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
  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_APPOINTMENTS}`);
      const pendingAppointments = response.data.filter(appointment => appointment.status === 'pending');
     
      setAllAppointments(pendingAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
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
      
      const availableSlots = response.data.availability
        .filter(slot => slot.is_available === 1)
        .map(slot => slot.time_slot);
  
      const bookedTimes = allAppointments
        .filter(app => formatLocalDate(app.date) === date)
        .map(app => app.time);
  
      const filteredSlots = availableSlots.filter(time => !bookedTimes.includes(time));
  
      setAvailableTimes(filteredSlots);
    } catch (error) {
      console.error('Error fetching available times:', error);
      setAvailableTimes([]);
    }
  };
 
    
  // const fetchAvailableTimes = async (date) => {
  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_GET_AVAILABLE_TIMES}?date=${date}`);
      
  //     // Get all available slots from API
  //     const availableSlots = response.data.availability
  //       .filter(slot => slot.is_available === 1)
  //       .map(slot => slot.time_slot);
  
  //     // Filter out time slots already booked on the selected date
  //     const bookedTimes = allAppointments
  //       .filter(app => formatLocalDate(app.date) === date)
  //       .map(app => app.time);
  
  //     const filteredSlots = availableSlots.filter(time => !bookedTimes.includes(time));
  
  //     setAvailableTimes(filteredSlots);
  //   } catch (error) {
  //     console.error('Error fetching available times:', error);
  //   }
  // };
  

  useEffect(() => {
    fetchAppointments();
    fetchAvailableDates();
    fetchAllAppointments();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateNotifications', () => {
      fetchAppointments();
      fetchAvailableDates();
      fetchAllAppointments();
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

  const formatTime12Hour = (timeString) => {
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12.toString().padStart(2, '0')}:${minute} ${suffix}`;
  };

  // const formatLocalDate = (date) => {
  //   const localDate = new Date(date);
  //   localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  //   return localDate.toISOString().split('T')[0];
  // };


  const formatLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
        date: formatLocalDate(selectedDate),
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
    const date = new Date(appointment.date);
    setSelectedDate(date);
    setSelectedTime(appointment.time);
    fetchAvailableTimes(formatLocalDate(date));
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
      <AppoinmentCalendar/>
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
                <th>Chief Complaint</th>
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

      <BookAppointmentModal
        show={showModal}
        onHide={() => { setShowModal(false); resetForm(); }}
        complaint={complaint}
        setComplaint={setComplaint}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        availableTimes={availableTimes}
        formatTime12Hour={formatTime12Hour}
        formatLocalDate={formatLocalDate}
        handleDateChange={handleDateChange}
        handleBookAppointment={handleBookAppointment}
        availableDates={availableDates}
      />

      <RescheduleAppointmentModal
        show={showRescheduleModal}
        onHide={() => { setShowRescheduleModal(false); resetForm(); }}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        availableTimes={availableTimes}
        formatTime12Hour={formatTime12Hour}
        formatLocalDate={formatLocalDate}
        handleDateChange={handleDateChange}
        handleRescheduleAppointment={handleRescheduleAppointment}
        availableDates={availableDates}
      />

      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        message={confirmMessage}
      />
    </Container>
  );
};

export default StudentAppointmentPage;

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import TextTruncate from '../extra/TextTruncate';
import { io } from 'socket.io-client';
import { useAuth } from '../../AuthContext';
import FormatDate from '../extra/DateFormat';
import RescheduleModal from './RescheduleModal';
function AppoinmentCalendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventPlans, setEventPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [availableDates, setAvailableDates] = useState([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [clickedDate, setClickedDate] = useState(null);


  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [studentName, setStudentName] = useState('');
  const [complaint, setComplaint] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});

  const formatDateLocal = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

      const source = appointments.length > 0 ? appointments : eventPlans;
      const normalizeTime = (time) => time.slice(0, 5); // converts "09:00:00" to "09:00"

      const bookedTimes = source
        .filter(app => formatLocalDate(app.date) === date)
        .map(app => normalizeTime(app.time));

      const filteredSlots = availableSlots
        .map(normalizeTime)
        .filter(time => !bookedTimes.includes(time));

      // Filter out time slots already booked on the selected date
      // const bookedTimes = appointments
      //   .filter(app => formatLocalDate(app.date) === date)
      //   .map(app => app.time);

      // const filteredSlots = availableSlots.filter(time => !bookedTimes.includes(time));

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

  const handleCloseModal = () => {
    setShowRescheduleModal(false);
    setStudentName('');
    setComplaint('');
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    fetchAvailableTimes(date);
  };


  const handleRescheduleAppointment = async () => {
    if (!selectedDate || !selectedTime || !studentName || !complaint) {
      alert('Please fill in all fields');
      return;
    }

    const formattedDate = formatLocalDate(selectedDate);
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

  useEffect(() => {
    fetchEvents();
    fetchAvailableDates();
    fetchAvailableDatesForMonth(currentMonth.getMonth(), currentMonth.getFullYear());

    if (availableTimes.length === 1 && !selectedTime) {
      setSelectedTime(availableTimes[0]);
    }

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateNotifications', () => {
      fetchEvents();
      fetchAvailableDates();

      fetchAvailableDatesForMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    });

    return () => socket.disconnect();

  }, [availableTimes]);


  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_APPOINTMENTS}`);
      const formatted = response.data.map(ev => {
        const eventDate = new Date(ev.date);
        const eventTime = new Date(`${ev.date} ${ev.time}`);

        const eventTitle = ev.complaint || "Unknown";
        const color = getColorByStatus(ev.status);
        return {
          ...ev,
          title: eventTitle,
          date: eventDate.toISOString(),
          startTime: eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          statusColor: color,
        };
      });

      setEventPlans(formatted);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(8, 30, 0, 0);

    for (let i = 0; i < 17; i++) {
      const time = start.toTimeString().slice(0, 8); // "HH:mm:ss"
      slots.push(time);
      start.setMinutes(start.getMinutes() + 30);
    }

    return slots;
  };



  const getColorByStatus = (status) => {
    switch (status) {
      case 'completed':
        return 'red';
      case 'pending':
        return '#1976D2';
      case 'canceled':
        return '#D32F2F';
      default:
        return '#0288D1';
    }
  };


  const handleAvailabilityChange = async (date, time, isAvailable, appointment_id) => {
    try {
      await axios.post(`${import.meta.env.VITE_ADD_AVAILABILITY}`, {
        date: date,
        time_slot: time,
        is_available: isAvailable,
        appointment_id: appointment_id
      });

      fetchAvailableDatesForMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    } catch (error) {
      console.error('Error updating availability', error);
      alert("Failed to update availability.");
    }
  };


  const toggleTimeSlot = (date, time) => {
    const isCurrentlyAvailable = selectedTimeSlots[time] === 1;
    const newAvailability = isCurrentlyAvailable ? 0 : 1;

    const existingAppointment = eventPlans.find(event => {
      return new Date(event.date).toLocaleDateString('en-CA') === date &&
        event.time === time;
    });

    if (existingAppointment && newAvailability === 0) {
      handleReschedule(existingAppointment);
    }

    setSelectedTimeSlots(prev => ({
      ...prev,
      [time]: newAvailability
    }));

    handleAvailabilityChange(date, time, newAvailability, existingAppointment.id);


  };



  const fetchAvailableDatesForMonth = async (month, year) => {
    try {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const available = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const formatted = dateObj.toLocaleDateString('en-CA');

        const res = await axios.get(`${import.meta.env.VITE_GET_AVAILABLE_TIMES_II}?date=${formatted}`);
        const slots = res.data.availability || [];

        const hasAvailable = slots.some(slot => slot.is_available === 1);
        if (hasAvailable) {
          available.push(formatted);
        }
      }

      setAvailableDates(available);
    } catch (error) {
      console.error('Failed to fetch available dates', error);
    }
  };

  const fetchAvailability = async (date) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_AVAILABLE_TIMES_II}?date=${date}`);
      const availability = response.data.availability;

      if (!Array.isArray(availability)) {
        console.error('The availability data is not an array:', availability);
        return;
      }

      const slots = {};
      availability.forEach(item => {
        slots[item.time_slot] = item.is_available;
      });
      setSelectedTimeSlots(slots);
      console.log(slots);
    } catch (error) {
      console.error('Error fetching availability', error);
    }
  };

  const handleAvailabilityModalOpen = (date) => {
    console.log(date);
    setClickedDate(date);
    fetchAvailability(date);
    setShowAvailabilityModal(true);
  };


  const openModal = (event) => {
    console.log(event);
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleMonthChange = (offset) => {
    const newDate = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset));
    setCurrentMonth(new Date(newDate));
    fetchAvailableDatesForMonth(newDate.getMonth(), newDate.getFullYear());
  };

  const getDaysInMonth = (month, year) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    return days;
  };

  const currentMonthNumber = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();
  const daysInMonth = getDaysInMonth(currentMonthNumber, currentYear);

  const filteredEvents = eventPlans.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const now = new Date();
  const selectedDateObj = new Date(clickedDate);
  const isToday = now.toDateString() === selectedDateObj.toDateString();
  const currentTime = now.toTimeString().slice(0, 8);


  return (
    <div className="container-fluid p-0 y-0">
      <Card className='mb-2'>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="dark" size='sm' onClick={() => handleMonthChange(-1)}>
              <i className="bi bi-arrow-left-circle"></i> Previous
            </Button>
            <h4 className="mb-0">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
            <Button variant="dark" size='sm' onClick={() => handleMonthChange(1)}>
              Next <i className="bi bi-arrow-right-circle"></i>
            </Button>
          </div>
          <div className="calendar-grid d-flex flex-wrap border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="text-center py-2 border" style={{ width: '14.2%' }}>
                <strong>{day}</strong>
              </div>
            ))}
            {daysInMonth.map((day, index) => {
              const formattedDay = new Date(currentYear, currentMonthNumber, day).toLocaleDateString('en-CA');

              const eventsForDay = filteredEvents.filter(event =>
                new Date(event.date).getDate() === day &&
                new Date(event.date).getMonth() === currentMonthNumber &&
                new Date(event.date).getFullYear() === currentYear
              );

              const hasAppointment = eventsForDay.length > 0;
              const isAvailable = availableDates.includes(formattedDay);

              return (
                <div
                  key={index}
                  className="border px-1 pt-1"
                  style={{
                    width: '14.2%',
                    minHeight: '70px',
                    backgroundColor: isAvailable || hasAppointment ? '#4CAF50' : 'white',
                    color: isAvailable || hasAppointment ? 'white' : 'black',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onClick={() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dateObj = new Date(currentYear, currentMonthNumber, day);
                    const isPastDate = dateObj < today;
                    if (!isPastDate) {
                      const clickedDate = dateObj.toLocaleDateString('en-CA');
                      setClickedDate(clickedDate);
                      handleAvailabilityModalOpen(clickedDate);
                    }
                  }}
                >

                  {day && (
                    <>
                      <div className="fw-bold">{day}</div>
                      <div style={{ maxHeight: '55px', overflowY: 'auto' }}>
                        {eventsForDay
                          .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
                          .map((event, idx) => (
                            <div
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                // openModal(event);
                                handleReschedule(event);
                              }}
                              style={{
                                backgroundColor: event.statusColor,
                                padding: '2px 3px',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                marginBottom: '3px',
                                borderRadius: '3px',
                                color: 'white',
                              }}
                            >
                              <>
                                <>
                                  <TextTruncate text={event.title} maxLength={15} /> -{' '}
                                  {new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                  {event.status === 'canceled' && (
                                    <span className="ms-1">(Canceled)</span>
                                  )}
                                </>

                                {/* <TextTruncate text={event.title} maxLength={15} /> -{' '}
                                {new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })} */}
                              </>

                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              );

            })}

          </div>
        </Card.Body>
      </Card>
      <Modal show={showAvailabilityModal} onHide={() => setShowAvailabilityModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Date Availability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Select available time slots for <strong>{clickedDate}</strong>:</p>
          <div className="d-flex flex-wrap">
            {generateTimeSlots().map((time, idx) => {
              const isPastTime = isToday && time < currentTime;

              return (
                <Form.Check
                  key={idx}
                  type="checkbox"
                  label={new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                  className="me-3"
                  checked={selectedTimeSlots[time] === 1}
                  disabled={isPastTime}
                  onChange={() => {
                    if (!isPastTime) toggleTimeSlot(clickedDate, time);
                  }}
                />
              );
            })}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAvailabilityModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent ? (
            <div>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Date:</strong> {FormatDate(selectedEvent.date)}</p>
              <p><strong>Time:</strong> {new Date(`1970-01-01T${selectedEvent.time}`).toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit', hour12: true
              })}</p>
              <p><strong>Status:</strong> {selectedEvent.status}</p>
              <p><strong>Complaint:</strong> {selectedEvent.complaint}</p>
              <p><strong>Patient Name:</strong> {selectedEvent.full_name || 'N/A'}</p>
            </div>
          ) : (
            <p>No appointment selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

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
    </div>
  );
}
export default AppoinmentCalendar;

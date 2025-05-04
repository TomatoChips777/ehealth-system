import React, { useState, useEffect } from 'react';

const AppointmentScheduler = () => {
  // Dummy data for existing appointments
  const [appointments, setAppointments] = useState([
    { date: '2025-04-28', time: '09:00 AM' },
    { date: '2025-04-28', time: '01:30 PM' },
    { date: '2025-04-29', time: '10:00 AM' },
  ]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = [
    '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM',
    '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM',
  ];

  // Check if the date is a weekday (Monday to Friday)
  const isWeekday = (date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  // Filter out unavailable times for the selected date
  const calculateAvailableTimes = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Get the date in yyyy-mm-dd format
    const takenTimes = appointments
      .filter(app => app.date === formattedDate)
      .map(app => app.time);
    return timeSlots.filter(slot => !takenTimes.includes(slot));
  };

  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes(calculateAvailableTimes(selectedDate));
      setSelectedTime(null);
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (isWeekday(newDate)) {
      setSelectedDate(newDate);
    } else {
      alert('Please select a weekday');
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    setAppointments([...appointments, { date: formattedDate, time: selectedTime }]);
    alert(`Appointment booked for ${formattedDate} at ${selectedTime}`);
  };

  return (
    <div className="appointment-scheduler">
      <h2>Book Your Appointment</h2>

      <div>
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
        />
      </div>

      {selectedDate && (
        <div>
          <label>Select Time:</label>
          <select onChange={handleTimeChange} value={selectedTime}>
            <option value="">Select a time</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleBookAppointment}>Book Appointment</button>

      <div>
        <h3>Existing Appointments</h3>
        <ul>
          {appointments.map((app, index) => (
            <li key={index}>{`${app.date} at ${app.time}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AppointmentScheduler;

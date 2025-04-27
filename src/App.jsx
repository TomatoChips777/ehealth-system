

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Sidebar from './Navigations/Sidebar';
import TopNavbar from './Navigations/TopNavbar';
import BorrowingScreen from './Borrowing/BorrowingScreens';
import EventManager from './Events/EventManager';
import LoginScreen from './LoginScreen';
import { useAuth } from '../AuthContext';
import Inventory from './Inventory/Inventory';
import Dashboard from './Dashboard/Dashboard';
import RequestPage from './RequestPage';
import Notifications from './Notifications/Notifications';
import Users from './User Management/Users';
import ChatWidget from './Chatbot/ChatWidget';
import Patients from './Patients/Patients';
import Prescriptions from './Prescriptions/Prescriptions';
import Consultation from './Consultation/ConsultationForm';
import AnnualPhysicalExamForm from './Patients/components/AnnualPhysicalExamForm';
import PatientDetails from './Patients/components/PatientDetails';
import AppointmentPage from './Appointment/Appointment';
import MedicineInventory from './Inventory/MedicineInventory';
import SupplyInventory from './Inventory/SupplyInventory';
import EquipmentInventory from './Inventory/EquipmentIventory';
import Registration from './Registration';
import Home from './Students/Home';
import StudentAppointmentPage from './Students/StudentAppointmentPage';
import Records from './Students/Records';
import StudentPrescriptions from './Students/Presciption';
import VisitLogs from './Students/VisitLogs';

function App() {
  const [chatMessage, setChatMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState(() => {
    return localStorage.getItem("activeLink") || "Dashboard";
  });

  const location = useLocation();

  useEffect(() => {
    // Update active link based on the current path
    const path = location.pathname;
    const routeMap = {
      '/': 'Dashboard',
      '/inventory': 'Inventory',
      '/borrowing': 'Borrowing',
      '/events': 'Calendar',
      '/notifications': 'Notifications',
      '/users': 'Users',
      '/patients': 'Patients',
      '/prescriptions': 'Prescriptions',
      '/appointment': 'Appointment',
      '/consultation': 'Consultations',
      '/patient-details': 'Patients',
      '/annualreport': 'Patients',
      '/medicines': 'Medicines',
      '/supply': 'Supply',
      '/equipment': 'Equipments',
      '/home': 'Home',
      '/student-appointment': 'My Appointments',
      '/student-details': 'My Records',
      '/student-prescriptions': 'My Prescriptions',
      '/student-logs': 'My Visit Logs'

    };

    setActiveLink(routeMap[path] || 'Dashboard');
  }, [location]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("activeLink", link);
  };

  const handleAskButton = (message) => {
    setChatMessage(message);
  };

  const { isAuthenticated, isLoading, role } = useAuth();
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="layout">
      {isAuthenticated ? (
        <>
          <Sidebar
            sidebarOpen={sidebarOpen}
            activeLink={activeLink}
            handleLinkClick={handleLinkClick}
            role={role}
          />
          <div className="main-content">
            <TopNavbar toggleSidebar={toggleSidebar} />
            <div className="content-scroll p-3">
              <Routes>
                {role === 'Admin' && (
                  <>
                    <Route path="/" element={<Dashboard handleAskButton={handleAskButton} />} />
                    <Route path='/users' element={<Users handleAskButton={handleAskButton} />} />
                    <Route path='/patients' element={<Patients handleAskButton={handleAskButton} handleLinkClick={handleLinkClick} />} />
                    <Route path='/consultation' element={<Consultation handleLinkClick={handleLinkClick} />} />
                    <Route path='/annualreport' element={<AnnualPhysicalExamForm handleLinkClick={handleLinkClick} />} />
                    <Route path='/patient-details' element={<PatientDetails handleLinkClick={handleLinkClick} />} />
                    <Route path='/appointment' element={<AppointmentPage handleLinkClick={handleLinkClick} />} />
                    <Route path='/prescriptions' element={<Prescriptions handleAskButton={handleAskButton} />} />
                    <Route path="/inventory" element={<Inventory handleAskButton={handleAskButton} />} />
                    <Route path="/borrowing" element={<BorrowingScreen handleAskButton={handleAskButton} />} />
                    <Route path="/events" element={<EventManager handleAskButton={handleAskButton} />} />
                    <Route path="/notifications" element={<Notifications handleAskButton={handleAskButton} />} />
                    <Route path="/medicines" element={<MedicineInventory handleAskButton={handleAskButton} />} />
                    <Route path="/supply" element={<SupplyInventory handleAskButton={handleAskButton} />} />
                    <Route path="/equipment" element={<EquipmentInventory handleAskButton={handleAskButton} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                )}

                {role === 'Physician' && (

                  <>
                    <Route path="/" element={<Dashboard handleAskButton={handleAskButton} />} />
                    <Route path='/patients' element={<Patients handleAskButton={handleAskButton} handleLinkClick={handleLinkClick} />} />
                    <Route path='/consultation' element={<Consultation handleLinkClick={handleLinkClick} />} />
                    <Route path='/annualreport' element={<AnnualPhysicalExamForm handleLinkClick={handleLinkClick} />} />
                    <Route path='/patient-details' element={<PatientDetails handleLinkClick={handleLinkClick} />} />
                    <Route path='/appointment' element={<AppointmentPage handleLinkClick={handleLinkClick} />} />
                    <Route path='/prescriptions' element={<Prescriptions handleAskButton={handleAskButton} />} />
                    <Route path="/inventory" element={<Inventory handleAskButton={handleAskButton} />} />
                    <Route path="/notifications" element={<Notifications handleAskButton={handleAskButton} />} />
                    <Route path="/medicines" element={<MedicineInventory handleAskButton={handleAskButton} />} />
                    <Route path="/supply" element={<SupplyInventory handleAskButton={handleAskButton} />} />
                    <Route path="/equipment" element={<EquipmentInventory handleAskButton={handleAskButton} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                )}
                {role === 'Staff' && (

                  <>
                    <Route path="/medicines" element={<MedicineInventory handleAskButton={handleAskButton} />} />
                    <Route path="/supply" element={<SupplyInventory handleAskButton={handleAskButton} />} />
                    <Route path="/equipment" element={<EquipmentInventory handleAskButton={handleAskButton} />} />
                    <Route path="*" element={<Navigate to="/medicines" />} />
                  </>
                )}

                {role === 'Student' && (

                  <>
                    <Route path="/home" element={<Home handleAskButton={handleAskButton} />} />
                    <Route path='/student-appointment' element={<StudentAppointmentPage/>} />
                    <Route path='/student-details' element={<Records/>} />
                    <Route path='/student-prescriptions' element={<StudentPrescriptions/>} />
                    <Route path='/student-logs' element={<VisitLogs/>} />
                  
                    <Route path="/notifications" element={<Notifications handleAskButton={handleAskButton} />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                  </>
                )}
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path='/registration' element={<Registration />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
}

export default App;

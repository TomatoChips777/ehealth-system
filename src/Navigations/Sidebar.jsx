

import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Sidebar({ sidebarOpen, activeLink, handleLinkClick, role }) {
  const navigate = useNavigate();

  const handleClick = (key) => {
    handleLinkClick(key);
    const routeMap = {
      Dashboard: '/',
      Inventory: '/inventory',
      Borrowing: '/borrowing',
      Notifications: '/notifications',
      Users: '/users',
      Patients: '/patients',
      Prescriptions: '/prescriptions',
      Appointment: '/appointment',
      Consultations: '/consultation',
      Medicines: '/medicines',
      Equipments: '/equipment',
      Supply: '/supply',
      Home: '/home',
     'My Appointments': '/student-appointment',
     'My Records': '/student-details',
      'My Prescriptions': '/student-prescriptions',
      'My Visit Logs': '/student-logs',

    };
    navigate(routeMap[key]);
  };

  const allLinks = [
    { key: 'Dashboard', icon: 'speedometer2' },
    { key: 'Users', icon: 'person-check-fill' },
    { key: 'Patients', icon: 'people-fill' },
    { key: 'Appointment', icon: 'calendar-week' },
    { key: 'Consultations', icon: 'file-earmark-medical' },
    { key: 'Prescriptions', icon: 'prescription' },
    { key: 'Medicines', icon: 'capsule' },
    { key: 'Supply', icon: 'boxes' },
    { key: 'Equipments', icon: 'tools' },
    {key: 'Home', icon: 'house'},
    {key: 'My Appointments', icon: 'calendar-week'},
    {key: 'My Records', icon: 'file-earmark-medical'},
    {key: 'My Prescriptions', icon: 'prescription'},
    {key: 'My Visit Logs', icon: 'file-earmark-text'},
    { key: 'Notifications', icon: 'bell' },
  ];

  // Filter links based on role
  const roleBasedLinks = {
    Admin: allLinks.filter(link =>
      ['Dashboard','Users' ,'Patients', 'Appointment', 'Consultations', 'Prescriptions', 'Medicines', 'Supply', 'Equipments', 'Notifications'].includes(link.key)
    ),
    Physician: allLinks.filter(link =>
      ['Dashboard', 'Patients', 'Appointment', 'Consultations', 'Prescriptions', 'Medicines', 'Supply', 'Equipments', 'Notifications'].includes(link.key)
    ),
    Staff: allLinks.filter(link =>
      ['Medicines', 'Supply', 'Equipments'].includes(link.key)
    ),
    Student: allLinks.filter(link =>
      ['Home','Notifications', 'My Appointments', 'My Records', 'My Prescriptions', 'My Visit Logs'].includes(link.key)
    ),
  };

  const linksToDisplay = roleBasedLinks[role] || [];

  return (
    <div className={`sidebar bg-success text-white ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header text-center py-4">
        <img src="../../src/assets/logo.jpg" alt="Logo" style={{ width: '100px', height: 'auto' }}/>
        {sidebarOpen && <h5 className="mt-2 mb-0">EHRS-LC</h5>}
      </div>
      <hr />
      <Nav className="flex-column">
        {linksToDisplay.map(({ key, icon }) => (
          <Nav.Link
            key={key}
            className={`d-flex align-items-center px-3 py-2 rounded-0 ${
              activeLink === key ? 'bg-dark text-white' : 'text-white'
            }`}
            href="#"
            onClick={() => handleClick(key)}
          >
            <i className={`bi bi-${icon} me-2`}></i>
            {sidebarOpen && <span>{key}</span>}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}

export default Sidebar;

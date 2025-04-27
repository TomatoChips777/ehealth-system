

// import { Nav } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// function Sidebar({ sidebarOpen, activeLink, handleLinkClick }) {
//   const navigate = useNavigate();

//   const handleClick = (key) => {
//     handleLinkClick(key);
//     const routeMap = {
//       Dashboard: '/',
//       Inventory: '/inventory',
//       Borrowing: '/borrowing',
//       Notifications: '/notifications',
//       Users: '/users',
//       Patients: '/patients',
//       Prescriptions: '/prescriptions',
//       Appointment: '/appointment',
//       Consultations: '/consultation',
//       Medicines: '/medicines',
//       Equipments: '/equipment',
//       Supply: '/supply'
//     };
//     navigate(routeMap[key]);
//   };

//   return (
//     <div className={`sidebar bg-success text-white ${sidebarOpen ? '' : 'collapsed'}`}>
//       <div className="sidebar-header text-center py-4">
//         <img src="../../src/assets/images.png" alt="Logo" style={{ width: '100px', height: 'auto' }}/>
//         {sidebarOpen && <h5 className="mt-2 mb-0"></h5>}
//       </div>
//       <hr />
//       <Nav className="flex-column">
//         {[
//           { key: 'Dashboard', icon: 'speedometer2' },
//           {key: 'Users', icon: 'person-check-fill'},
//           { key: 'Patients', icon: 'people-fill' },
//           { key: 'Appointment', icon: 'calendar-week' },
//           { key: 'Consultations', icon: 'file-earmark-medical' },
//           { key: 'Prescriptions', icon: 'prescription' },
//           { key: 'Medicines', icon: 'capsule' },
//           { key: 'Supply', icon: 'boxes' },
//           { key: 'Equipments', icon: 'tools' },
//           { key: 'Notifications', icon: 'bell' },
//         ].map(({ key, icon }) => (
//           <Nav.Link
//             key={key}
//             className={`d-flex align-items-center px-3 py-2 rounded-0 ${
//               activeLink === key ? 'bg-dark text-white ' : 'text-white'
//             }`}
//             href="#"
//             onClick={() => handleClick(key)}
//           >
//             <i className={`bi bi-${icon} me-2`}></i>
//             {sidebarOpen && <span>{key}</span>}
//           </Nav.Link>
//         ))}
//       </Nav>
//     </div>
//   );
// }

// export default Sidebar;


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
      Supply: '/supply'
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
    { key: 'Notifications', icon: 'bell' },
  ];

  // Filter links based on role
  const roleBasedLinks = {
    Admin: allLinks,
    Physician: allLinks.filter(link =>
      ['Dashboard', 'Patients', 'Appointment', 'Consultations', 'Prescriptions', 'Medicines', 'Supply', 'Equipments', 'Notifications'].includes(link.key)
    ),
    Staff: allLinks.filter(link =>
      ['Medicines', 'Supply', 'Equipments'].includes(link.key)
    ),
  };

  const linksToDisplay = roleBasedLinks[role] || [];

  return (
    <div className={`sidebar bg-success text-white ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header text-center py-4">
        <img src="../../src/assets/images.png" alt="Logo" style={{ width: '100px', height: 'auto' }}/>
        {sidebarOpen && <h5 className="mt-2 mb-0"></h5>}
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

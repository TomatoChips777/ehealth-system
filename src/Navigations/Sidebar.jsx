import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Sidebar({ sidebarOpen, activeLink, handleLinkClick }) {
  const navigate = useNavigate();

  const handleClick = (key) => {
    handleLinkClick(key);
    // Dagdagan kung kailangan
    const routeMap = {
      Dashboard: '/',
      Inventory: '/inventory',
      Barrowing: '/borrowing',
      Appointments: '/events',
      Notifications: '/notifications',
      Users: '/users',
    };
    navigate(routeMap[key]);
  };

  return (
    <div className={`sidebar bg-success text-white ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header text-center py-4">
      <img src="../../src/assets/images.png" alt="Logo" style={{ width: '100px', height: 'auto' }}/>

        {sidebarOpen && <h5 className="mt-2 mb-0">Inventory System</h5>}
      </div>
      <hr />
      <Nav className="flex-column">
        {[
          { key: 'Dashboard', icon: 'speedometer2' },
          {key: 'Users', icon: 'people-fill'},
          { key: 'Inventory', icon: 'box-seam' },
          { key: 'Barrowing', icon: 'arrow-left-right' },
          { key: 'Appointments', icon: 'calendar' },
          { key: 'Notifications', icon: 'bell' },
        ].map(({ key, icon }) => (
          <Nav.Link
            key={key}
            className={`d-flex align-items-center px-3 py-2 rounded-pill ${
              activeLink === key ? 'bg-primary text-white ' : 'text-white'
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

import { useEffect, useMemo, useState } from 'react';
import { Container, Table, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import PaginationControls from '../extra/Paginations';
import FormatDate from '../extra/DateFormat';
import EditUserModal from '../extra/EditUserModal';
import AddUserModal from '../extra/AddUserModal';
import { io } from 'socket.io-client';
import { useAuth } from '../../AuthContext';
function Users() {
  const {user} = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: 1,
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_FETCH_ALL_USERS}`);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateUser', () => {
      fetchUsers();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'All' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (user) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_ADD_USER}`, user);
      if (res.data.success) {
        setShowAddModal(false);
        fetchUsers();
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: '',
          status: 1,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditSubmit = async (user) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_UPDATE_USER}/${user.id}`, user);
      if (res.data.success) {
        setShowEditModal(false);
        fetchUsers();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const handleSave = () => {
    console.log('Saved!');
    
  };
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleUserStatus = async (userId, currentStatus) => {

    if(user.id === userId){
      return;
    }
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const response = await axios.put(`${import.meta.env.VITE_ACTIVATE_DEACTIVATE_USER}/${userId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        setUsers(users.map(user =>
          user.user_id === userId ? { ...user, status: newStatus } : user
        ));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container fluid className="p-0">
      <Card className='p-1'>
        <h1 className="mb-4 text-center">User Management</h1>

        <Row className="mb-3 p-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Physician">Physician</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Button variant='success' onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-circle me-2"></i> Add New User
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive className='mb-0'>
          <thead className='table-dark'>
            <tr>
              <th>#ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className='text-center'>Status</th>
              <th>Date Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className='text-center'>
                    <Form.Check
                      type="checkbox"
                      checked={user.status === 1}
                      onChange={() => toggleUserStatus(user.user_id, user.status)}
                    />
                  </td>
                  <td>{FormatDate(user.created_at)}</td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(user)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No users found.</td>
              </tr>
            )}
          </tbody>
        </Table>

        <PaginationControls
          filteredReports={filteredUsers}
          pageSize={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handlePageSizeChange={handlePageSizeChange}
        />
      </Card>

      {/* <AddUserModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        newUser={newUser}
        handleChange={handleAddChange}
      /> */}

      {/* <EditUserModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleEditSubmit}
        user={selectedUser || newUser}
        handleChange={handleEditChange}
      /> */}

    <AddUserModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSave={handleSave}
      />
      <EditUserModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        initialData={selectedPatient}
        onSave={handleSave}
      />
    </Container>
  );
}

export default Users;

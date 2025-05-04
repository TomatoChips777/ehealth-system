import { useEffect, useMemo, useState } from 'react';
import { Container, Table, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import TextTruncate from '../../extra/TextTruncate';
import axios from 'axios';
import { io } from 'socket.io-client';
import PaginationControls from '../../extra/Paginations';
import AddSupplyModal from './components/AddSupplyModal';
import EditSupplyModal from './components/EditSupplyModal';
import FormatDate from '../../extra/DateFormat';

function SupplyInventory({ handleAskButton }) {
  const [supply, setSupply] = useState([]);
  const navigate = useNavigate(); 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newSupply, setNewSupply] = useState({
    supply_name: '',
    quantity: 1,
    category: '',
    serial_number: '',
    status: ''

  });
  const goToMonthlyReport = () => {
    navigate('/supply-monthly'); 
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_SUPPLIES}`);
      setSupply(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateInventory', () => {
      fetchData();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredItems = useMemo(() => {
    return supply.filter(item => {
      const matchesSearch =
        item.supply_name.toLowerCase().includes(search.toLowerCase()) ||
        item.serial_number.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
        

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [supply, search, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewSupply((prev) => ({ ...prev, [name]: value }));
  };

  const formatLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedSupply((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async () => {
    const addNewSupply = {
      supply_name: newSupply.supply_name,
      category: newSupply.category,
      quantity: newSupply.quantity,
      expiry_date: newSupply.expiry_date,
      serial_number: newSupply.serial_number,
      status: newSupply.status
    }
    console.log(addNewSupply);

    try {
      const response = await axios.post(`${import.meta.env.VITE_ADD_SUPPLY}`, addNewSupply);
      if (response.data.success) {
        setCurrentPage(currentPage);
        setShowAddModal(false);
        setNewSupply({
          supply_name: '',
          category: '',
          quantity: 1,
          serial_number: '',
          status: '',
        });
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (supply) => {
    const updateSupply = {
      supply_name: supply.supply_name,
      category: supply.category,
      quantity: supply.quantity,
      serial_number: supply.serial_number,
      status: supply.status
    }
    try {
      const response = await axios.put(`${import.meta.env.VITE_UPDATE_SUPPLY}/${supply.id}`, updateSupply);
      if (response.data.success) {
        setCurrentPage(currentPage);
        setShowEditModal(false);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (supply) => {
    setSelectedSupply(supply);
    setShowEditModal(true);
  };


  const handleDelete = async (id) => {
    try{
      const response = await axios.put(`${import.meta.env.VITE_REMOVE_SUPPLY}/${id}`);
      setSupply(supply.filter(item => item.id !== id));
    }catch(error){

    }
    

  };

  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <Container className="p-0 y-0" fluid>
      <Card className='p-1'>
        <h1 className="mb-4 text-center">Supply Inventory</h1>

        <Row className="mb-3 p-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search supply name, serial number, or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
          <Button variant="dark" size='sm' onClick={goToMonthlyReport}>
              Go to Monthly Report
            </Button>
          </Col>
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Button variant='dark' size='sm' onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-circle me-2"></i> Add Supply
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive className='mb-0'>
          <thead className='table-dark'>
            <tr>
              <th>#</th>
              <th>Created At</th>
              <th>Serial Number</th>
              <th>Supply Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th className='text-center'>Actions</th>
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
              currentData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{FormatDate(item.created_at, false)}</td>
                  <td>{item.serial_number}</td>
                  <td>
                        <TextTruncate text={item.supply_name} maxLength={30} />
                  </td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.status}</td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" className="me-2 mb-1" onClick={() => handleEdit(item)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="danger" size="sm" className="me-2 mb-1" onClick={() => handleDelete(item.id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No records found.</td>
              </tr>
            )}
          </tbody>
        </Table>
        <PaginationControls
          filteredReports={filteredItems}
          pageSize={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handlePageSizeChange={handlePageSizeChange}
        />
      </Card>

      <AddSupplyModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        newItem={newSupply}
        handleChange={handleAddChange}
      />

      <EditSupplyModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleEditSubmit}
        item={selectedSupply || newSupply}
        handleChange={handleEditChange}
      />
    </Container>
  );
}

export default SupplyInventory;

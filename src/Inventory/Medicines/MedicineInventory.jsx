import { useEffect, useMemo, useState } from 'react';
import { Container, Table, Form, Button, Row, Col, Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import TextTruncate from '../../extra/TextTruncate';
import AddMedicineModal from './components/AddMedicineModal'; // Keep or rename to AddMedicineModal if preferred
import EditMedicineModal from './components/EditMedicineModal'; // Same here
import axios from 'axios';
import { io } from 'socket.io-client';
import PaginationControls from '../../extra/Paginations';
import FormatDate from '../../extra/DateFormat';

function MedicineInventory({ handleAskButton }) {
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate(); 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newMedicine, setNewMedicine] = useState({
    medicine_name: '',
    category: '',
    quantity: 1,
    expiry_date: '',
    serial_number: ''
  });
  const goToMonthlyReport = () => {
    navigate('/medicines-monthly'); 
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_MEDICINES}`);
      setMedicines(response.data);
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
    return medicines.filter(item => {
      const matchesSearch =
        item.medicine_name.toLowerCase().includes(search.toLowerCase()) ||
        item.serial_number.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
        

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [medicines, search, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine((prev) => ({ ...prev, [name]: value }));
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
    setSelectedMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async () => {
    const addNewMedicine = {
      medicine_name: newMedicine.medicine_name,
      category: newMedicine.category,
      quantity: newMedicine.quantity,
      expiry_date: newMedicine.expiry_date,
      serial_number: newMedicine.serial_number
    }
    console.log(addNewMedicine);

    try {
      const response = await axios.post(`${import.meta.env.VITE_ADD_MEDICINE}`, addNewMedicine);
      if (response.data.success) {
        setCurrentPage(currentPage);
        setShowAddModal(false);
        setNewMedicine({
          medicine_name: '',
          category: '',
          quantity: 1,
          expiry_date: '',
          serial_number: ''
        });
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (medicine) => {
    const updateMedicine = {
      medicine_name: medicine.medicine_name,
      category: medicine.category,
      quantity: medicine.quantity,
      expiry_date: formatLocalDate(medicine.expiry_date),
      serial_number: medicine.serial_number
    }
    try {
      const response = await axios.put(`${import.meta.env.VITE_UPDATE_MEDICINE}/${medicine.id}`, updateMedicine);
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

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setShowEditModal(true);
  };

  const handleSave = (updatedMedicine) => {
    setMedicines(medicines.map(item => item.id === updatedMedicine.id ? updatedMedicine : item));
    setShowEditModal(false);
    setSelectedMedicine(null);
  };

  const handleDelete = async (id) => {
    try{
      const response = await axios.put(`${import.meta.env.VITE_REMOVE_MEDICINE}/${id}`);
      setMedicines(medicines.filter(item => item.id !== id));
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
        <h1 className="mb-4 text-center">Medicine Inventory</h1>

        <Row className="mb-3 p-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search medicine name, serial number, or type..."
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
              <i className="bi bi-plus-circle me-2"></i> Add Medicine
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive className='mb-0'>
          <thead className='table-dark'>
            <tr>
              <th>#</th>
              <th>Created At</th>
              <th>Serial Number</th>
              <th>Medicine Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th className='text-center'>Expiry Date</th>
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
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Ask about this medicine</Tooltip>}
                    >
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          handleAskButton(
                            `What is the use or instructions for this medicine: "${item.medicine_name}"${item.serial_number
                              ? ` with serial number ${item.serial_number}`
                              : ''
                            }, type: ${item.category}, status: ${item.status}, quantity: ${item.quantity}?`
                          )
                        }
                      >
                        <TextTruncate text={item.medicine_name} maxLength={30} />
                      </span>
                    </OverlayTrigger>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{FormatDate(item.expiry_date, false)}</td>
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

      <AddMedicineModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        newItem={newMedicine}
        handleChange={handleAddChange}
      />

      <EditMedicineModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleEditSubmit}
        item={selectedMedicine || newMedicine}
        handleChange={handleEditChange}
      />
    </Container>
  );
}

export default MedicineInventory;

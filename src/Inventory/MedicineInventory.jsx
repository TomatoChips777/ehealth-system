import { useEffect, useMemo, useState } from 'react';
import { Container, Table, Form, Button, Row, Col, Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';

import TextTruncate from '../extra/TextTruncate';
import AddInventoryModal from './Medicines/components/AddMedicineModal'; // Keep or rename to AddMedicineModal if preferred
import EditInventoryModal from './Medicines/components/EditInventoryModal'; // Same here
import axios from 'axios';
import { io } from 'socket.io-client';
import PaginationControls from '../extra/Paginations';

function MedicineInventory({ handleAskButton }) {
  const [medicines, setMedicines] = useState([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newMedicine, setNewMedicine] = useState({
    item_name: '',
    category: '',
    quantity: 1,
    status: 'New',
    serial_number: ''
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_INVENTORY_ITEM}`);
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
        item.item_name.toLowerCase().includes(search.toLowerCase()) ||
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (medicine) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_CREATE_INVENTORY_ITEM}`, medicine);
      if (response.data.success) {
        setCurrentPage(currentPage);
        setShowAddModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (medicine) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_UPDATE_INVENTORY_ITEM}/${medicine.id}`, medicine);
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

  const handleDelete = (id) => {
    setMedicines(medicines.filter(item => item.id !== id));
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
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Expired">Expired</option>
              <option value="Restocked">Restocked</option>
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Button variant='dark' onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-circle me-2"></i> Add Medicine
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive className='mb-0'>
          <thead className='table-dark'>
            <tr>
              <th>#ID</th>
              <th>Serial Number</th>
              <th>Medicine Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th className='text-center'>Status</th>
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
              currentData.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
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
                            `What is the use or instructions for this medicine: "${item.item_name}"${item.serial_number
                              ? ` with serial number ${item.serial_number}`
                              : ''
                            }, type: ${item.category}, status: ${item.status}, quantity: ${item.quantity}?`
                          )
                        }
                      >
                        <TextTruncate text={item.item_name} maxLength={10} />
                      </span>
                    </OverlayTrigger>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td className='text-center'>{item.status}</td>
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

      <AddInventoryModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        newItem={newMedicine}
        handleChange={handleAddChange}
      />

      <EditInventoryModal
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

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddEquipmentModal({ show, onHide, onSubmit, newItem, handleChange }) {
  const [customCategory, setCustomCategory] = useState(false);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    handleChange(e);
    setCustomCategory(selected === 'Other');
  };

  const categoryOptions = [
    "Medical Devices",
    "Diagnostic Equipment",
    "Office Electronics",
    "Furniture",
    "Surgical Instruments",
    "Sterilization Equipment",
    "Protective Equipment",
    "Monitoring Equipment",
    "Emergency Equipment",
    "Other"
  ];
  
  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Add New Equipment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => {
          e.preventDefault();

          const finalItem = {
            ...newItem,
            category: newItem.category === "Other" ? newItem.customCategory : newItem.category,
          };

          onSubmit(finalItem);
        }}>

          <Form.Group className="mb-3" controlId="equipment_name">
            <Form.Label>Equipment Name</Form.Label>
            <Form.Control
              type="text"
              name="equipment_name"
              value={newItem.equipment_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={newItem.category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {newItem.category === "Other" && (
            <Form.Group className="mb-3" controlId="customCategory">
              <Form.Label>Specify Category</Form.Label>
              <Form.Control
                type="text"
                name="customCategory"
                value={newItem.customCategory || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="serial_number">
            <Form.Label>Serial Number / Asset Tag (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="serial_number"
              value={newItem.serial_number}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="status">
            <Form.Label>Condition (Optional)</Form.Label>
            <Form.Select
              name="status"
              value={newItem.status || ''}
              onChange={handleChange}
            >
               <option value="">-- Select condition --</option>
              <option value="New">Brand New</option>
              <option value="Used">Used</option>
              <option value="Restored">Restored</option>
              <option value="Defective">Defective</option>
              <option value="For Repair">For Repair</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Equipment
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddEquipmentModal;

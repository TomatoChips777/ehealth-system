import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddSupplyModal({ show, onHide, onSubmit, newItem, handleChange }) {
  const [customCategory, setCustomCategory] = useState(false);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    handleChange(e);
    setCustomCategory(selected === 'Other');
  };

  const categoryOptions = [
    "Office Supply",
    "Medical Equipment",
    "Cleaning Supply",
    "Protective Gear",
    "Electronic Device",
    "Furniture",
    "Tool",
    "Other"
  ];

  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Add New Supply Item</Modal.Title>
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

          <Form.Group className="mb-3" controlId="supply_name">
            <Form.Label>Supply Item Name</Form.Label>
            <Form.Control
              type="text"
              name="supply_name"
              value={newItem.supply_name}
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
            <Form.Label>Serial Number / Batch Code (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="serial_number"
              value={newItem.serial_number}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="status">
            <Form.Label>Status (Optional)</Form.Label>
            <Form.Select
              name="status"
              value={newItem.status || ''}
              onChange={handleChange}
            >
              <option value="">-- Select status --</option>
              <option value="In Stock">In Stock</option>
              <option value="Out Of Stock">Out of Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Expired">Expired</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Supply
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddSupplyModal;

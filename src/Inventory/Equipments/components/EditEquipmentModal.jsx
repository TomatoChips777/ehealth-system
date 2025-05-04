import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditEquipmentModal({ show, onHide, onSave, item, handleChange }) {
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

  const updatedCategoryOptions = categoryOptions.includes(item.category)
    ? categoryOptions
    : [...categoryOptions, item.category];

  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (item.category === "Other") {
      setCustomCategory(item.customCategory || '');
    } else {
      setCustomCategory('');
    }
  }, [item.category, item.customCategory]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'Other') {
      setCustomCategory(item.customCategory || '');
    } else {
      setCustomCategory('');
    }
    handleChange(e);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedItem = {
      ...item,
      category: item.category === "Other" ? customCategory : item.category
    };
    onSave(updatedItem);
  };

  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Edit Equipment Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="equipment_name">
            <Form.Label>Equipment Item Name</Form.Label>
            <Form.Control
              type="text"
              name="equipment_name"
              value={item.equipment_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={item.category}
              onChange={handleCategoryChange}
              required
            >
              {updatedCategoryOptions.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {item.category === "Other" && (
            <Form.Group className="mb-3" controlId="custom_category">
              <Form.Label>Custom Category</Form.Label>
              <Form.Control
                type="text"
                name="customCategory"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="serial_number">
            <Form.Label>Serial Number / Batch Code (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="serial_number"
              value={item.serial_number}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="status">
            <Form.Label>Condition</Form.Label>
            <Form.Select
              name="status"
              value={item.status || ''}
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
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditEquipmentModal;

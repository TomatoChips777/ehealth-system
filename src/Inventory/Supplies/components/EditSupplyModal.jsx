import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditSupplyModal({ show, onHide, onSave, item, handleChange }) {
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
    if (item.category === "Other" && customCategory) {
      item.category = customCategory;
    }
    onSave(item);
  };

  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Edit Supply Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="supply_name">
            <Form.Label>Supply Item Name</Form.Label>
            <Form.Control
              type="text"
              name="supply_name"
              value={item.supply_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
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
            </Form.Control>
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
            <Form.Label>Status (Optional)</Form.Label>
            <Form.Select
              name="status"
              value={item.status || ''}
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
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditSupplyModal;

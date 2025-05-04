import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddMedicineModal({ show, onHide, onSubmit, newItem, handleChange }) {
  const [customCategory, setCustomCategory] = useState(false);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    handleChange(e);
    setCustomCategory(selected === 'Other');
  };

  const categoryOptions = [
    "Antibiotic",
    "Analgesic",
    "Antiseptic",
    "Antipyretic",
    "Antacid",
    "Antiviral",
    "Vitamin",
    "Supplement",
    "Cough & Cold",
    "Topical",
    "Other"
  ];

  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Add New Medicine</Modal.Title>
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

          <Form.Group className="mb-3" controlId="medicine_name">
            <Form.Label>Medicine Name</Form.Label>
            <Form.Control
              type="text"
              name="medicine_name"
              value={newItem.medicine_name}
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

          <Form.Group className="mb-3" controlId="expiry_date">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="date"
              name="expiry_date"
              value={newItem.expiry_date}
              onChange={handleChange}
              required
            />
          </Form.Group>


          <Form.Group className="mb-3" controlId="serial_number">
            <Form.Label>Batch Number / Serial Number (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="serial_number"
              value={newItem.serial_number}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Medicine
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddMedicineModal;

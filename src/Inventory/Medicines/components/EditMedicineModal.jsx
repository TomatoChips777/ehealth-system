import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditMedicineModal({ show, onHide, onSave, item, handleChange }) {
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

  // Check if the item category is in the options, if not, add it to the list
  const updatedCategoryOptions = categoryOptions.includes(item.category)
    ? categoryOptions
    : [...categoryOptions, item.category];

  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (item.category === "Other") {
      setCustomCategory(item.customCategory || ''); // If the category is 'Other', use the customCategory value
    } else {
      setCustomCategory('');
    }
  }, [item.category, item.customCategory]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'Other') {
      // If 'Other' is selected, keep the custom category input active
      setCustomCategory(item.customCategory || '');
    } else {
      setCustomCategory('');
    }

    // Update category in item object directly if 'Other' is selected
    handleChange(e);
  };

  // Update the item object with the custom category before saving
  const handleSave = (e) => {
    e.preventDefault();

    if (item.category === "Other" && customCategory) {
      // If "Other" is selected and there's a custom category, set the category to the custom value
      item.category = customCategory;
    }

    // Pass the updated item object to the onSave function
    onSave(item);
  };
  const formatLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Edit Inventory Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="medicine_name">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              name="medicine_name"
              value={item.medicine_name}
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
          {/* Show custom category input if 'Other' is selected */}
          {item.category === "Other" && (
            <Form.Group className="mb-3" controlId="custom_category">
              <Form.Label>Custom Category</Form.Label>
              <Form.Control
                type="text"
                name="customCategory"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                }}
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
          <Form.Group className="mb-3" controlId="expiry_date">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="date"
              name="expiry_date"
              value={
                item.expiry_date
                  ? formatLocalDate(item.expiry_date)
                  : ''
              }
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="serial_number">
            <Form.Label>Serial Number (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="serial_number"
              value={item.serial_number}
              onChange={handleChange}
            />
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

export default EditMedicineModal;

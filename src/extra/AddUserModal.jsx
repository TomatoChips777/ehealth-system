import { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
const AddUserModal = ({ show, handleClose, onSave }) => {
  const { role } = useAuth();
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    student_id: '',
    full_name: '',
    course: '',
    year: '',
    birthdate: '',
    sex: '',
    contact_number: '',
    address: '',
    contact_person: '',
    contact_person_number: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({}); // Reset field errors

    try {
      const response = await axios.post(`${import.meta.env.VITE_ADD_PATIENT}`, formData);

      if (response.data.success) {
        onSave();
        handleClose();
        setFormData({
          username: '',
          password: '',
          email: '',
          student_id: '',
          full_name: '',
          course: '',
          year: '',
          birthdate: '',
          sex: '',
          contact_number: '',
          address: '',
          contact_person: '',
          contact_person_number: '',
          role: '',
        })
      } else if (response.data.errors) {
        setFieldErrors(response.data.errors); 
      } else {
        setError(response.data.message || 'Failed to add patient.');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_ADD_PATIENT}`, formData);

  //     if (response.data.success) {
  //       onSave();
  //       handleClose();
  //     } else {

  //       setError(response.data.message || 'Failed to add patient.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     if (err.response?.data?.message) {
  //       setError(err.response.data.message); 
  //     } else {
  //       setError('Something went wrong.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_ADD_PATIENT}`, formData);

  //     if (response.data.success) {
  //       onSave(); // Callback after successful save
  //       handleClose(); // Close modal
  //     } else {
  //       setError(response.data.message || 'Failed to add patient.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError('Something went wrong.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add New Patient</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="g-3">
            {/* Username */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Username *</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Password */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Password *</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Student ID */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Student ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.student_id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Full Name */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Course */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Course</Form.Label>
                <Form.Control
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Year */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Birthdate */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Sex */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Sex</Form.Label>
                <Form.Select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Contact Number */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Address */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Contact Person */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contact Person</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Contact Person Number */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contact Person Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_person_number"
                  value={formData.contact_person_number}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* User type */}
            {role === 'Admin' &&
              <Col md={6}>
                <Form.Group>
                  <Form.Label>User Type</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                    <option value="Physician">Physician</option>
                    <option value="Admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            }
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Saving...
              </>
            ) : (
              'Save Patient'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddUserModal;

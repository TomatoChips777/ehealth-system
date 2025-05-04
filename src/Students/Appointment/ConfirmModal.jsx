import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, message, onConfirm, onClose }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Confirmation</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>No</Button>
      <Button variant="primary" onClick={onConfirm}>Yes</Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;

import React, { useState, useEffect } from 'react';
import { Table, Pagination, Badge, Button, Container, Row, Col, Card } from 'react-bootstrap';
import FormatDate from '../extra/DateFormat';
import generatePrescriptionPDF from '../Prescriptions/PrescriptionPDF';
import { useAuth } from '../../AuthContext';
import axios from 'axios';

function StudentPrescriptions() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [prescriptions, setPrescriptions] = useState([]);
  const prescriptionsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_PRESCRIPTIONS_BY_USER}/${user?.id}`);
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const indexOfLastPrescription = currentPage * prescriptionsPerPage;
  const indexOfFirstPrescription = indexOfLastPrescription - prescriptionsPerPage;
  const currentPrescriptions = prescriptions.slice(indexOfFirstPrescription, indexOfLastPrescription);
  const totalPages = Math.ceil(prescriptions.length / prescriptionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDownload = (pres) => {
    const prescriptionData = {
      student: pres.user_id,
      prescriptions: pres.prescriptions,
      notes: pres.notes,
    };
    generatePrescriptionPDF(prescriptionData.student, prescriptionData.prescriptions, prescriptionData.notes);
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Issued Prescriptions</h5>
              <Badge bg="light" text="dark" pill>
                {prescriptions.length} Total
              </Badge>
            </Card.Header>

            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table bordered hover size="sm" className="mb-0 w-100 text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Date Issued</th>
                      <th>Medicines</th>
                      <th>Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPrescriptions.length > 0 ? (
                      currentPrescriptions.map((pres, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold">{FormatDate(pres.created_at, false)}</td>
                          <td className="text-start">
                            {pres.prescriptions.map((med, medIdx) => (
                              <div key={medIdx} className="mb-1 fw-bold">
                                {med.medicine}{' '}
                                <small className="text-muted">
                                  ({med.dosage} / {med.frequency}xday / {med.duration} days)
                                </small>
                              </div>
                            ))}
                          </td>
                          <td className="text-start">{pres.notes || <span className="text-muted">No notes</span>}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleDownload(pres)}
                            >
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No prescriptions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>

            {totalPages > 1 && (
              <Card.Footer className="bg-white d-flex justify-content-center">
                <Pagination>
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentPrescriptions;

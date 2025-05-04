import React, { useState } from 'react';
import { Table, Pagination, Badge, Button } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';
import generatePrescriptionPDF from '../../Prescriptions/PrescriptionPDF';

function StudentPrescriptions({ prescriptions, student }) {
  const [currentPage, setCurrentPage] = useState(1);
  const prescriptionsPerPage = 5;

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
      notes: pres.notes
    };
    generatePrescriptionPDF(prescriptionData.student, prescriptionData.prescriptions, prescriptionData.notes);
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Issued Prescriptions</h5>
        <Badge bg="success" pill>
          {prescriptions.length} Total
        </Badge>
      </div>

      <div className="table-responsive shadow-sm rounded p-2 bg-white">
        <Table bordered hover size="sm" responsive>
          <thead className="table-light">
            <tr className="text-center">
              <th>Date Issued</th>
              <th>Medicines</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPrescriptions.map((pres, idx) => (
              <tr key={idx}>
                <td className="fw-bold">{FormatDate(pres.created_at, false)}</td>
                <td>
                  {pres.prescriptions.map((med, medIdx) => (
                    <div key={medIdx} className="mb-1 fw-bold">
                      {med.medicine}
                      {/* <small className="text-muted">
                        ({med.dosage} / {med.frequency}xday / {med.duration} days)
                      </small> */}
                    </div>
                  ))}
                </td>
                <td>{pres.notes || <span className="text-muted">No notes</span>}</td>
                <td className="text-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownload(pres)}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
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
        </div>
      )}
    </div>
  );
}

export default StudentPrescriptions;

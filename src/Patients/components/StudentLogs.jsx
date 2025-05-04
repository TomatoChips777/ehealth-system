import React, { useState } from 'react';
import { Card, Row, Col, Pagination } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';
import TextTruncate from '../../extra/TextTruncate';

function StudentLogs({ logs = [] }) {
  if (!logs || logs.length === 0) {
    return <p className="mt-3 text-muted">No logs found for this student.</p>;
  }
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 2;

  if (!logs.length) return null;

  const indexOfLastLog = currentPage * logsPerPage;
  const currentLogs = logs.slice(indexOfLastLog - logsPerPage, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatTime12Hour = (timeString) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12.toString().padStart(2, '0')}:${minute} ${suffix}`;
  };

  return (
    <Card>
      <Card.Header><strong>Visit Logs</strong></Card.Header>

      <Card.Body>
        {currentLogs.map((log, index) => (
          <Card key={index} className="mb-2">
            <Card.Body className="text-wrap">
              <Row>
                <Col md={4}>
                  <p className="mb-1"><strong>Date:</strong> {FormatDate(log.date, false)}</p>
                  <p className="mb-1"><strong>Time:</strong> {formatTime12Hour(log.time)}</p>
                </Col>
                <Col md={8}>
                  <p className="mb-1"><strong>Chief Complaint:</strong> {<TextTruncate text={log.chief_complaint} maxLength={10}/>}</p>
                  <p className="mb-1"><strong>Intervention:</strong> {<TextTruncate text={log.intervention || 'N/A'} maxLength={30}/>}</p>
                  <p className="mb-1"><strong>Remarks:</strong> {<TextTruncate text={log.remarks || 'N/A'} maxLength={10}/>}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </Card.Body>

      {totalPages > 1 && (
        <Card.Footer className="d-flex justify-content-end">
          <Pagination size="sm">
            {Array.from({ length: totalPages }, (_, idx) => (
              <Pagination.Item
                key={idx}
                active={idx + 1 === currentPage}
                onClick={() => paginate(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Card.Footer>
      )}
    </Card>
  );
}

export default StudentLogs;

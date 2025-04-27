import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ListGroup, Badge, Table } from 'react-bootstrap';
import {
  PersonBadgeFill,
  CalendarCheckFill,
  ClipboardDataFill,
  CapsulePill,
  BellFill,
  PeopleFill,
  FileEarmarkMedicalFill,
  Prescription2,
  BoxSeam
} from 'react-bootstrap-icons';


const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);
  const [findingsStatus, setFindingsStatus] = useState([]);
  const [equipmentMonthly, setEquipmentMonthly] = useState([]);
  const [medicineMonthly, setMedicineMonthly] = useState([]);

  const [supplyMonthly, setSupplyMonthly] = useState([]);

  useEffect(() => {
    fetchCounts();
    fetchAppointments();
    fetchTopMedicines();
    fetchFindingsStatus();
    fetchEquipmentMonthly();
    fetchMedicineMonthly();
    fetchSupplytMonthly();
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/counts');
      setCounts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/appointments-status');
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/top-medicines');
      setTopMedicines(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFindingsStatus = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/physical-findings');
      setFindingsStatus(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEquipmentMonthly = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/equipment-monthly');
      setEquipmentMonthly(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchSupplytMonthly = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/supply-monthly');
      setSupplyMonthly(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchMedicineMonthly = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/medicine-monthly');
      setMedicineMonthly(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container fluid>
      {/* Quick Stats */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">Quick Stats</Card.Header>
        <Card.Body>
          <Row className="g-3">
            {[
              { label: "Annual Exams", count: counts.annual_physical_exams, color: "primary", icon: <PersonBadgeFill size={32} /> },
              { label: "Appointments (Pending)", count: counts.appointments, color: "danger", icon: <CalendarCheckFill size={32} /> },
              { label: "Equipment Items", count: counts.equipment_inventory, color: "success", icon: <ClipboardDataFill size={32} /> },
              { label: "Medicines Items", count: counts.medicine_inventory, color: "info", icon: <CapsulePill size={32} /> },
              { label: "Supply Items", count: counts.supply_inventory, color: "secondary", icon: <BoxSeam size={32} /> }, // <-- Supply card
              { label: "Notifications", count: counts.notifications, color: "warning", icon: <BellFill size={32} /> },
              { label: "Findings", count: counts.physical_exam_findings, color: "dark", icon: <FileEarmarkMedicalFill size={32} /> },
              { label: "Prescriptions", count: counts.prescriptions, color: "light", icon: <Prescription2 size={32} /> },
            ]
              .map((stat, idx) => (
                <Col md={3} key={idx}>
                  <Card bg={stat.color} text={stat.color === 'light' ? 'dark' : 'white'} className="text-center">
                    <Card.Body>
                      <Card.Title className="mb-1">{stat.icon}</Card.Title>
                      <Card.Text className="small">{stat.label}</Card.Text>
                      <h4>{stat.count || 0}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Appointments Status */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">Appointments Status</Card.Header>
        <Card.Body>
          {appointments.length > 0 ? (
            <ListGroup>
              {appointments.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  {item.status}
                  <Badge bg="primary" pill>{item.count}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No appointment data available.</p>
          )}
        </Card.Body>
      </Card>
      <Row>
        <Col md={6}>
          {/* Top Prescribed Medicines */}
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">Top Prescribed Medicines</Card.Header>
            <Card.Body>
              {topMedicines.length > 0 ? (
                <ListGroup>
                  {topMedicines.map((med, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      {med.medicine_name}
                      <Badge bg="success" pill>{med.count}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No medicine data available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          {/* Findings Status */}
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">Physical Exam Findings</Card.Header>
            <Card.Body>
              {findingsStatus.length > 0 ? (
                <ListGroup>
                  {findingsStatus.map((finding, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      {finding.status}
                      <Badge bg="warning" pill>{finding.count}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No findings data available.</p>
              )}
            </Card.Body>
          </Card></Col>
      </Row>



      {/* Equipment Inventory */}
      <Card className="mb-4">
        <Card.Header className="bg-success text-white">Equipment Inventory (Monthly)</Card.Header>
        <Card.Body>
          {equipmentMonthly.length > 0 ? (
            <div className="table-responsive">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => (
                      <th key={idx}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {equipmentMonthly.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      {[
                        item.january, item.february, item.march, item.april, item.may, item.june,
                        item.july, item.august, item.september, item.october, item.november, item.december
                      ].map((val, idx2) => (
                        <td key={idx2}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>No equipment inventory data available.</p>
          )}
        </Card.Body>
      </Card>

      {/* Medicine Inventory */}
      <Card className="mb-5">
        <Card.Header className="bg-info text-white">Medicine Inventory (Monthly)</Card.Header>
        <Card.Body>
          {medicineMonthly.length > 0 ? (
            <div className="table-responsive">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => (
                      <th key={idx}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medicineMonthly.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      {[
                        item.january, item.february, item.march, item.april, item.may, item.june,
                        item.july, item.august, item.september, item.october, item.november, item.december
                      ].map((val, idx2) => (
                        <td key={idx2}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>No medicine inventory data available.</p>
          )}
        </Card.Body>
      </Card>

      {/* Supply Inventory */}
      <Card className="mb-5">
        <Card.Header className="bg-warning text-white">Supply Inventory (Monthly)</Card.Header>
        <Card.Body>
          {supplyMonthly.length > 0 ? (
            <div className="table-responsive">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => (
                      <th key={idx}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {supplyMonthly.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      {[
                        item.january, item.february, item.march, item.april, item.may, item.june,
                        item.july, item.august, item.september, item.october, item.november, item.december
                      ].map((val, idx2) => (
                        <td key={idx2}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>No medicine inventory data available.</p>
          )}
        </Card.Body>
      </Card>

    </Container>
  );
};

export default Dashboard;

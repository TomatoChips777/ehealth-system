
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// Sample data
const appointmentsData = [
  { month: 'Jan', count: 30 },
  { month: 'Feb', count: 50 },
  { month: 'Mar', count: 40 },
  { month: 'Apr', count: 60 },
];

const inventoryData = [
  { name: 'Paracetamol', used: 200 },
  { name: 'Bandages', used: 120 },
  { name: 'Syringes', used: 80 },
  { name: 'Alcohol', used: 150 },
];

const consultationData = [
  { week: 'Week 1', consultations: 12 },
  { week: 'Week 2', consultations: 18 },
  { week: 'Week 3', consultations: 15 },
  { week: 'Week 4', consultations: 22 },
];

function Dashboard() {
  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Clinic System Dashboard</h2>

      {/* Info Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-white bg-info mb-3">
            <Card.Body>
              <Card.Title>Annual Physical Exams</Card.Title>
              <Card.Text>Track and manage student APEs.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-white bg-success mb-3">
            <Card.Body>
              <Card.Title>Appointments</Card.Title>
              <Card.Text>Manage upcoming and past appointments.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-white bg-warning mb-3">
            <Card.Body>
              <Card.Title>Inventory</Card.Title>
              <Card.Text>Monitor medicine, supplies, and equipment usage.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Appointments Trend</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={appointmentsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#007bff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Inventory Usage</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="used" fill="#28a745" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Weekly Consultations</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={consultationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="consultations" stroke="#dc3545" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;

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
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import AppoinmentCalendar from '../Appointment/Calendar';


const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);
  const [findingsStatus, setFindingsStatus] = useState([]);
  const [equipmentMonthly, setEquipmentMonthly] = useState([]);
  const [medicineMonthly, setMedicineMonthly] = useState([]);

  const [supplyMonthly, setSupplyMonthly] = useState([]);
  const [consultationData, setConsultationData] = useState([]);
  const [trendType, setTrendType] = useState("daily");
  const [appointmentData, setAppointmentData] = useState([]);
  const [medicineExtremes, setMedicineExtremes] = useState({ highest: [], lowest: [] });

  useEffect(() => {
    fetchCounts();
    fetchAppointments();
    fetchTopMedicines();
    fetchFindingsStatus();
    fetchEquipmentMonthly();
    fetchMedicineMonthly();
    fetchSupplytMonthly();
    fetchDailyTrends();
    fetchAppointmentFrequency();
    fetchMedicineExtremes();
  }, []);



  const fetchMedicineExtremes = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/medicine-quantity-extremes');
      setMedicineExtremes(res.data);
    } catch (error) {
      console.error('Error fetching medicine extremes:', error);
    }
  };

  const chartData = medicineExtremes.highest.map(high => {
    const low = medicineExtremes.lowest.find(l => l.medicine_name === high.medicine_name) || {};
    return {
      name: high.medicine_name,
      highestQuantity: high.quantity,
      lowestQuantity: low.quantity || 0
    };
  });

  // const chartData = [
  //   ...medicineExtremes.highest.map(item => ({
  //     name: item.medicine_name,
  //     quantity: item.quantity,
  //     type: 'Highest'
  //   })),
  //   ...medicineExtremes.lowest.map(item => ({
  //     name: item.medicine_name,
  //     quantity: item.quantity,
  //     type: 'Lowest'
  //   }))
  // ];

  const fetchAppointmentFrequency = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/appointment-frequency');
      setAppointmentData(res.data);
    } catch (error) {
      console.error('Error fetching appointment frequency:', error);
    }
  };

  const fetchDailyTrends = async () => {
    try {
      const res = await axios.get('http://localhost:3030/api/dashboard/analytics/trends-daily'); // Ensure this endpoint is correct

      const formatted = res.data.map(entry => {
        return {
          label: entry.label,
          total: entry.total
        };
      });

      setConsultationData(formatted);
    } catch (error) {
      console.error(error);
    }
  };

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
      <Card className="mb-2">
        <Card.Header className="">Quick Stats</Card.Header>
        <Card.Body>
          <Row className="g-3">
            {[
              { label: "Appointments (Pending)", count: counts.appointments, color: "danger", icon: <CalendarCheckFill size={32} /> },
              { label: "Equipment Items", count: counts.equipment_inventory, color: "success", icon: <ClipboardDataFill size={32} /> },
              { label: "Medicines Items", count: counts.medicine_inventory, color: "info", icon: <CapsulePill size={32} /> },
              { label: "Supply Items", count: counts.supply_inventory, color: "secondary", icon: <BoxSeam size={32} /> }, // <-- Supply card
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
      <AppoinmentCalendar/>
      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title>Consultation Trends This Week</Card.Title>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={consultationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tickFormatter={(value) => value} // This will just use the formatted label as it is
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#dc3545"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>

          </Card>

        </Col>
      </Row>

      

      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title>Appointment Frequency</Card.Title>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pending" stroke="#ffc107" strokeWidth={2} name="Pending" />
                  <Line type="monotone" dataKey="completed" stroke="#28a745" strokeWidth={2} name="Completed" />
                  <Line type="monotone" dataKey="canceled" stroke="#dc3545" strokeWidth={2} name="Canceled" />
                  <Line type="monotone" dataKey="rescheduled" stroke="#17a2b8" strokeWidth={2} name="Rescheduled" />
                </LineChart>
              </ResponsiveContainer>

            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
              <Card.Title>Highest and Lowest Medicine Quantities</Card.Title>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="highestQuantity" fill="#007bff" name="Highest" />
                  <Bar dataKey="lowestQuantity" fill="#dc3545" name="Lowest" />
                </BarChart>
              </ResponsiveContainer>


            </Card.Body>

          </Card>

        </Col>
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
                    {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, idx) => (
                      <th key={idx}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {equipmentMonthly.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.equipment_name}</td>
                      {[
                        item.Aug, item.Sep, item.Oct, item.Nov, item.Dec, item.Jan,
                        item.Feb, item.Mar, item.Apr, item.May, item.Jun, item.Jul
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
                    {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, idx) => (
                      <th key={idx}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medicineMonthly.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.medicine_name}</td>
                      {[
                        item.Aug, item.Sep, item.Oct, item.Nov, item.Dec, item.Jan,
                        item.Feb, item.Mar, item.Apr, item.May, item.Jun, item.Jul
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
                    {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, idx) => (

                      <th key={idx}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {supplyMonthly.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.supply_name}</td>
                      {[
                        item.Aug, item.Sep, item.Oct, item.Nov, item.Dec, item.Jan,
                        item.Feb, item.Mar, item.Apr, item.May, item.Jun, item.Jul
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
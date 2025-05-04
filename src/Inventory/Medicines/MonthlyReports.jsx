import { useEffect, useState } from 'react';
import { Table, Container, Card, Spinner, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { exportToPDF } from '../components/ConvertToPDF';

const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

function MedicineMonthlyReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const groupByMonth = (medicines) => {
    const itemMap = {};
  
    medicines.forEach(item => {
      const date = new Date(item.created_at);
      const monthIndex = (date.getMonth() + 12 - 7) % 12;
      const itemName = item.medicine_name;
  
      if (!itemMap[itemName]) {
        itemMap[itemName] = Array(12).fill(0);
      }
  
      const quantity = parseInt(item.quantity, 10) || 0;
      itemMap[itemName][monthIndex] += quantity;
    });
  
    return Object.entries(itemMap).map(([name, months]) => ({
      name,
      monthlyCounts: months,
      total: months.reduce((a, b) => a + b, 0),
      remarks: ''
    }));
  };
//   const groupByMonth = (medicines) => {
//     const itemMap = {};

//     medicines.forEach(item => {
//       const date = new Date(item.created_at); 
//       const monthIndex = (date.getMonth() + 12 - 7) % 12; 
//       const itemName = item.medicine_name;

//       if (!itemMap[itemName]) {
//         itemMap[itemName] = Array(12).fill(0);
//       }
//       itemMap[itemName][monthIndex] += 1;
//     });

//     return Object.entries(itemMap).map(([name, months]) => ({
//       name,
//       monthlyCounts: months,
//       total: months.reduce((a, b) => a + b, 0),
//       remarks: ''
//     }));
//   };

  const goBack = () => {
    navigate('/medicines'); 
  };

  const handleDownloadPDF = () => {
    const columns = ['Medicines Inventory', ...MONTHS, 'Total', 'Remarks'];
    const data = reportData.map(item => [
      item.name,
      ...item.monthlyCounts,
      item.total,
      item.remarks
    ]);
    exportToPDF('Medicine Inventory Report (Aug - Jul)', columns, data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_GET_MEDICINES}`);
        const processed = groupByMonth(response.data);
        setReportData(processed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="p-0 y-0" fluid>
      <Card className='p-3'>
        <h2 className="text-center mb-4">Medicine Inventory Report (Aug - Jul)</h2>

        {/* Go Back Button */}
        <Row className="mb-4">
          <Col className="d-flex justify-content-between">
            <Button variant="dark" size='sm' onClick={goBack}>
              Go Back
            </Button>
            <Button variant="success" size='sm' onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead className='table-dark'>
              <tr>
                <th>Medicines Inventory</th>
                {MONTHS.map(month => (
                  <th key={month}>{month}</th>
                ))}
                <th>Total</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  {item.monthlyCounts.map((count, i) => (
                    <td key={i}>{count}</td>
                  ))}
                  <td>{item.total}</td>
                  <td>{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}

export default MedicineMonthlyReport;

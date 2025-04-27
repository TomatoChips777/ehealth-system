import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import { exportToPDF } from './components/ConvertToPDF';
function MedicineInventory() {
    const [medicines, setMedicines] = useState([

    ]);


    const fetchMedicines = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_MEDICINES}`)
            setMedicines(response.data);

        } catch (error) {

        }
    }

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleInputChange = async (index, field, value) => {
        const updatedMedicines = [...medicines];
        updatedMedicines[index][field] = value;
        setMedicines(updatedMedicines);

        // Sync only the edited row
        const editedRow = updatedMedicines[index];

        try {
            await axios.post(`${import.meta.env.VITE_UPDATE_MEDICINE_ROW}`, { medicine: editedRow });
            console.log('Single row synced successfully');
        } catch (error) {
            console.error('Error syncing single row:', error);
        }
    };

    const addNewRow = async () => {
        const newMedicine = {
            name: '',
            january: 0,
            february: 0,
            march: 0,
            april: 0,
            may: 0,
            june: 0,
            july: 0,
            august: 0,
            september: 0,
            october: 0,
            november: 0,
            december: 0,
            expiry_date: '',
            year: new Date().getFullYear(),
            remarks: ''
        };

        const updated = [...medicines, newMedicine];
        try {
            const response = await axios.post(`${import.meta.env.VITE_ADD_MEDICINE}`, { medicine: newMedicine });
            fetchMedicines();
        } catch (error) {
        }


    };

    const handleDownloadPDF = () => {
        const columns = [
            'Medicines', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Expiry Date','Year', 'Remarks'
        ];
        const data = medicines.map(e => [
            e.name,
            e.august,
            e.september,
            e.october,
            e.november,
            e.december,
            e.january,
            e.february,
            e.march,
            e.april,
            e.may,
            e.june,
            e.july,
            e.expiry_date,
            e.year,
            e.remarks
        ]);

        exportToPDF('Medicine Inventory', columns, data, 'medicine-inventory.pdf');
    };
    const removeRow = async (index) => {
        const medicineToDelete = medicines[index];
        const updated = medicines.filter((_, idx) => idx !== index);
        setMedicines(updated);

        if (medicineToDelete.id) {
            try {
                await axios.put(`${import.meta.env.VITE_REMOVE_MEDICINE_ROW}`, { id: medicineToDelete.id });
                console.log('Deleted from DB successfully');
            } catch (error) {
                console.error('Error deleting row:', error);
            }
        }
    };

    return (
        <Container fluid className="mt-4">
            <Card className="shadow-sm ">
                <Card.Header className='d-flex justify-content-between'>
                    <h4 className="mb-3 fw-bold text-success">Medicine Inventory</h4>

                    <div className="text-end">
                        <Button variant="success" onClick={addNewRow}>
                            + Add Medicine
                        </Button>
                        < Button variant="primary" className="ms-1" onClick={handleDownloadPDF}>
                            Download PDF
                        </Button>
                    </div>
                </Card.Header>

                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered striped hover size="sm" className="excel-like-table">
                            <thead className="table-light text-center align-middle">
                                <tr>
                                    <th>MEDICINE</th>
                                    <th>Aug</th>
                                    <th>Sep</th>
                                    <th>Oct</th>
                                    <th>Nov</th>
                                    <th>Dec</th>
                                    <th>Jan</th>
                                    <th>Feb</th>
                                    <th>Mar</th>
                                    <th>Apr</th>
                                    <th>May</th>
                                    <th>Jun</th>
                                    <th>Jul</th>
                                    <th>Expiry Date</th>
                                    <th>Year</th>
                                    <th>Remarks</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((medicine, idx) => (
                                    <tr key={idx}>
                                        <td style={{ minWidth: '250px' }}>
                                            <Form.Control
                                                type="text"
                                                size="sm"
                                                className="no-border text-start"
                                                value={medicine.name}
                                                onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                                            />
                                        </td>

                                        {[
                                            'january', 'february', 'march', 'april', 'may', 'june',
                                            'july', 'august', 'september', 'october', 'november', 'december'
                                        ].map((month) => (
                                            <td key={month}>
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    className="no-border text-center fw-bold"
                                                    value={medicine[month]}
                                                    onChange={(e) => handleInputChange(idx, month, parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                        ))}

                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={medicine.expiry_date}
                                                onChange={(e) => handleInputChange(idx, 'expiry_date', e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                className="no-border text-center"
                                                value={medicine.year}
                                                onChange={(e) => handleInputChange(idx, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                                            />
                                        </td>

                                        <td>
                                            <Form.Control
                                                type="text"
                                                size="sm"
                                                className="no-border"
                                                value={medicine.remarks}
                                                onChange={(e) => handleInputChange(idx, 'remarks', e.target.value)}
                                            />
                                        </td>

                                        <td className="text-center">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeRow(idx)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                </Card.Body>
            </Card>
            <style jsx="true">{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        .excel-like-table td,
        .excel-like-table th {
          padding: 0.4rem;
          vertical-align: middle;
        }
        .no-border {
          border: none;
          box-shadow: none;
          background-color: transparent;
          padding: 0;
          text-align: center;
        }
        .no-border:focus {
          background-color: #eef7ff;
          border: 1px solid #86b7fe;
          outline: none;
        }
      `}</style>
        </Container>
    );
}

export default MedicineInventory;

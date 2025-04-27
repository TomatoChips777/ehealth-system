import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function SupplyInventory() {
  const [supplies, setSupplies] = useState([
   
  ]);


  const fetchSupplies= async ()=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_GET_SUPPLIES}`)
        setSupplies(response.data);
    }catch(error){

    }
  }

  useEffect(() =>{
    fetchSupplies();
  },[]);

  const handleInputChange = async (index, field, value) => {
    const updatedSupplies = [...supplies];
    updatedSupplies[index][field] = value;
    setSupplies(updatedSupplies);

    // Sync only the edited row
    const editedRow = updatedSupplies[index];

    try {
      await axios.post(`${import.meta.env.VITE_UPDATE_SUPPLY_ROW}`, { supply: editedRow });
      console.log('Single row synced successfully');
    } catch (error) {
      console.error('Error syncing single row:', error);
    }
  };

  const addNewRow = async () => {
    const newSupply = {
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
      year: new Date().getFullYear(),
      remarks: ''
    };

    const updated = [...supplies, newSupply];
    try{
        const response = await axios.post(`${import.meta.env.VITE_ADD_SUPPLY}`,{supply: newSupply } );
       fetchSupplies();
    }catch(error){
    }

    
  };

  const removeRow = async (index) => {
    const supplyToDelete = supplies[index];
    const updated = supplies.filter((_, idx) => idx !== index);
    setSupplies(updated);

    if (supplyToDelete.id) {
      try {
        await axios.put(`${import.meta.env.VITE_REMOVE_SUPPLY_ROW}`, { id: supplyToDelete.id });
        console.log('Deleted from DB successfully');
      } catch (error) {
        console.error('Error deleting row:', error);
      }
    }
  };

  return (
    <Container fluid className="mt-4">
      <h4 className="mb-3 fw-bold text-success">Supply Inventory</h4>

      <div className="table-responsive">
        <Table bordered striped hover size="sm" className="excel-like-table">
          <thead className="table-light text-center align-middle">
            <tr>
              <th>SUPPLY</th>
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
              <th>Year</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply, idx) => (
              <tr key={idx}>
               <td style={{ minWidth: '250px' }}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="no-border text-start"
                    value={supply.name}
                    onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                  />
                </td>

                {[
                   'august', 'september', 'october', 'november', 'december','january', 'february', 'march', 'april', 'may', 'june',
                  'july',
                ].map((month) => (
                  <td key={month}>
                    <Form.Control
                      type="text"
                      size="sm"
                      className="no-border text-center fw-bold"
                      value={supply[month]}
                      onChange={(e) => handleInputChange(idx, month, parseInt(e.target.value) || 0)}
                    />
                  </td>
                ))}
                <td>
                  <Form.Control
                    type="number"
                    size="sm"
                    className="no-border text-center"
                    value={supply.year}
                    onChange={(e) => handleInputChange(idx, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                  />
                </td>

                <td>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="no-border"
                    value={supply.remarks}
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

      <div className="text-end">
        <Button variant="success" onClick={addNewRow}>
          + Add Supply
        </Button>
      </div>

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

export default SupplyInventory;

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper function to execute a query and return a promise
const runQuery = (query, values = []) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Get All Inventory Items
router.get('/medicine-inventory', async (req, res) => {
    const query = `SELECT * FROM medicines WHERE archived = 1 ORDER BY id DESC`;
  
    try {
        const rows = await runQuery(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all reports:", err);
        res.status(500).json([]);
    }
});

// ADD NEW MEDICINE
router.post('/add-medicine', async (req, res) => {
    const { medicine_name, category, quantity, expiry_date, serial_number } = req.body;
  
    if (!medicine_name || !category || !quantity || !expiry_date) {
      return res.status(400).json({ success: false, message: 'Missing medicine data.' });
    }
    
    try {
      const insertQuery = `
        INSERT INTO medicines (medicine_name, category, quantity, expiry_date, serial_number)
        VALUES (? , ? , ? , ? , ?)
      `;
      const values = [
          medicine_name,
          category,
          quantity || 1,
          expiry_date,
          serial_number || ''
      ];
  
      const result = await runQuery(insertQuery, values);
      req.io.emit("updateInventory");
      res.json({ success: true, message: 'Medicine added successfully.', insertedId: result.insertId });
    } catch (error) {
      console.error('Error adding medicine:', error);
      res.status(500).json({ success: false, message: 'Failed to add medicine.' });
    }
  });
  
router.put('/update-medicine/:id', async (req, res) => {
   const {id } = req.params;
   const { medicine_name, category, quantity, expiry_date, serial_number } = req.body;
      
    if (!medicine_name || !id) {
      return res.status(400).json({ success: false, message: 'Missing medicine or ID.' });
    }
  
    try {
      const updateQuery = `
        UPDATE medicines
        SET 
          medicine_name = ?,
          category = ?,
          quantity = ?,
          expiry_date = ?,
          serial_number = ?
        WHERE id = ?
      `;
  
      const values = [
        medicine_name, 
        category, 
        quantity, 
        expiry_date, 
        serial_number,
        id
      ];
  
      await runQuery(updateQuery, values);
      req.io.emit("updateInventory");
      res.json({ success: true, message: 'Medicine updated successfully.' });
    } catch (error) {
      console.error('Error updating medicine:', error);
      res.status(500).json({ success: false, message: 'Failed to update medicine.' });
    }
  });

  router.put('/remove-medicine/:id', async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing medicine or ID.' });
    }
  
    try {
      const updateQuery = `
        UPDATE medicines
        SET 
          archived = 0
        WHERE id = ?
      `;
      await runQuery(updateQuery, id);
      req.io.emit("updateInventory");
      res.json({ success: true, message: 'Medicine updated successfully.' });
    } catch (error) {
      console.error('Error updating medicine:', error);
      res.status(500).json({ success: false, message: 'Failed to update medicine.' });
    }
  });







  // Equipments


  // Get All Inventory Items
router.get('/equipment-inventory', async (req, res) => {
  const query = `SELECT * FROM equipments WHERE archived = 1 ORDER BY id DESC`;

  try {
      const rows = await runQuery(query);
      res.json(rows);
  } catch (err) {
      console.error("Error fetching all reports:", err);
      res.status(500).json([]);
  }
});

// ADD NEW equipment
router.post('/add-equipment', async (req, res) => {
  const { equipment_name, category, serial_number, status, quantity } = req.body;

  if (!equipment_name) {
    return res.status(400).json({ success: false, message: 'Missing equipment data.' });
  }
  
  try {
    const insertQuery = `
      INSERT INTO equipments
      (equipment_name, category, quantity, status, serial_number)
      VALUES (? , ? , ? , ? , ?)
    `;

    const values = [
      equipment_name,
      category,
      quantity,
      status,
      serial_number
    ];

    const result = await runQuery(insertQuery, values);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'equipment added successfully.', insertedId: result.insertId });
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).json({ success: false, message: 'Failed to add equipment.' });
  }
});
router.put('/update-equipment/:id', async (req, res) => {
  const { id } = req.params;
  const { equipment_name, category, serial_number, status, quantity } = req.body;


  if (!id || !equipment_name) {
    return res.status(400).json({ success: false, message: 'Missing equipment or ID.' });
  }

  try {
    const updateQuery = `
      UPDATE equipments
      SET 
      equipment_name = ?,
      category = ?,
      quantity = ?,
      status = ?,
      serial_number = ? 
      WHERE id = ?
    `;

    const values = [
     equipment_name,
     category,
     quantity,
     status,
     serial_number,
     id
    ];

    await runQuery(updateQuery, values);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'Equipment updated successfully.' });
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ success: false, message: 'Failed to update equipment.' });
  }
});

router.put('/remove-equipment/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Missing equipment or ID.' });
  }

  try {
    const updateQuery = `
      UPDATE equipments
      SET 
        archived = 0
      WHERE id = ?
    `;
    await runQuery(updateQuery, id);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'Equipment updated successfully.' });
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ success: false, message: 'Failed to update equipment.' });
  }
});






// Supply
// Get All Inventory Items
router.get('/supply-inventory', async (req, res) => {
  const query = `SELECT * FROM supplies WHERE archived = 1 ORDER BY id DESC`;

  try {
      const rows = await runQuery(query);
      res.json(rows);
  } catch (err) {
      console.error("Error fetching all reports:", err);
      res.status(500).json([]);
  }
});

// ADD NEW supply
router.post('/add-supply', async (req, res) => {
  const { supply_name, category, quantity, serial_number, status } = req.body;

  if (!supply_name) {
    return res.status(400).json({ success: false, message: 'Missing supply data.' });
  }
  
  try {
    const insertQuery = `
      INSERT INTO supplies
      (supply_name, category, quantity, serial_number, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      supply_name,
      category,
      quantity,
      serial_number,
      status,
    ];

    const result = await runQuery(insertQuery, values);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'Supply added successfully.', insertedId: result.insertId });
  } catch (error) {
    console.error('Error adding supply:', error);
    res.status(500).json({ success: false, message: 'Failed to add supply.' });
  }
});

router.put('/update-supply/:id', async (req, res) => {
  const {id} = req.params;
  const { supply_name, category, quantity, serial_number, status } = req.body;

  if (!id || !supply_name) {
    return res.status(400).json({ success: false, message: 'Missing supply or ID.' });
  }

  try {
    const updateQuery = `
      UPDATE supplies
      SET 
        supply_name = ?,
        category= ?,
        quantity = ?,
        status = ?,
        serial_number = ?
      WHERE id = ?
    `;

    const values = [
      supply_name,
      category,
      quantity,
      status,
      serial_number,
      id
    ];

    await runQuery(updateQuery, values);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'Supply updated successfully.' });
  } catch (error) {
    console.error('Error updating supply:', error);
    res.status(500).json({ success: false, message: 'Failed to update supply.' });
  }
});

router.put('/remove-supply/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Missing supply or ID.' });
  }

  try {
    const updateQuery = `
      UPDATE supplies
      SET 
        archived = 0
      WHERE id = ?
    `;
    await runQuery(updateQuery, id);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'Supply updated successfully.' });
  } catch (error) {
    console.error('Error updating supply:', error);
    res.status(500).json({ success: false, message: 'Failed to update supply.' });
  }
});
module.exports = router;

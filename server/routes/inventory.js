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
    const query = `SELECT * FROM medicine_inventory WHERE archived = 0 ORDER BY id DESC`;

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
    const { medicine } = req.body;
  
    console.log(medicine);
    if (!medicine) {
      return res.status(400).json({ success: false, message: 'Missing medicine data.' });
    }
    
    try {
      const insertQuery = `
        INSERT INTO medicine_inventory 
        (name, january, february, march, april, may, june, july, august, september, october, november, december, expiry_date, year, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      const values = [
        medicine.name || '',
        medicine.january || 0, medicine.february || 0, medicine.march || 0, medicine.april || 0,
        medicine.may || 0, medicine.june || 0, medicine.july || 0, medicine.august || 0,
        medicine.september || 0, medicine.october || 0, medicine.november || 0, medicine.december || 0,
        medicine.expiry_date || null,
        medicine.year || new Date().getFullYear(),
        medicine.remarks || ''
      ];
  
      const result = await runQuery(insertQuery, values);
      req.io.emit("updateInventory");
      res.json({ success: true, message: 'Medicine added successfully.', insertedId: result.insertId });
    } catch (error) {
      console.error('Error adding medicine:', error);
      res.status(500).json({ success: false, message: 'Failed to add medicine.' });
    }
  });
router.post('/update-single-medicine', async (req, res) => {
    const { medicine } = req.body;
  
    if (!medicine || !medicine.id) {
      return res.status(400).json({ success: false, message: 'Missing medicine or ID.' });
    }
  
    try {
      const updateQuery = `
        UPDATE medicine_inventory
        SET 
          name = ?,
          january = ?, february = ?, march = ?, april = ?, may = ?, june = ?,
          july = ?, august = ?, september = ?, october = ?, november = ?, december = ?,
          expiry_date = ?,
          year = ?,
          remarks = ?,
          last_updated = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
  
      const values = [
        medicine.name,
        medicine.january, medicine.february, medicine.march, medicine.april,
        medicine.may, medicine.june, medicine.july, medicine.august,
        medicine.september, medicine.october, medicine.november, medicine.december,
        medicine.expiry_date,
        medicine.year,
        medicine.remarks,
        medicine.id
      ];
  
      await runQuery(updateQuery, values);
      req.io.emit("updateInventory");
      res.json({ success: true, message: 'Medicine updated successfully.' });
    } catch (error) {
      console.error('Error updating medicine:', error);
      res.status(500).json({ success: false, message: 'Failed to update medicine.' });
    }
  });

  router.put('/remove-medicine-row', async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing medicine or ID.' });
    }
  
    try {
      const updateQuery = `
        UPDATE medicine_inventory
        SET 
          archived = 1
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
  const query = `SELECT * FROM equipment_inventory WHERE archived = 0 ORDER BY id DESC`;

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
  const { equipment } = req.body;

  console.log(equipment);
  if (!equipment) {
    return res.status(400).json({ success: false, message: 'Missing equipment data.' });
  }
  
  try {
    const insertQuery = `
      INSERT INTO equipment_inventory 
      (name, january, february, march, april, may, june, july, august, september, october, november, december, year, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      equipment.name || '',
      equipment.january || 0, equipment.february || 0, equipment.march || 0, equipment.april || 0,
      equipment.may || 0, equipment.june || 0, equipment.july || 0, equipment.august || 0,
      equipment.september || 0, equipment.october || 0, equipment.november || 0, equipment.december || 0,
      equipment.year || new Date().getFullYear(),
      equipment.remarks || ''
    ];

    const result = await runQuery(insertQuery, values);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'equipment added successfully.', insertedId: result.insertId });
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).json({ success: false, message: 'Failed to add equipment.' });
  }
});
router.post('/update-single-equipment', async (req, res) => {
  const { equipment } = req.body;

  if (!equipment || !equipment.id) {
    return res.status(400).json({ success: false, message: 'Missing equipment or ID.' });
  }

  try {
    const updateQuery = `
      UPDATE equipment_inventory
      SET 
        name = ?,
        january = ?, february = ?, march = ?, april = ?, may = ?, june = ?,
        july = ?, august = ?, september = ?, october = ?, november = ?, december = ?,
        year = ?,
        remarks = ?,
        last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const values = [
      equipment.name,
      equipment.january, equipment.february, equipment.march, equipment.april,
      equipment.may, equipment.june, equipment.july, equipment.august,
      equipment.september, equipment.october, equipment.november, equipment.december,
      equipment.year,
      equipment.remarks,
      equipment.id
    ];

    await runQuery(updateQuery, values);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'Equipment updated successfully.' });
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ success: false, message: 'Failed to update equipment.' });
  }
});

router.put('/remove-equipment-row', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Missing equipment or ID.' });
  }

  try {
    const updateQuery = `
      UPDATE equipment_inventory
      SET 
        archived = 1
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
  const query = `SELECT * FROM supply_inventory WHERE archived = 0 ORDER BY id DESC`;

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
  const { supply } = req.body;

  console.log(supply);
  if (!supply) {
    return res.status(400).json({ success: false, message: 'Missing supply data.' });
  }
  
  try {
    const insertQuery = `
      INSERT INTO supply_inventory 
      (name, january, february, march, april, may, june, july, august, september, october, november, december, year, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      supply.name || '',
      supply.january || 0, supply.february || 0, supply.march || 0, supply.april || 0,
      supply.may || 0, supply.june || 0, supply.july || 0, supply.august || 0,
      supply.september || 0, supply.october || 0, supply.november || 0, supply.december || 0,
      supply.year || new Date().getFullYear(),
      supply.remarks || ''
    ];

    const result = await runQuery(insertQuery, values);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'Supply added successfully.', insertedId: result.insertId });
  } catch (error) {
    console.error('Error adding supply:', error);
    res.status(500).json({ success: false, message: 'Failed to add supply.' });
  }
});
router.post('/update-single-supply', async (req, res) => {
  const { supply } = req.body;

  if (!supply || !supply.id) {
    return res.status(400).json({ success: false, message: 'Missing supply or ID.' });
  }

  try {
    const updateQuery = `
      UPDATE supply_inventory
      SET 
        name = ?,
        january = ?, february = ?, march = ?, april = ?, may = ?, june = ?,
        july = ?, august = ?, september = ?, october = ?, november = ?, december = ?,
        year = ?,
        remarks = ?,
        last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const values = [
      supply.name,
      supply.january, supply.february, supply.march, supply.april,
      supply.may, supply.june, supply.july, supply.august,
      supply.september, supply.october, supply.november, supply.december,
      supply.year,
      supply.remarks,
      supply.id
    ];

    await runQuery(updateQuery, values);
    req.io.emit("updateInventory");
    res.json({ success: true, message: 'Supply updated successfully.' });
  } catch (error) {
    console.error('Error updating supply:', error);
    res.status(500).json({ success: false, message: 'Failed to update supply.' });
  }
});

router.put('/remove-supply-row', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Missing supply or ID.' });
  }

  try {
    const updateQuery = `
      UPDATE supply_inventory
      SET 
        archived = 1
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

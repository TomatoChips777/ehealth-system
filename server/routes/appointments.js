const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get All Borrowed Items
router.get('/', async (req, res) => {
    try {
        const rows = await db.queryAsync(`SELECT a.*,p.student_id, a.complaint as chief_complaint ,p.full_name as student_name FROM appointments a JOIN patients p ON a.user_id = p.id ORDER BY created_at DESC;`);
        return res.json(rows);
    } catch (err) {
        console.error("Error fetching all borrow records:", err);
        res.status(500).json([]);
    }
});

// Borrow Request (for users)
router.post('/post-appointment', async (req, res) => {
    const {
        complaint,
        time,
        date,
    } = req.body;
    console.log(req.body);

    if ( !complaint || !time || !date ) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const query = `
        INSERT INTO appointments
        (user_id, complaint, time, date)
        VALUES (?, ? ,?, ?)
    `;
    const values = [1, complaint, time, date];

    try {
        const result = await db.queryAsync(query, values);
        res.json({
            success: true,
            message: 'Borrow record and notification created successfully',
        });

    } catch (err) {
        console.error("Error creating borrow record or notification:", err);
        res.status(500).json({ success: false, message: 'Failed to create borrow record or notification' });
    }
});

router.put('/update-appointment:/id', async (req, res) => {
    const { id } = req.params;
    const {
        complaint,
        time,
        date,
    } = req.body;
    console.log(req.body);

    if ( !complaint || !time || !date ||!id ) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const query = `
        UPDATE appointments SET complaint = ?, time = ?, date = ? WHERE id = ?
    `;
    const values = [complaint, time, date, id];

    try {
        const result = await db.queryAsync(query, values);
        res.json({
            success: true,
            message: ' record and notification created successfully',
        });

    } catch (err) {
        console.error("Error creating borrow record or notification:", err);
        res.status(500).json({ success: false, message: 'Failed to create borrow record or notification' });
    }
});

// Borrow Record (for admins/staff)
router.post('/create-borrow', async (req, res) => {
    const {
        borrower_name,
        email,
        department,
        item_name,
        description,
        returned_date,
        assist_by
    } = req.body;

    if (!borrower_name || !email || !department || !item_name || !assist_by) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const query = `
        INSERT INTO borrowed_items 
        (borrower_name, email, department, item_name, description, returned_date, assisted_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        borrower_name,
        email,
        department,
        item_name,
        description || '',
        returned_date || null,
        assist_by
    ];

    try {
        const result = await db.queryAsync(query, values);

        const newBorrow = {
            id: result.insertId,
            borrower_name,
            email,
            department,
            item_name,
            description,
            returned_date,
            assist_by
        };

        req.io.emit('updateBorrowing');
        req.io.emit('update');
        req.io.emit('createdBorrow', newBorrow);

        res.json({
            success: true,
            message: 'Borrow record created successfully',
            borrowId: result.insertId
        });
    } catch (err) {
        console.error("Error creating borrow record:", err);
        res.status(500).json({ success: false, message: 'Failed to create borrow record' });
    }
});

// Update Borrow Record
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const {
        borrower_name,
        email,
        department,
        item_name,
        description,
        returned_date,
        assist_by,
        status
    } = req.body;

    const query = `
        UPDATE borrowed_items
        SET borrower_name = ?, email = ?, department = ?, item_name = ?,
            description = ?, returned_date = ?, assisted_by = ?, status = ?
        WHERE id = ?
    `;

    const values = [
        borrower_name,
        email,
        department,
        item_name,
        description || '',
        returned_date || null,
        assist_by || '',
        status || 'Pending',
        id
    ];

    try {
        const result = await db.queryAsync(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Borrow record not found' });
        }
        req.io.emit('updateBorrowing');
        req.io.emit('update');
        res.json({ success: true, message: 'Borrow record updated successfully' });
    } catch (err) {
        console.error("Error updating borrow record:", err);
        res.status(500).json({ success: false, message: 'Failed to update borrow record' });
    }
});



router.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status, assist_by } = req.body;

    // Get the current time in PHT (UTC +8)
    const phtOffset = 8 * 60; // PHT is UTC +8 hours
    const currentDate = new Date();
    const currentTimePHT = new Date(currentDate.getTime() + (phtOffset * 60000)); // Convert UTC to PHT

    // Format the current time to 'YYYY-MM-DD HH:mm:ss'
    const formattedCurrentTimePHT = currentTimePHT.toISOString().slice(0, 19).replace('T', ' ');

    let query = `
        UPDATE borrowed_items 
        SET status = ?, assisted_by = ?, 
            returned_date = CASE WHEN ? = 'Returned' THEN ? ELSE returned_date END 
        WHERE id = ?`;

    const values = [
        status || 'Pending',
        assist_by,
        status,
        status === 'Returned' ? formattedCurrentTimePHT : null,
        id
    ];

    try {
        const result = await db.queryAsync(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Borrow record not found' });
        }

        req.io.emit('updateBorrowing');
        req.io.emit('update');  // Emit the update event to notify clients
        res.json({ success: true, message: 'Borrow record updated successfully' });
    } catch (err) {
        console.error("Error updating borrow record:", err);
        res.status(500).json({ success: false, message: 'Failed to update borrow record' });
    }
});

module.exports = router;

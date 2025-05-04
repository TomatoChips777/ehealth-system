const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔔 Notify Admins, Staff, and Owner if available
async function notifyAdminsStaffAndOwner(title, message, ownerId = null) {
    try {
        const notificationResult = await db.queryAsync(
            'INSERT INTO notifications (title, message, created_at) VALUES (?, ?, NOW())',
            [title, message]
        );
        const notificationId = notificationResult.insertId;

        const users = await db.queryAsync(
            'SELECT id FROM users WHERE role IN (?, ?) AND status = 1',
            ['Admin', 'Staff', 'Physician']
        );

        const receivers = users.map(user => [notificationId, user.id, 0, null]);

        if (ownerId) {
            const ownerAlreadyIncluded = users.some(user => user.id === ownerId);
            if (!ownerAlreadyIncluded) {
                receivers.push([notificationId, ownerId, 0, null]);
            }
        }

        if (receivers.length > 0) {
            await db.queryAsync(
                'INSERT INTO notification_receivers (notification_id, user_id, is_read, read_at) VALUES ?',
                [receivers]
            );
        }

    } catch (err) {
        console.error("Error sending notifications:", err);
    }
}

// If only appointment ID is available
async function notifyAdminsStaffAndOwnerByAppointment(title, message, appointmentId) {
    try {
        const [appointment] = await db.queryAsync(
            'SELECT user_id FROM appointments WHERE id = ?',
            [appointmentId]
        );

        const ownerId = appointment ? appointment.user_id : null;
        await notifyAdminsStaffAndOwner(title, message, ownerId);

    } catch (err) {
        console.error("Error sending notifications by appointment:", err);
    }
}


router.get('/', async (req, res) => {
    try {
        const rows = await db.queryAsync(`
            SELECT a.*, s.student_id, a.complaint AS chief_complaint,a.status, s.full_name, s.email, s.birthdate, s.sex 
            FROM appointments a 
            JOIN students s ON a.user_id = s.user_id 
            ORDER BY a.status ASC, time ASC
        `);
        return res.json(rows);
    } catch (err) {
        console.error("Error fetching all appointments:", err);
        res.status(500).json([]);
    }
});

// Get pending appointments for specific student
router.get('/student/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const rows = await db.queryAsync(`
            SELECT a.*, s.student_id, a.complaint AS chief_complaint, s.full_name, s.email, s.birthdate, s.sex 
            FROM appointments a 
            JOIN students s ON a.user_id = s.user_id 
            WHERE a.status = "pending" AND a.user_id = ? 
            ORDER BY created_at DESC
        `, [user_id]);
        return res.json(rows);
    } catch (err) {
        console.error("Error fetching student's appointments:", err);
        res.status(500).json([]);
    }
});

router.post('/post-appointment', async (req, res) => {
    const { user_id, complaint, time, date } = req.body;

    if (!complaint || !time || !date || !user_id) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // Insert appointment first
        await db.queryAsync(`
            INSERT INTO appointments (user_id, complaint, time, date) VALUES (?, ?, ?, ?)
        `, [user_id, complaint, time, date]);

        const [availabilityExists] = await db.queryAsync(`
            SELECT * FROM availability WHERE date = ? AND time_slot = ?
        `, [date, time]);

        if (availabilityExists.length === 0) {
            await db.queryAsync(`
                INSERT INTO availability (date, time_slot, is_available)
                VALUES (?, ?, 1)
            `, [date, time]);
        }

        await notifyAdminsStaffAndOwner('New Appointment Scheduled', 'A new appointment has been booked.', user_id);

        req.io.emit("updateNotifications");

        res.json({ success: true, message: 'Appointment and notification created successfully' });

    } catch (err) {
        console.error("Error posting appointment:", err);
        res.status(500).json({ success: false, message: 'Failed to create appointment' });
    }
});


router.put('/update-appointment/:id', async (req, res) => {
    const { id } = req.params;
    const { complaint, time, date } = req.body;

    if (!complaint || !time || !date || !id) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // Update appointment details
        await db.queryAsync(`
            UPDATE appointments SET time = ?, date = ?, status = 'pending' WHERE id = ?
        `, [time, date, id]);

        
        // Check if the time-slot availability exists, if not insert it
        const availabilityExists = await db.queryAsync(`
            SELECT * FROM availability WHERE date = ? AND time_slot = ?
        `, [date, time]);

        if (availabilityExists.length === 0) {
            // Insert availability if it does not exist
            await db.queryAsync(`
                INSERT INTO availability (date, time_slot)
                VALUES (?, ?)
            `, [date, time]);
        }

        // Notify staff and owners about the updated appointment
        await notifyAdminsStaffAndOwnerByAppointment('Appointment Updated', 'An appointment has been updated.', id);

        // Emit update for notifications
        req.io.emit("updateNotifications");

        res.json({ success: true, message: 'Appointment and notification updated successfully' });

    } catch (err) {
        req.io.emit("updateNotifications");
        console.error("Error updating appointment:", err);
        res.status(500).json({ success: false, message: 'Failed to update appointment' });
    }
});


// router.post('/post-appointment', async (req, res) => {
//     const { user_id, complaint, time, date } = req.body;

//     if (!complaint || !time || !date || !user_id) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     try {
//         await db.queryAsync(`
//             INSERT INTO appointments (user_id, complaint, time, date) VALUES (?, ?, ?, ?)
//         `, [user_id, complaint, time, date]);

//         await notifyAdminsStaffAndOwner('New Appointment Scheduled', 'A new appointment has been booked.', user_id);

//         req.io.emit("updateNotifications");
//         res.json({ success: true, message: 'Appointment and notification created successfully' });

//     } catch (err) {
//         console.error("Error posting appointment:", err);
//         res.status(500).json({ success: false, message: 'Failed to create appointment' });
//     }
// });

// // 🛠 Update an appointment
// router.put('/update-appointment/:id', async (req, res) => {
//     const { id } = req.params;
//     const { complaint, time, date } = req.body;

//     if (!complaint || !time || !date || !id) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     try {
//         await db.queryAsync(`
//             UPDATE appointments SET complaint = ?, time = ?, date = ? WHERE id = ?
//         `, [complaint, time, date, id]);

//         await notifyAdminsStaffAndOwnerByAppointment('Appointment Updated', 'An appointment has been updated.', id);

//         req.io.emit("updateNotifications");
//         res.json({ success: true, message: 'Appointment and notification updated successfully' });

//     } catch (err) {
//         console.error("Error updating appointment:", err);
//         res.status(500).json({ success: false, message: 'Failed to update appointment' });
//     }
// });

router.put('/cancel-appointment/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        await db.queryAsync(`
            UPDATE appointments SET status = ? WHERE id = ?
        `, ["canceled", id]);

        await notifyAdminsStaffAndOwnerByAppointment('Appointment Canceled', 'An appointment has been canceled.', id);

        req.io.emit("updateNotifications");
        res.json({ success: true, message: 'Appointment and notification canceled successfully' });

    } catch (err) {
        console.error("Error canceling appointment:", err);
        res.status(500).json({ success: false, message: 'Failed to cancel appointment' });
    }
});

router.put('/mark-completed-appointment/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        await db.queryAsync(`
            UPDATE appointments SET status = ? WHERE id = ?
        `, ["completed", id]);

        await notifyAdminsStaffAndOwnerByAppointment('Appointment Completed', 'An appointment has been completed.', id);

        req.io.emit("updateNotifications");
        res.json({ success: true, message: 'Appointment marked as completed and notification sent' });

    } catch (err) {
        console.error("Error completing appointment:", err);
        res.status(500).json({ success: false, message: 'Failed to complete appointment' });
    }
});


router.post('/availability', async (req, res) => {
    const { date, time_slot, is_available, appointment_id } = req.body;


    try {
        const updateAvailabilityQuery = `
            INSERT INTO availability (date, time_slot, is_available)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE is_available = ?
        `;
        await db.queryAsync(updateAvailabilityQuery, [date, time_slot, is_available, is_available]);

        // Cancel appointment if the time is made unavailable
        if (parseInt(is_available) === 0) {
            const cancelAppointmentQuery = `
                UPDATE appointments
                SET status = 'canceled'
                WHERE id = ? AND status != 'canceled'
            `;
            const cancelResult = await db.queryAsync(cancelAppointmentQuery, [appointment_id]);

            if (cancelResult.affectedRows > 0) {
                console.log(`Canceled ${cancelResult.affectedRows} appointment(s) on ${date} at ${time_slot}`);
                req.io.emit("appointmentCanceled", { date, time_slot });
            }
        }

        req.io.emit("updateNotifications");
        res.status(200).send({ message: 'Availability updated successfully' });
    } catch (error) {
        console.error('Error saving availability:', error);
        res.status(500).send({ error: 'Error saving availability' });
    }
});


// Route to save availability
// router.post('/availability', async (req, res) => {
//     const { date, time_slot, is_available } = req.body;
//     console.log(req.body);
//     try {
//         const query = `INSERT INTO availability (date, time_slot, is_available)
//                         VALUES (?, ?, ?)
//                         ON DUPLICATE KEY UPDATE is_available = ?`;
//         await db.queryAsync(query, [date, time_slot, is_available, is_available]);
//         req.io.emit("updateNotifications");
//         res.status(200).send({ message: 'Availability updated successfully' });
//     } catch (error) {
//         res.status(500).send({ error: 'Error saving availability' });
//     }
// });

// Route to get availability for a specific date
router.get('/availability-time-ii', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).send({ error: 'Date is required' });
    }

    try {
        const query = `
            SELECT *
            FROM availability
            WHERE date = ?;
        `;

        const results = await db.queryAsync(query, [date]);

        if (results.length === 0) {
            return res.status(200).send({ availability: [] });
        }

        // Send the availability data back
        res.status(200).send({ availability: results });
    } catch (error) {
        console.error('Error fetching availability:', error); // Log the error for debugging
        res.status(500).send({ error: 'Error fetching availability' });
    }
});

// Route to get availability for a specific date
router.get('/availability-time', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).send({ error: 'Date is required' });
    }

    try {
        const query = `
            SELECT time_slot, is_available
            FROM availability
            WHERE date = ? AND is_available = 1;
        `;

        const results = await db.queryAsync(query, [date]);

        if (results.length === 0) {
            return res.status(200).send({ availability: [] });
        }

        // Send the availability data back
        res.status(200).send({ availability: results });
    } catch (error) {
        console.error('Error fetching availability:', error); // Log the error for debugging
        res.status(500).send({ error: 'Error fetching availability' });
    }
});

router.get('/availability-ii', async (req, res) => {

    try {
        const query = `
            SELECT *
            FROM availability
        `;

        const results = await db.queryAsync(query);

        if (results.length === 0) {
            return res.status(200).send({ availability: [] });
        }
        res.status(200).send({ availability: results });
    } catch (error) {
        console.error('Error fetching availability:', error); // Log the error for debugging
        res.status(500).send({ error: 'Error fetching availability' });
    }
});

router.get('/availability', async (req, res) => {

    try {
        const query = `
            SELECT date 
            FROM availability WHERE is_available = 1 GROUP BY date
        `;

        const results = await db.queryAsync(query);

        if (results.length === 0) {
            return res.status(200).send({ availability: [] });
        }
        return res.json(results);
    } catch (error) {
        console.error('Error fetching availability:', error); // Log the error for debugging
        res.status(500).send({ error: 'Error fetching availability' });
    }
});

// Route to get all appointments for a specific date
router.get('/appointments/by-date', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).send({ error: 'Date is required' });
    }

    try {
        const query = `
            SELECT id, user_id, date, time
            FROM appointments
            WHERE date = ?
        `;

        const results = await db.queryAsync(query, [date]);

        return res.status(200).send(results);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send({ error: 'Error fetching appointments' });
    }
});


module.exports = router;

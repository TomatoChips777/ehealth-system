// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');

// // async function notifyAdminsAndStaff(title, message) {
// //     try {
// //         const notificationResult = await db.queryAsync(
// //             'INSERT INTO notifications (title, message, created_at) VALUES (?, ?, NOW())',
// //             [title, message]
// //         );
// //         const notificationId = notificationResult.insertId;

// //         // Fetch Admins and Staff
// //         const users = await db.queryAsync(
// //             'SELECT id FROM users WHERE role IN (?, ?) AND status = 1',
// //             ['admin', 'staff']
// //         );

// //         const receivers = users.map(user => [notificationId, user.id, 0, null]);
// //         if (receivers.length > 0) {
// //             await db.queryAsync(
// //                 'INSERT INTO notification_receivers (notification_id, user_id, is_read, read_at) VALUES ?',
// //                 [receivers]
// //             );
// //         }
// //     } catch (err) {
// //         console.error("Error sending notifications:", err);
// //     }
// // }


// async function notifyAdminsStaffAndOwner(title, message, ownerId) {
//     try {
//         const notificationResult = await db.queryAsync(
//             'INSERT INTO notifications (title, message, created_at) VALUES (?, ?, NOW())',
//             [title, message]
//         );
//         const notificationId = notificationResult.insertId;

//         // Fetch Admins and Staff
//         const users = await db.queryAsync(
//             'SELECT id FROM users WHERE role IN (?, ?) AND status = 1',
//             ['admin', 'staff']
//         );

//         // Prepare receivers: admins, staff, and the owner
//         const receivers = users.map(user => [notificationId, user.id, 0, null]);

//         // Add owner if not already included
//         if (ownerId) {
//             // Ensure owner isn't duplicated (in case admin/staff books own appointment)
//             const ownerAlreadyIncluded = users.some(user => user.id === ownerId);
//             if (!ownerAlreadyIncluded) {
//                 receivers.push([notificationId, ownerId, 0, null]);
//             }
//         }

//         if (receivers.length > 0) {
//             await db.queryAsync(
//                 'INSERT INTO notification_receivers (notification_id, user_id, is_read, read_at) VALUES ?',
//                 [receivers]
//             );
//         }

//     } catch (err) {
//         console.error("Error sending notifications:", err);
//     }
// }


// router.get('/', async (req, res) => {
//     try {
//         const rows = await db.queryAsync(`SELECT a.*,s.student_id, a.complaint as chief_complaint ,s.full_name, s.email, s.birthdate, s.sex FROM appointments a JOIN students s ON a.user_id = s.user_id WHERE a.status = "pending" ORDER BY created_at DESC;`);
//         return res.json(rows);
//     } catch (err) {
//         console.error("Error fetching all borrow records:", err);
//         res.status(500).json([]);
//     }
// });

// router.get('/student/:user_id', async (req, res) => {
//     const {user_id} = req.params;
//     try {
//         const rows = await db.queryAsync(`SELECT a.*,s.student_id, a.complaint as chief_complaint ,s.full_name, s.email, s.birthdate, s.sex FROM appointments a JOIN students s ON a.user_id = s.user_id WHERE a.status = "pending" AND a.user_id = ? ORDER BY created_at DESC;`,[user_id]);
//         return res.json(rows);
//     } catch (err) {
//         console.error("Error fetching all borrow records:", err);
//         res.status(500).json([]);
//     }
// });
// // Borrow Request (for users)
// router.post('/post-appointment', async (req, res) => {
//     const {
//         user_id,
//         complaint,
//         time,
//         date,
//     } = req.body;
//     console.log(req.body);

//     if ( !complaint || !time || !date || !user_id ) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const query = `
//         INSERT INTO appointments
//         (user_id, complaint, time, date)
//         VALUES (?, ? ,?, ?)
//     `;
//     const values = [user_id, complaint, time, date];

//     try {
//         const result = await db.queryAsync(query, values);
//         await notifyAdminsAndStaff('New Appointment Scheduled', 'A new appointment has been booked.', user_id);
//         req.io.emit("updateNotifications");
//         res.json({
//             success: true,
//             message: 'Borrow record and notification created successfully',
//         });

//     } catch (err) {
//         console.error("Error creating borrow record or notification:", err);
//         res.status(500).json({ success: false, message: 'Failed to create borrow record or notification' });
//     }
// });

// router.put('/update-appointment/:id', async (req, res) => {

//     const { id } = req.params;
//     const {
//         complaint,
//         time,
//         date,
//     } = req.body;
//     console.log(req.body);

//     if ( !complaint || !time || !date ||!id ) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const query = `
//         UPDATE appointments SET complaint = ?, time = ?, date = ? WHERE id = ?
//     `;
//     const values = [complaint, time, date, id];

//     try {
//         const result = await db.queryAsync(query, values);
//         await notifyAdminsAndStaff('Appointment Updated', 'An appointment has been updated.');
//         req.io.emit("updateNotifications");
//         res.json({
//             success: true,
//             message: ' record and notification created successfully',
//         });

//     } catch (err) {
//         console.error("Error creating borrow record or notification:", err);
//         res.status(500).json({ success: false, message: 'Failed to create borrow record or notification' });
//     }
// });

// router.put('/cancel-appointment/:id', async (req, res) => {
//     const { id } = req.params;


//     if (!id ) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const query = `
//         UPDATE appointments SET status = ? WHERE id = ?
//     `;
//     const values = ["canceled" ,id];

//     try {
//         const result = await db.queryAsync(query, values);
//         await notifyAdminsAndStaff('Appointment Canceled', 'An appointment has been canceled.');
//         req.io.emit("updateNotifications");
//         res.json({
//             success: true,
//             message: ' record and notification created successfully',
//         });

//     } catch (err) {
//         console.error("Error creating borrow record or notification:", err);
//         res.status(500).json({ success: false, message: 'Failed to create borrow record or notification' });
//     }
// });

// router.put('/mark-completed-appointment/:id', async (req, res) => {
//     const { id } = req.params;


//     if (!id ) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const query = `
//         UPDATE appointments SET status = ? WHERE id = ?
//     `;
//     const values = ["completed" ,id];

//     try {
        
//         const result = await db.queryAsync(query, values);
//         await notifyAdminsAndStaff('Appointment Completed', 'An appointment has been completed.');

//         req.io.emit("updateNotifications");
//         res.json({
//             success: true,
//             message: ' record and notification created successfully',
//         });

//     } catch (err) {
//         console.error("Error creating borrow record or notification:", err);
//         res.status(500).json({ success: false, message: 'Failed to create borrow record or notification' });
//     }
// });


// module.exports = router;



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

// 🩺 Routes

// Get all pending appointments
router.get('/', async (req, res) => {
    try {
        const rows = await db.queryAsync(`
            SELECT a.*, s.student_id, a.complaint AS chief_complaint, s.full_name, s.email, s.birthdate, s.sex 
            FROM appointments a 
            JOIN students s ON a.user_id = s.user_id 
            WHERE a.status = "pending" 
            ORDER BY created_at DESC
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

// 📅 Post new appointment
router.post('/post-appointment', async (req, res) => {
    const { user_id, complaint, time, date } = req.body;

    if (!complaint || !time || !date || !user_id) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        await db.queryAsync(`
            INSERT INTO appointments (user_id, complaint, time, date) VALUES (?, ?, ?, ?)
        `, [user_id, complaint, time, date]);

        await notifyAdminsStaffAndOwner('New Appointment Scheduled', 'A new appointment has been booked.', user_id);

        req.io.emit("updateNotifications");
        res.json({ success: true, message: 'Appointment and notification created successfully' });

    } catch (err) {
        console.error("Error posting appointment:", err);
        res.status(500).json({ success: false, message: 'Failed to create appointment' });
    }
});

// 🛠 Update an appointment
router.put('/update-appointment/:id', async (req, res) => {
    const { id } = req.params;
    const { complaint, time, date } = req.body;

    if (!complaint || !time || !date || !id) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        await db.queryAsync(`
            UPDATE appointments SET complaint = ?, time = ?, date = ? WHERE id = ?
        `, [complaint, time, date, id]);

        await notifyAdminsStaffAndOwnerByAppointment('Appointment Updated', 'An appointment has been updated.', id);

        req.io.emit("updateNotifications");
        res.json({ success: true, message: 'Appointment and notification updated successfully' });

    } catch (err) {
        console.error("Error updating appointment:", err);
        res.status(500).json({ success: false, message: 'Failed to update appointment' });
    }
});

// ❌ Cancel an appointment
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

// ✅ Mark an appointment as completed
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

module.exports = router;

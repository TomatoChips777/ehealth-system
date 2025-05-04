const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adjust if your db config is elsewhere

// Get basic counts for all tables
router.get('/analytics/counts', (req, res) => {
    const queries = {
        annual_physical_exams: 'SELECT COUNT(*) AS count FROM annual_physical_exams',
        appointments: 'SELECT COUNT(*) AS count FROM appointments WHERE status = "pending"',
        equipment_inventory: 'SELECT COUNT(DISTINCT equipment_name) AS count FROM equipments WHERE archived = 1',
        medicine_inventory: 'SELECT COUNT(DISTINCT medicine_name) AS count FROM medicines WHERE archived = 1',
        notifications: 'SELECT COUNT(*) AS count FROM notifications',
        supply_inventory: 'SELECT COUNT(DISTINCT supply_name) AS count FROM supplies WHERE archived = 1',
        personel: 'SELECT COUNT(*) AS count FROM personel',
        physical_exam_findings: 'SELECT COUNT(*) AS count FROM physical_exam_findings',
        prescriptions: 'SELECT COUNT(*) AS count FROM prescriptions'
    };

    const results = {};
    const keys = Object.keys(queries);
    let completed = 0;

    keys.forEach(table => {
        db.query(queries[table], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err });
                return;
            }
            results[table] = rows[0].count;
            completed++;

            if (completed === keys.length) {
                res.json(results);
            }
        });
    });
});

// Get appointment status breakdown
router.get('/analytics/appointments-status', (req, res) => {
    db.query(
        `SELECT status, COUNT(*) as count FROM appointments GROUP BY status`,
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err });
            } else {
                res.json(rows);
            }
        }
    );
});

// Get top prescribed medicines
router.get('/analytics/top-medicines', (req, res) => {
    db.query(
        `SELECT medicine_name, COUNT(*) as count 
         FROM prescriptions 
         GROUP BY medicine_name 
         ORDER BY count DESC 
         LIMIT 5`,
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err });
            } else {
                res.json(rows);
            }
        }
    );
});

// Get monthly equipment updates
router.get('/analytics/equipment-monthly', (req, res) => {
    db.query(
        `SELECT 
  equipment_name,
  SUM(CASE WHEN MONTH(created_at) = 8 THEN quantity ELSE 0 END) AS Aug,
  SUM(CASE WHEN MONTH(created_at) = 9 THEN quantity ELSE 0 END) AS Sep,
  SUM(CASE WHEN MONTH(created_at) = 10 THEN quantity ELSE 0 END) AS Oct,
  SUM(CASE WHEN MONTH(created_at) = 11 THEN quantity ELSE 0 END) AS Nov,
  SUM(CASE WHEN MONTH(created_at) = 12 THEN quantity ELSE 0 END) AS 'Dec',
  SUM(CASE WHEN MONTH(created_at) = 1 THEN quantity ELSE 0 END) AS Jan,
  SUM(CASE WHEN MONTH(created_at) = 2 THEN quantity ELSE 0 END) AS Feb,
  SUM(CASE WHEN MONTH(created_at) = 3 THEN quantity ELSE 0 END) AS Mar,
  SUM(CASE WHEN MONTH(created_at) = 4 THEN quantity ELSE 0 END) AS Apr,
  SUM(CASE WHEN MONTH(created_at) = 5 THEN quantity ELSE 0 END) AS May,
  SUM(CASE WHEN MONTH(created_at) = 6 THEN quantity ELSE 0 END) AS Jun,
  SUM(CASE WHEN MONTH(created_at) = 7 THEN quantity ELSE 0 END) AS Jul,
  SUM(quantity) AS total
FROM equipments
WHERE archived = 1
  AND (
    (MONTH(created_at) >= 8 AND YEAR(created_at) = YEAR(CURDATE()) - 1)
    OR (MONTH(created_at) <= 7 AND YEAR(created_at) = YEAR(CURDATE()))
  )
GROUP BY equipment_name
ORDER BY equipment_name;`,
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err });
            } else {
                res.json(rows);
            }
        }
    );
});

router.get('/analytics/supply-monthly', (req, res) => {
    db.query(
        `SELECT 
  supply_name,
  SUM(CASE WHEN MONTH(created_at) = 8 THEN quantity ELSE 0 END) AS Aug,
  SUM(CASE WHEN MONTH(created_at) = 9 THEN quantity ELSE 0 END) AS Sep,
  SUM(CASE WHEN MONTH(created_at) = 10 THEN quantity ELSE 0 END) AS Oct,
  SUM(CASE WHEN MONTH(created_at) = 11 THEN quantity ELSE 0 END) AS Nov,
  SUM(CASE WHEN MONTH(created_at) = 12 THEN quantity ELSE 0 END) AS "Dec",
  SUM(CASE WHEN MONTH(created_at) = 1 THEN quantity ELSE 0 END) AS Jan,
  SUM(CASE WHEN MONTH(created_at) = 2 THEN quantity ELSE 0 END) AS Feb,
  SUM(CASE WHEN MONTH(created_at) = 3 THEN quantity ELSE 0 END) AS Mar,
  SUM(CASE WHEN MONTH(created_at) = 4 THEN quantity ELSE 0 END) AS Apr,
  SUM(CASE WHEN MONTH(created_at) = 5 THEN quantity ELSE 0 END) AS May,
  SUM(CASE WHEN MONTH(created_at) = 6 THEN quantity ELSE 0 END) AS Jun,
  SUM(CASE WHEN MONTH(created_at) = 7 THEN quantity ELSE 0 END) AS Jul,
  SUM(quantity) AS total
FROM supplies
WHERE archived = 1
  AND (
    (MONTH(created_at) >= 8 AND YEAR(created_at) = YEAR(CURDATE()) - 1)
    OR (MONTH(created_at) <= 7 AND YEAR(created_at) = YEAR(CURDATE()))
  )
GROUP BY supply_name
ORDER BY supply_name;`,
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err });
            } else {
                res.json(rows);
            }
        }
    );
});

// Get monthly medicine stock
router.get('/analytics/medicine-monthly', (req, res) => {
    db.query(
        `SELECT 
  medicine_name,
  SUM(CASE WHEN MONTH(created_at) = 8 THEN quantity ELSE 0 END) AS Aug,
  SUM(CASE WHEN MONTH(created_at) = 9 THEN quantity ELSE 0 END) AS Sep,
  SUM(CASE WHEN MONTH(created_at) = 10 THEN quantity ELSE 0 END) AS Oct,
  SUM(CASE WHEN MONTH(created_at) = 11 THEN quantity ELSE 0 END) AS Nov,
  SUM(CASE WHEN MONTH(created_at) = 12 THEN quantity ELSE 0 END) AS "Dec",
  SUM(CASE WHEN MONTH(created_at) = 1 THEN quantity ELSE 0 END) AS Jan,
  SUM(CASE WHEN MONTH(created_at) = 2 THEN quantity ELSE 0 END) AS Feb,
  SUM(CASE WHEN MONTH(created_at) = 3 THEN quantity ELSE 0 END) AS Mar,
  SUM(CASE WHEN MONTH(created_at) = 4 THEN quantity ELSE 0 END) AS Apr,
  SUM(CASE WHEN MONTH(created_at) = 5 THEN quantity ELSE 0 END) AS May,
  SUM(CASE WHEN MONTH(created_at) = 6 THEN quantity ELSE 0 END) AS Jun,
  SUM(CASE WHEN MONTH(created_at) = 7 THEN quantity ELSE 0 END) AS Jul,
  SUM(quantity) AS total
FROM medicines
WHERE archived = 1
  AND (
    (MONTH(created_at) >= 8 AND YEAR(created_at) = YEAR(CURDATE()) - 1)
    OR (MONTH(created_at) <= 7 AND YEAR(created_at) = YEAR(CURDATE()))
  )
GROUP BY medicine_name
ORDER BY medicine_name;`,
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err });
            } else {
                res.json(rows);
            }
        }
    );
});

// Get physical exam findings status
router.get('/analytics/physical-findings', (req, res) => {
    db.query(
        `SELECT status, COUNT(*) as count FROM physical_exam_findings GROUP BY status`,
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err });
            } else {
                res.json(rows);
            }
        }
    );
});

router.get('/analytics/trends-daily', (req, res) => {
    db.query(`
      SELECT 
        DATE(date) AS day,
        COUNT(*) AS total_consultations
      FROM student_logs
      WHERE YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)  -- Filters for the current week
      GROUP BY day
      ORDER BY day;
    `, (error, results) => {
        if (error) {
            console.error('Error fetching daily consultation trends:', error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const data = results.map(row => {
            const date = new Date(row.day);
            
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', row.day);
                return { label: "Invalid Date", total: row.total_consultations };
            }

            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            });

            return {
                label: formattedDate, 
                total: row.total_consultations
            };
        });

        res.json(data);
    });
});


router.get('/analytics/appointment-frequency', (req, res) => {
    db.query(`
      SELECT 
        DATE(date) AS day,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) AS canceled,
        SUM(CASE WHEN status = 'rescheduled' THEN 1 ELSE 0 END) AS rescheduled
      FROM appointments
      GROUP BY day
      ORDER BY day;
    `, (error, results) => {
      if (error) {
        console.error('Error fetching appointment frequency:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
  
      const data = results.map(row => {
        const date = new Date(row.day);
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', row.day);
          return { label: "Invalid Date" };
        }
  
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        });
  
        return {
          label: formattedDate,
          pending: row.pending,
          completed: row.completed,
          canceled: row.canceled,
          rescheduled: row.rescheduled,
        };
      });
  
      res.json(data);
    });
  });
  
  
  router.get('/analytics/medicine-quantity-extremes', (req, res) => {
    const highestQuery = `
      SELECT medicine_name, quantity 
      FROM medicines 
      WHERE archived = 0 
      ORDER BY quantity DESC 
      LIMIT 5
    `;
  
    const lowestQuery = `
      SELECT medicine_name, quantity 
      FROM medicines 
      WHERE archived = 0 
      ORDER BY quantity ASC 
      LIMIT 5
    `;
  
    db.query(highestQuery, (highErr, highestResults) => {
      if (highErr) {
        console.error('Error fetching highest quantity medicines:', highErr);
        return res.status(500).json({ success: false, message: 'Server error (highest)' });
      }
  
      db.query(lowestQuery, (lowErr, lowestResults) => {
        if (lowErr) {
          console.error('Error fetching lowest quantity medicines:', lowErr);
          return res.status(500).json({ success: false, message: 'Server error (lowest)' });
        }
  
        res.json({
          highest: highestResults,
          lowest: lowestResults
        });
      });
    });
  });
  
module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adjust if your db config is elsewhere

// Get basic counts for all tables
router.get('/analytics/counts', (req, res) => {
    const queries = {
        annual_physical_exams: 'SELECT COUNT(*) AS count FROM annual_physical_exams',
        appointments: 'SELECT COUNT(*) AS count FROM appointments WHERE status = "pending"',
        equipment_inventory: 'SELECT COUNT(*) AS count FROM equipment_inventory',
        medicine_inventory: 'SELECT COUNT(*) AS count FROM medicine_inventory',
        notifications: 'SELECT COUNT(*) AS count FROM notifications',
        personel: 'SELECT COUNT(*) AS count FROM personel',
        physical_exam_findings: 'SELECT COUNT(*) AS count FROM physical_exam_findings',
        prescriptions: 'SELECT COUNT(*) AS count FROM prescriptions',
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
        `SELECT name, january, february, march, april, may, june, july, august, september, october, november, december
         FROM equipment_inventory
         WHERE year = YEAR(CURDATE())`,
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
      `SELECT name, january, february, march, april, may, june, july, august, september, october, november, december
       FROM supply_inventory
       WHERE year = YEAR(CURDATE())`,
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
        `SELECT name, january, february, march, april, may, june, july, august, september, october, november, december
         FROM medicine_inventory
         WHERE year = YEAR(CURDATE())`,
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

module.exports = router;

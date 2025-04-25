const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper function to execute a query and return a promise
const runQuery = (query, values = []) => {
    return db.queryAsync(query, values);
};

// Get all patients
router.get('/', async (req, res) => {
    const query = `SELECT * FROM patients ORDER BY full_name`;

    try {
        const rows = await runQuery(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all patients:", err);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
});

router.post('/add-annual-physical-exam', async (req, res) => {
    const {
        patient_id,
        bp,
        temp,
        heart_rate,
        rr,
        height,
        weight,
        bmi,
        asthma,
        allergies,
        medical_condition,
        vision_od,
        vision_os,
        hearing_right,
        hearing_left,
        remarks,
        assessment,
        recommendation,
        findings
    } = req.body;
    console.log(req.body);

    // Validate the necessary fields
    if (!patient_id) {
        return res.status(400).json({ success: false, message: 'Patient ID and Date Examined are required' });
    }

    const insertExamQuery = `
        INSERT INTO annual_physical_exams 
        (patient_id, bp, temp, heart_rate, rr, height, weight, bmi, asthma, allergies, medical_condition, 
        vision_od, vision_os, hearing_right, hearing_left, remarks, assessment, recommendation ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const examValues = [
        patient_id, bp, temp, heart_rate, rr, height, weight, bmi, asthma, allergies, medical_condition,
        vision_od, vision_os, hearing_right, hearing_left, remarks, assessment, recommendation
    ];

    try {
        // Insert into annual_physical_exams table
        const examResult = await runQuery(insertExamQuery, examValues);
        const examId = examResult.insertId;

        // Prepare findings data for insertion
        const findingsQuery = `
            INSERT INTO physical_exam_findings (exam_id, body_part, status, notes) 
            VALUES ?`;

        const findingsData = [];
        for (const part of Object.keys(findings)) {
            const { status, note } = findings[part];
            findingsData.push([examId, part, status, note || null]);
        }

        // Insert multiple findings into the physical_exam_findings table
        await runQuery(findingsQuery, [findingsData]);

        // Respond with success message
        res.status(200).json({ success: true, message: 'Annual physical exam added successfully' });
    } catch (err) {
        console.error("Error during insertion:", err);
        res.status(500).json({ success: false, message: 'Failed to add annual physical exam' });
    }
});



router.put('/update-annual-physical-exam/:id', async (req, res) => {
     const {id} = req.params;
    const {
        patient_id,
        bp,
        temp,
        heart_rate,
        rr,
        height,
        weight,
        bmi,
        asthma,
        allergies,
        medical_condition,
        vision_od,
        vision_os,
        hearing_right,
        hearing_left,
        remarks,
        assessment,
        recommendation,
        date_examined,
        findings
    } = req.body;
     console.log(req.body);
    // Validate the necessary fields
    if (!id || !patient_id ) {
        return res.status(400).json({ success: false, message: 'Exam ID, Patient ID, and Date Examined are required' });
    }

    const updateExamQuery = `
        UPDATE annual_physical_exams 
        SET bp = ?, temp = ?, heart_rate = ?, rr = ?, height = ?, weight = ?, bmi = ?, asthma = ?, allergies = ?, 
            medical_condition = ?, vision_od = ?, vision_os = ?, hearing_right = ?, hearing_left = ?, remarks = ?, 
            assessment = ?, recommendation = ?
        WHERE id = ? AND patient_id = ?`;

    const examValues = [
        bp, temp, heart_rate, rr, height, weight, bmi, asthma, allergies, medical_condition,
        vision_od, vision_os, hearing_right, hearing_left, remarks, assessment, recommendation, id, patient_id
    ];

    try {
        // Update the record in the annual_physical_exams table
        const examUpdateResult = await runQuery(updateExamQuery, examValues);

        if (examUpdateResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No matching record found to update' });
        }

        // Now, update the findings if any
        const deleteFindingsQuery = 'DELETE FROM physical_exam_findings WHERE exam_id = ?';
        await runQuery(deleteFindingsQuery, [id]);

        // Prepare findings data for insertion
        const findingsQuery = `
            INSERT INTO physical_exam_findings (exam_id, body_part, status, notes) 
            VALUES ?`;

        const findingsData = [];
        for (const part of Object.keys(findings)) {
            const { status, note } = findings[part];
            findingsData.push([id, part, status, note || null]);
        }

        // Insert the updated findings into the physical_exam_findings table
        await runQuery(findingsQuery, [findingsData]);

        // Respond with success message
        res.status(200).json({ success: true, message: 'Annual physical exam updated successfully' });
    } catch (err) {
        console.error("Error during update:", err);
        res.status(500).json({ success: false, message: 'Failed to update annual physical exam' });
    }
});

router.get('/annual-physical-exam/:patient_id', async (req, res) => {
    const { patient_id } = req.params;

    if (!patient_id) {
        return res.status(400).json({ success: false, message: 'Patient ID is required' });
    }

    const examQuery = `
            SELECT * FROM annual_physical_exams 
            WHERE patient_id = ? 
            ORDER BY date_examined DESC
    `;

    try {
        const examResult = await runQuery(examQuery, [patient_id]);
        const exam = examResult[0]; 

        if (!exam || !exam.id) {
            return res.status(404).json({ success: false, message: 'No annual physical exam record found' });
        }

        const findingsQuery = `
            SELECT * FROM physical_exam_findings WHERE exam_id = ?
        `;
        const findingsRows = await runQuery(findingsQuery, [exam.id]);
        res.json({
            success: true,
            exam: {
                ...exam,
                findings: findingsRows || [],
            }
        });

    } catch (err) {
        console.error("Error fetching physical exam details:", err);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
});

module.exports = router;
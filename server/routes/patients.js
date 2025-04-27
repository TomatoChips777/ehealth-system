const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const runQuery = (query, values = []) => {
    return db.queryAsync(query, values);
};

// Get all patients
router.get('/', async (req, res) => {
    const query = `SELECT s.*, u.name, u.email FROM students s JOIN users u on u.id = s.user_id WHERE u.role = "student" ORDER BY full_name`;

    try {
        const rows = await runQuery(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all students:", err);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
});

router.get('/get-student-logs/:user_id', async (req, res) => {

    const { user_id } = req.params;
    const query = `SELECT * FROM student_logs WHERE user_id = ? ORDER BY created_at DESC`;

    try {
        const rows = await runQuery(query, [user_id]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all students:", err);
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

    // Validate the necessary fields
    if (!patient_id) {
        return res.status(400).json({ success: false, message: 'Patient ID and Date Examined are required' });
    }

    const insertExamQuery = `
        INSERT INTO annual_physical_exams 
        (user_id, bp, temp, heart_rate, rr, height, weight, bmi, asthma, allergies, medical_condition, 
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
        req.io.emit("updateAPE");
        // Respond with success message
        res.status(200).json({ success: true, message: 'Annual physical exam added successfully' });
    } catch (err) {
        console.error("Error during insertion:", err);
        res.status(500).json({ success: false, message: 'Failed to add annual physical exam' });
    }
});



router.put('/update-annual-physical-exam/:id', async (req, res) => {
    const { id } = req.params;
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
    // Validate the necessary fields
    if (!id || !patient_id) {
        return res.status(400).json({ success: false, message: 'Exam ID, Patient ID, and Date Examined are required' });
    }

    const updateExamQuery = `
        UPDATE annual_physical_exams 
        SET bp = ?, temp = ?, heart_rate = ?, rr = ?, height = ?, weight = ?, bmi = ?, asthma = ?, allergies = ?, 
            medical_condition = ?, vision_od = ?, vision_os = ?, hearing_right = ?, hearing_left = ?, remarks = ?, 
            assessment = ?, recommendation = ?
        WHERE id = ? AND user_id = ?`;

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
        req.io.emit("updateAPE");
        // Respond with success message
        res.status(200).json({ success: true, message: 'Annual physical exam updated successfully' });
    } catch (err) {
        console.error("Error during update:", err);
        res.status(500).json({ success: false, message: 'Failed to update annual physical exam' });
    }
});

router.get('/annual-physical-exam-2/:patient_id', async (req, res) => {
    const { patient_id } = req.params;

    if (!patient_id) {
        return res.status(400).json({ success: false, message: 'Patient ID is required' });
    }

    const examQuery = `
            SELECT * FROM annual_physical_exams 
            WHERE user_id = ? 
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

router.get('/annual-physical-exam/:patient_id', async (req, res) => {
    const { patient_id } = req.params;

    if (!patient_id) {
        return res.status(400).json({ success: false, message: 'Patient ID is required' });
    }

    const examQuery = `
        SELECT * FROM annual_physical_exams 
        WHERE user_id = ? 
        ORDER BY date_examined DESC
    `;

    try {
        const examResults = await runQuery(examQuery, [patient_id]);

        // Fetch findings for each exam
        const examsWithFindings = await Promise.all(
            examResults.map(async (exam) => {
                const findingsQuery = `SELECT * FROM physical_exam_findings WHERE exam_id = ?`;
                const findings = await runQuery(findingsQuery, [exam.id]);
                return {
                    ...exam,
                    findings: findings || []
                };
            })
        );

        res.json({
            success: true,
            exam: examsWithFindings
        });
    } catch (err) {
        console.error("Error fetching physical exam details:", err);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
});


// Add a Student Log (Consultation Entry)
router.post('/add-student-log', async (req, res) => {
    const {
        user_id,
        complaint,
        intervention,
        remarks
    } = req.body;

    // Basic validation
    if (!user_id || !complaint || !intervention || !remarks) {
        return res.status(400).json({ success: false, message: 'Student ID and Complaint are required.' });
    }

    const insertQuery = `
     INSERT INTO student_logs (user_id, chief_complaint, intervention, remarks, date, time) 
     VALUES (?, ?, ?, ?, CURDATE(), CURTIME()); 
    `;

    const values = [
        user_id || null,
        complaint,
        intervention || '',
        remarks || ''
    ];

    try {
        await runQuery(insertQuery, values);
        req.io.emit("updateAppointment");
        res.status(200).json({ success: true, message: 'Student log added successfully.' });
    } catch (err) {
        console.error('Error adding student log:', err);
        res.status(500).json({ success: false, message: 'Failed to add student log.' });
    }
});


router.get('/search-students', async (req, res) => {
    const { query } = req.query;
    try {
        const studentsResult = await runQuery(
            'SELECT * FROM students WHERE student_id LIKE ? LIMIT 5',
            [`%${query}%`]
        );
        const students = studentsResult || [];
        if (students.length > 0) {
            res.json(students);
        } else {
            // res.status(404).json({ error: 'No students found' });
        }
    } catch (error) {
        console.error('Error searching students:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch students', detail: error.message });
    }
});

router.post('/add-prescriptions', async (req, res) => {
    const { user_id, prescriptions, notes, prescribed_by } = req.body;
    console.log(req.body);

    if (!user_id || !prescriptions || prescriptions.length === 0) {
        return res.status(400).json({ success: false, message: 'User ID and at least one prescription are required.' });
    }

    try {
        // 1. Insert into prescription_headers first
        const insertHeaderQuery = `
        INSERT INTO prescription_headers (user_id, prescribed_by, notes)
        VALUES (?, ?, ?)
      `;

        const result = await runQuery(insertHeaderQuery, [user_id, prescribed_by, notes || null]);

        const prescriptionId = result.insertId;  // Get the inserted prescription_id
        console.log('New Prescription ID:', prescriptionId);

        // 2. Insert into prescription_medicines
        const insertMedicinesQuery = `
        INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, frequency, duration)
        VALUES ${prescriptions.map(() => `(?, ?, ?, ?, ?)`).join(', ')}
      `;

        const medicineValues = prescriptions.flatMap(pres => [
            prescriptionId,
            pres.medicine,
            pres.dosage,
            pres.frequency,
            pres.duration
        ]);

        await runQuery(insertMedicinesQuery, medicineValues);
        req.io.emit("updatePrescription");
        res.status(200).json({ success: true, message: 'Prescription added successfully.' });

    } catch (err) {
        console.error('Error adding prescription:', err);
        res.status(500).json({ success: false, message: 'Failed to add prescription.' });
    }
});

router.get('/get-prescriptions-by-id/:user_id', async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'Missing user_id.' });
    }

    try {
        const query = `
        SELECT 
          ph.prescription_id,
          ph.user_id,
          ph.notes,
          ph.created_at,
          pm.medicine_name,
          pm.dosage,
          pm.frequency,
          pm.duration
        FROM prescription_headers ph
        JOIN prescription_medicines pm ON ph.prescription_id = pm.prescription_id
        WHERE ph.user_id = ?
        ORDER BY ph.created_at DESC
      `;

        const prescriptions = await runQuery(query, [user_id]);

        // Group by prescription_id
        const grouped = Object.values(
            prescriptions.reduce((acc, item) => {
                if (!acc[item.prescription_id]) {
                    acc[item.prescription_id] = {
                        prescription_id: item.prescription_id,
                        user_id: item.user_id,
                        created_at: item.created_at,
                        notes: item.notes,
                        prescriptions: []
                    };
                }
                acc[item.prescription_id].prescriptions.push({
                    medicine: item.medicine_name,
                    dosage: item.dosage,
                    frequency: item.frequency,
                    duration: item.duration
                });
                return acc;
            }, {})
        );

        res.json(grouped);
    } catch (err) {
        console.error('Error fetching prescriptions:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch prescriptions.' });
    }
});


router.post('/add-patient', async (req, res) => {
    const {
        username,
        password,
        email,
        student_id,
        full_name,
        course,
        year,
        birthdate,
        sex,
        contact_number,
        address,
        contact_person,
        contact_person_number
    } = req.body;
    if (!username || !email || !student_id) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    try {
        // 1. Check if email already exists
        const checkEmailQuery = `SELECT id FROM users WHERE email = ? LIMIT 1`;
        const existingUser = await runQuery(checkEmailQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        // 2. Check if student_id already exists
        const checkStudentIdQuery = `SELECT id FROM students WHERE student_id = ? LIMIT 1`;
        const existingStudent = await runQuery(checkStudentIdQuery, [student_id]);

        if (existingStudent.length > 0) {
            return res.status(400).json({ success: false, message: 'Student ID already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // 2. Insert into users table
        const userInsertQuery = `
        INSERT INTO users (username, password, name, email)
        VALUES (?, ?, ?, ?)
      `;
        const userResult = await runQuery(userInsertQuery, [username, hashedPassword, full_name, email]);
        const userId = userResult.insertId;

        // 3. Insert into students table
        const studentInsertQuery = `
        INSERT INTO students (user_id, student_id, full_name, course, year, birthdate, sex, contact_number, email, address, contact_person, contact_person_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
        await runQuery(studentInsertQuery, [
            userId,
            student_id,
            full_name,
            course,
            year,
            birthdate,
            sex,
            contact_number,
            email,
            address,
            contact_person,
            contact_person_number
        ]);
        req.io.emit("updateUser");
        res.status(200).json({ success: true, message: 'Student added successfully.' });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ success: false, message: 'Failed to add student.' });
    }
});

router.post('/edit-details', async (req, res) => {
    const {
      id, 
      username,
      email,
      student_id,
      full_name,
      course,
      year,
      birthdate,
      sex,
      contact_number,
      address,
      contact_person,
      contact_person_number,
      password, 
    } = req.body;
    console.log(req.body);
    if (!id || !username || !email || !student_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
  
    try {
      // 1. Check if email already exists (excluding current user)
      const checkEmailQuery = `SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1`;
      const existingEmail = await runQuery(checkEmailQuery, [email, id]);
  
      if (existingEmail.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already in use by another account.' });
      }
  
      // 2. Check if student_id already exists (excluding current student)
      const checkStudentIdQuery = `
        SELECT s.id 
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.student_id = ? AND u.id != ? 
        LIMIT 1
      `;
      const existingStudent = await runQuery(checkStudentIdQuery, [student_id, id]);
  
      if (existingStudent.length > 0) {
        return res.status(400).json({ success: false, message: 'Student ID already in use by another account.' });
      }
  
      // 3. Update users table
      let updateUserQuery = `UPDATE users SET username = ?, email = ?, name = ?`;
      const updateUserParams = [username, email, full_name];
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateUserQuery += `, password = ?`;
        updateUserParams.push(hashedPassword);
      }
  
      updateUserQuery += ` WHERE id = ?`;
      updateUserParams.push(id);
  
      await runQuery(updateUserQuery, updateUserParams);
  
      // 4. Update students table
      const updateStudentQuery = `
        UPDATE students
        SET 
          student_id = ?,
          full_name = ?,
          course = ?,
          year = ?,
          birthdate = ?,
          sex = ?,
          contact_number = ?,
          email = ?,
          address = ?,
          contact_person = ?,
          contact_person_number = ?
        WHERE user_id = ?
      `;
  
      await runQuery(updateStudentQuery, [
        student_id,
        full_name,
        course,
        year,
        birthdate,
        sex,
        contact_number,
        email,
        address,
        contact_person,
        contact_person_number,
        id,
      ]);
      req.io.emit("updateUser");
      res.status(200).json({ success: true, message: 'Student updated successfully.' });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ success: false, message: 'Failed to update student.' });
    }
  });
  

module.exports = router;
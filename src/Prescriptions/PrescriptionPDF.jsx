import jsPDF from 'jspdf';
import 'jspdf-autotable';

function generatePrescriptionPDF(student, prescriptions, notes) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [216, 140]
  });

  doc.setFont('Times', 'Normal');
  doc.setFontSize(10);

  // Header
  doc.setFontSize(14);
  doc.text('LORMA COLLEGES', 108, 10, { align: 'center' });
  doc.setFontSize(11);
  doc.text('CAMPUS HEALTH OFFICE', 108, 16, { align: 'center' });
  doc.text('Caralatan, San Fernando City, La Union', 108, 22, { align: 'center' });

  // Student Info
  doc.setFontSize(9);
  doc.text(`Name: ${student.full_name || ''}`, 10, 35);
  doc.text(`Age: ${calculateAge(student.birthdate) || ''}`, 160, 35);
  doc.text(`Sex: ${student.sex || ''}`, 185, 35);

  doc.text(`Address: ${student.address || '_________________________'}`, 10, 42);
  doc.line(10, 44, 206, 44); 

  // RX symbol
  doc.setFontSize(24);
  doc.text('Rx', 10, 55);

  // Table of prescriptions
  const tableData = prescriptions.map((prescription, index) => [
    index + 1,
    prescription.medicine,
    prescription.dosage,
    prescription.frequency,
    prescription.duration
  ]);

  doc.autoTable({
    startY: 60,
    head: [['#', 'Medicine', 'Dosage', 'Frequency', 'Duration']],
    body: tableData,
    theme: 'grid',
    styles: { font: 'Times', fontSize: 8 },
    headStyles: { fillColor: [230, 230, 230] },
    margin: { left: 10, right: 10 },
    tableWidth: 'auto'
  });

  let finalY = doc.previousAutoTable.finalY || 80;

  // Notes
  if (notes) {
    doc.setFont('Times', 'Bold');
    doc.setFontSize(10);
    doc.text('Notes:', 10, finalY + 8);

    doc.setFont('Times', 'Normal');
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(notes, 190), 15, finalY + 14);
  }

  doc.setFont('Times', 'Normal');
  doc.setFontSize(9);

  doc.text('__________________, MD', 10, 128);
  doc.text('License No: _______________', 165, 128);

  doc.setFontSize(8);
  doc.text('School Physician', 15, 132);

  doc.save(`${student.full_name || 'Student'}_Prescription.pdf`);
}

function calculateAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default generatePrescriptionPDF;

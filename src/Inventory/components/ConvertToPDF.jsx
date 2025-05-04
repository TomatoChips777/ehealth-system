// pdfExport.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = (title, columns, data, fileName = 'report.pdf') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Generate table
  doc.autoTable({
    head: [columns],
    body: data,
    startY: 25,
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [0, 128, 0], // green header
    },
  });

  // Save
  doc.save(fileName);
};

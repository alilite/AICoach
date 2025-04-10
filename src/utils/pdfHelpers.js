
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const parseStructuredPlan = (text) => {
  if (!text || typeof text !== 'string') return text;

  const lines = text.split('\n').filter(Boolean);
  const structured = [];
  let currentDay = '', currentDetails = [];

  for (const line of lines) {
    if (/^Day \d+|^Monday|^Tuesday|^Wednesday|^Thursday|^Friday|^Saturday|^Sunday/i.test(line)) {
      if (currentDay) structured.push({ day: currentDay, details: currentDetails.join('\n') });
      currentDay = line.trim();
      currentDetails = [];
    } else {
      currentDetails.push(line.trim());
    }
  }

  if (currentDay) structured.push({ day: currentDay, details: currentDetails.join('\n') });
  return structured.length > 0 ? structured : text;
};

export const generatePDF = (title, content, filename, userName = '', isStructured = false) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 10, 15);

  doc.setFontSize(10);
  const now = new Date().toLocaleString();
  if (userName) doc.text(`User: ${userName}`, 10, 22);
  doc.text(`Generated: ${now}`, 10, userName ? 28 : 22);

  if (isStructured && Array.isArray(content)) {
    autoTable(doc, {
      startY: userName ? 35 : 30,
      head: [['Day', 'Plan']],
      body: content.map((row) => [row.day, row.details]),
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'top',
      },
      theme: 'grid',
      headStyles: { fillColor: [33, 33, 33] },
      pageBreak: 'auto', 
    });
  } else {
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, userName ? 35 : 30);
  }

  doc.save(`${filename}.pdf`);
};

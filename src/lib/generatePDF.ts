import jsPDF from "jspdf";

export function generatePDF(data: {
  name: string;
  email: string;
  phone: string;
  position: string;
  description: string;
}) {
  const doc = new jsPDF();

  let y = 40;

  // Section function
  const addField = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(label, 20, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(value || "-", 60, y);
    y += 12;
  };

  // Fields
  addField("Name:", data.name);
  addField("Email:", data.email);
  addField("Phone:", data.phone);
  addField("Position:", data.position);

  // Description (inline with value)
  doc.setFont("helvetica", "bold");
  doc.text("Description:", 20, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(data.description || "-", 60, y, { maxWidth: 130 });
  y += 12;

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 280, 190, 280);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 287, {
    align: "center",
  });

  return doc;
}

import jsPDF from "jspdf";

export const generatePdf = (formData: any): Blob => {
  const doc = new jsPDF();
  doc.setFont("times", "");
  doc.setFontSize(12);
  const lineSpacing = 1.2;
  let y = 10;

  // Encabezado izquierdo
  doc.setFont("times", "bold");
  doc.text("POLICIA BOLIVIANA", 10, y); y += 6 * lineSpacing;
  doc.setFont("times", "normal");
  doc.text("DIRECCION DEPARTAMENTAL", 10, y); y += 6 * lineSpacing;
  doc.text("FUERZA ESPECIAL DE LUCHA CONTRA EL CRIMEN", 10, y); y += 6 * lineSpacing;
  doc.text("La Paz - Bolivia", 10, y);

  // Encabezado derecho (en blanco)
  y = 10;
  const rightX = 130;
  const addRightField = (label: string) => {
    doc.text(`${label} ${'.'.repeat(50)}`, rightX, y); y += 6 * lineSpacing;
  };
  addRightField("Caso N°:");
  addRightField("División:");
  addRightField("Dir. Dptal. de:");
  addRightField("Fecha:");

  y += 2;
  doc.setFont("times", "bold");
  doc.text("SOLICITUD DE INFORMACION", 105, y, { align: "center" });
  y += 8 * lineSpacing;

  doc.setFont("times", "normal");
  doc.text("El Jefe de la División: " + ".".repeat(80), 10, y); y += 6 * lineSpacing;
  doc.text("Se solicita al Sr. Jefe del CENTRO DE FUSION DE INFORMACION DE LA FELCC la información de:", 10, y); y += 6 * lineSpacing;

  const serviciosLabels = {
    segip: "SEGIP",
    sinarap: "SINARAP",
    itv: "ITV",
    impuestos: "IMPUESTOS",
  };
  const servicios = formData.servicios;
  const roman = ["I", "II", "III", "IV"];
  Object.entries(serviciosLabels).forEach(([key, label], index) => {
    const checkBoxX = 180;
    doc.text(`${roman[index]}. ${label.toUpperCase()} ${'.'.repeat(40)}`, 10, y);
    doc.rect(checkBoxX, y - 4, 4, 4);
    if (servicios[key]) {
      doc.text("X", checkBoxX + 1, y - 1);
    }
    y += 6 * lineSpacing;
  });

  y += 4;
  doc.text("De la(s) siguiente(s) persona(s) o /placa:", 10, y); y += 6 * lineSpacing;

  const tableTop = y;
  const tableLeft = 10;
  const colWidths = [120, 35, 35];
  const rowHeight = 8;
  const rows = 13;

  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const tableHeight = rowHeight * rows;
  doc.rect(tableLeft, tableTop, tableWidth, tableHeight);

  const headers = ["NOMBRE COMPLETO / PLACA", "C.I.", "F/N"];
  let colX = tableLeft;
  headers.forEach((header, i) => {
    doc.text(header, colX + 2, tableTop + 6);
    colX += colWidths[i];
  });

  colX = tableLeft;
  colWidths.forEach((width, i) => {
    if (i > 0) doc.line(colX, tableTop, colX, tableTop + tableHeight);
    colX += width;
  });

  for (let i = 1; i < rows; i++) {
    const rowY = tableTop + i * rowHeight;
    doc.line(tableLeft, rowY, tableLeft + tableWidth, rowY);
  }

  // Fill sujetos
  formData.sujetos.forEach((sujeto: any, i: number) => {
    const baseY = tableTop + (i + 2) * rowHeight - 1.5;
    let nombre = "";
    let ci = "";
    let fn = "";
    if (sujeto.tipo === "persona") {
      nombre = `${sujeto.nombres} ${sujeto.apellido_paterno} ${sujeto.apellido_materno}`;
      ci = sujeto.ci;
      fn = String(sujeto.fecha_nacimiento);
    } else {
      nombre = sujeto.placa;
    }
    doc.text(nombre, tableLeft + 2, baseY);
    doc.text(ci, tableLeft + colWidths[0] + 2, baseY);
    doc.text(fn, tableLeft + colWidths[0] + colWidths[1] + 2, baseY);
  });

  y = tableTop + tableHeight + 10;
  const dottedLine = (label: string, value: string = "") =>
    `${label} ${value}${'.'.repeat(90 - label.length - value.length)}`;

  doc.text(dottedLine("Los mismos que servirán para proseguir con las investigaciones en el caso No:", formData.caso_unidad), 10, y); y += 6 * lineSpacing;
  doc.text(dottedLine("Por el delito de:", formData.delito), 10, y);
  doc.text(dottedLine("A cargo del Sr.(a):", formData.investigador), 10, y += 6 * lineSpacing);
  y += 6 * lineSpacing;

  doc.text("Investigador(a) asignado(a) al presente caso", 10, y); y += 6 * lineSpacing;

  const date = new Date();
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
                  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const formattedDate = `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;

  doc.text(`La Paz, ${formattedDate}`, 150, y, { align: "right" });

  return doc.output("blob");
};

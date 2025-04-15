import jsPDF from "jspdf";

export const generatePdf = (formData: any): Blob => {
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(14);
  doc.text("Solicitud de Información", 105, y, { align: "center" });
  y += 10;

  doc.setFontSize(12);
  doc.text("Se solicita al Sr. Jefe del CENTRO DE FUSION DE INFORMACION DE LA FELCC la información de:", 10, y);
  y += 8;

  const servicios = formData.servicios;
  const serviciosLabels = {
    segip: "SEGIP",
    sinarap: "SINARAP",
    itv: "ITV",
    impuestos: "Impuestos",
  };

  Object.entries(serviciosLabels).forEach(([key, label], index) => {
    const check = servicios[key] ? "✔" : "✘";
    doc.text(`${label}: ${check}`, 10 + (index % 2) * 100, y);
    if (index % 2 === 1) y += 7;
  });

  y += 5;
  doc.setFontSize(12);
  doc.text("De las siguientes personas o placa:", 10, y);
  y += 7;

  formData.sujetos.forEach((sujeto: any, i: number) => {
    doc.setFontSize(11);
    doc.text(`Registro ${i + 1}: ${sujeto.tipo === "persona" ? "Persona" : "Vehículo"}`, 10, y);
    y += 6;

    if (sujeto.tipo === "persona") {
      doc.text(`Nombres: ${sujeto.nombres}`, 10, y); y += 6;
      doc.text(`Apellido Paterno: ${sujeto.apellido_paterno}`, 10, y); y += 6;
      doc.text(`Apellido Materno: ${sujeto.apellido_materno}`, 10, y); y += 6;
      doc.text(`CI: ${sujeto.ci}`, 10, y); y += 6;
      doc.text(`F/N: ${sujeto.fecha_nacimiento}`, 10, y); y += 8;
    } else {
      doc.text(`Placa: ${sujeto.placa}`, 10, y); y += 8;
    }
  });

  doc.setFontSize(12);
  doc.text(`Los mismos que servirán para proseguir con las investigaciones en el caso N°: ${formData.caso_unidad}`, 10, y);
  y += 10;

  doc.text(`Por el delito de: ${formData.delito}`, 10, y); y += 7;
  doc.text(`A cargo del Sr.(a): ${formData.investigador}`, 10, y);

  return doc.output("blob"); // return as Blob for preview
};

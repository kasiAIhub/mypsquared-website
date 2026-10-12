import fs from 'node:fs';
import { PDFDocument, PDFName, rgb, StandardFonts, degrees } from 'pdf-lib';
import { jsPDF } from 'jspdf';

const TEMPLATE = '/dev-server/src/assets/gde-dbe-form-template.pdf';
const OUT_DIR = '/mnt/documents';

// ── 1. APPLICATION FORM PREVIEW (nuclear AcroForm removal + watermark) ──
async function genApplicationPreview() {
  const templateBytes = fs.readFileSync(TEMPLATE);
  const pdfDoc = await PDFDocument.load(templateBytes);

  // Pre-flatten: count fields
  const formBefore = pdfDoc.getForm();
  const fieldCountBefore = formBefore.getFields().length;
  console.log(`[before] AcroForm fields: ${fieldCountBefore}`);

  // Method 1: clear + flatten
  try {
    const form = pdfDoc.getForm();
    form.getFields().forEach((field) => {
      try {
        if (typeof field.setText === 'function') field.setText('');
        if (typeof field.clear === 'function') field.clear();
        field.enableReadOnly();
      } catch {}
    });
    form.flatten();
  } catch (e) { console.log('M1 fail', e.message); }

  // Method 2: strip annotations
  pdfDoc.getPages().forEach((p) => { try { p.node.delete(PDFName.of('Annots')); } catch {} });

  // Method 3: delete AcroForm from catalog
  try { pdfDoc.catalog.delete(PDFName.of('AcroForm')); } catch (e) { console.log('M3 fail', e.message); }

  // Watermark
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  pdfDoc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText('SAMPLE — NOT FOR SUBMISSION', {
      x: width / 2 - 180, y: height / 2, size: 36, font,
      color: rgb(0.86, 0.15, 0.15), opacity: 0.3, rotate: degrees(45),
    });
  });

  const bytes = await pdfDoc.save();
  fs.writeFileSync(`${OUT_DIR}/dbe_application_preview.pdf`, bytes);

  // Verify on saved file
  const verifyDoc = await PDFDocument.load(bytes);
  const verifyForm = verifyDoc.getForm();
  const fieldCountAfter = verifyForm.getFields().length;
  const hasAcroForm = !!verifyDoc.catalog.get(PDFName.of('AcroForm'));
  console.log(`[after]  AcroForm fields: ${fieldCountAfter}, AcroForm key present: ${hasAcroForm}, pages: ${verifyDoc.getPageCount()}`);
  return { fieldCountBefore, fieldCountAfter, hasAcroForm, pages: verifyDoc.getPageCount() };
}

// ── 2. MOTIVATION LETTER PREVIEW (jsPDF + watermark on every page) ──
function genMotivationPreview() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  // Sample multi-page letter content
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
  doc.text('MOTIVATION FOR HOME EDUCATION', 105, 30, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
  const body = 'This is a sample motivation letter generated for preview verification. '.repeat(40);
  const lines = doc.splitTextToSize(body, 170);
  doc.text(lines, 20, 50);
  doc.addPage();
  doc.text(lines, 20, 30);
  doc.addPage();
  doc.text('Final page content for watermark verification.', 20, 30);

  // Apply watermark on every page (replica of generateMotivationLetterPDFPreview)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text('SAMPLE — NOT FOR SUBMISSION', 105, 148, { angle: 45, align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  }
  fs.writeFileSync(`${OUT_DIR}/dbe_motivation_preview.pdf`, Buffer.from(doc.output('arraybuffer')));
  return { pages: pageCount };
}

const r1 = await genApplicationPreview();
const r2 = genMotivationPreview();
console.log('\n=== RESULTS ===');
console.log('Application preview:', r1);
console.log('Motivation preview:', r2);

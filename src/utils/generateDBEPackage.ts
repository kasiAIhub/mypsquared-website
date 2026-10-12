import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import {
  generateApplicationFormPDF as _generateApplicationFormPDF,
  generateApplicationFormPDFPreview as _generateApplicationFormPDFPreview,
} from './generateApplicationFormPDF';
import { DBEFormData, provinceEmails } from '@/types/dbeRegistration';
import { toTitleCase, capitalizeSentences } from '@/utils/formatters';

function normalizeFormData(fd: DBEFormData): DBEFormData {
  return {
    ...fd,
    childFullName: toTitleCase(fd.childFullName || ''),
    parentFullName: toTitleCase(fd.parentFullName || ''),
    parentRelationship: toTitleCase(fd.parentRelationship || ''),
    parent2: fd.parent2
      ? { ...fd.parent2, fullName: toTitleCase(fd.parent2.fullName || '') }
      : fd.parent2,
    previousSchoolDetails: fd.previousSchoolDetails
      ? {
          ...fd.previousSchoolDetails,
          schoolName: toTitleCase(fd.previousSchoolDetails.schoolName || ''),
        }
      : fd.previousSchoolDetails,
    address: fd.address
      ? {
          ...fd.address,
          street: toTitleCase(fd.address.street || ''),
          city: toTitleCase(fd.address.city || ''),
          suburb: toTitleCase(fd.address.suburb || ''),
        }
      : fd.address,
    circumstanceNarrative: capitalizeSentences(fd.circumstanceNarrative || ''),
    childLearnerProfile: capitalizeSentences(fd.childLearnerProfile || ''),
    childNeeds: capitalizeSentences(fd.childNeeds || ''),
    parentBackground: capitalizeSentences(fd.parentBackground || ''),
    schoolIncident: capitalizeSentences(fd.schoolIncident || ''),
    educationVision: capitalizeSentences(fd.educationVision || ''),
  };
}


// ─── Shared helpers ──────────────────────────────────────────────────
function getFooterText(fd: DBEFormData, pageNum: number, totalPages: number) {
  const ref = fd.referenceNumber || '—';
  return `Prepared with P-Squared | mypsquared.com | Ref: ${ref} | Page ${pageNum} of ${totalPages} | Review all details before signing.`;
}

function addFooter(doc: jsPDF, fd: DBEFormData) {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text(getFooterText(fd, i, totalPages), 105, 287, { align: 'center', maxWidth: 180 });
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  }
}

function drawCheckbox(doc: jsPDF, x: number, y: number, checked: boolean) {
  doc.setLineWidth(0.2);
  doc.rect(x, y, 4, 4);
  if (checked) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('X', x + 0.8, y + 3.2);
    doc.setFont('helvetica', 'normal');
  }
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text || '', maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function extractNames(fullName: string) {
  const parts = (fullName || '').trim().split(/\s+/);
  const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0] || '';
  const firstNames = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || '';
  const initials = parts.map(p => p.charAt(0).toUpperCase()).join('');
  return { firstNames, surname, initials };
}

// ─── Pixel-replica DBE form helpers ──────────────────────────────────
function drawPageHeader(doc: jsPDF) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('• This Application Form is not for sale.', 15, 12);
  doc.text('• It is the sole use for Applicant Parent only.', 15, 17);
  doc.text('• There are no charges levied for registration.', 15, 22);
}

function drawSectionHeader(doc: jsPDF, text: string, y: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(text, 15, y);
  doc.setLineWidth(0.3);
  doc.line(15, y + 1.5, 195, y + 1.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
}

function drawField(doc: jsPDF, label: string, value: string, x: number, y: number, labelWidth: number, valueWidth: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(label, x, y);
  doc.setFont('helvetica', 'normal');
  doc.text(value || '', x + labelWidth + 1, y);
  doc.setLineWidth(0.2);
  doc.line(x + labelWidth, y + 1, x + labelWidth + valueWidth, y + 1);
}

// ─── DOCUMENT 1: DBE APPLICATION FORM (pixel replica of GDE form) ───
function generateApplicationForm(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const email = provinceEmails[fd.province] || '';
  const { firstNames, surname, initials } = extractNames(fd.parentFullName);
  const childNames = extractNames(fd.childFullName);

  // ── PAGE 1: Cover / General Information ────────────────────────────
  drawPageHeader(doc);
  let y = 32;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize('APPLICATION FOR THE REGISTRATION OF LEARNERS FOR HOME EDUCATION', 175);
  doc.text(titleLines, 105, y, { align: 'center' });
  y += titleLines.length * 6 + 4;

  doc.setFontSize(11);
  doc.text('General Information', 15, y); y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('1. This application form must be completed in full by the parents/ guardian of a learner.', 15, y); y += 6;
  y = addWrappedText(doc, '2. A separate form must be completed for each learner, accompanied by the following required documents:', 15, y, 180, 5); y += 2;

  doc.setFont('helvetica', 'bold');
  doc.text('Please note: all certified copies must not be older than 3 months', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');

  const reqs = [
    "Certified copy of the learner's birth certificate",
    "Certified copy of the learner's last school report signed by the principal (if applicable)",
    "Certified copy of the parent's ID",
    'In case of foreign nationals certified copies of passport /study permit/work permit/ Asylum document is required.',
    'Certified copy of the transfer certificate from previous school (if Applicable)',
    'In case of a learner with special needs, attach certified copy of assessment document or Referral letter from the medical practitioner.',
    'Motivation why the parent wishes the learner to be educated at home.',
    'A copy of proof of residence',
    'Where the learner is in alternative care, the relevant court order granting guardianship or custody is required',
    'Full details of the educational programme (subjects, teaching hours per subjects, assessment, extra mural activities, excursions, library, programme use of tutor).',
  ];
  doc.setFontSize(8);
  reqs.forEach(req => {
    drawCheckbox(doc, 18, y - 3, false);
    const lines = doc.splitTextToSize(req, 168);
    doc.text(lines, 25, y);
    y += Math.max(5.5, lines.length * 4);
  });

  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Instructions on how to complete this form:', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const instructions = [
    'Complete the form by ticking check box and Write in the text box where applicable',
    'Select relevant option from given options in a dropdown-list',
    `Submit the form with the required documents to: ${email}`,
  ];
  instructions.forEach(line => {
    drawCheckbox(doc, 18, y - 3, false);
    const lines = doc.splitTextToSize(line, 168);
    doc.text(lines, 25, y);
    y += Math.max(5.5, lines.length * 4);
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Year: ${fd.applicationYear}`, 185, y, { align: 'right' });
  y += 8;

  // Note box
  doc.setLineWidth(0.3);
  const noteY = y;
  doc.rect(15, noteY, 180, 22);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Note: Submission of the application form does not imply that the learner is registered with', 18, noteY + 5);
  doc.text('Provincial Department of Education.', 18, noteY + 9);
  doc.text('• The official will contact you for verification and the registration process will follow.', 18, noteY + 15);

  // ── PAGE 2: Learner + School + Grade ───────────────────────────────
  doc.addPage();
  drawPageHeader(doc);
  y = 32;

  drawSectionHeader(doc, '1. Learner Details', y);
  y += 8;

  // Field rows
  drawField(doc, '1.1 Full Names: (As on birth certificate)', childNames.firstNames, 15, y, 78, 102); y += 8;
  drawField(doc, '1.2 Surname:', childNames.surname, 15, y, 28, 152); y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('1.3 South African Citizen: (Choose appropriate choice)', 15, y);
  drawCheckbox(doc, 110, y - 3, true);
  doc.setFont('helvetica', 'normal');
  doc.text('Yes', 116, y);
  drawCheckbox(doc, 130, y - 3, false);
  doc.text('No', 136, y);
  y += 8;

  drawField(doc, '1.4 South African Identification Number:', fd.childIdNumber || '', 15, y, 78, 102); y += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('1.5 Gender: (Tick Appropriate box)', 15, y);
  const isMale = fd.childGender === 'Male';
  drawCheckbox(doc, 78, y - 3, isMale);
  doc.setFont('helvetica', 'normal');
  doc.text('Male', 84, y);
  drawCheckbox(doc, 100, y - 3, !isMale && !!fd.childGender);
  doc.text('Female', 106, y);
  doc.setFont('helvetica', 'bold');
  doc.text('1.6 Date of Birth (yyyy-mm-dd):', 125, y);
  doc.setFont('helvetica', 'normal');
  doc.text(fd.childDOB || '', 175, y);
  doc.setLineWidth(0.2);
  doc.line(173, y + 1, 195, y + 1);
  y += 8;

  drawField(doc, '1.7 Passport Number: (if applicable)', 'N/A', 15, y, 70, 30); 
  drawField(doc, '1.8 Country of Origin:', 'South Africa', 120, y, 32, 43); y += 8;

  drawField(doc, '1.9 Population Group:', fd.childPopulationGroup || '', 15, y, 38, 75);
  doc.setFont('helvetica', 'bold');
  doc.text('Other:', 138, y);
  doc.line(150, y + 1, 195, y + 1);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('1.10 Type of Disability: (tick appropriate box: If applicable)', 15, y); y += 5;
  doc.setFont('helvetica', 'italic');
  doc.text('Please Attach Proof of Disability', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');

  const disabilityRows: [string, string, string][] = [
    ['Epilepsy', 'Partial Sighted/Low vision', 'Physical Disability'],
    ['Blindness', 'Attention Deficit Disorder', 'Autistic Spectrum Disorder'],
    ['Deafness', 'Severe Intellectual Disability', 'Behavioural disorder'],
    ['Hard of Hearing', 'Mild to Moderate Intellectual disability', 'Specific learning disability'],
    ['Cerebral Palsy', 'Severe to profound intellectual disability', 'Other'],
  ];
  const isTicked = (label: string) =>
    fd.disabilities.some(d => d.toLowerCase().includes(label.toLowerCase().substring(0, 8)));

  disabilityRows.forEach(row => {
    row.forEach((label, col) => {
      const x = 15 + col * 62;
      drawCheckbox(doc, x, y, isTicked(label));
      const wrapped = doc.splitTextToSize(label, 55);
      doc.text(wrapped, x + 6, y + 3);
    });
    y += 8;
  });

  doc.text(`If learner suffers from Other disability please Specify: ${fd.disabilityOther || '_______________'}`, 15, y); y += 7;

  const assessed = fd.disabilities.length > 0 && !fd.disabilities.every(d => d === 'No diagnosed conditions');
  drawField(doc, '1.11 Assessed by registered professional practitioner:', assessed ? 'Yes' : 'No', 15, y, 95, 80); y += 10;

  drawSectionHeader(doc, '2. Last School Attended', y); y += 8;
  const neverEnrolled = fd.previousSchool === 'Never been enrolled';
  const prev = fd.previousSchoolDetails;
  drawField(doc, '2.1 Province of last school attended (if applicable):', neverEnrolled ? 'Not applicable' : prev.province, 15, y, 95, 85); y += 7;
  drawField(doc, '2.2 Name of previous school attended (if applicable):', neverEnrolled ? 'Not applicable' : prev.schoolName, 15, y, 95, 85); y += 7;
  drawField(doc, '2.3 Grade completed (if applicable):', neverEnrolled ? 'Not applicable' : prev.gradeCompleted, 15, y, 70, 110); y += 7;
  drawField(doc, '2.4 Physical address of the school (if applicable):', neverEnrolled ? 'Not applicable' : prev.physicalAddress, 15, y, 90, 90); y += 7;
  drawField(doc, '2.5 Contact No. of last school attended (if applicable):', neverEnrolled ? 'Not applicable' : prev.contactNumber, 15, y, 95, 85); y += 10;

  drawSectionHeader(doc, '3. Home Education Grade Registering', y); y += 8;
  drawField(doc, '3.1 Grade for which application is being made:', fd.gradeApplying, 15, y, 90, 90); y += 7;
  drawField(doc, '3.2 Curriculum to be used:', fd.chosenCurriculum, 15, y, 55, 125); y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('3.3 Subjects Offered (List all subjects, Separated by comma):', 15, y); y += 5;
  doc.setFont('helvetica', 'normal');
  y = addWrappedText(doc, fd.subjects.join(', ') || '—', 15, y, 180, 4.5); y += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('3.4 Reasons for choosing home education (Mark Appropriate)', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');

  const reasonMap: Record<string, string> = {
    'Family relocation': 'Distance to school',
    'Learning needs not being met': 'Children With Special needs',
    'Learning difference or special need': 'Children With Special needs',
    'Nomadic or travelling lifestyle': 'Nomadic lifestyles',
    'Safety or bullying concerns': 'Dissatisfaction with public school',
    'Dissatisfaction with school quality': 'Dissatisfaction with public school',
    'Religious convictions': 'Religious Convictions',
    'Financial circumstances changed': 'Financial Consideration',
    'Lack of admission to suitable school': 'Lack of Admission to public ordinary Schools',
  };
  const tickedReasons = new Set<string>();
  fd.circumstanceTriggers.forEach(t => { const m = reasonMap[t]; if (m) tickedReasons.add(m); });

  const reasonRows: string[][] = [
    ['Distance to school', 'Children With Special needs', 'Nomadic lifestyles'],
    ['Dissatisfaction with public school', 'Religious Convictions', 'Financial Consideration'],
    ['Lack of Admission to public ordinary Schools', '', ''],
  ];
  reasonRows.forEach(row => {
    row.forEach((label, col) => {
      if (!label) return;
      const x = 15 + col * 62;
      drawCheckbox(doc, x, y, tickedReasons.has(label));
      const wrapped = doc.splitTextToSize(label, 55);
      doc.text(wrapped, x + 6, y + 3);
    });
    y += 8;
  });
  doc.text(`If Other Specify: ${fd.circumstanceOther || '_______________'}`, 15, y);

  // ── PAGE 3: Parent 1 ───────────────────────────────────────────────
  doc.addPage();
  drawPageHeader(doc);
  y = 32;
  drawSectionHeader(doc, '4. Parent 1 / Legal Guardian Details', y); y += 8;

  drawField(doc, '4.1 Title:', fd.parentTitle, 15, y, 18, 30);
  drawField(doc, '4.2 First Names:', firstNames, 70, y, 32, 93); y += 7;
  drawField(doc, '4.3 Surname:', surname, 15, y, 28, 152); y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('4.4 South African Citizen:', 15, y);
  drawCheckbox(doc, 78, y - 3, true);
  doc.setFont('helvetica', 'normal');
  doc.text('Yes', 84, y);
  drawCheckbox(doc, 102, y - 3, false);
  doc.text('No', 108, y); y += 7;

  drawField(doc, '4.5 SA ID Number:', fd.parentIdNumber || '', 15, y, 38, 142); y += 7;
  drawField(doc, '4.6 Passport Number (if applicable):', 'N/A', 15, y, 65, 115); y += 7;
  drawField(doc, '4.7 Country of Origin:', 'South Africa', 15, y, 42, 138); y += 7;
  drawField(doc, '4.8 Population Group:', '', 15, y, 42, 138); y += 7;
  drawField(doc, '4.9 Highest Qualification Obtained:', fd.parentQualification, 15, y, 70, 110); y += 9;

  doc.setFont('helvetica', 'bold');
  doc.text('4.10 Employment Status: (Please tick appropriate box)', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  ['Employed', 'Self-employed', 'Unemployed', 'Other'].forEach((opt, i) => {
    const x = 15 + i * 45;
    drawCheckbox(doc, x, y - 3, fd.parentEmployment === opt);
    doc.text(opt, x + 6, y);
  });
  y += 9;

  doc.setFont('helvetica', 'bold');
  doc.text('4.11 Marital Status: (Please tick appropriate box)', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  ['Single', 'Married', 'Divorced', 'Widowed'].forEach((opt, i) => {
    const x = 15 + i * 44;
    drawCheckbox(doc, x, y - 3, !!fd.parentMaritalStatus && fd.parentMaritalStatus.includes(opt));
    doc.text(opt, x + 6, y);
  });
  y += 9;

  doc.setFont('helvetica', 'bold');
  doc.text('4.12 Lives with the Learner:', 15, y);
  drawCheckbox(doc, 75, y - 3, true);
  doc.setFont('helvetica', 'normal');
  doc.text('Yes', 81, y);
  drawCheckbox(doc, 100, y - 3, false);
  doc.text('No', 106, y); y += 7;

  drawField(doc, '4.13 Relationship With Learner:', fd.parentRelationship, 15, y, 70, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('Other Specify:', 150, y);
  doc.setLineWidth(0.2);
  doc.line(175, y + 1, 195, y + 1);
  doc.setFont('helvetica', 'normal');
  y += 7;

  drawField(doc, '4.14 Telephone Number:', fd.parentPhone, 15, y, 50, 60);
  drawField(doc, '4.15 Cell Number:', fd.parentPhone, 130, y, 30, 35); y += 7;
  drawField(doc, '4.16 Email Address:', fd.parentEmail, 15, y, 38, 142); y += 9;

  doc.setFont('helvetica', 'bold');
  doc.text('4.17 Residential Address:', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  drawField(doc, 'Street:', fd.address.street, 15, y, 16, 70);
  drawField(doc, 'House No.:', '', 105, y, 22, 25);
  drawField(doc, 'Farm:', '', 158, y, 12, 25); y += 7;
  drawField(doc, 'Complex/ Building:', '', 15, y, 38, 75);
  drawField(doc, 'Area Code:', fd.address.postalCode, 100, y, 22, 25);
  drawField(doc, 'Town:', fd.address.city, 152, y, 14, 28);

  // ── PAGE 4: Parent 2 ───────────────────────────────────────────────
  doc.addPage();
  drawPageHeader(doc);
  y = 32;
  drawSectionHeader(doc, '5. Parent 2 / Legal Guardian Details', y); y += 10;

  if (fd.soleParent || !fd.parent2.fullName) {
    doc.setFont('helvetica', 'italic');
    doc.text('Not applicable — sole parent / guardian declared.', 15, y);
    doc.setFont('helvetica', 'normal');
  } else {
    const p2 = fd.parent2;
    const p2Names = extractNames(p2.fullName);
    drawField(doc, '5.1 Title:', p2.title, 15, y, 18, 30);
    drawField(doc, '5.2 First Names:', p2Names.firstNames, 70, y, 32, 93); y += 7;
    drawField(doc, '5.3 Surname:', p2Names.surname, 15, y, 28, 152); y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('5.4 South African Citizen:', 15, y);
    drawCheckbox(doc, 78, y - 3, true);
    doc.setFont('helvetica', 'normal');
    doc.text('Yes', 84, y); y += 7;
    drawField(doc, '5.5 SA ID Number:', p2.idNumber, 15, y, 38, 142); y += 7;
    drawField(doc, '5.6 Passport Number:', 'N/A', 15, y, 42, 138); y += 7;
    drawField(doc, '5.7 Country of Origin:', 'South Africa', 15, y, 42, 138); y += 7;
    drawField(doc, '5.8 Population Group:', '', 15, y, 42, 138); y += 7;
    drawField(doc, '5.9 Highest Qualification:', p2.qualification, 15, y, 55, 125); y += 9;
    doc.setFont('helvetica', 'bold');
    doc.text('5.10 Employment Status:', 15, y); y += 6;
    doc.setFont('helvetica', 'normal');
    ['Employed', 'Self-employed', 'Unemployed', 'Other'].forEach((opt, i) => {
      const x = 15 + i * 45;
      drawCheckbox(doc, x, y - 3, p2.employment === opt);
      doc.text(opt, x + 6, y);
    });
    y += 9;
    drawField(doc, '5.13 Relationship With Learner:', p2.relationship, 15, y, 70, 110); y += 7;
    drawField(doc, '5.14 Telephone:', p2.phone, 15, y, 32, 60);
    drawField(doc, '5.15 Cell:', p2.phone, 110, y, 16, 70); y += 7;
    drawField(doc, '5.16 Email Address:', p2.email, 15, y, 38, 142); y += 9;
    doc.setFont('helvetica', 'bold');
    doc.text('5.17 Residential Address:', 15, y); y += 6;
    doc.setFont('helvetica', 'normal');
    drawField(doc, 'Street:', '', 15, y, 16, 70);
    drawField(doc, 'House No.:', '', 105, y, 22, 25);
    drawField(doc, 'Farm:', '', 158, y, 12, 25); y += 7;
    drawField(doc, 'Complex/ Building:', '', 15, y, 38, 75);
    drawField(doc, 'Area Code:', '', 100, y, 22, 25);
    drawField(doc, 'Town:', '', 152, y, 14, 28);
  }

  // ── PAGE 5: Declaration + Office Use ───────────────────────────────
  doc.addPage();
  drawPageHeader(doc);
  y = 32;
  drawSectionHeader(doc, '6. Declaration By Parent Or Guardian', y); y += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const decl = "I/We hereby declare that I have read and understood the BELA Act 32 of 2024, Section 35 read together with the Policy on Home Education published on the Gazette No. 42037 of November 2018. I further declare that I have supplied correct information and undertake to do the following:";
  y = addWrappedText(doc, decl, 15, y, 180, 4.5); y += 4;

  const items = [
    '(a) Accept full responsibility for the implementation of home education for my child',
    "(b) Make suitable education resources available to support my learner's learning;",
    '(c) Monitor his/her academic progress;',
    "(d) Arrange for the learner's educational attainment to be assessed by a competent assessor at the end of each phase up to the year in which the learner reaches the age 15 years or completes grade 9.",
    "(e) Submit to the Head of Department, the assessment report signed by the competent assessor as evidence of the learner's educational attainment at the end of each phase.",
  ];
  items.forEach(it => { y = addWrappedText(doc, it, 15, y, 180, 4.5); y += 3; });
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Initials and Surname of the Parent 1 / Guardian', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`${initials} ${surname}`, 15, y);
  doc.setLineWidth(0.2);
  doc.line(15, y + 1, 100, y + 1);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 110, y);
  doc.setFont('helvetica', 'normal');
  doc.line(122, y + 1, 165, y + 1);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('Initials and Surname of the Parent 2', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  doc.line(15, y + 1, 100, y + 1);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 110, y);
  doc.setFont('helvetica', 'normal');
  doc.line(122, y + 1, 165, y + 1);
  y += 14;

  drawSectionHeader(doc, '7. OFFICE USE ONLY', y); y += 8;

  const officeCells = [
    '7.1 Received By:',
    '7.2 Verification Conducted By:',
    '7.3 Application Status:',
    '7.4 Reason for not Accepting:',
    '7.5 Certificate issued:',
  ];
  const cellWidth = 36;
  const cellHeight = 28;
  doc.setFontSize(8);
  doc.setLineWidth(0.3);
  officeCells.forEach((label, i) => {
    const x = 15 + i * cellWidth;
    doc.rect(x, y, cellWidth, cellHeight);
    doc.setFont('helvetica', 'bold');
    const lines = doc.splitTextToSize(label, cellWidth - 4);
    doc.text(lines, x + 2, y + 5);
    doc.setFont('helvetica', 'normal');
  });

  addFooter(doc, fd);
  return doc;
}

// ─── DOCUMENT 2: MOTIVATION LETTER ──────────────────────────────────
function generateMotivationLetter(fd: DBEFormData, aiLetter?: string): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 25;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // If AI-generated letter provided, render it as-is in prose form
  if (aiLetter && aiLetter.trim().length > 50) {
    // Aggressively normalise AI output. Some models return prose where the
    // "spaces" between words are non-breaking / em / en / narrow-no-break /
    // zero-width characters. jsPDF treats those as part of the word, so whole
    // phrases become one un-breakable token and render as bizarrely-spaced,
    // letter-by-letter lines. Replace every Unicode whitespace variant with a
    // plain ASCII space and strip zero-width chars before wrapping.
    const normalized = aiLetter
      .replace(/\r\n?/g, '\n')
      .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
      .replace(/[^\S\n]+/g, ' ')
      .split('\n')
      .map((l) => l.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');

    const paragraphs = normalized.split(/\n\n+/);
    const PAGE_BOTTOM = 268; // keep clear of footer at y=287
    const lineHeight = 5;
    paragraphs.forEach((para) => {
      const trimmed = para.trim();
      if (!trimmed) return;
      const lines = doc.splitTextToSize(trimmed, 170);
      const blockHeight = lines.length * lineHeight;
      if (y + blockHeight > PAGE_BOTTOM) {
        doc.addPage();
        y = 25;
      }
      doc.text(lines, 20, y);
      y += blockHeight + 3;
    });
    addFooter(doc, fd);
    return doc;
  }

  // Fallback: red warning + structured prose letter
  const ref = fd.referenceNumber || '—';
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(1);
  doc.rect(15, 15, 180, 30);
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠ DRAFT — ENHANCED VERSION COMING WITHIN 24 HOURS', 105, 25, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    'P-Squared will send a professionally written version via WhatsApp within 24 hours. Ref: ' + ref,
    105, 35, { align: 'center', maxWidth: 170 },
  );
  doc.text('WhatsApp: +27 81 890 5861', 105, 42, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  y = 55;

  const cap = (s: string) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1).trim();
  };
  const childFullName = toTitleCase(fd.childFullName || '');
  const childFirst = childFullName.split(' ')[0] || '';
  const parentTitled = toTitleCase(fd.parentFullName || '');
  const isMale = fd.childGender === 'Male';
  const heCap = isMale ? 'He' : 'She';
  const him = isMale ? 'him' : 'her';
  const hisHer = isMale ? 'his' : 'her';
  const addr = fd.address || ({} as DBEFormData['address']);
  const circumstances = cap(fd.circumstanceNarrative || '');
  const childProfile = cap(fd.childLearnerProfile || '');
  const parentBg = cap(fd.parentBackground || '');
  const vision = cap(fd.educationVision || '');

  // Sender address block
  doc.text(parentTitled, 20, y); y += 5;
  doc.text(`${addr.street || ''}, ${addr.suburb || ''}`, 20, y); y += 5;
  doc.text(`${addr.city || ''}, ${addr.postalCode || ''}`, 20, y); y += 8;
  doc.text(
    new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }),
    20, y,
  ); y += 10;

  doc.text('To: The Head of Department', 20, y); y += 5;
  doc.text(`${fd.province} Department of Basic Education`, 20, y); y += 10;

  doc.text('Dear Sir/Madam,', 20, y); y += 8;

  doc.setFont('helvetica', 'bold');
  y = addWrappedText(
    doc,
    `Re: Application for Home Education Registration — ${childFullName}, ${fd.gradeApplying}, ${fd.applicationYear}`,
    20, y, 170, 5,
  );
  y += 5;
  doc.setFont('helvetica', 'normal');

  const writePara = (text: string) => {
    if (!text) return;
    if (y > 265) { doc.addPage(); y = 25; }
    y = addWrappedText(doc, text, 20, y, 170, 5);
    y += 5;
  };

  writePara(
    `I, ${parentTitled}, ${fd.parentRelationship || 'parent'} of ${childFullName}, am writing to formally apply for home education registration for ${fd.applicationYear}, pursuant to Section 51 of the South African Schools Act and the Policy on Home Education (2018).`,
  );

  if (circumstances) {
    writePara(
      `This application follows a period of careful consideration. ${circumstances} We have determined that a home-based learning environment will best serve ${childFirst}'s educational interests and allow ${him} to thrive academically and personally.`,
    );
  }

  let learnerPara = `${childFirst} is a ${fd.gradeApplying} learner who ${childProfile || 'shows steady commitment to learning'}.`;
  if (fd.reportAverage) {
    learnerPara += ` ${heCap} has demonstrated strong academic capability, achieving an average of ${fd.reportAverage}%.`;
  }
  writePara(learnerPara);

  let progPara = `Our educational programme will follow the ${fd.chosenCurriculum} curriculum, covering ${(fd.subjects || []).join(', ')}. Learning will take place for ${fd.dailyHours} daily, five days per week.`;
  if (fd.extramurals && fd.extramurals.length > 0) {
    progPara += ` ${childFirst}'s programme will also include ${fd.extramurals.join(', ')} to ensure balanced development.`;
  }
  writePara(progPara);

  writePara(
    `I hold a ${fd.parentQualification || 'relevant qualification'}${parentBg ? ` and ${parentBg}` : ''}.`,
  );

  writePara(
    `I commit to maintaining comprehensive records, providing curriculum-aligned instruction, and cooperating fully with the Department of Education. I further commit to arranging assessment by a competent assessor at the end of each phase.`,
  );

  if (vision) {
    writePara(`My vision for ${childFirst}'s education is as follows: ${vision}`);
  }

  writePara(
    `I respectfully request that this application be approved. I am available at ${fd.parentPhone || ''} or ${fd.parentEmail || ''} to provide any further information required.`,
  );

  if (y > 250) { doc.addPage(); y = 25; }
  doc.text('Yours sincerely,', 20, y); y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(parentTitled, 20, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(fd.parentPhone || '', 20, y); y += 5;
  doc.text(fd.parentEmail || '', 20, y); y += 12;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  const note = 'This motivation letter was generated from your application answers. P-Squared will review and enhance this letter within 24 hours of payment. The final version will be sent to you via WhatsApp.';
  addWrappedText(doc, note, 20, y, 170, 4);
  doc.setTextColor(0, 0, 0);

  addFooter(doc, fd);
  return doc;
}

// ─── DOCUMENT 3: EDUCATIONAL PROGRAMME ──────────────────────────────
function generateEducationalProgramme(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 25;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPREHENSIVE EDUCATIONAL PLAN', 105, y, { align: 'center' }); y += 8;
  doc.setFontSize(11);
  doc.text(`${fd.childFullName} — ${fd.gradeApplying}, ${fd.applicationYear} Academic Year`, 105, y, { align: 'center' }); y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Parent/Educator: ${fd.parentFullName}`, 20, y); y += 5;
  doc.text(`Curriculum: ${fd.chosenCurriculum}`, 20, y); y += 10;

  // Section 1: Daily Schedule
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Section 1: Daily Schedule', 20, y); y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Weekly Schedule: Monday – Friday', 20, y); y += 5;
  doc.text(`Daily learning: ${fd.dailyHours} hours`, 20, y); y += 5;
  doc.text(`Days per week: ${fd.weeklyDays}`, 20, y); y += 8;

  const schedule = [
    ['Time', 'Activity'],
    ['8:00–8:30', 'Morning Routine and Review'],
    ['8:30–10:00', 'English Home Language'],
    ['10:00–10:15', 'Break'],
    ['10:15–12:00', 'Mathematics'],
    ['12:00–12:45', 'Lunch'],
    ['12:45–1:30', 'Science / Social Sciences'],
    ['1:30–2:00', 'Life Skills / Enrichment'],
  ];

  schedule.forEach(([time, activity], i) => {
    const font = i === 0 ? 'bold' : 'normal';
    doc.setFont('helvetica', font);
    doc.text(time, 22, y);
    doc.text(activity, 60, y);
    y += 6;
  });
  doc.setFont('helvetica', 'normal');
  y += 6;

  // Section 2: Subject Breakdown — proper percentage allocation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Section 2: Subject Breakdown', 20, y); y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const dailyHoursMap: Record<string, number> = { '1-2': 1.5, '3-4': 3.5, '4-6': 5, 'flexible': 3.5 };
  const weeklyDaysMap: Record<string, number> = { '3 days': 3, '4 days': 4, '5 days': 5, 'Flexible': 5 };
  const dailyH = dailyHoursMap[fd.dailyHours] || 3.5;
  const weeklyDays = weeklyDaysMap[fd.weeklyDays] || 5;
  const weeklyHours = dailyH * weeklyDays;

  const standardAlloc: Record<string, number> = {
    'English': 0.25, 'Mathematics': 0.25, 'Natural Sciences': 0.13,
    'Social Sciences': 0.13, 'Life Skills': 0.12,
  };

  const subjectHours: Array<[string, number]> = [];
  let allocatedPct = 0;
  const standardSubjects: string[] = [];
  const extraSubjects: string[] = [];
  fd.subjects.forEach(s => {
    const matchKey = Object.keys(standardAlloc).find(k => s.toLowerCase().includes(k.toLowerCase()));
    if (matchKey) {
      standardSubjects.push(s);
      allocatedPct += standardAlloc[matchKey];
      subjectHours.push([s, +(weeklyHours * standardAlloc[matchKey]).toFixed(1)]);
    } else {
      extraSubjects.push(s);
    }
  });
  const remainingPct = Math.max(0, 1 - allocatedPct);
  const perExtra = extraSubjects.length > 0 ? remainingPct / extraSubjects.length : 0;
  extraSubjects.forEach(s => subjectHours.push([s, +(weeklyHours * perExtra).toFixed(1)]));

  subjectHours.forEach(([subject, hrs]) => {
    if (y > 265) { doc.addPage(); y = 25; }
    doc.setFont('helvetica', 'bold');
    doc.text(`${subject}`, 22, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${hrs} hours/week`, 120, y);
    y += 6;
  });
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: ${weeklyHours} hours/week`, 22, y); y += 8;
  doc.setFont('helvetica', 'normal');

  // Extramurals
  if (fd.extramurals && fd.extramurals.length > 0) {
    if (y > 250) { doc.addPage(); y = 25; }
    doc.setFont('helvetica', 'bold');
    doc.text('Extramural and Enrichment Activities:', 22, y); y += 6;
    doc.setFont('helvetica', 'normal');
    const extraText = fd.extramurals.join(', ')
      + (fd.extramuralsSport ? ` (Sport: ${fd.extramuralsSport})` : '')
      + (fd.extramuralsLanguage ? ` (Languages: ${fd.extramuralsLanguage})` : '')
      + (fd.extramuralsOther ? ` (Other: ${fd.extramuralsOther})` : '');
    y = addWrappedText(doc, extraText, 22, y, 165, 5);
  }
  y += 6;

  // Section 3: Assessment Strategy
  if (y > 230) { doc.addPage(); y = 25; }
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Section 3: Assessment Strategy', 20, y); y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const assessments = [
    'Weekly: Quizzes, daily observation, progress tracking',
    'Monthly: Portfolio reviews, projects',
    'Quarterly: Formal examinations, progress reports',
    `End of Phase: Independent competent assessor (${fd.assessorCommitment})`,
  ];
  assessments.forEach(a => { doc.text(a, 22, y); y += 6; });
  y += 6;

  // Section 4: Resources
  if (y > 240) { doc.addPage(); y = 25; }
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Section 4: Resources', 20, y); y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  fd.learningResources.forEach(r => { doc.text(`• ${r}`, 22, y); y += 5; });
  doc.text(`• ${fd.chosenCurriculum} materials`, 22, y); y += 5;
  if (fd.usesTutor === 'Yes') {
    doc.text('• Tutor support for selected subjects', 22, y); y += 5;
  }
  y += 6;

  // Section 5: Learning Environment
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Section 5: Learning Environment', 20, y); y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(fd.learningSpace || '', 22, y); y += 10;

  // Section 6: Parental Commitment
  if (y > 220) { doc.addPage(); y = 25; }
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Section 6: Parental Commitment', 20, y); y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text(`I, ${fd.parentFullName}, commit to:`, 22, y); y += 7;
  const commitments = [
    'Maintain comprehensive records',
    'Provide CAPS-aligned instruction',
    `Ensure ${fd.dailyHours} hours daily instruction`,
    'Conduct thorough assessments',
    'Submit required reports to DBE',
    'Ensure smooth transitions if returning to formal schooling',
  ];
  commitments.forEach(c => { doc.text(`• ${c}`, 24, y); y += 5.5; });

  addFooter(doc, fd);
  return doc;
}

// ─── DOCUMENT 4: WEEKLY TIMETABLE ───────────────────────────────────
function generateWeeklyTimetable(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  let y = 20;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Weekly Timetable — ${fd.childFullName}, ${fd.gradeApplying}`, 148, y, { align: 'center' }); y += 10;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['8:00–8:30', '8:30–9:30', '9:30–10:00', '10:00–10:15', '10:15–11:15', '11:15–12:00', '12:00–12:45', '12:45–1:30', '1:30–2:00'];
  const subjects = fd.subjects.length > 0 ? fd.subjects : ['English', 'Mathematics', 'Science', 'Life Skills'];

  // Distribute subjects across slots
  const slotActivities = [
    'Morning Review',
    subjects[0] || 'English Home Language',
    subjects[1] || 'Mathematics',
    'BREAK',
    subjects[2] || 'Natural Sciences',
    subjects[3] || 'Social Sciences',
    'LUNCH',
    subjects[Math.min(4, subjects.length - 1)] || 'Life Skills',
    'Enrichment / Creative Arts',
  ];

  const colW = 45;
  const timeColW = 28;
  const rowH = 8;

  // Header row
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(16, 185, 129);
  doc.rect(20, y, timeColW, rowH, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Time', 22, y + 5.5);

  days.forEach((day, i) => {
    doc.setFillColor(16, 185, 129);
    doc.rect(20 + timeColW + i * colW, y, colW, rowH, 'F');
    doc.text(day, 22 + timeColW + i * colW, y + 5.5);
  });
  doc.setTextColor(0, 0, 0);
  y += rowH;

  // Data rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  timeSlots.forEach((slot, si) => {
    const isBreak = slotActivities[si] === 'BREAK' || slotActivities[si] === 'LUNCH';
    const fillColor = isBreak ? [240, 240, 240] : (si % 2 === 0 ? [255, 255, 255] : [248, 250, 252]);

    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.rect(20, y, timeColW, rowH, 'FD');
    doc.text(slot, 22, y + 5.5);

    days.forEach((_day, di) => {
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.rect(20 + timeColW + di * colW, y, colW, rowH, 'FD');
      doc.text(slotActivities[si] || '', 22 + timeColW + di * colW, y + 5.5);
    });
    y += rowH;
  });

  y += 8;
  doc.setFontSize(9);
  doc.text(`Daily learning hours: ${fd.dailyHours} | Days per week: ${fd.weeklyDays}`, 20, y);

  addFooter(doc, fd);
  return doc;
}

// ─── DOCUMENT 5: ASSESSMENT COMMITMENT LETTER ──────────────────────
function generateAssessmentCommitment(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 30;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ASSESSMENT COMMITMENT DECLARATION', 105, y, { align: 'center' }); y += 14;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('To: The Head of Department', 20, y); y += 5;
  doc.text(`${fd.province} Department of Education`, 20, y); y += 12;

  const body = `I, ${fd.parentFullName} (ID: ${fd.parentIdNumber || 'as per attached ID'}), parent/guardian of ${fd.childFullName}, hereby confirm my commitment to arrange for independent assessment of my child's educational attainment at the end of each phase, specifically:`;
  y = addWrappedText(doc, body, 20, y, 170, 5.5);
  y += 8;

  const phases = [
    'End of Foundation Phase (Grade 3): Assessment by a competent assessor',
    'End of Intermediate Phase (Grade 6): Assessment by a competent assessor',
    'End of Senior Phase (Grade 9): Assessment by a competent assessor',
  ];
  phases.forEach(p => { doc.text(`• ${p}`, 22, y); y += 7; });
  y += 6;

  doc.text('I understand that:', 20, y); y += 7;
  const understandings = [
    'A competent assessor is a qualified educator',
    'The assessment report must be submitted to the Head of Department',
    'This assessment covers all subjects in the home education programme',
  ];
  understandings.forEach(u => { doc.text(`• ${u}`, 22, y); y += 6; });
  y += 14;

  doc.text('Signed: ________________', 20, y); y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(fd.parentFullName, 20, y); y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Date: ________________', 20, y);

  addFooter(doc, fd);
  return doc;
}

// ─── DOCUMENT 6: SUBMISSION INSTRUCTIONS (TXT) ─────────────────────
function generateSubmissionInstructions(fd: DBEFormData): string {
  const email = provinceEmails[fd.province] || '';
  const isGmail = fd.province === 'Mpumalanga' || fd.province === 'Limpopo';
  const isHOD = fd.province === 'North West' || fd.province === 'Northern Cape';

  let text = `P-SQUARED DBE REGISTRATION PACKAGE
Submission Instructions for ${fd.province}
====================================

STEP 1: GATHER YOUR DOCUMENTS
Collect everything on your checklist.
Certified copies must not be older than 3 months.

STEP 2: SUBMIT YOUR APPLICATION
Send your complete package to:
${email}
`;

  if (isHOD) {
    text += `\nAddress your email to:
"The Head of Department,
${fd.province} Department of Education"\n`;
  }
  if (isGmail) {
    text += `\nNote: This is the confirmed official contact for home education in your province. It uses a Gmail address. Keep your sent email as proof of submission.\n`;
  }

  text += `
Email subject line:
"Home Education Registration Application — ${fd.childFullName} — ${fd.gradeApplying} — ${fd.applicationYear}"

STEP 3: KEEP YOUR PROOF
Screenshot or save your sent email immediately.
This is your proof of submission.

STEP 4: FOLLOW UP
Processing times:
- Gauteng / Western Cape: 14–30 days
- Other provinces: 30–60 days

IMPORTANT — YOUR LEGAL PROTECTION:
Under Section 51 of the BELA Act (2024), if the Head of Department does not respond within 60 days of receiving your application, your application is DEEMED APPROVED by law.
Keep your proof of submission date.

STEP 5: IF YOU DON'T HEAR BACK
After 30 days with no response, send this follow-up email:

Subject: Follow-up: Home Education Application — ${fd.childFullName}

"Dear Sir/Madam,

I submitted a home education registration application for ${fd.childFullName} on [your submission date] and have not yet received acknowledgement.

Please confirm receipt and advise on the status of this application.

Kind regards,
${fd.parentFullName}
${fd.parentPhone}"

====================================
Need help? WhatsApp P-Squared:
+27 81 890 5861
mypsquared.com
`;

  return text;
}

function generateSubmissionInstructionsPDF(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const text = generateSubmissionInstructions(fd);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(text, 180);
  let y = 20;
  const pageHeight = doc.internal.pageSize.getHeight();
  for (const line of lines) {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 15, y);
    y += 5;
  }
  addFooter(doc, fd);
  return doc;
}

function generateEmailCoverLetter(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const email = provinceEmails[fd.province] || '';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EMAIL COVER LETTER', 15, 25);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let y = 40;
  const body = `To: ${email}
Subject: Home Education Registration Application — ${fd.childFullName} — ${fd.gradeApplying} — ${fd.applicationYear}

Dear Sir/Madam,

Please find attached my application for the registration of my child, ${fd.childFullName}, for home education in ${fd.applicationYear}.

The following documents are included:
- Application Form
- Motivation Letter
- Educational Programme
- Weekly Timetable
- Assessment Commitment Letter
- Document Checklist
- Certified copies of supporting documents

Kindly acknowledge receipt of this application.

Kind regards,
${fd.parentFullName}
${fd.parentPhone}
${fd.parentEmail || ''}`;
  const lines = doc.splitTextToSize(body, 180);
  for (const line of lines) {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(line, 15, y);
    y += 5;
  }
  addFooter(doc, fd);
  return doc;
}

// ─── DOCUMENT 7: DOCUMENT CHECKLIST ─────────────────────────────────
function generateDocumentChecklist(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 25;

  const hasPrevSchool = fd.previousSchool !== 'Never been enrolled' && fd.previousSchool !== '';
  const hasDisabilities = fd.disabilities.length > 0 && !fd.disabilities.every(d => d === 'No diagnosed conditions');
  const hasCustody = fd.parentMaritalStatus === 'Divorced' || fd.parentMaritalStatus === 'Co-parenting / Separated';

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DOCUMENT CHECKLIST', 105, y, { align: 'center' }); y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${fd.childFullName} — ${fd.gradeApplying} — ${fd.province}`, 105, y, { align: 'center' }); y += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Documents prepared by P-Squared:', 20, y); y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const generated = [
    'Official DBE Application Form (pre-filled)',
    'Motivation Letter (province-specific)',
    'Educational Programme (196-day plan)',
    'Weekly Subject Timetable',
    'Assessment Commitment Letter',
    'Submission Instructions',
    '30-Day WhatsApp Support Access',
  ];
  if (fd.province === 'KwaZulu-Natal') generated.push('Liaison School Request Letter');
  if (fd.usesTutor === 'Yes') generated.push('Tutor Authorisation Declaration');

  generated.forEach(item => {
    drawCheckbox(doc, 22, y - 3, true);
    doc.text(item, 28, y);
    y += 6;
  });

  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Documents you need to provide:', 20, y); y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const youProvide = [
    'Certified copy of your ID (less than 3 months old)',
    'Certified copy of child\'s birth certificate (less than 3 months old)',
  ];
  if (hasPrevSchool) {
    youProvide.push('Last school report (certified, signed by principal)');
    youProvide.push('Transfer certificate from previous school');
  }
  if (hasDisabilities) youProvide.push('Medical practitioner\'s letter or assessment report');
  if (hasCustody) youProvide.push('Court order (if applicable)');
  if (fd.province === 'Gauteng') youProvide.push('Proof of residence (utility bill or lease agreement)');

  youProvide.forEach(item => {
    drawCheckbox(doc, 22, y - 3, false);
    doc.text(item, 28, y);
    y += 6;
  });

  addFooter(doc, fd);
  return doc;
}

// ─── DOCUMENT 8: KZN LIAISON SCHOOL LETTER ──────────────────────────
function generateKZNLiaisonLetter(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 15;

  // Amber banner
  doc.setFillColor(245, 158, 11);
  doc.rect(0, y - 5, 210, 22, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 40, 0);
  doc.text('⚠ KZN PARENTS — ACTION REQUIRED', 105, y + 2, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This letter must be signed by a local school principal before you submit your DBE application.', 105, y + 8, { align: 'center' });
  doc.text('Take it to any nearby school and request their signature.', 105, y + 12, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 28;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LIAISON SCHOOL AGREEMENT FOR HOME EDUCATION', 105, y, { align: 'center' }); y += 12;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(fd.address.street || '', 20, y); y += 5;
  doc.text(`${fd.address.suburb}, ${fd.address.city}`, 20, y); y += 5;
  doc.text(fd.address.postalCode || '', 20, y); y += 8;
  doc.text(new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }), 20, y); y += 10;

  doc.text('To: The Principal', 20, y); y += 5;
  doc.text('[School name — please fill in]', 20, y); y += 5;
  doc.text('[School address — please fill in]', 20, y); y += 10;

  doc.text('Dear Principal,', 20, y); y += 8;

  doc.setFont('helvetica', 'bold');
  doc.text(`Re: Request for Liaison School Agreement — ${fd.childFullName}`, 20, y); y += 8;
  doc.setFont('helvetica', 'normal');

  const body1 = `I, ${fd.parentFullName}, am applying to the KwaZulu-Natal Department of Education for registration of my child, ${fd.childFullName}, for home education in ${fd.gradeApplying} for the ${fd.applicationYear} academic year.`;
  y = addWrappedText(doc, body1, 20, y, 170, 5);
  y += 5;

  const body2 = 'In terms of the KwaZulu-Natal School Education Act and the Policy on Home Education (2018), I am required to obtain agreement from a registered school to serve as liaison school for the purpose of monitoring and evaluating my child\'s educational progress.';
  y = addWrappedText(doc, body2, 20, y, 170, 5);
  y += 5;

  const body3 = `I respectfully request that [School Name] agree to serve as liaison school for ${fd.childFullName} for the ${fd.applicationYear} academic year.`;
  y = addWrappedText(doc, body3, 20, y, 170, 5);
  y += 8;

  doc.text('The liaison school\'s responsibilities include:', 20, y); y += 6;
  ['Monitoring and evaluating the learner\'s educational progress',
   'Providing guidance on the curriculum where requested',
   'Signing the end-of-phase assessment report',
  ].forEach(r => { doc.text(`• ${r}`, 22, y); y += 5.5; });

  y += 4;
  doc.text('I commit to:', 20, y); y += 6;
  ['Keeping you informed of my child\'s progress',
   'Submitting reports as required',
   'Cooperating fully with any monitoring visits',
  ].forEach(r => { doc.text(`• ${r}`, 22, y); y += 5.5; });

  y += 6;
  doc.text('Yours sincerely,', 20, y); y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(fd.parentFullName, 20, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(`${fd.parentPhone} | ${fd.parentEmail}`, 20, y); y += 12;

  // Principal's Acknowledgement
  doc.setFont('helvetica', 'bold');
  doc.text('PRINCIPAL\'S ACKNOWLEDGEMENT:', 20, y); y += 8;
  doc.setFont('helvetica', 'normal');

  doc.text(`I, ________________, Principal of ________________ School,`, 20, y); y += 6;
  doc.text(`agree to serve as liaison school for ${fd.childFullName} for the ${fd.applicationYear} academic year.`, 20, y); y += 10;

  doc.text('Signature: ________________', 20, y); y += 7;
  doc.text('Name: ________________', 20, y); y += 7;
  doc.text('Position: Principal', 20, y); y += 7;
  doc.text('School stamp: ________________', 20, y); y += 7;
  doc.text('Date: ________________', 20, y); y += 12;

  // Instructions
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Instructions:', 20, y); y += 4;
  ['1. Print this letter',
   '2. Take it to any registered school near you',
   '3. Ask the principal to sign and stamp it',
   '4. Include the signed letter in your DBE application package',
   '5. WhatsApp us if any school refuses: +27 81 890 5861 — we will advise you',
  ].forEach(line => { doc.text(line, 22, y); y += 4; });
  doc.setTextColor(0, 0, 0);

  addFooter(doc, fd);
  return doc;
}

// ─── DOCUMENT 8b: TUTOR AUTHORISATION ───────────────────────────────
function generateTutorAuthorisation(fd: DBEFormData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 30;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TUTOR AUTHORISATION DECLARATION', 105, y, { align: 'center' }); y += 14;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const body = `I, ${fd.parentFullName}, parent/guardian of ${fd.childFullName}, hereby declare that I have appointed a tutor to support the delivery of certain subjects within my home education programme.

I confirm that:

1. I remain the primary educator and take full responsibility for my child's education.
2. The tutor supports me in delivering specific subjects and does not take over full curriculum delivery.
3. I supervise all teaching and learning activities.

Tutor Details:
Name: ${fd.tutorDetails.name || '[To be confirmed]'}
Qualifications: ${fd.tutorDetails.qualifications || '[To be confirmed]'}`;

  y = addWrappedText(doc, body, 20, y, 170, 5.5);
  y += 16;

  doc.text('Signed: ________________', 20, y); y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(fd.parentFullName, 20, y); y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Date: ________________', 20, y);

  addFooter(doc, fd);
  return doc;
}

// ─── MAIN ZIP GENERATOR ─────────────────────────────────────────────
export async function generateDBEPackage(
  rawFd: DBEFormData,
  aiLetter?: string,
): Promise<Blob> {
  const fd = normalizeFormData(rawFd);
  const zip = new JSZip();


  // 1. Application Form (official GDE template overlaid via pdf-lib)
  zip.file('DBE_Application_Form.pdf', await _generateApplicationFormPDF(fd, fd.referenceNumber || ''));

  // 2. Motivation Letter (uses AI-generated text when provided)
  zip.file('Motivation_Letter.pdf', generateMotivationLetter(fd, aiLetter).output('blob'));

  // 3. Educational Programme
  zip.file('Educational_Programme.pdf', generateEducationalProgramme(fd).output('blob'));

  // 4. Weekly Timetable
  zip.file('Weekly_Timetable.pdf', generateWeeklyTimetable(fd).output('blob'));

  // 5. Assessment Commitment Letter
  zip.file('Assessment_Commitment_Letter.pdf', generateAssessmentCommitment(fd).output('blob'));

  // 6. Submission Instructions (PDF)
  zip.file('Submission_Instructions.pdf', generateSubmissionInstructionsPDF(fd).output('blob'));

  // 7. Document Checklist
  zip.file('Document_Checklist.pdf', generateDocumentChecklist(fd).output('blob'));

  // 8. Email Cover Letter
  zip.file('EMAIL_COVER_LETTER.pdf', generateEmailCoverLetter(fd).output('blob'));

  // Conditional: KZN Liaison Letter
  if (fd.province === 'KwaZulu-Natal') {
    zip.file('Liaison_School_Request_Letter.pdf', generateKZNLiaisonLetter(fd).output('blob'));
  }

  // Conditional: Tutor Authorisation
  if (fd.usesTutor === 'Yes') {
    zip.file('Tutor_Authorisation_Declaration.pdf', generateTutorAuthorisation(fd).output('blob'));
  }

  return zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getZipFilename(fd: DBEFormData): string {
  const name = (fd.childFullName || 'Learner').replace(/\s+/g, '_');
  const grade = (fd.gradeApplying || 'Grade').replace(/\s+/g, '_');
  const ref = fd.referenceNumber || `PSQ-${new Date().getFullYear()}`;
  return `PSQ_${ref}_${name}_${grade}.zip`;
}

// ─── PREVIEW EXPORTS (used by Step6Review preview buttons) ──────────
export async function generateApplicationFormPDF(
  formData: DBEFormData,
  ref: string,
): Promise<Blob> {
  return _generateApplicationFormPDF({ ...formData, referenceNumber: ref }, ref);
}

export async function generateApplicationFormPDFPreview(
  formData: DBEFormData,
  ref: string,
): Promise<Blob> {
  return _generateApplicationFormPDFPreview({ ...formData, referenceNumber: ref }, ref);
}

export async function generateMotivationLetterPDF(
  formData: DBEFormData,
  ref: string,
  aiLetter: string,
): Promise<Blob> {
  const fd = normalizeFormData({ ...formData, referenceNumber: ref });
  const doc = generateMotivationLetter(fd, aiLetter);
  return doc.output('blob');
}

export async function generateMotivationLetterPDFPreview(
  formData: DBEFormData,
  ref: string,
  aiLetter: string = '',
): Promise<Blob> {
  const fd = normalizeFormData({ ...formData, referenceNumber: ref });
  const doc = generateMotivationLetter(fd, aiLetter);
  const baseBlob: Blob = doc.output('blob');

  // Use pdf-lib for tiled, rotated watermark — strong red, multiple instances per page
  // makes screenshots/copying easily identifiable as a sample.
  // pdf-lib imported statically at top of file
  const arrayBuffer = await baseBlob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const watermarkText = 'SAMPLE - NOT FOR SUBMISSION';
  const angle = Math.PI / 4;
  const red = rgb(0.95, 0.08, 0.08);

  pdfDoc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    // Size watermark to span most of the page diagonally
    const diagonal = Math.sqrt(width * width + height * height) * 0.55;
    const size = (diagonal / font.widthOfTextAtSize(watermarkText, 100)) * 100;
    const textWidth = font.widthOfTextAtSize(watermarkText, size);
    const cx = width / 2 - (textWidth * Math.cos(angle)) / 2;
    const cy = height / 2 - (textWidth * Math.sin(angle)) / 2;
    page.drawText(watermarkText, {
      x: cx, y: cy, size, font, color: red, opacity: 0.25, rotate: degrees(45),
    });
  });

  const bytes = await pdfDoc.save();
  return new Blob([bytes as BlobPart], { type: 'application/pdf' });
}


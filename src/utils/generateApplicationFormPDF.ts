import { PDFDocument, PDFName, rgb, StandardFonts, degrees, type PDFFont } from 'pdf-lib';
import dbeFormTemplate from '@/assets/gde-dbe-form-template.pdf';
import { toTitleCase } from '@/utils/formatters';
import { DBEFormData } from '@/types/dbeRegistration';

const WATERMARK_TEXT = 'SAMPLE - NOT FOR SUBMISSION';

type FieldRect = { pageIndex: number; x: number; y: number; width: number; height: number };

type ManualDraw = FieldRect & { text: string; size?: number; bold?: boolean };

function normalizeOption(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function mapPopulationGroup(value = '') {
  const normalized = normalizeOption(value);
  if (normalized.includes('african') || normalized.includes('black')) return 'African';
  if (normalized.includes('coloured')) return 'Coloured';
  if (normalized.includes('indian') || normalized.includes('asian')) return 'Indian';
  if (normalized.includes('white')) return 'White';
  if (normalized.includes('other')) return 'Other';
  return '';
}

function mapEmployment(value = '') {
  return value === 'Self-employed' ? 'Self Employed' : value;
}

function splitName(fullName = '') {
  const titled = toTitleCase(fullName).trim();
  const parts = titled.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstNames: titled, surname: '' };
  return { firstNames: parts.slice(0, -1).join(' '), surname: parts[parts.length - 1] };
}

function addCenteredWatermark(pdfDoc: PDFDocument, font: PDFFont) {
  const red = rgb(0.95, 0.08, 0.08);
  pdfDoc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    // Size watermark to span most of the page diagonally
    const diagonal = Math.sqrt(width * width + height * height) * 0.55;
    const size = (diagonal / font.widthOfTextAtSize(WATERMARK_TEXT, 100)) * 100;
    const textWidth = font.widthOfTextAtSize(WATERMARK_TEXT, size);
    const angle = Math.PI / 4;
    const cx = width / 2 - (textWidth * Math.cos(angle)) / 2;
    const cy = height / 2 - (textWidth * Math.sin(angle)) / 2;

    page.drawText(WATERMARK_TEXT, {
      x: cx, y: cy, size, font, color: red, opacity: 0.25, rotate: degrees(45),
    });

  });

}

export async function generateApplicationFormPDF(
  formData: DBEFormData,
  ref: string,
): Promise<Blob> {
  const templateBytes = await fetch(dbeFormTemplate).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();
  const pages = pdfDoc.getPages();
  const pageRefToIndex = new Map(pages.map((page, index) => [page.ref.toString(), index]));
  const manualDraws: ManualDraw[] = [];
  const filledDropdowns = new Set<string>();
  const filledCheckboxes = new Set<string>();

  const getFieldRect = (name: string): FieldRect | null => {
    try {
      const field = form.getField(name);
      const widget = (field as unknown as { acroField: { getWidgets: () => Array<{ getRectangle: () => { x: number; y: number; width: number; height: number }; P: () => { toString: () => string } | undefined }> } }).acroField.getWidgets()[0];
      if (!widget) return null;
      const rect = widget.getRectangle();
      const pageRef = widget.P();
      if (!pageRef) return null;
      const pageIndex = pageRefToIndex.get(pageRef.toString());
      if (pageIndex === undefined) return null;
      return { pageIndex, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    } catch {
      return null;
    }
  };

  const drawInField = (name: string, text: string, size = 10) => {
    if (!text) return;
    const rect = getFieldRect(name);
    if (!rect) return;
    manualDraws.push({ ...rect, text, size, bold: true });
  };

  const setTextField = (name: string, value: string, size = 10) => {
    const text = String(value || '').trim();
    try {
      const field = form.getTextField(name);
      field.setText(text.substring(0, 180));
      field.setFontSize(size);
      field.updateAppearances(boldFont);
    } catch {
      drawInField(name, text, size);
    }
  };

  const setDropdown = (name: string, value: string, size = 10) => {
    const raw = String(value || '').trim();
    try {
      const field = form.getDropdown(name);
      const options = field.getOptions();
      const selected =
        options.find((option) => option === raw) ||
        options.find((option) => option.trim() === raw) ||
        options.find((option) => normalizeOption(option) === normalizeOption(raw));
      const valueToSelect = selected || raw || ' ';
      if (!options.includes(valueToSelect)) field.addOptions([valueToSelect]);
      field.select(valueToSelect);
      field.setFontSize(size);
      field.updateAppearances(boldFont);
      filledDropdowns.add(name);
    } catch {
      drawInField(name, raw, size);
    }
  };

  const setBlankDropdown = (name: string) => {
    try {
      const field = form.getDropdown(name);
      const options = field.getOptions();
      if (!options.includes(' ')) field.addOptions([' ']);
      field.select(' ');
      field.updateAppearances(font);
    } catch {
      // ignore
    }
  };

  const setCheckbox = (name: string, checked: boolean) => {
    try {
      const field = form.getCheckBox(name);
      if (checked) {
        field.check();
        filledCheckboxes.add(name);
      } else {
        field.uncheck();
      }
      field.updateAppearances();
    } catch {
      // ignore
    }
  };

  const textMatches = (haystack: string, needle: string) =>
    normalizeOption(haystack).includes(normalizeOption(needle));

  const childNames = splitName(formData.childFullName);
  const parentNames = splitName(formData.parentFullName);
  const parent2Names = splitName(formData.parent2?.fullName || '');
  const previous = formData.previousSchoolDetails || ({} as DBEFormData['previousSchoolDetails']);
  const address = formData.address || ({} as DBEFormData['address']);
  const hasPreviousSchool = formData.previousSchool !== 'Never been enrolled' && !!formData.previousSchool;
  const disabilities = formData.disabilities || [];
  const hasDisabilities = disabilities.length > 0 && !disabilities.every((d) => d === 'No diagnosed conditions');
  const triggers = formData.circumstanceTriggers || [];

  form.getFields().forEach((field) => {
    if (field.constructor.name === 'PDFDropdown') setBlankDropdown(field.getName());
    if (field.constructor.name === 'PDFCheckBox') setCheckbox(field.getName(), false);
  });

  setDropdown('ApplicationYear', formData.applicationYear ? ` ${formData.applicationYear}` : '', 8);

  setTextField('LearnerFirstName', childNames.firstNames);
  setTextField('LearnerSurname', childNames.surname);
  setDropdown('Citizenship', 'Yes');
  setTextField('LearnerIDNo', formData.childIdNumber);
  setDropdown('LearnerGender', formData.childGender);
  setTextField('LearnerPassportNo', 'N/A');
  setTextField('LearnerDOB', formData.childDOB, 8);
  setTextField('LearnerCountryoOrigin', 'South Africa', 8);
  setDropdown('LearnerPopulationGroup', mapPopulationGroup(formData.childPopulationGroup));
  if (mapPopulationGroup(formData.childPopulationGroup) === 'Other') setTextField('LearnerOther', formData.childPopulationGroup, 8);

  setCheckbox('Epilepsy', disabilities.some((d) => textMatches(d, 'Epilepsy')));
  setCheckbox('PartialSighted', disabilities.some((d) => textMatches(d, 'Partial sighted') || textMatches(d, 'Low vision')));
  setCheckbox('PD', disabilities.some((d) => textMatches(d, 'Physical disability')));
  setCheckbox('Blindness', disabilities.some((d) => textMatches(d, 'Blindness')));
  setCheckbox('ADD', disabilities.some((d) => textMatches(d, 'Attention Deficit') || textMatches(d, 'ADHD')));
  setCheckbox('ASD', disabilities.some((d) => textMatches(d, 'Autistic')));
  setCheckbox('Deafness', disabilities.some((d) => textMatches(d, 'Deafness')));
  setCheckbox('SPID', disabilities.some((d) => textMatches(d, 'Severe intellectual')));
  setCheckbox('BD', disabilities.some((d) => textMatches(d, 'Behavioural')));
  setCheckbox('HH', disabilities.some((d) => textMatches(d, 'Hard of hearing')));
  setCheckbox('MMID', disabilities.some((d) => textMatches(d, 'Mild to moderate')));
  setCheckbox('SLD', disabilities.some((d) => textMatches(d, 'Specific learning')));
  setCheckbox('CPB', disabilities.some((d) => textMatches(d, 'Cerebral palsy')));
  setCheckbox('chkOther', disabilities.some((d) => textMatches(d, 'Other')) || !!formData.disabilityOther);
  setTextField('LearnerOther1', formData.disabilityOther || '');
  setDropdown('LearnerAssessedby', hasDisabilities ? 'Medical Practitioner' : 'Not applicable');

  setDropdown('LearnerProvinces', hasPreviousSchool ? previous.province : 'Not applicable', 8);
  setTextField('Learnerpreviousschool', hasPreviousSchool ? previous.schoolName : 'Not applicable', 8);
  setDropdown('LearnerGradeCompleted', hasPreviousSchool ? previous.gradeCompleted : 'Not applicable', 8);
  setTextField('LearnerPrevSchoolPhysicaladdress', hasPreviousSchool ? previous.physicalAddress : 'Not applicable', 7);
  setTextField('LearnerPrevSchoolContact', hasPreviousSchool ? previous.contactNumber : 'Not applicable');
  setDropdown('LearnerGradeApplying', formData.gradeApplying);
  setTextField('LearnerCurriculumtobeused', toTitleCase(formData.chosenCurriculum || ''), 8);
  setTextField('LearnerSubjectsOffered', (formData.subjects || []).join(', '), 6);

  setCheckbox('LearnerDistancetoschool', triggers.some((t) => textMatches(t, 'Family relocation')));
  setCheckbox('ChildrenwithSpecialneeds', triggers.some((t) => textMatches(t, 'Learning needs') || textMatches(t, 'special need')) || hasDisabilities);
  setCheckbox('NomadicLifestyles', triggers.some((t) => textMatches(t, 'Nomadic') || textMatches(t, 'travelling')));
  setCheckbox('DissatisfactionwithPublicSchool', triggers.some((t) => textMatches(t, 'Safety') || textMatches(t, 'bullying') || textMatches(t, 'Dissatisfaction')));
  setCheckbox('ReligiousConvictions', triggers.some((t) => textMatches(t, 'Religious')));
  setCheckbox('FinancialConsideration', triggers.some((t) => textMatches(t, 'Financial')));
  setCheckbox('LackofAdmission', triggers.some((t) => textMatches(t, 'Lack of admission')));
  setTextField('IfOtherSpecify', formData.circumstanceOther || '', 8);

  setDropdown('Parent1Title', formData.parentTitle);
  setTextField('Parent1FirstName', parentNames.firstNames);
  setTextField('Parent1Surname', parentNames.surname);
  setDropdown('Parent1CitizenshipFather', 'Yes');
  setTextField('Parent1SAIdentificationNumber', formData.parentIdNumber);
  setTextField('Parent1PassportNumber', 'N/A');
  setTextField('Parent1CountryofOrigin', 'South Africa', 8);
  setTextField('Parent1HighestQualificationObtained', formData.parentQualification, 8);
  setDropdown('Parent1PopulationGroupFather', mapPopulationGroup(formData.parentPopulationGroup));
  setDropdown('Parent1EmploymentStatus', mapEmployment(formData.parentEmployment));
  setDropdown('Parent1MaritalStatus', formData.parentMaritalStatus);
  setDropdown('Parent1LivesWithThelearner', 'Yes');
  setDropdown('Parent1Realtionship', formData.parentRelationship);
  if (!['Father', 'Legal Guardian'].includes(formData.parentRelationship)) {
    setTextField('Parent1OtherSpecify', formData.parentRelationship, 8);
  }
  setTextField('Parent1TelephoneNumber', formData.parentPhone);
  setTextField('Parent1CellNumber', formData.parentPhone);
  setTextField('Parent1EmailAddress', formData.parentEmail, 8);
  setTextField('Parent1Street', address.street, 7);
  setTextField('Parent1Complex Building', address.suburb, 7);
  setTextField('Parent1AreaCode', address.postalCode, 8);
  setTextField('Parent1Town', address.city, 8);

  if (!formData.soleParent && formData.parent2?.fullName) {
    setDropdown('Parent2TitleMother', formData.parent2.title);
    setTextField('Parent2FullName', parent2Names.firstNames);
    setTextField('Parent2Surname', parent2Names.surname);
    setDropdown('Parent2CitizenshipMother', 'Yes');
    setTextField('Parent2SAfIdentificationNumber', formData.parent2.idNumber);
    setTextField('Parent2PassportNumber', 'N/A');
    setTextField('Parent2CountryofOrigin', 'South Africa', 8);
    setTextField('Parent2HighestQualificationObtained', formData.parent2.qualification, 8);
    setDropdown('Parent2PopulationGroupMother', mapPopulationGroup(formData.parent2.populationGroup));
    setDropdown('Parent2EmploymentStatusMother', mapEmployment(formData.parent2.employment));
    setDropdown('Parent2MaritalStatusMother', formData.parentMaritalStatus);
    setDropdown('Parent2LivesWithThelearnerMother', 'Yes');
    setDropdown('Parent2RealtionshipMother', formData.parent2.relationship);
    if (!['Mother', 'Legal Guardian'].includes(formData.parent2.relationship)) {
      setTextField('Parent2otherspecify', formData.parent2.relationship, 8);
    }
    setTextField('Parent2TelephoneNumber', formData.parent2.phone);
    setTextField('CellNumber', formData.parent2.phone);
    setTextField('Parent2EmailAddress', formData.parent2.email, 8);
    setTextField('Parent2Street_2', address.street, 7);
    setTextField('Parent2ComplexBuilding_2', address.suburb, 7);
    setTextField('Parent2Area Code_2', address.postalCode, 8);
    setTextField('Parent2Town_2', address.city, 8);
  } else {
    setTextField('Parent2FullName', 'Not applicable — sole parent', 8);
  }

  // Section 6 declaration — parent name rendered LARGER + BOLD over the field
  const declarationName = `${toTitleCase(formData.parentFullName)} (${formData.parentRelationship || 'Parent/Guardian'})`;
  const declRect = getFieldRect('Nameofparentguardian');
  if (declRect) {
    // Leave the underlying form field blank so it doesn't render small text underneath
    try { form.getTextField('Nameofparentguardian').setText(''); } catch { /* ignore */ }
    manualDraws.push({
      ...declRect,
      text: declarationName,
      size: 12,
      bold: true,
    });
  } else {
    setTextField('Nameofparentguardian', declarationName, 12);
  }

  filledDropdowns.forEach((name) => {
    try {
      form.getDropdown(name).updateAppearances(boldFont);
    } catch {
      // ignore
    }
  });
  filledCheckboxes.forEach((name) => {
    try {
      form.getCheckBox(name).updateAppearances();
    } catch {
      // ignore
    }
  });

  try {
    form.flatten();
    console.log('Official DBE form filled and flattened');
  } catch (e) {
    console.log('Form flatten failed:', e);
  }

  pages.forEach((page) => {
    try {
      page.node.delete(PDFName.of('Annots'));
    } catch {
      // ignore
    }
  });
  try {
    pdfDoc.catalog.delete(PDFName.of('AcroForm'));
  } catch {
    // ignore
  }

  manualDraws.forEach(({ pageIndex, x, y, width, height, text, size = 10, bold = true }) => {
    const page = pages[pageIndex];
    if (!page || !text) return;
    page.drawText(String(text).substring(0, 140), {
      x: x + 3,
      y: y + Math.max(4, height / 2 - size / 3),
      size,
      font: bold ? boldFont : font,
      color: rgb(0, 0, 0),
      maxWidth: Math.max(20, width - 6),
    });
  });

  pages.forEach((page, i) => {
    page.drawText(
      `Prepared with P-Squared | mypsquared.com | Ref: ${ref} | Page ${i + 1} of ${pages.length} | Review all details before signing.`,
      { x: 50, y: 20, size: 7, font, color: rgb(0.5, 0.5, 0.5) },
    );
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
}

// WATERMARKED PREVIEW VERSION
export async function generateApplicationFormPDFPreview(
  formData: DBEFormData,
  ref: string,
): Promise<Blob> {
  const blob = await generateApplicationFormPDF(formData, ref);
  const arrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  addCenteredWatermark(pdfDoc, font);

  const watermarkedBytes = await pdfDoc.save();
  return new Blob([watermarkedBytes as BlobPart], { type: 'application/pdf' });
}

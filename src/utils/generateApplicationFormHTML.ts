import { DBEFormData, provinceEmails } from '@/types/dbeRegistration';

const HEADER = `
  <div style="text-align:right;font-size:8pt;color:#333;line-height:1.4">
    <div>• This Application Form is not for sale.</div>
    <div>• It is the sole use for Applicant Parent only.</div>
    <div>• There are no charges levied for registration.</div>
  </div>`;

const FOOTER = (ref: string, page: number, total: number) => `
  <div style="text-align:center;font-size:8pt;color:#888;font-style:italic;margin-top:24px;padding-top:8px;border-top:1px solid #ddd">
    Prepared with P-Squared | mypsquared.com | Ref: ${ref} | Page ${page} of ${total} | Review all details before signing.
  </div>`;

const cb = (checked: boolean) => `<span style="display:inline-block;width:10px;height:10px;border:1px solid #000;text-align:center;line-height:10px;font-size:8pt;margin-right:4px;vertical-align:middle">${checked ? 'X' : ''}</span>`;

const sectionRow = (text: string) =>
  `<tr><td colspan="2" style="background:#d9d9d9;font-weight:bold;font-size:10pt;padding:5px 6px;border:1px solid #000">${text}</td></tr>`;

const row = (label: string, value: string) =>
  `<tr>
    <td style="background:#f5f5f5;width:40%;padding:4px 6px;font-weight:bold;border:1px solid #000;vertical-align:top">${label}</td>
    <td style="width:60%;padding:4px 6px;border:1px solid #000">${value || '&nbsp;'}</td>
  </tr>`;

const splitNames = (full: string) => {
  const parts = (full || '').trim().split(/\s+/);
  return {
    surname: parts.length > 1 ? parts[parts.length - 1] : parts[0] || '',
    first: parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || '',
    initials: parts.map(p => p.charAt(0).toUpperCase()).join(''),
  };
};

export function generateApplicationFormHTML(fd: DBEFormData, ref: string): string {
  const email = provinceEmails[fd.province] || '';
  const child = splitNames(fd.childFullName);
  const parent = splitNames(fd.parentFullName);
  const isMale = fd.childGender === 'Male';
  const total = 5;

  const disabilityRows: [string, string, string][] = [
    ['Epilepsy', 'Partial Sighted/Low vision', 'Physical Disability'],
    ['Blindness', 'Attention Deficit Disorder', 'Autistic Spectrum Disorder'],
    ['Deafness', 'Severe Intellectual Disability', 'Behavioural disorder'],
    ['Hard of Hearing', 'Mild to Moderate Intellectual disability', 'Specific learning disability'],
    ['Cerebral Palsy', 'Severe to profound intellectual disability', 'Other'],
  ];
  const disTicked = (label: string) =>
    fd.disabilities.some(d => d.toLowerCase().includes(label.toLowerCase().substring(0, 8)));

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
  const ticked = new Set<string>();
  fd.circumstanceTriggers.forEach(t => { const m = reasonMap[t]; if (m) ticked.add(m); });

  const reasonRows: string[][] = [
    ['Distance to school', 'Children With Special needs', 'Nomadic lifestyles'],
    ['Dissatisfaction with public school', 'Religious Convictions', 'Financial Consideration'],
    ['Lack of Admission to public ordinary Schools', '', ''],
  ];

  const grid = (rows: string[][], tickFn: (l: string) => boolean) => `
    <table style="width:100%;border-collapse:collapse">
      ${rows.map(r => `<tr>${r.map(c => c
        ? `<td style="width:33%;padding:4px;border:1px solid #999;font-size:8.5pt">${cb(tickFn(c))}${c}</td>`
        : `<td style="border:1px solid #999"></td>`).join('')}</tr>`).join('')}
    </table>`;

  const empBoxes = (current: string) =>
    ['Employed', 'Self-employed', 'Unemployed', 'Other']
      .map(o => `${cb(current === o)}${o}`).join('&nbsp;&nbsp;');

  const maritalBoxes = (current: string) =>
    ['Single', 'Married', 'Divorced', 'Widowed']
      .map(o => `${cb(!!current && current.includes(o))}${o}`).join('&nbsp;&nbsp;');

  const page = (content: string, num: number) => `
    <div style="page-break-after:always;padding:18px 20px;min-height:1080px">
      ${HEADER}
      ${content}
      ${FOOTER(ref, num, total)}
    </div>`;

  // PAGE 1
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

  const page1 = page(`
    <div style="text-align:center;font-size:13pt;font-weight:bold;color:#000;margin:14px 0 12px">
      APPLICATION FOR THE REGISTRATION OF LEARNERS FOR HOME EDUCATION
    </div>
    <div style="border:1px solid #000;padding:10px;margin-bottom:10px;font-size:9pt">
      <div style="font-weight:bold;font-size:11pt;margin-bottom:6px">General Information</div>
      <div>1. This application form must be completed in full by the parents / guardian of a learner.</div>
      <div style="margin-top:4px">2. A separate form must be completed for each learner, accompanied by the following required documents:</div>
      <div style="font-weight:bold;margin-top:4px">Please note: all certified copies must not be older than 3 months</div>
      <div style="margin-top:6px">${reqs.map(r => `<div style="margin:3px 0">${cb(false)}${r}</div>`).join('')}</div>
      <div style="font-weight:bold;margin-top:8px">Instructions on how to complete this form:</div>
      <div>${cb(false)}Complete the form by ticking check box and Write in the text box where applicable</div>
      <div>${cb(false)}Select relevant option from given options in a dropdown-list</div>
      <div>${cb(false)}Submit the form with the required documents to: ${email}</div>
    </div>
    <div style="text-align:right;font-weight:bold;margin:8px 0">Year: ${fd.applicationYear}</div>
    <div style="border:1px solid #000;padding:8px;font-size:9pt">
      <strong>Note:</strong> Submission of the application form does not imply that the learner is registered with Provincial Department of Education.
      <div>• The official will contact you for verification and the registration process will follow.</div>
    </div>
  `, 1);

  // PAGE 2
  const page2 = page(`
    <table style="width:100%;border-collapse:collapse;font-size:9pt;margin-top:12px">
      ${sectionRow('1. Learner Details')}
      ${row('1.1 Full Names: (As on birth certificate)', child.first)}
      ${row('1.2 Surname:', child.surname)}
      ${row('1.3 South African Citizen: (Choose appropriate choice)', `${cb(true)}Yes &nbsp; ${cb(false)}No`)}
      ${row('1.4 South African Identification Number:', fd.childIdNumber || '')}
      ${row('1.5 Gender / 1.6 Date of Birth (yyyy-mm-dd):', `${cb(isMale)}Male &nbsp; ${cb(!isMale && !!fd.childGender)}Female &nbsp;&nbsp;|&nbsp;&nbsp; <strong>DOB:</strong> ${fd.childDOB || ''}`)}
      ${row('1.7 Passport / 1.8 Country of Origin:', `Passport: N/A &nbsp;|&nbsp; Country: South Africa`)}
      ${row('1.9 Population Group:', `${fd.childPopulationGroup || ''} &nbsp; <strong>Other:</strong> _______`)}
      <tr>
        <td style="background:#f5f5f5;padding:4px 6px;font-weight:bold;border:1px solid #000;vertical-align:top">1.10 Type of Disability: (tick appropriate box)<br/><em>Please Attach Proof of Disability</em></td>
        <td style="padding:4px 6px;border:1px solid #000">
          ${grid(disabilityRows, disTicked)}
          <div style="margin-top:4px">If learner suffers from Other disability please Specify: ${fd.disabilityOther || '_______________'}</div>
        </td>
      </tr>
      ${row('1.11 Assessed by registered professional practitioner:', (fd.disabilities.length > 0 && !fd.disabilities.every(d => d === 'No diagnosed conditions')) ? 'Yes' : 'No')}
      ${sectionRow('2. Last School Attended')}
      ${row('2.1 Province of last school attended:', fd.previousSchool === 'Never been enrolled' ? 'Not applicable' : fd.previousSchoolDetails.province)}
      ${row('2.2 Name of previous school attended:', fd.previousSchool === 'Never been enrolled' ? 'Not applicable' : fd.previousSchoolDetails.schoolName)}
      ${row('2.3 Grade completed:', fd.previousSchool === 'Never been enrolled' ? 'Not applicable' : fd.previousSchoolDetails.gradeCompleted)}
      ${row('2.4 Physical address of the school:', fd.previousSchool === 'Never been enrolled' ? 'Not applicable' : fd.previousSchoolDetails.physicalAddress)}
      ${row('2.5 Contact No. of last school attended:', fd.previousSchool === 'Never been enrolled' ? 'Not applicable' : fd.previousSchoolDetails.contactNumber)}
      ${sectionRow('3. Home Education Grade Registering')}
      ${row('3.1 Grade for which application is being made:', fd.gradeApplying)}
      ${row('3.2 Curriculum to be used:', fd.chosenCurriculum)}
      ${row('3.3 Subjects Offered (separated by comma):', fd.subjects.join(', '))}
      <tr>
        <td style="background:#f5f5f5;padding:4px 6px;font-weight:bold;border:1px solid #000;vertical-align:top">3.4 Reasons for choosing home education (Mark Appropriate)</td>
        <td style="padding:4px 6px;border:1px solid #000">
          ${grid(reasonRows, l => ticked.has(l))}
          <div style="margin-top:4px">If Other Specify: ${fd.circumstanceOther || '_______________'}</div>
        </td>
      </tr>
    </table>
  `, 2);

  // PAGE 3 - Parent 1
  const page3 = page(`
    <table style="width:100%;border-collapse:collapse;font-size:9pt;margin-top:12px">
      ${sectionRow('4. Parent 1 / Legal Guardian Details')}
      ${row('4.1 Title / 4.2 First Names:', `<strong>Title:</strong> ${fd.parentTitle} &nbsp;|&nbsp; <strong>First Names:</strong> ${parent.first}`)}
      ${row('4.3 Surname:', parent.surname)}
      ${row('4.4 South African Citizen:', `${cb(true)}Yes &nbsp; ${cb(false)}No`)}
      ${row('4.5 South African Identification Number:', fd.parentIdNumber || '')}
      ${row('4.6 Passport Number:', 'N/A')}
      ${row('4.7 Country of Origin:', 'South Africa')}
      ${row('4.8 Population Group:', '___')}
      ${row('4.9 Highest Qualification Obtained:', fd.parentQualification)}
      ${row('4.10 Employment Status:', empBoxes(fd.parentEmployment))}
      ${row('4.11 Marital Status:', maritalBoxes(fd.parentMaritalStatus))}
      ${row('4.12 Lives with the Learner:', `${cb(true)}Yes &nbsp; ${cb(false)}No`)}
      ${row('4.13 Relationship With Learner:', `${fd.parentRelationship} &nbsp; <strong>Other Specify:</strong> ___`)}
      ${row('4.14 Telephone / 4.15 Cell Number:', `<strong>Tel:</strong> ${fd.parentPhone} &nbsp;|&nbsp; <strong>Cell:</strong> ${fd.parentPhone}`)}
      ${row('4.16 Email Address:', fd.parentEmail)}
      ${row('4.17 Residential Address:', `<strong>Street:</strong> ${fd.address.street} &nbsp;|&nbsp; <strong>Town:</strong> ${fd.address.city} &nbsp;|&nbsp; <strong>Area Code:</strong> ${fd.address.postalCode}`)}
    </table>
  `, 3);

  // PAGE 4 - Parent 2
  const p2 = fd.parent2;
  const p2Names = splitNames(p2?.fullName || '');
  const page4 = page(`
    <table style="width:100%;border-collapse:collapse;font-size:9pt;margin-top:12px">
      ${sectionRow('5. Parent 2 / Legal Guardian Details')}
      ${fd.soleParent || !p2?.fullName
        ? `<tr><td colspan="2" style="padding:10px;border:1px solid #000;font-style:italic">Not applicable — sole parent / guardian declared.</td></tr>`
        : `
          ${row('5.1 Title / 5.2 First Names:', `<strong>Title:</strong> ${p2.title} &nbsp;|&nbsp; <strong>First Names:</strong> ${p2Names.first}`)}
          ${row('5.3 Surname:', p2Names.surname)}
          ${row('5.4 South African Citizen:', `${cb(true)}Yes &nbsp; ${cb(false)}No`)}
          ${row('5.5 South African Identification Number:', p2.idNumber)}
          ${row('5.6 Passport Number:', 'N/A')}
          ${row('5.7 Country of Origin:', 'South Africa')}
          ${row('5.8 Population Group:', '___')}
          ${row('5.9 Highest Qualification:', p2.qualification)}
          ${row('5.10 Employment Status:', empBoxes(p2.employment))}
          ${row('5.11 Marital Status:', maritalBoxes(fd.parentMaritalStatus))}
          ${row('5.12 Lives with the Learner:', `${cb(true)}Yes &nbsp; ${cb(false)}No`)}
          ${row('5.13 Relationship With Learner:', `${p2.relationship} &nbsp; <strong>If other specify:</strong> ___`)}
          ${row('5.14 Telephone / 5.15 Cell:', `${p2.phone} | ${p2.phone}`)}
          ${row('5.16 Email Address:', p2.email)}
          ${row('5.17 Residential Address:', '<strong>Street:</strong> ___ &nbsp;|&nbsp; <strong>Town:</strong> ___ &nbsp;|&nbsp; <strong>Area Code:</strong> ___')}
        `}
    </table>
  `, 4);

  // PAGE 5 - Declaration + Office
  const page5 = page(`
    <table style="width:100%;border-collapse:collapse;font-size:9pt;margin-top:12px">
      ${sectionRow('6. Declaration By Parent Or Guardian')}
      <tr><td colspan="2" style="padding:10px;border:1px solid #000;line-height:1.5">
        I/We hereby declare that I have read and understood the BELA Act 32 of 2024, Section 35 read together with the Policy on Home Education published on the Gazette No. 42037 of November 2018. I further declare that I have supplied correct information and undertake to do the following:<br/><br/>
        (a) Accept full responsibility for the implementation of home education for my child<br/>
        (b) Make suitable education resources available to support my learner's learning;<br/>
        (c) Monitor his/her academic progress;<br/>
        (d) Arrange for the learner's educational attainment to be assessed by a competent assessor at the end of each phase up to the year in which the learner reaches the age 15 years or completes grade 9.<br/>
        (e) Submit to the Head of Department, the assessment report signed by the competent assessor as evidence of the learner's educational attainment at the end of each phase.
      </td></tr>
      <tr>
        <td style="padding:10px;border:1px solid #000;width:50%">
          <strong>Initials and Surname of the Parent 1 / Guardian</strong><br/>
          ${parent.initials} ${parent.surname}<br/>
          ___________________________<br/>
          <strong>Date:</strong> _______________
        </td>
        <td style="padding:10px;border:1px solid #000;width:50%">
          <strong>Initials and Surname of the Parent 2</strong><br/><br/>
          ___________________________<br/>
          <strong>Date:</strong> _______________
        </td>
      </tr>
      ${sectionRow('7. OFFICE USE ONLY')}
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:8pt;margin-top:0">
      <tr>
        <td style="border:1px solid #000;padding:6px;height:50px;width:20%;vertical-align:top"><strong>7.1 Received By:</strong></td>
        <td style="border:1px solid #000;padding:6px;height:50px;width:20%;vertical-align:top"><strong>7.2 Verification Conducted By:</strong></td>
        <td style="border:1px solid #000;padding:6px;height:50px;width:20%;vertical-align:top"><strong>7.3 Application Status:</strong></td>
        <td style="border:1px solid #000;padding:6px;height:50px;width:20%;vertical-align:top"><strong>7.4 Reason for not Accepting:</strong></td>
        <td style="border:1px solid #000;padding:6px;height:50px;width:20%;vertical-align:top"><strong>7.5 Certificate issued:</strong></td>
      </tr>
    </table>
  `, 5);

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:9pt;color:#000;width:754px;margin:0 auto;background:#fff">
      ${page1}${page2}${page3}${page4}${page5}
    </div>`;
}

export async function generateApplicationFormBlob(fd: DBEFormData, ref: string): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;left:-9999px;top:0;width:794px;background:#fff';
  container.innerHTML = generateApplicationFormHTML(fd, ref);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL('image/png');
    const canvasAspect = canvas.height / canvas.width;
    const fullImgHeight = pdfWidth * canvasAspect;
    const pages = Math.ceil(fullImgHeight / pdfHeight);

    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -(i * pdfHeight), pdfWidth, fullImgHeight);
    }
    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
}

export interface PopupContent {
  title: string;
  content: {
    whatYouNeed?: string;
    whyRequired?: string;
    howToGet?: string;
    whatIf?: string;
    cost?: string;
    tip?: string;
  };
}

export const documentPopupData: Record<string, PopupContent> = {
  birthCert: {
    title: 'Unabridged Birth Certificate',
    content: {
      whatYouNeed: 'Original unabridged (long form) birth certificate showing both parents\' details.',
      whyRequired: 'DBE needs proof of child\'s identity and age. Must be certified less than 3 months old.',
      howToGet: '✓ If you have original: Get it certified (FREE at police stations, R10-R20 at post office)\n✓ If you don\'t have it: Apply at Home Affairs or online at www.gov.za (6-8 week wait)',
      cost: 'R0-R20 (certification only)',
      tip: 'Order now even if not applying immediately - it takes weeks to arrive!'
    }
  },
  parentId: {
    title: 'Parent ID Document',
    content: {
      whatYouNeed: 'South African ID (green barcoded book or smart card) OR Passport + valid visa/permit if foreign national.',
      whyRequired: 'DBE verifies parent identity and legal guardianship. Both parents\' IDs needed if both will teach.',
      howToGet: '✓ Have damaged ID: Replace at Home Affairs (3-6 weeks)\n✓ Foreign national: Ensure visa/permit is valid for duration of homeschooling',
      cost: 'Certification: FREE at police, R10-R20 at post office',
      tip: 'Smart card IDs can be certified by taking a photo and printing it - ask at the police station.'
    }
  },
  schoolReport: {
    title: 'Child\'s School Report',
    content: {
      whatYouNeed: 'Most recent report card/progress report from current or previous school, signed by principal with school stamp.',
      whyRequired: 'Provides academic baseline for diagnostic assessment. Shows child\'s current level and learning patterns.',
      whatIf: '✓ Child never attended school: No problem! We use developmental milestones instead.\n✓ School won\'t give it: We have a legal request letter template (works 95% of time).\n✓ Not signed by principal: Request signature before submission.',
      tip: 'Even if grades aren\'t great, the report helps us show educational need - don\'t worry about it!'
    }
  },
  transferCert: {
    title: 'Transfer Certificate',
    content: {
      whatYouNeed: 'Official document from previous school confirming child is no longer enrolled there.',
      whyRequired: 'THE FAMOUS CATCH-22: Schools often say "We\'ll issue it when child is placed elsewhere" BUT DBE asks for it in the application!',
      whatIf: '✓ 89% of approved applications used our legal workaround when schools refused\n✓ We include a template letter citing BELA Act that satisfies DBE\n✓ Child never attended school: Mark N/A, no problem!',
      tip: 'Don\'t stress about this one - it\'s the most common problem and we have proven solutions.'
    }
  },
  proofResidence: {
    title: 'Proof of Residence',
    content: {
      whatYouNeed: '✓ Municipal bill (water, electricity, rates)\n✓ Bank statement\n✓ Lease agreement',
      whyRequired: 'MUST BE: In your name (parent applying), dated within last 3 months, shows your physical address.',
      whatIf: 'If you live with family: Need affidavit from homeowner (we provide template) + copy of their proof + their ID + Commissioner signature (FREE at police)',
      cost: 'Certification: R10-R20 per document at post office, FREE at police',
      tip: 'If your bills are in someone else\'s name, the affidavit route works perfectly - we\'ve helped many parents with this.'
    }
  }
};

export const concernsOptions = [
  "Don't know how to write professional motivation letter",
  "Worried my qualifications aren't good enough",
  "Don't understand what educational plan should include",
  "Afraid of rejection and wasting time",
  "Concerned about site visits or verification",
  "Don't have supporting letters (medical/work/religious)",
  "Currently homeschooling but not DBE registered (anxious!)",
  "Child has been out of school - worried about explaining gap",
  "Overwhelmed by the entire process",
  "Don't understand legal requirements (BELA Act, policies)",
  "Worried about ongoing reporting obligations",
  "Concerned about curriculum requirements"
];

export const idealPackageOptions = [
  "Completed official DBE application form (all 103 fields)",
  "Professional motivation letter (your story, DBE language)",
  "Comprehensive educational plan (CAPS-aligned, grade-specific)",
  "Diagnostic assessment report (professional analysis)",
  "Email template with submission instructions",
  "Document certification guide (where to go, costs)",
  "Timeline tracker (60-day rule, follow-up schedule)",
  "Response templates (if DBE requests clarifications)",
  "Site visit preparation guide (what to expect)",
  "Legal compliance checklist (BELA Act requirements)",
  "All of the above (complete peace of mind!)"
];

export const provinceNotes: Record<string, string> = {
  gauteng: '📋 Evidence-based motivation letters are valued. We provide professional language that satisfies requirements.',
  westernCape: '⏰ September deadline for January starts. Our timeline tracker helps you submit early.',
  kzn: '🏫 Liaison school requirements in some districts. We help identify options and include documentation.',
  easternCape: '📧 District office processing. We provide correct contact details and submission guidance.',
  freeState: '✓ Straightforward requirements following national guidelines closely.',
  limpopo: '📝 Year-round applications accepted. Faster responses before June typically.',
  mpumalanga: '✓ National guidelines closely followed. Standard documentation approach works well.',
  northWest: '📞 In-person submission preferred at district offices. We provide directions and checklists.',
  northernCape: '✓ Smallest province with typically fast response times. Personal service expected.'
};

export const gradeOptions = [
  { value: 'gradeR', label: 'Grade R' },
  { value: 'grade1', label: 'Grade 1' },
  { value: 'grade2', label: 'Grade 2' },
  { value: 'grade3', label: 'Grade 3' },
  { value: 'grade4', label: 'Grade 4' },
  { value: 'grade5', label: 'Grade 5' },
  { value: 'grade6', label: 'Grade 6' },
  { value: 'grade7', label: 'Grade 7' },
  { value: 'grade8', label: 'Grade 8' },
  { value: 'grade9', label: 'Grade 9' },
  { value: 'grade10', label: 'Grade 10' },
  { value: 'grade11', label: 'Grade 11' },
  { value: 'grade12', label: 'Grade 12' },
];

export const provinceOptions = [
  { value: 'gauteng', label: 'Gauteng' },
  { value: 'westernCape', label: 'Western Cape' },
  { value: 'kzn', label: 'KwaZulu-Natal' },
  { value: 'easternCape', label: 'Eastern Cape' },
  { value: 'freeState', label: 'Free State' },
  { value: 'limpopo', label: 'Limpopo' },
  { value: 'mpumalanga', label: 'Mpumalanga' },
  { value: 'northWest', label: 'North West' },
  { value: 'northernCape', label: 'Northern Cape' },
];

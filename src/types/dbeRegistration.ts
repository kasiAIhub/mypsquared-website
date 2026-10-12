export interface PreviousSchoolDetails {
  schoolName: string;
  province: string;
  gradeCompleted: string;
  contactNumber: string;
  physicalAddress: string;
}

export interface AddressInfo {
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Parent2Info {
  fullName: string;
  idNumber: string;
  email: string;
  phone: string;
  title: string;
  relationship: string;
  qualification: string;
  employment: string;
  populationGroup: string;
}

export interface TutorDetails {
  name: string;
  qualifications: string;
}

export interface DBEFormData {
  // Province
  province: string;

  // Step 1: Parent
  parentFullName: string;
  parentIdNumber: string;
  parentEmail: string;
  parentPhone: string;
  parentTitle: string;
  parentRelationship: string;
  parentQualification: string;
  parentEmployment: string;
  parentPopulationGroup: string;
  parentMaritalStatus: string;
  address: AddressInfo;
  parent2: Parent2Info;
  soleParent: boolean;

  // Step 2: Child
  childFullName: string;
  childDOB: string;
  childIdNumber: string;
  childGender: string;
  childPopulationGroup: string;
  gradeApplying: string;
  applicationYear: string;
  previousSchool: string;
  previousSchoolDetails: PreviousSchoolDetails;
  disabilities: string[];
  disabilityOther: string;

  // Step 3: Circumstances
  circumstanceTriggers: string[];
  circumstanceOther: string;
  circumstanceNarrative: string;
  childNeeds: string;
  educationVision: string;

  // Step 4: Learning Plan
  learningSpace: string;
  learningResources: string[];
  chosenCurriculum: string;
  subjects: string[];
  subjectsOther: string;
  dailyHours: string;
  weeklyDays: string;
  usesTutor: string;
  tutorDetails: TutorDetails;
  assessorCommitment: string;

  // Step 4 extras
  extramurals: string[];
  extramuralsSport: string;
  extramuralsLanguage: string;
  extramuralsOther: string;

  // Step 5: Motivation
  childLearnerProfile: string;
  academicPerformance: string;
  reportAverage: string;
  schoolIncident: string;
  parentBackground: string;
  supportingDocs: string[];

  // POPIA consent
  popiaConsent1?: boolean;
  popiaConsent2?: boolean;

  // System
  referenceNumber?: string;
}

export const initialFormData: DBEFormData = {
  province: '',
  parentFullName: '',
  parentIdNumber: '',
  parentEmail: '',
  parentPhone: '',
  parentTitle: '',
  parentRelationship: '',
  parentQualification: '',
  parentEmployment: '',
  parentPopulationGroup: '',
  parentMaritalStatus: '',
  address: { street: '', suburb: '', city: '', province: '', postalCode: '' },
  parent2: { fullName: '', idNumber: '', email: '', phone: '', title: '', relationship: '', qualification: '', employment: '', populationGroup: '' },
  soleParent: false,
  childFullName: '',
  childDOB: '',
  childIdNumber: '',
  childGender: '',
  childPopulationGroup: '',
  gradeApplying: '',
  applicationYear: '2026',
  previousSchool: '',
  previousSchoolDetails: { schoolName: '', province: '', gradeCompleted: '', contactNumber: '', physicalAddress: '' },
  disabilities: [],
  disabilityOther: '',
  circumstanceTriggers: [],
  circumstanceOther: '',
  circumstanceNarrative: '',
  childNeeds: '',
  educationVision: '',
  learningSpace: '',
  learningResources: [],
  chosenCurriculum: '',
  subjects: [],
  subjectsOther: '',
  dailyHours: '',
  weeklyDays: '',
  usesTutor: '',
  tutorDetails: { name: '', qualifications: '' },
  assessorCommitment: '',
  extramurals: [],
  extramuralsSport: '',
  extramuralsLanguage: '',
  extramuralsOther: '',
  childLearnerProfile: '',
  academicPerformance: '',
  reportAverage: '',
  schoolIncident: '',
  parentBackground: '',
  supportingDocs: [],
  popiaConsent1: false,
  popiaConsent2: false,
};

export const provinces = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
];

export const titleOptions = ['Ms', 'Mrs', 'Mr', 'Dr', 'Prof', 'Other'];
export const relationshipOptions = ['Mother', 'Father', 'Legal Guardian', 'Grandmother', 'Grandfather', 'Other'];
export const qualificationOptions = ['Grade 12 / Matric', 'Certificate', 'Diploma', 'Degree', 'Postgraduate', 'Other'];
export const employmentOptions = ['Employed', 'Self-employed', 'Unemployed', 'Other'];
export const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Co-parenting / Separated'];
export const populationOptions = ['African / Black', 'Coloured', 'Indian / Asian', 'White', 'Other', 'Prefer not to say'];
export const gradeOptions = ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];
export const yearOptions = ['2025', '2026', '2027'];
export const previousSchoolOptions = ['Yes, currently enrolled', 'Previously enrolled', 'Never been enrolled'];

export const disabilityOptions = [
  'Epilepsy', 'Partial sighted / low vision', 'Physical disability', 'Blindness',
  'Attention Deficit Disorder (ADD/ADHD)', 'Autistic Spectrum Disorder', 'Deafness',
  'Severe intellectual disability', 'Behavioural disorder', 'Hard of hearing',
  'Mild to moderate intellectual disability', 'Specific learning disability',
  'Cerebral palsy', 'Other', 'No diagnosed conditions',
];

export const circumstanceOptions = [
  'Safety or bullying concerns', 'Learning needs not being met', 'Family relocation',
  "Child's health", "Family member's health / caregiving", 'Financial circumstances changed',
  'Work or business demands', 'Values or beliefs alignment', 'Learning difference or special need',
  'Dissatisfaction with school quality', 'Religious convictions', 'Nomadic or travelling lifestyle',
  'Lack of admission to suitable school', 'Other',
];

export const curriculumOptions = [
  'CAPS-aligned materials', 'IEB materials', 'Cambridge Primary / International',
  'Combination of materials', 'Online school programme', 'My own programme', 'Not decided yet',
];

export const subjectOptions = [
  'English Home Language', 'Mathematics', 'Natural Sciences and Technology',
  'Social Sciences (History & Geography)', 'Life Skills', 'Afrikaans First Additional Language',
  'isiZulu First Additional Language', 'Another African language', 'Coding and Robotics',
  'Creative Arts', 'Physical Education', 'Other',
];

export const extramuralOptions = [
  'Sport',
  'Music lessons',
  'Art or creative classes',
  'Drama or performing arts',
  'Religious instruction',
  'Community service or volunteering',
  'Coding or technology clubs',
  'Language classes',
  'Science clubs or projects',
  'Library visits',
  'Educational excursions',
  'Home economics / life skills activities',
  'Other',
];

export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PSQ-${year}-${rand}`;
}

export const supportingDocOptions = [
  'Medical or psychological assessment report', 'Letter from school about bullying / incident',
  "Doctor's letter regarding health", "Educational psychologist's report",
  'Proof of relocation', 'Letter from employer / business',
  'Court order (custody / guardianship)', 'Previous school reports', 'None yet',
];

export const provinceEmails: Record<string, string> = {
  'Gauteng': 'gdehomeeducation@gauteng.gov.za',
  'Western Cape': 'homebased.education@westerncape.gov.za',
  'Eastern Cape': 'Mzwandile.Sotyato@ecdoe.gov.za',
  'KwaZulu-Natal': 'Dineo.Motloli@kzndoe.gov.za',
  'Limpopo': 'SetlhakoMI@edu.limpopo.gov.za',
  'Mpumalanga': 'mpumalanga-office@example.org',
  'Free State': 'N.Mokone@fseducation.gov.za',
  'North West': 'nweducation@nwpg.gov.za',
  'Northern Cape': 'eurekaboikanyo@ncdoe.gov.za',
};

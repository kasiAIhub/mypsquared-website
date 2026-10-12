export interface AssessmentAnswers {
  documents: {
    birthCertificate: boolean;
    parentId: boolean;
    schoolReport: boolean;
    transferCertificate: boolean;
    proofOfResidence: boolean;
    noneOfThese: boolean;
  };
  timeline: 'urgent' | '1-3months' | '3-6months' | '6plus' | 'noTimeline' | '';
  qualification: 'postgraduate' | 'undergraduate' | 'matric' | 'someHighSchool' | 'noFormal' | '';
  experience: 'formalEmployment' | 'selfEmployed' | 'volunteer' | 'stayAtHome' | 'betweenOpportunities' | 'retired' | '';
  experienceField: string;
  reasons: string[];
  evidenceTypes: string[];
  concerns: string[];
  idealPackage: string[];
  province: 'gauteng' | 'westernCape' | 'kzn' | 'easternCape' | 'freeState' | 'limpopo' | 'mpumalanga' | 'northWest' | 'northernCape' | '';
  grade: string;
  childName: string;
  currentSituation: 'publicPrivateSchool' | 'onlineSchool' | 'informalHomeschool' | 'alreadyHomeschoolingRegistered' | 'atHome' | 'neverAttended' | 'transitioning' | '';
  email: string;
  phone: string;
  firstName: string;
  optInPriorityList: boolean;
  optInGuide: boolean;
  optInUpdates: boolean;
}

export interface AssessmentScore {
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  level: 'green' | 'yellow' | 'red';
  levelLabel: string;
  breakdown: {
    documentScore: number;
    documentMax: number;
    timelineScore: number;
    timelineMax: number;
    parentScore: number;
    parentMax: number;
    motivationScore: number;
    motivationMax: number;
  };
  urgencyFlags: {
    informalHomeschooler: boolean;
    childOutOfSchool: boolean;
    urgentTimeline: boolean;
    experiencedHomeschooler: boolean;
  };
}

export interface VocAnswers {
  serviceEnhancement: string;
  personalContext: string;
  pricingPreference: string;
}

export const initialAssessmentAnswers: AssessmentAnswers = {
  documents: {
    birthCertificate: false,
    parentId: false,
    schoolReport: false,
    transferCertificate: false,
    proofOfResidence: false,
    noneOfThese: false,
  },
  timeline: '',
  qualification: '',
  experience: '',
  experienceField: '',
  reasons: [],
  evidenceTypes: [],
  concerns: [],
  idealPackage: [],
  province: '',
  grade: '',
  childName: '',
  currentSituation: '',
  email: '',
  phone: '',
  firstName: '',
  optInPriorityList: true,
  optInGuide: false,
  optInUpdates: false,
};

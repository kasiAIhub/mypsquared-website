export interface IntakeData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: string;
  currentGrade: string;
  currentSchooling: string;
}

export interface LearningProfileQuestion {
  id: string;
  question: string;
  category: 'learning_style' | 'academic' | 'social' | 'interests' | 'challenges' | 'circumstance' | 'mission' | 'values' | 'goals' | 'services';
  type: 'single' | 'multiple' | 'scale' | 'text' | 'multiple_with_other' | 'goals';
  description?: string;
  subtitle?: string;
  placeholder?: string;
  optional?: boolean;
  maxLength?: number;
  options?: Array<{
    value: string;
    label: string;
    score?: number;
  }>;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface LearningProfileAnswer {
  questionId: string;
  answer: string | string[] | number | GoalsAnswer;
  otherText?: string;
}

export interface GoalsAnswer {
  goal_1: string;
  goal_2: string;
  goal_3: string;
}

export interface LearningProfileData {
  intakeData: IntakeData;
  answers: LearningProfileAnswer[];
  completedAt: string;
}

export interface ProfileAnalysis {
  learningStyle: {
    primary: string;
    secondary: string;
    description: string;
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  academicReadiness: {
    score: number;
    description: string;
  };
  socialEmotional: {
    score: number;
    description: string;
  };
  interestAreas: string[];
}

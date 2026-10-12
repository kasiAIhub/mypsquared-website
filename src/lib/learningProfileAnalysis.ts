import { LearningProfileData, ProfileAnalysis, LearningProfileAnswer } from '@/types/learningProfile';
import { learningProfileQuestions } from './learningProfileQuestions';

export function generateProfileAnalysis(data: LearningProfileData): ProfileAnalysis {
  const answers = data.answers;

  const learningStyle = analyzeLearningStyle(answers);
  const strengths = analyzeStrengths(answers);
  const challenges = analyzeChallenges(answers);
  const recommendations = generateRecommendations(answers, learningStyle);
  const academicReadiness = analyzeAcademicReadiness(answers);
  const socialEmotional = analyzeSocialEmotional(answers);
  const interestAreas = analyzeInterests(answers);

  return {
    learningStyle,
    strengths,
    challenges,
    recommendations,
    academicReadiness,
    socialEmotional,
    interestAreas
  };
}

function getAnswer(answers: LearningProfileAnswer[], questionId: string): any {
  return answers.find(a => a.questionId === questionId)?.answer;
}

function analyzeLearningStyle(answers: LearningProfileAnswer[]) {
  const q1Answer = getAnswer(answers, 'q1') as string[] || [];
  const q2Answer = getAnswer(answers, 'q2');
  const q3Answer = getAnswer(answers, 'q3') as number;
  const q12Answer = getAnswer(answers, 'q12');
  const q13Answer = getAnswer(answers, 'q13');

  const styleMap: Record<string, string> = {
    visual: 'Visual Learner',
    auditory: 'Auditory Learner',
    kinesthetic: 'Kinesthetic Learner',
    reading: 'Reading/Writing Learner',
    social: 'Social Learner'
  };

  const primary = q1Answer[0] ? styleMap[q1Answer[0]] : 'Multimodal Learner';
  const secondary = q1Answer[1] ? styleMap[q1Answer[1]] : 'Flexible Learning Style';

  let description = `Your child is primarily a ${primary}`;

  if (q3Answer >= 4) {
    description += ' who works well independently';
  } else if (q3Answer <= 2) {
    description += ' who benefits from guided support';
  }

  if (q13Answer === 'needs_high') {
    description += ' and thrives with clear structure and routine.';
  } else if (q13Answer === 'flexible' || q13Answer === 'resists') {
    description += ' and prefers flexibility and exploration.';
  } else {
    description += ' with moderate structure providing the best balance.';
  }

  return { primary, secondary, description };
}

function analyzeStrengths(answers: LearningProfileAnswer[]): string[] {
  const strengths: string[] = [];
  const q4Answer = getAnswer(answers, 'q4') as string[] || [];
  const q6Answer = getAnswer(answers, 'q6');
  const q3Answer = getAnswer(answers, 'q3') as number;
  const q11Answer = getAnswer(answers, 'q11') as number;

  if (q4Answer.includes('math')) strengths.push('Strong mathematical reasoning');
  if (q4Answer.includes('language')) strengths.push('Excellent language and communication skills');
  if (q4Answer.includes('science')) strengths.push('Scientific thinking and curiosity');
  if (q4Answer.includes('creative')) strengths.push('Creative and artistic abilities');
  if (q4Answer.includes('technology')) strengths.push('Technical and digital literacy');

  if (q6Answer === 'excellent') {
    strengths.push('High academic performance and achievement');
  }

  if (q3Answer >= 4) {
    strengths.push('Independent and self-motivated learner');
  }

  if (q11Answer >= 4) {
    strengths.push('Resilient with strong problem-solving skills');
  }

  if (strengths.length === 0) {
    strengths.push('Developing skills across multiple areas');
  }

  return strengths;
}

function analyzeChallenges(answers: LearningProfileAnswer[]): string[] {
  const challenges: string[] = [];
  const q5Answer = getAnswer(answers, 'q5') as string[] || [];
  const q7Answer = getAnswer(answers, 'q7') as string[] || [];
  const q3Answer = getAnswer(answers, 'q3') as number;
  const q8Answer = getAnswer(answers, 'q8');
  const q11Answer = getAnswer(answers, 'q11') as number;

  if (q5Answer.includes('math')) challenges.push('Mathematics requires additional support');
  if (q5Answer.includes('language')) challenges.push('Language arts may need extra attention');
  if (q5Answer.includes('science')) challenges.push('Science concepts may require scaffolding');

  if (q7Answer.includes('adhd')) challenges.push('ADHD considerations for focus and organization');
  if (q7Answer.includes('autism')) challenges.push('Autism spectrum support needs');
  if (q7Answer.includes('dyslexia')) challenges.push('Reading and processing accommodations needed');
  if (q7Answer.includes('anxiety')) challenges.push('Anxiety management and emotional support');

  if (q3Answer <= 2) {
    challenges.push('Benefits from consistent guidance and support');
  }

  if (q8Answer === 'struggles') {
    challenges.push('Social skills development needed');
  }

  if (q11Answer <= 2) {
    challenges.push('Building resilience and frustration tolerance');
  }

  if (challenges.length === 0) {
    challenges.push('No significant challenges identified at this time');
  }

  return challenges;
}

function generateRecommendations(answers: LearningProfileAnswer[], learningStyle: any): string[] {
  const recommendations: string[] = [];
  const q1Answer = getAnswer(answers, 'q1') as string[] || [];
  const q2Answer = getAnswer(answers, 'q2');
  const q3Answer = getAnswer(answers, 'q3') as number;
  const q7Answer = getAnswer(answers, 'q7') as string[] || [];
  const q9Answer = getAnswer(answers, 'q9') as number;
  const q13Answer = getAnswer(answers, 'q13');

  if (q1Answer.includes('visual')) {
    recommendations.push('Use visual aids, diagrams, and educational videos extensively');
  }
  if (q1Answer.includes('kinesthetic')) {
    recommendations.push('Incorporate hands-on activities, experiments, and movement breaks');
  }
  if (q1Answer.includes('auditory')) {
    recommendations.push('Leverage audio resources, discussions, and verbal explanations');
  }

  if (q2Answer === 'fast') {
    recommendations.push('Consider enrichment activities and accelerated learning opportunities');
  } else if (q2Answer === 'slow') {
    recommendations.push('Allow extra time for processing and mastery of concepts');
  }

  if (q3Answer <= 2) {
    recommendations.push('Provide structured daily check-ins and clear learning milestones');
  } else if (q3Answer >= 4) {
    recommendations.push('Foster independence with project-based and self-directed learning');
  }

  if (q9Answer >= 4) {
    recommendations.push('Prioritize programs with regular peer interaction and collaborative activities');
  } else if (q9Answer <= 2) {
    recommendations.push('Independent study with optional social components works well');
  }

  if (q13Answer === 'needs_high') {
    recommendations.push('Choose structured programs with consistent routines and clear expectations');
  }

  if (q7Answer.length > 0 && !q7Answer.includes('none')) {
    recommendations.push('Seek curriculum with built-in accommodations and differentiated instruction');
  }

  return recommendations;
}

function analyzeAcademicReadiness(answers: LearningProfileAnswer[]) {
  const q6Answer = getAnswer(answers, 'q6');
  const q5Answer = getAnswer(answers, 'q5') as string[] || [];

  const scoreMap: Record<string, number> = {
    excellent: 5,
    good: 4,
    average: 3,
    below: 2,
    struggling: 1
  };

  const score = scoreMap[q6Answer as string] || 3;

  let description = '';
  if (score >= 4) {
    description = 'Your child demonstrates strong academic readiness and is performing well across subjects.';
  } else if (score === 3) {
    description = 'Your child shows solid academic foundations with room for growth in specific areas.';
  } else {
    description = 'Your child would benefit from targeted support to build academic confidence and skills.';
  }

  if (q5Answer.length > 2 && !q5Answer.includes('none')) {
    description += ' Focus on addressing challenges in multiple subject areas.';
  }

  return { score, description };
}

function analyzeSocialEmotional(answers: LearningProfileAnswer[]) {
  const q8Answer = getAnswer(answers, 'q8');
  const q11Answer = getAnswer(answers, 'q11') as number || 3;

  const scoreMap: Record<string, number> = {
    very_social: 5,
    social: 4,
    selective: 3,
    shy: 2,
    struggles: 1
  };

  const socialScore = scoreMap[q8Answer as string] || 3;
  const resilienceScore = q11Answer;

  const score = Math.round((socialScore + resilienceScore) / 2);

  let description = '';
  if (score >= 4) {
    description = 'Your child demonstrates strong social-emotional skills with good peer relationships and resilience.';
  } else if (score === 3) {
    description = 'Your child shows developing social-emotional skills with typical strengths and growth areas.';
  } else {
    description = 'Your child would benefit from additional social-emotional support and skill-building opportunities.';
  }

  return { score, description };
}

function analyzeInterests(answers: LearningProfileAnswer[]): string[] {
  const q10Answer = getAnswer(answers, 'q10') as string[] || [];

  const interestMap: Record<string, string> = {
    sports: 'Sports and Physical Activities',
    arts: 'Arts and Creative Expression',
    music: 'Music and Performance',
    reading: 'Reading and Literature',
    stem: 'STEM (Science, Technology, Engineering, Math)',
    gaming: 'Digital Media and Gaming',
    nature: 'Nature and Environmental Studies',
    building: 'Construction and Engineering'
  };

  return q10Answer.map(interest => interestMap[interest] || interest);
}

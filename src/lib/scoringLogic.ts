import { AssessmentAnswers, AssessmentScore } from '@/types/assessment';

export function calculateScore(answers: AssessmentAnswers): AssessmentScore {
  // Document score (max 15)
  let documentScore = 0;
  if (!answers.documents.noneOfThese) {
    const docs = [
      answers.documents.birthCertificate,
      answers.documents.parentId,
      answers.documents.schoolReport,
      answers.documents.transferCertificate,
      answers.documents.proofOfResidence
    ];
    documentScore = docs.filter(Boolean).length * 3;
  }

  // Timeline score (max 3)
  const timelineScores: Record<string, number> = { 
    urgent: 3, 
    '1-3months': 3, 
    '3-6months': 3, 
    '6plus': 2, 
    noTimeline: 1,
    '': 0
  };
  const timelineScore = timelineScores[answers.timeline] || 0;

  // Qualification score (max 4)
  const qualScores: Record<string, number> = { 
    postgraduate: 4, 
    undergraduate: 3, 
    matric: 2, 
    someHighSchool: 2, 
    noFormal: 1,
    '': 0
  };
  const qualScore = qualScores[answers.qualification] || 0;

  // Experience score (max 4)
  const expScores: Record<string, number> = { 
    formalEmployment: 4, 
    selfEmployed: 4, 
    volunteer: 3, 
    stayAtHome: 3, 
    betweenOpportunities: 2, 
    retired: 3,
    '': 0
  };
  const expScore = expScores[answers.experience] || 0;

  // Motivation scores - now based on arrays
  // Reasons: 1 reason = 1pt, 2 reasons = 2pts, 3 reasons = 3pts (max 3)
  const reasonScore = Math.min(answers.reasons.length, 3);

  // Evidence: score based on quality and quantity
  // Strong evidence (doctor/psychologist) = 2pts each, others = 1pt each
  const strongEvidence = ['doctorReports', 'psychologistAssessment'];
  const evidenceScore = answers.evidenceTypes.reduce((score, type) => {
    if (strongEvidence.includes(type)) return score + 2;
    if (type === 'noneYet') return score + 0.5; // Half point for planning to gather
    return score + 1;
  }, 0);
  const cappedEvidenceScore = Math.min(evidenceScore, 4); // Cap at 4 points

  // Situation bonus (max 2) - Experience counts positively
  let situationBonus = 0;
  if (answers.currentSituation === 'alreadyHomeschoolingRegistered') {
    situationBonus = 2; // Already registered and experienced
  } else if (answers.currentSituation === 'onlineSchool') {
    situationBonus = 1; // Some remote learning experience
  }

  const parentScore = qualScore + expScore;
  const motivationScore = reasonScore + cappedEvidenceScore;
  const totalPoints = documentScore + timelineScore + parentScore + motivationScore + situationBonus;
  const maxPoints = 36;
  const percentage = Math.round((totalPoints / maxPoints) * 100);

  let level: 'green' | 'yellow' | 'red';
  let levelLabel: string;
  if (totalPoints >= 22) { 
    level = 'green'; 
    levelLabel = 'Strong Foundation'; 
  } else if (totalPoints >= 11) { 
    level = 'yellow'; 
    levelLabel = 'Building Readiness'; 
  } else { 
    level = 'red'; 
    levelLabel = 'Early Stage'; 
  }

  return {
    totalPoints,
    maxPoints,
    percentage,
    level,
    levelLabel,
    breakdown: {
      documentScore,
      documentMax: 15,
      timelineScore,
      timelineMax: 3,
      parentScore,
      parentMax: 8,
      motivationScore,
      motivationMax: 7
    },
    urgencyFlags: {
      informalHomeschooler: answers.currentSituation === 'informalHomeschool',
      childOutOfSchool: answers.currentSituation === 'atHome' || answers.currentSituation === 'neverAttended',
      urgentTimeline: answers.timeline === 'urgent',
      experiencedHomeschooler: answers.currentSituation === 'alreadyHomeschoolingRegistered'
    }
  };
}

export function getScoreColor(level: 'green' | 'yellow' | 'red'): string {
  switch (level) {
    case 'green': return 'text-primary';
    case 'yellow': return 'text-yellow-500';
    case 'red': return 'text-red-500';
  }
}

export function getScoreBgColor(level: 'green' | 'yellow' | 'red'): string {
  switch (level) {
    case 'green': return 'bg-primary/10 border-primary';
    case 'yellow': return 'bg-yellow-500/10 border-yellow-500';
    case 'red': return 'bg-red-500/10 border-red-500';
  }
}

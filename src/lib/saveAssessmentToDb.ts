import { supabase } from "@/integrations/supabase/client";
import { LearningProfileData, LearningProfileAnswer, GoalsAnswer } from "@/types/learningProfile";
import { generateProfileAnalysis } from "./learningProfileAnalysis";

function getAnswer(answers: LearningProfileAnswer[], questionId: string): any {
  return answers.find(a => a.questionId === questionId)?.answer;
}

function getOtherText(answers: LearningProfileAnswer[], questionId: string): string | null {
  return answers.find(a => a.questionId === questionId)?.otherText || null;
}

export async function saveAssessmentToDatabase(profileData: LearningProfileData): Promise<string | null> {
  try {
    const analysis = generateProfileAnalysis(profileData);
    const { intakeData, answers } = profileData;

    // Q15-Q19 removed from form — set to null
    const circumstanceTriggers: string[] = [];
    const circumstanceOther: string | null = null;
    const educationPriorities: string[] = [];
    const educationPrioritiesOther: string | null = null;
    const parentingApproach: string | null = null;
    const goalsAnswer: GoalsAnswer | undefined = undefined;
    const desiredServices: string | null = null;

    // Build learning style scores from raw answers
    const learningStyleScores: Record<string, any> = {};
    answers.forEach(a => {
      learningStyleScores[a.questionId] = a.answer;
    });

    const payload = {
      child_name: intakeData.childName,
      grade: intakeData.currentGrade,
      parent_name: intakeData.parentName || null,
      parent_email: intakeData.parentEmail,
      parent_phone: intakeData.parentPhone || null,
      learning_style: analysis.learningStyle.primary,
      learning_style_scores: learningStyleScores,
      curriculum_recommendations: {
        strengths: analysis.strengths,
        challenges: analysis.challenges,
        recommendations: analysis.recommendations,
        academicReadiness: analysis.academicReadiness,
        socialEmotional: analysis.socialEmotional,
        interestAreas: analysis.interestAreas,
        learningStyle: analysis.learningStyle,
      },
      top_curriculum: null,
      circumstance_triggers: circumstanceTriggers,
      circumstance_other: circumstanceOther,
      education_priorities: educationPriorities,
      parenting_approach: parentingApproach,
      mission: educationPrioritiesOther || null,
      values: null,
      goals: goalsAnswer ? JSON.parse(JSON.stringify(goalsAnswer)) : null,
      desired_services: desiredServices,
    };

    const { data, error } = await supabase
      .from('assessments')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      console.error('Failed to save assessment:', error.message);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Failed to save assessment:', err);
    return null;
  }
}

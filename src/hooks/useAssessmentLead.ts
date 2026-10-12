import { supabase } from "@/integrations/supabase/client";
import { AssessmentAnswers, AssessmentScore, VocAnswers } from "@/types/assessment";

export interface LeadData {
  answers: AssessmentAnswers;
  score: AssessmentScore;
  vocAnswers?: VocAnswers;
  reservedSpot?: boolean;
}

export const saveAssessmentLead = async (data: LeadData): Promise<{ id: string } | null> => {
  const { answers, score, vocAnswers, reservedSpot } = data;

  const payload = {
    email: answers.email,
    first_name: answers.firstName || '',
    child_name: answers.childName || null,
    province: answers.province || null,
    grade: answers.grade || null,
    documents: answers.documents,
    timeline: answers.timeline || null,
    qualification: answers.qualification || null,
    experience: answers.experience || null,
    experience_field: answers.experienceField || null,
    reasons: answers.reasons || [],
    evidence_types: answers.evidenceTypes || [],
    concerns: answers.concerns || [],
    ideal_package: answers.idealPackage || [],
    current_situation: answers.currentSituation || null,
    total_points: score.totalPoints,
    max_points: score.maxPoints,
    percentage: score.percentage,
    readiness_level: score.level,
    level_label: score.levelLabel,
    score_breakdown: score.breakdown,
    urgency_flags: score.urgencyFlags,
    opt_in_priority_list: answers.optInPriorityList,
    opt_in_guide: answers.optInGuide,
    opt_in_updates: answers.optInUpdates,
    voc_open_frustration: vocAnswers?.serviceEnhancement || null,
    voc_feature_request: vocAnswers?.personalContext || null,
    voc_pricing_preference: vocAnswers?.pricingPreference || null,
    reserved_spot: reservedSpot || false,
  };

  try {
    const { data: result, error } = await supabase.functions.invoke('submit-assessment', {
      body: payload,
    });

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Assessment submission failed:', error.message);
      }
      return null;
    }

    return result?.id ? { id: result.id } : null;
  } catch {
    if (import.meta.env.DEV) {
      console.error('Assessment submission failed');
    }
    return null;
  }
};

export const updateLeadVoC = async (leadId: string, vocAnswers: VocAnswers): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('update-assessment', {
      body: {
        lead_id: leadId,
        action: 'update_voc',
        voc_open_frustration: vocAnswers.serviceEnhancement || null,
        voc_feature_request: vocAnswers.personalContext || null,
        voc_pricing_preference: vocAnswers.pricingPreference || null,
      },
    });

    if (error) {
      if (import.meta.env.DEV) {
        console.error('VoC update failed:', error.message);
      }
      return false;
    }
    return true;
  } catch {
    if (import.meta.env.DEV) {
      console.error('VoC update failed');
    }
    return false;
  }
};

export const updateLeadReservation = async (leadId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('update-assessment', {
      body: {
        lead_id: leadId,
        action: 'reserve_spot',
      },
    });

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Reservation update failed');
      }
      return false;
    }
    return true;
  } catch {
    if (import.meta.env.DEV) {
      console.error('Reservation update failed');
    }
    return false;
  }
};

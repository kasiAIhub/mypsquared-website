export interface SubscribeFields {
  score?: number;
  scorePercentage?: number;
  level?: string;
  priorityNumber?: number;
  childName?: string;
  grade?: string;
  province?: string;
}

export const subscribeToList = async (
  email: string,
  firstName: string,
  fields: SubscribeFields
): Promise<{ success: boolean; subscriberId?: string; error?: unknown }> => {
  console.log('Email automation disabled for launch');
  return { success: false, error: 'Disabled' };
};

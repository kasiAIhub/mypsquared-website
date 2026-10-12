import { supabase } from '@/integrations/supabase/client';

export type FunnelEventType =
  | 'page_view'
  | 'province_selected'
  | 'step_started'
  | 'step_completed'
  | 'step_abandoned'
  | 'payment_initiated'
  | 'payment_completed'
  | 'payment_failed'
  | 'package_downloaded'
  | 'email_confirmed';

interface FunnelEvent {
  sessionId: string;
  eventType: FunnelEventType;
  stepNumber?: number;
  stepName?: string;
  province?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Anonymously record a funnel event. Never throws — tracking
 * failures must not block the user flow.
 */
export async function trackFunnelEvent(event: FunnelEvent): Promise<void> {
  try {
    await supabase.from('dbe_funnel_events').insert({
      session_id: event.sessionId,
      event_type: event.eventType,
      step_number: event.stepNumber ?? null,
      step_name: event.stepName ?? null,
      province: event.province ?? null,
      metadata: (event.metadata as never) ?? {},
    });
  } catch {
    // Fail silently
  }
}

export const DBE_STEP_NAMES: Record<number, string> = {
  1: 'Your details',
  2: 'Your child',
  3: 'Circumstances',
  4: 'Learning plan',
  5: 'Motivation',
  6: 'Review and payment',
};

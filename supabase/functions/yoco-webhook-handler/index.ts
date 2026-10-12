// Yoco webhook handler — listens for refund / failed / dispute events
// and updates the matching dbe_registrations row.
// Verifies the x-yoco-signature HMAC before trusting any event.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-yoco-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ALERT_TO = 'hello@mypsquared.com';
const ALERT_FROM = 'P-Squared Alerts <onboarding@resend.dev>';

interface YocoEvent {
  type?: string;
  event_type?: string;
  id?: string;
  payload?: { id?: string };
}

async function sendAlertEmail(subject: string, html: string): Promise<void> {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: ALERT_FROM, to: ALERT_TO, subject, html }),
    });
  } catch (err) {
    console.error('alert email failed:', err);
  }
}

// Constant-time comparison
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().toLowerCase().replace(/^0x/, '');
  if (clean.length % 2 !== 0) return new Uint8Array(0);
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}

async function verifyYocoSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!signatureHeader) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(rawBody),
  );
  const expected = new Uint8Array(sig);

  // Yoco may send the signature as raw hex, or as a structured header.
  // Accept either: "<hex>" or "t=...,v1=<hex>" style.
  const candidates: string[] = [];
  candidates.push(signatureHeader);
  for (const part of signatureHeader.split(',')) {
    const [k, v] = part.split('=');
    if (v && (k.trim() === 'v1' || k.trim() === 'sig' || k.trim() === 'signature')) {
      candidates.push(v.trim());
    }
  }

  for (const candidate of candidates) {
    const provided = hexToBytes(candidate);
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) {
      return true;
    }
  }
  return false;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get('YOCO_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('YOCO_WEBHOOK_SECRET not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = await req.text();
    const signatureHeader = req.headers.get('x-yoco-signature');

    const valid = await verifyYocoSignature(body, signatureHeader, webhookSecret);
    if (!valid) {
      console.warn('Invalid Yoco webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const event = JSON.parse(body) as YocoEvent;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const chargeId = event?.payload?.id || event?.id || null;

    if (!chargeId) {
      return new Response(
        JSON.stringify({ received: true, action: 'ignored — no charge id' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { data: registrations, error: findErr } = await supabase
      .from('dbe_registrations')
      .select('id, internal_notes, parent_email, parent_full_name, child_full_name, grade, province')
      .ilike('internal_notes', `%\"yocoChargeId\":\"${chargeId}\"%`);

    if (findErr) {
      console.error('lookup error:', findErr);
    }

    if (!registrations || registrations.length === 0) {
      return new Response(
        JSON.stringify({ received: true, action: 'no matching registration' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const registration = registrations[0];
    const existingNotes: Record<string, unknown> = (() => {
      try {
        return JSON.parse(registration.internal_notes || '{}');
      } catch {
        return {};
      }
    })();

    const eventType = event.type || event.event_type || '';

    if (eventType === 'charge.refunded' || eventType === 'payment.refunded') {
      await supabase
        .from('dbe_registrations')
        .update({
          payment_status: 'refunded',
          internal_notes: JSON.stringify({
            ...existingNotes,
            refundedAt: new Date().toISOString(),
            refundEvent: event,
            adminAlert: 'REFUND — manual review needed',
          }),
        })
        .eq('id', registration.id);

      await sendAlertEmail(
        `⚠️ Refund received — ${registration.child_full_name}`,
        `<h2>Refund Alert</h2>
         <p>A payment has been refunded.</p>
         <p><strong>Parent:</strong> ${registration.parent_full_name} (${registration.parent_email})</p>
         <p><strong>Child:</strong> ${registration.child_full_name} — ${registration.grade}</p>
         <p><strong>Charge ID:</strong> ${chargeId}</p>`,
      );

      return new Response(
        JSON.stringify({ received: true, action: 'refund processed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (eventType === 'charge.failed' || eventType === 'payment.failed') {
      await supabase
        .from('dbe_registrations')
        .update({
          payment_status: 'failed',
          internal_notes: JSON.stringify({
            ...existingNotes,
            failedAt: new Date().toISOString(),
            failEvent: event,
          }),
        })
        .eq('id', registration.id);

      return new Response(
        JSON.stringify({ received: true, action: 'failure recorded' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (eventType === 'charge.disputed' || eventType === 'payment.disputed') {
      await supabase
        .from('dbe_registrations')
        .update({
          payment_status: 'disputed',
          internal_notes: JSON.stringify({
            ...existingNotes,
            disputedAt: new Date().toISOString(),
            disputeEvent: event,
            adminAlert: 'DISPUTE — urgent review needed',
          }),
        })
        .eq('id', registration.id);

      await sendAlertEmail(
        `🚨 URGENT: Payment disputed — ${registration.child_full_name}`,
        `<h2 style="color:#b91c1c">Payment Dispute Alert</h2>
         <p><strong>Parent:</strong> ${registration.parent_full_name} (${registration.parent_email})</p>
         <p><strong>Charge ID:</strong> ${chargeId}</p>`,
      );

      return new Response(
        JSON.stringify({ received: true, action: 'dispute recorded' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ received: true, action: `unhandled: ${eventType}` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('yoco-webhook-handler error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

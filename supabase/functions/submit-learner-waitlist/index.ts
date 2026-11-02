import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GRADES = ['Grade R', ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)] as const;
const CURRICULA = ['CAPS', 'IEB', 'Cambridge', 'Not sure'] as const;
const RATE_LIMIT = 5; // submissions per visitor
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour

const Body = z.object({
  parentName: z.string().trim().min(1).max(100),
  whatsappNumber: z.string().trim().min(1).max(25),
  grade: z.enum(GRADES),
  curriculum: z.enum(CURRICULA),
});

// Accepts SA local (0XXXXXXXXX) or international (+CC...) numbers; returns E.164 or null.
function normalisePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-().]/g, '');
  if (/^0[6-8]\d{8}$/.test(cleaned) || /^0[1-5]\d{8}$/.test(cleaned)) return '+27' + cleaned.slice(1);
  const intl = cleaned.startsWith('00') ? '+' + cleaned.slice(2) : cleaned;
  if (/^\+[1-9]\d{7,14}$/.test(intl)) return intl;
  if (/^27\d{9}$/.test(cleaned)) return '+' + cleaned;
  return null;
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const fail = (status = 400) =>
  new Response(JSON.stringify({ error: 'Something went wrong. Please check your details and try again.' }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return fail(405);

  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return fail(400);
    const phone = normalisePhone(parsed.data.whatsappNumber);
    if (!phone) return fail(400);

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
    const visitor = await sha256(ip + (req.headers.get('user-agent') ?? ''));
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count } = await supabase
      .from('waitlist_rate_limits')
      .select('id', { count: 'exact', head: true })
      .eq('visitor_hash', visitor)
      .gte('created_at', since);
    if ((count ?? 0) >= RATE_LIMIT) return fail(429);
    await supabase.from('waitlist_rate_limits').insert({ visitor_hash: visitor });

    const { error } = await supabase.from('learner_blueprint_waitlist').insert({
      parent_name: parsed.data.parentName,
      whatsapp_number: phone,
      grade: parsed.data.grade,
      curriculum: parsed.data.curriculum,
    });
    if (error) return fail(400); // includes duplicate number

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return fail(500);
  }
});

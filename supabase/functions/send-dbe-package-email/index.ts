// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const provinceEmails: Record<string, string> = {
  'Gauteng': 'gdehomeeducation@gauteng.gov.za',
  'Western Cape': 'homebased.education@westerncape.gov.za',
  'Eastern Cape': 'Mzwandile.Sotyato@ecdoe.gov.za',
  'KwaZulu-Natal': 'Dineo.Motloli@kzndoe.gov.za',
  'Limpopo': 'SetlhakoMI@edu.limpopo.gov.za',
  'Mpumalanga': 'mpumalanga-office@example.org',
  'Free State': 'N.Mokone@fseducation.gov.za',
  'North West': 'nweducation@nwpg.gov.za',
  'Northern Cape': 'eurekaboikanyo@ncdoe.gov.za',
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !serviceKey) {
      throw new Error('Supabase env vars missing');
    }

    const body = await req.json();
    const { referenceNumber, zipBase64 } = body || {};

    // Strict payload validation — only the reference and the zip are accepted
    // from the client. Recipient details are sourced from the database to
    // prevent the endpoint being abused as an open email relay.
    if (
      typeof referenceNumber !== 'string' ||
      !/^PSQ-\d{4}-\d{4}$/.test(referenceNumber) ||
      typeof zipBase64 !== 'string' ||
      zipBase64.length < 100 ||
      zipBase64.length > 25 * 1024 * 1024 // ~18 MB binary cap
    ) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Look up the registration by reference number stored inside internal_notes
    // (text JSON). If no matching record exists we silently refuse — this stops
    // attackers from triggering email blasts to arbitrary addresses.
    const { data: registrations, error: regErr } = await supabase
      .from('dbe_registrations')
      .select('id, parent_email, parent_full_name, child_full_name, grade, province, created_at, dbe_package_generated')
      .ilike('internal_notes', `%\"referenceNumber\":\"${referenceNumber}\"%`)
      .limit(1);

    if (regErr) {
      console.error('registration lookup error:', regErr);
    }

    const registration = registrations?.[0];
    if (!registration || !registration.parent_email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // One-shot: refuse if already generated/emailed, to prevent enumeration
    // attacks from re-sending attacker-controlled content to real parents.
    if (registration.dbe_package_generated === true) {
      return new Response(
        JSON.stringify({ success: false, error: 'Package already delivered' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Time-window guard: only accept uploads for registrations created in
    // the last 30 minutes (matches the legitimate submit-then-email flow).
    const createdAt = registration.created_at ? new Date(registration.created_at).getTime() : 0;
    if (!createdAt || Date.now() - createdAt > 30 * 60 * 1000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Registration window expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const parentEmail = registration.parent_email;
    const parentName = registration.parent_full_name || 'there';
    const childName = registration.child_full_name || 'Learner';
    const gradeApplying = registration.grade || 'Grade';
    const province = registration.province || '';

    // Decode base64 ZIP
    const binary = atob(zipBase64);
    const zipBuffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) zipBuffer[i] = binary.charCodeAt(i);

    // Validate ZIP magic bytes (PK\x03\x04) so attackers cannot smuggle
    // arbitrary file types (e.g. executables) under a .zip filename.
    if (
      zipBuffer.length < 4 ||
      zipBuffer[0] !== 0x50 || zipBuffer[1] !== 0x4b ||
      zipBuffer[2] !== 0x03 || zipBuffer[3] !== 0x04
    ) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid file format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }


    const safeChild = (childName || 'Learner').replace(/[^A-Za-z0-9]+/g, '_');
    const safeGrade = (gradeApplying || 'Grade').replace(/[^A-Za-z0-9]+/g, '_');
    const filename = `PSQ_${referenceNumber}_${safeChild}_${safeGrade}.zip`;
    const path = `${referenceNumber}/${filename}`;

    // Upload to Storage (service role bypasses RLS)
    const { error: uploadErr } = await supabase.storage
      .from('dbe-packages')
      .upload(path, zipBuffer, {
        contentType: 'application/zip',
        upsert: true,
      });

    if (uploadErr) {
      console.error('Upload error:', uploadErr);
      throw new Error('Storage upload failed: ' + uploadErr.message);
    }

    // Generate 30-day signed URL
    const { data: signedData, error: signedErr } = await supabase.storage
      .from('dbe-packages')
      .createSignedUrl(path, 60 * 60 * 24 * 30);

    if (signedErr) {
      console.error('Signed URL error:', signedErr);
    }
    const signedUrl = signedData?.signedUrl || '';

    // Mark the package as generated (one-shot guard) and store the URL.
    try {
      await supabase
        .from('dbe_registrations')
        .update({
          dbe_package_pdf_url: signedUrl,
          dbe_package_generated: true,
          dbe_package_generated_at: new Date().toISOString(),
        })
        .eq('id', registration.id);
    } catch (updErr) {
      console.warn('Registration update failed', updErr);
    }

    const dbeEmail = provinceEmails[province] || 'gdehomeeducation@gauteng.gov.za';

    if (!resendKey) {
      console.warn('RESEND_API_KEY missing — skipping email send');
      return new Response(
        JSON.stringify({ success: true, signedUrl, emailed: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const safeRef = escapeHtml(referenceNumber);
    const safeParent = escapeHtml(parentName || 'there');
    const safeChildHtml = escapeHtml(childName || 'your child');
    const safeGradeHtml = escapeHtml(gradeApplying || '');
    const safeDbe = escapeHtml(dbeEmail);

    const html = `<!DOCTYPE html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background:#f3f4f6; padding:24px; margin:0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; padding:32px; color:#111827;">
      <h1 style="color:#059669; font-size:22px; margin:0 0 16px;">Your documents are ready, ${safeParent}.</h1>
      <p style="font-size:15px; line-height:1.5; color:#374151;">
        Your DBE home education registration package for
        <strong>${safeChildHtml}</strong> (${safeGradeHtml}) has been prepared.
      </p>

      <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:16px; margin:20px 0; text-align:center;">
        <p style="margin:0; font-size:13px; color:#047857;">Your reference number</p>
        <p style="margin:6px 0 0; font-size:22px; font-weight:700; color:#065f46; letter-spacing:1.5px;">${safeRef}</p>
        <p style="margin:8px 0 0; font-size:12px; color:#047857;">Save this. Use it whenever you contact us.</p>
      </div>

      <p style="margin:0 0 8px; font-size:15px; color:#111827; font-weight:600;">Download your package:</p>
      <p style="margin:0 0 8px;">
        <a href="${signedUrl}" style="display:inline-block; background:#10b981; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-weight:600;">Download ZIP Package</a>
      </p>
      <p style="font-size:12px; color:#6b7280; margin:0 0 24px;">This link expires in 30 days.</p>

      <div style="background:#E8F8F2; border-left:4px solid #10b981; border-radius:6px; padding:16px; margin:20px 0;">
        <h2 style="font-size:15px; color:#065f46; margin:0 0 8px;">Your Learning Coach is included</h2>
        <p style="font-size:14px; color:#374151; line-height:1.6; margin:0 0 8px;">
          Your first 7 days of My Learning Coach are included free with your package.
          Starting tomorrow morning at 7am, you will receive a daily WhatsApp message guiding you
          through your first week of homeschooling — step by step, one day at a time.
        </p>
        <p style="font-size:14px; color:#065f46; font-weight:600; margin:0;">
          Day 1 begins tomorrow. Save this number: ${Deno.env.get('SUPPORT_WHATSAPP') ?? 'our WhatsApp number'}
        </p>
      </div>

      <h2 style="font-size:16px; color:#111827; margin:24px 0 8px;">What to do next</h2>
      <ol style="font-size:14px; color:#374151; line-height:1.6; padding-left:20px; margin:0 0 16px;">
        <li>Download and unzip your package</li>
        <li>Gather your certified documents (see checklist inside the ZIP)</li>
        <li>Submit everything to: <strong>${safeDbe}</strong></li>
        <li>Use subject line: "Home Education Registration — ${safeChildHtml} — ${safeGradeHtml}"</li>
        <li>WhatsApp us your reference once submitted: <strong>${Deno.env.get('SUPPORT_WHATSAPP') ?? 'our WhatsApp number'}</strong></li>
      </ol>

      <div style="background:#fefce8; border:1px solid #fde68a; border-radius:8px; padding:14px; margin:20px 0; font-size:13px; color:#92400e;">
        Under the BELA Act, if the department does not respond within 60 days,
        your application is legally deemed approved. Keep your proof of submission.
      </div>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
      <p style="font-size:12px; color:#6b7280; line-height:1.6; margin:0;">
        P-Squared | mypsquared.com<br />
        Questions? WhatsApp: ${Deno.env.get('SUPPORT_WHATSAPP') ?? 'our WhatsApp number'}<br />
        hello@mypsquared.com
      </p>
    </div>
  </body>
</html>`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'P-Squared <onboarding@resend.dev>',
        to: parentEmail,
        subject: `Your DBE Registration Package is Ready — Ref: ${referenceNumber}`,
        html,
      }),
    });

    const emailJson = await emailRes.json().catch(() => ({}));
    if (!emailRes.ok) {
      console.error('Resend error:', emailRes.status, emailJson);
    }

    return new Response(
      JSON.stringify({ success: true, signedUrl, emailed: emailRes.ok }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    console.error('send-dbe-package-email error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'An internal error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

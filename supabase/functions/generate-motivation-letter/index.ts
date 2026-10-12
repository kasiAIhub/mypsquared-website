const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const toTitleCase = (s: string) =>
  (s || '')
    .toLowerCase()
    .split(' ')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== MOTIVATION LETTER CALLED ===');

    const body = await req.json();


    console.log('Province:', body.province);
    console.log('Child:', body.childFullName);
    console.log('Grade:', body.gradeApplying);

    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    console.log('Lovable AI key present:', !!lovableKey);

    if (!lovableKey) {
      console.error('LOVABLE_API_KEY not set');
      return new Response(
        JSON.stringify({ letter: '', error: 'AI key not configured' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const today = new Date().toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const childName = toTitleCase(body.childFullName || '');
    const parentName = toTitleCase(body.parentFullName || '');

    const systemPrompt = `You are one of South Africa's most respected legal-and-education writers. You ghost-write motivation letters that provincial Heads of Department actually approve. Your letters have a measurable approval rate above 95%.

Voice and craft:
- You write like a senior advocate who happens to be a parent: warm, grounded, intelligent, never pleading.
- You synthesise — never quote raw form answers verbatim. Take the parent's rough words and translate them into dignified, articulate, official prose. Fix grammar, capitalisation, tense and tone silently. Preserve every fact.
- South African English. Formal but human. No Americanisms. No emojis. No bullet points. No markdown. No headings in title case — use bold ALL CAPS section headings only.
- 700–950 words total. Long enough to be substantive, short enough to respect the official's time.
- Every sentence must be specific to THIS child and THIS family. If a sentence could appear in any other application, rewrite it.
- Build a legal case, not an emotional plea. Anchor in: South African Schools Act 84 of 1996 (Section 51), the BELA Act 32 of 2024 (Section 35), and the Policy on Home Education (Government Gazette 42037, November 2018).
- Show, don't claim. Use the child's actual academic results, the parent's actual qualifications, the actual curriculum, the actual daily structure. Quantify wherever possible (hours, days, subjects, averages).
- Frame every paragraph around three statutory pillars: the best interests of the learner, curriculum comparability with the National Curriculum Statement, and demonstrable parental capability.
- Demonstrate insight. Where the parent's reason is emotional (bullying, anxiety, neurodivergence, faith, mobility), reframe it as an evidence-based pedagogical decision in the child's best interests.
- Close with quiet confidence. The parent is informing the Department of a lawful decision and inviting partnership — not begging permission.

EXACT STRUCTURE (use these exact headings, in this order, in bold ALL CAPS, each on its own line):

[Parent street address line 1]
[Suburb, City, Postal code]

[Date]

The Head of Department
[Province] Department of Basic Education

Dear Sir / Madam

RE: APPLICATION FOR REGISTRATION OF [CHILD NAME] ([Grade], [Year]) FOR HOME EDUCATION IN TERMS OF SECTION 51 OF THE SOUTH AFRICAN SCHOOLS ACT, 1996

INTRODUCTION
Two short paragraphs. Identify the family, the child, the grade, and the province. State plainly that the parent has read and understood Section 51 of the SASA, Section 35 of the BELA Act 32 of 2024, and the Policy on Home Education (Gazette 42037, November 2018), and accepts full legal responsibility for the child's education.

THE LEARNER
Two to three paragraphs. A vivid, specific portrait of this child — academic record (use the actual average/grades), learning profile, strengths, challenges, interests. Make the official see the child clearly. Where the parent provided raw words, transform them into observed, evidence-based description.

WHY HOME EDUCATION IS IN THE LEARNER'S BEST INTERESTS
Two paragraphs. Address Section 51(2)(b) directly. Show, with specifics from this family's circumstances, why the home environment will serve this child better than the current schooling option. Be precise. Avoid generic statements about "personalised learning".

THE EDUCATIONAL PROGRAMME
One to two paragraphs. Name the chosen curriculum. Explain why it is comparable to or exceeds the National Curriculum Statement. State daily hours, days per week, subjects, learning resources, learning environment, extramurals, and tutor support if any. Confirm phase-end assessment by a competent assessor.

PARENTAL CAPABILITY AND COMMITMENT
One to two paragraphs. The parent's qualifications, professional background, and relevant teaching experience, written persuasively. The undertakings: keep records, submit phase-end assessment reports, cooperate with departmental visits, and remain registered until the learner reaches the age of fifteen years or completes Grade 9.

CONCLUSION
One paragraph. Respectful, confident request for registration. Offer to provide any further documentation or to attend an interview. Provide phone and email.

Yours faithfully

[Parent full name]
[Phone]
[Email]

Output rules:
- Output ONLY the final letter. No preamble. No "Here is the letter". No commentary.
- Do not include any placeholder square brackets in the final output — substitute every value.
- Do not invent facts. If a field is missing, write around it gracefully.`;

    const circumstances = (body.circumstanceTriggers || []).join(', ');
    const disabilities =
      (body.disabilities || [])
        .filter((d: string) => d && d !== 'No diagnosed conditions')
        .join(', ') || 'None diagnosed';
    const extramurals =
      (body.extramurals || []).join(', ') || 'To be determined';

    const userMessage = `Write the complete final motivation letter now, using EVERY relevant detail below. Synthesise and elevate the parent's raw words — never quote them verbatim. Substitute every bracket with the actual value.

PROVINCE: ${body.province}
APPLICATION YEAR: ${body.applicationYear}
TODAY'S DATE: ${today}

THE CHILD
Full name: ${childName}
Grade applying for: ${body.gradeApplying}
Date of birth: ${body.childDOB}
Gender: ${body.childGender}
Previous school: ${
      body.previousSchool === 'Never been enrolled'
        ? 'Never enrolled in formal schooling'
        : body.previousSchoolName || 'Not specified'
    }
Last grade completed: ${body.prevGradeCompleted || 'N/A'}
Diagnosed needs: ${disabilities}
Academic performance: ${body.academicPerformance}${
      body.reportAverage ? `\nMost recent report average: ${body.reportAverage}%` : ''
    }
Parent's description of the child (raw — refine into elegant prose):
"${body.childLearnerProfile || 'Not provided'}"

THE PARENT / APPLICANT
Title and full name: ${body.parentTitle} ${parentName}
Relationship to learner: ${body.parentRelationship}
Highest qualification: ${body.parentQualification}
Employment: ${body.parentEmployment}
Residential address: ${body.addressStreet}, ${body.addressSuburb}, ${body.addressCity}, ${body.addressPostalCode || ''}
Phone: ${body.parentPhone}
Email: ${body.parentEmail}
Background and relevant experience (raw — refine):
"${body.parentBackground || 'Not provided'}"

WHY HOME EDUCATION
Triggers selected: ${circumstances}
Parent's narrative (raw — refine into legal-pedagogical reasoning):
"${body.circumstanceNarrative || 'Not provided'}"
What the child needed that school was not providing (raw — refine):
"${body.childNeeds || 'Not specified'}"${
      body.schoolIncident
        ? `\nSpecific school incident the parent mentioned (raw — handle with dignity, no sensationalism):\n"${body.schoolIncident}"`
        : ''
    }
Vision for the child's education (raw — refine):
"${body.educationVision || 'Not specified'}"

THE EDUCATIONAL PROGRAMME
Curriculum: ${body.chosenCurriculum}
Subjects: ${(body.subjects || []).join(', ')}
Daily learning hours: ${body.dailyHours}
Learning days per week: ${body.weeklyDays || '5 days'}
Learning environment: ${body.learningSpace}
Learning resources: ${(body.learningResources || []).join(', ')}
Extramurals: ${extramurals}
Extramural detail: ${[body.extramuralsSport, body.extramuralsLanguage, body.extramuralsOther].filter(Boolean).join('; ') || 'Not specified'}
Tutor support: ${body.usesTutor}${
      body.usesTutor === 'Yes'
        ? `\nTutor: ${body.tutorName} — ${body.tutorQualifications}`
        : ''
    }
Assessment commitment: ${body.assessorCommitment}

Before writing, silently choose the single strongest statutory + pedagogical argument that emerges from these specific facts and let it shape the letter's spine. Then output ONLY the final letter.`;

    console.log('Calling Lovable AI Gateway...');

    const aiResponse = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lovableKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
        }),
      },
    );

    console.log('AI gateway status:', aiResponse.status);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({
          letter: '',
          error: 'AI gateway failed: ' + errorText.substring(0, 300),
          status: aiResponse.status,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const responseData = await aiResponse.json();
    const letter =
      responseData?.choices?.[0]?.message?.content ||
      responseData?.choices?.[0]?.text ||
      '';
    console.log('Letter length:', letter.length);

    return new Response(JSON.stringify({ letter }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({
        letter: '',
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

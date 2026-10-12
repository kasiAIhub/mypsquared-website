import jsPDF from 'jspdf';

// ─── Types (kept compatible with existing callers) ──────────────────
export interface FullAssessmentData {
  childName: string;
  grade: string;
  learningStyle: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  academicReadiness: { score: number; description: string };
  socialEmotional: { score: number; description: string };
  interestAreas: string[];
  circumstanceTriggers: string[];
  circumstanceOther: string | null;
  educationPriorities: string[];
  parentingApproach: string | null;
  goals: { goal_1: string; goal_2: string; goal_3: string } | null;
  desiredServices: string | null;
  learningStyleScores?: Record<string, any>;
  parentName?: string;
}

interface CurriculumData {
  key: 'CAMBRIDGE' | 'IEB' | 'CAPS';
  name: string;
  matchScore: number;
  whyFits: string[];
  bestFor: string;
  price: string;
  consideration: string;
}

interface SchoolData {
  rankLabel: string;
  name: string;
  curriculum: string;
  rating: string;
  feeRange: string;
  url: string;
  points: string[];
}

// ─── Colours (RGB) ──────────────────────────────────────────────────
const C = {
  emerald:    [16, 185, 129] as [number, number, number],   // #10B981
  emeraldLt:  [232, 248, 242] as [number, number, number],  // #E8F8F2
  emeraldMid: [209, 250, 229] as [number, number, number],  // #D1FAE5
  navy:       [15, 23, 42]   as [number, number, number],   // #0F172A
  navyMid:    [30, 58, 95]   as [number, number, number],   // #1E3A5F
  slate:      [148, 163, 184] as [number, number, number],  // #94A3B8
  gray700:    [55, 65, 81]   as [number, number, number],   // #374151
  gray500:    [107, 114, 128] as [number, number, number],  // #6B7280
  gray400:    [156, 163, 175] as [number, number, number],  // #9CA3AF
  gray200:    [229, 231, 235] as [number, number, number],  // #E5E7EB
  gray100:    [249, 250, 251] as [number, number, number],  // #F9FAFB
  white:      [255, 255, 255] as [number, number, number],
  blue500:    [96, 165, 250] as [number, number, number],   // #60A5FA secondary bar
  blue600:    [37, 99, 235]  as [number, number, number],   // #2563EB
  blueLt:     [219, 234, 254] as [number, number, number],  // #DBEAFE
  graybar:    [209, 213, 219] as [number, number, number],  // #D1D5DB
  amber:      [245, 158, 11]  as [number, number, number],  // #F59E0B
  slateBg:    [100, 116, 139] as [number, number, number],  // #64748B
};

// Page is 794 x 1123 px (A4 at 96dpi). Use px units for 1:1 spec mapping.
const PW = 794;
const PH = 1123;
const HEADER_H = 56;        // 16px padding * 2 + ~24px content
const FOOTER_H = 38;        // 10px pad + line + small content
const CONTENT_X = 40;
const CONTENT_W = PW - 80;  // 714

// Fonts: jsPDF built-ins. Use times (serif) as Playfair Display, helvetica as Lato.
const FONT_HEAD = 'helvetica';
const FONT_BODY = 'helvetica';

// ─── helpers ────────────────────────────────────────────────────────
function fnOf(name: string) { return (name || '').split(' ')[0] || name; }
function todayZA() {
  return new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

const ARCHETYPE_TRAITS: Record<string, string[]> = {
  'Visual Learner': [
    'Learns best through images, diagrams, and visual storytelling',
    'Colour-coding helps organise and retain complex concepts',
    'Mind maps and visual schedules support planning and focus',
    'Strong spatial awareness and pattern recognition',
    'Videos and demonstrations accelerate understanding significantly',
    'A clutter-free, well-lit workspace improves concentration',
  ],
  'Auditory Learner': [
    'Learns best by hearing information spoken aloud',
    'Discussion, debate, and verbal explanation deepen understanding',
    'Reading aloud and recording notes in their own voice helps retention',
    'Music, rhythm, and rhyme are powerful memory tools',
    'Verbal instructions are more effective than written ones',
    'Podcast-style content and audiobooks suit this pattern well',
  ],
  'Kinesthetic Learner': [
    'Needs to move, touch, and do in order to learn deeply',
    'Hands-on experiments and building projects are essential',
    'Role-playing and real-world application accelerate learning',
    'Movement breaks every 20–30 minutes improve focus and retention',
    'May struggle with extended desk-only or passive learning sessions',
    'Fidgeting tools and standing desks support concentration',
  ],
  'Reading/Writing Learner': [
    'Learns best through reading and writing activities',
    'Note-taking, lists, and written summaries support retention',
    'Prefers written instructions over verbal or visual formats',
    'Regular journaling or written reflection deepens understanding',
    'Essays, reports, and written projects are natural strengths',
    'Annotating texts and rewriting notes in own words aids memory',
  ],
  'Multimodal Learner': [
    'Adapts comfortably across visual, auditory and physical modes',
    'Variety in instruction keeps engagement high',
    'Benefits from blending notes, discussion and hands-on tasks',
    'Strong at translating ideas across formats',
    'May enjoy a mix of media — books, video, projects',
    'Flexible learning environments suit them best',
  ],
  'Social Learner': [
    'Learns best through collaboration and conversation',
    'Group projects and peer feedback fuel growth',
    'Empathy and perspective-taking are natural strengths',
    'Benefits from study buddies and discussion-based curricula',
    'May find isolated study less motivating',
    'Thrives in communities and team learning settings',
  ],
};

const ARCHETYPE_STRENGTHS: Record<string, string[]> = {
  'Visual Learner': [
    'Strong mathematical reasoning and problem-solving',
    'Excellent language and communication skills',
    'High academic performance and achievement',
    'Exceptional memory for visual information and diagrams',
  ],
  'Auditory Learner': [
    'Strong verbal communication and storytelling ability',
    'Excellent listening and recall of spoken information',
    'Natural talent for language, music, and rhythm',
    'Thrives in discussion-based and collaborative environments',
  ],
  'Kinesthetic Learner': [
    'Strong mathematical reasoning and problem-solving',
    'Excellent language and communication skills',
    'High energy and motivation when hands-on learning is available',
    'Quick to grasp physical and spatial concepts',
  ],
  'Reading/Writing Learner': [
    'Strong analytical and written communication skills',
    'Excellent reading comprehension and vocabulary',
    'High attention to detail and structured thinking',
    'Naturally organised — benefits from lists and written plans',
  ],
  'Multimodal Learner': [
    'Adapts comfortably across many learning formats',
    'Strong general comprehension and recall',
    'Versatile problem-solver across subjects',
    'Confident in varied learning environments',
  ],
  'Social Learner': [
    'Strong empathy and people skills',
    'Excellent collaborator and communicator',
    'Natural leadership in group settings',
    'Thrives on feedback and shared learning',
  ],
};

function ensureFourStrengths(provided: string[], style: string): string[] {
  const fallback = ARCHETYPE_STRENGTHS[style] || ARCHETYPE_STRENGTHS['Multimodal Learner'];
  const merged = [...(provided || [])];
  for (const f of fallback) {
    if (merged.length >= 4) break;
    if (!merged.some(s => s.toLowerCase() === f.toLowerCase())) merged.push(f);
  }
  return merged.slice(0, 4);
}

function archetypeIntro(style: string, fn: string): string {
  const map: Record<string, string> = {
    'Kinesthetic Learner': `${fn} learns by doing. Movement, touch, and real-world experience are not distractions — they are the pathway to deep understanding. Build learning around action and ${fn} thrives.`,
    'Visual Learner': `${fn} learns through what they see. Images, diagrams and visual stories light up the path to understanding — the right environment makes complex ideas feel intuitive.`,
    'Auditory Learner': `${fn} learns through listening and conversation. Spoken explanation, discussion, and sound-based learning unlock deep comprehension.`,
    'Reading/Writing Learner': `${fn} thinks in words. Reading, writing and structured notes turn ideas into understanding — and give ${fn} room to go deeper.`,
    'Social Learner': `${fn} learns through people. Collaboration, conversation and connection are not extras — they are the engine of how ${fn} understands the world.`,
    'Multimodal Learner': `${fn} adapts across many ways of learning. The richest growth happens when teaching mixes visual, auditory and hands-on experiences.`,
  };
  return map[style] || map['Multimodal Learner'];
}

function archetypeAdjective(style: string): string {
  const map: Record<string, string> = {
    'Visual Learner': 'visual',
    'Auditory Learner': 'auditory',
    'Kinesthetic Learner': 'kinesthetic',
    'Reading/Writing Learner': 'read-write',
    'Multimodal Learner': 'multimodal',
    'Social Learner': 'social',
  };
  return map[style] || style.replace(/\s*Learner\s*$/i, '').toLowerCase();
}

// Curriculum scoring — returns 3 sorted desc by match
function buildCurricula(style: string, fn: string): CurriculumData[] {
  let cap = 65, ieb = 75, camb = 70;
  if (style.includes('Visual')) { camb += 15; ieb += 5; }
  else if (style.includes('Auditory')) { ieb += 15; camb += 5; }
  else if (style.includes('Kinesthetic')) { camb += 10; cap += 5; }
  else if (style.includes('Read')) { ieb += 10; cap += 10; }

  const out: CurriculumData[] = [
    {
      key: 'CAMBRIDGE',
      name: 'Cambridge International',
      matchScore: Math.min(camb, 100),
      whyFits: [
        `Project-based and inquiry-driven — matches ${fn}'s learning pattern`,
        'Highly visual and hands-on throughout',
        'Flexible subject combinations and personalised pathways',
        'Recognised by 160+ countries and 2,200+ universities',
        `Prepares ${fn} for global citizenship and future options`,
      ],
      bestFor: 'International relocation, global university, visual/kinesthetic learners',
      price: 'R35,000 – R115,000/year depending on provider and tier',
      consideration: 'Premium pricing; parental guidance needed to stay on track',
    },
    {
      key: 'IEB',
      name: 'IEB',
      matchScore: Math.min(ieb, 100),
      whyFits: [
        'Emphasises critical thinking and higher-order analysis',
        'Discussion and project-based assessments with real depth',
        'Excellent reputation at SA and international universities',
        'Produces confident, independent thinkers',
      ],
      bestFor: 'University-bound, analytical thinkers, academic excellence',
      price: 'R25,000 – R75,000/year',
      consideration: 'Higher workload — monitor for burnout; strong self-management required',
    },
    {
      key: 'CAPS',
      name: 'CAPS',
      matchScore: Math.min(cap, 100),
      whyFits: [
        'Aligned with government schools — easy transfer if needed',
        'Locally relevant content and SA context',
        'Accepted by all SA universities and employers',
        'Widest price range — suits all budgets',
      ],
      bestFor: 'Long-term SA families, budget-conscious, government school transfers',
      price: 'R2,000 – R96,000/year',
      consideration: 'More content-heavy; supplement with hands-on projects for kinesthetic learners',
    },
  ];
  return out.sort((a, b) => b.matchScore - a.matchScore);
}

const SCHOOLS: SchoolData[] = [
  {
    rankLabel: 'Recommendation #1',
    name: 'CambriLearn',
    curriculum: 'Cambridge International',
    rating: '4.7',
    feeRange: 'R35,000 – R115,000/year',
    url: 'cambrilearn.com',
    points: [
      'Premium quality with global recognition — NCAA-approved for US universities',
      '3 tiers (Starter / Standard / Premium) — mix and match per subject',
      '20 years experience, Cognia accredited, dedicated education consultants',
      'Multiple curricula available with world-class teaching',
    ],
  },
  {
    rankLabel: 'Recommendation #2',
    name: 'Wingu Academy',
    curriculum: 'Cambridge International',
    rating: '4.5',
    feeRange: 'R52,000 – R68,000/year',
    url: 'wingu-academy.com',
    points: [
      'Tech-centric focus: coding, robotics, AI skills built into curriculum',
      'Only school with Oxford International Curriculum option',
      'Kukua Programme for social-emotional learning alongside academics',
      'Hybrid Smart Schools in Centurion and Cape Town',
    ],
  },
  {
    rankLabel: 'Recommendation #3 — Best Value',
    name: 'Think Digital Academy',
    curriculum: 'Cambridge International',
    rating: '4.1',
    feeRange: 'R13,000 – R18,000/year',
    url: 'thinkdigitalacademy.org',
    points: [
      'Most affordable Cambridge option in South Africa',
      '5× award-winning — exceptional value without compromise',
      '14-day free trial before committing — test before you invest',
      'Virtual clubs, extracurriculars, and global recognition',
    ],
  },
];

// Parent recommendations card content (reuse for all archetypes — generic but warm)
function parentCards(style: string, fn: string) {
  const k = style.toLowerCase();
  return [
    {
      title: 'Learning Environment',
      items: k.includes('kinesthetic') ? [
        'Provide a standing desk option and movement-friendly furniture',
        'Keep hands-on materials nearby: building blocks, science kits, art supplies',
        'Schedule movement breaks every 20–30 minutes',
        'Natural light and open space improve focus significantly',
      ] : k.includes('visual') ? [
        'Use a whiteboard or pin board for visual schedules and mind maps',
        'Ensure good lighting and a clutter-free, organised workspace',
        'Stock colour pens, highlighters and visual learning tools',
        'Keep reference posters and timelines visible',
      ] : k.includes('auditory') ? [
        'Create a calm space with minimal background noise',
        'Invest in quality speakers or headphones for audio lessons',
        'Allow space for reading aloud and verbal discussions',
        'Use rhythm and music to support memorisation',
      ] : [
        'Stock a mini-library with reference books and journals',
        'Provide quality notebooks and writing supplies',
        'Create a quiet reading nook separate from the main study area',
        'Encourage rewriting concepts in own words for retention',
      ],
    },
    {
      title: 'Teaching Approach',
      items: k.includes('kinesthetic') ? [
        'Use visual aids, diagrams and educational videos extensively',
        'Incorporate experiments and real-world problem-solving',
        `Let ${fn} build, make, and demonstrate understanding physically`,
        'Role-play and field trips accelerate retention',
      ] : k.includes('visual') ? [
        `Use diagrams, charts and infographics when introducing new ideas`,
        `Pair text with visuals — videos, demos and step-by-step images`,
        `Encourage ${fn} to draw or sketch their understanding`,
        'Mind-mapping is powerful for revision',
      ] : k.includes('auditory') ? [
        'Read instructions aloud and use verbal explanation',
        `Discuss new concepts before ${fn} works alone`,
        'Use audiobooks and podcasts as primary materials where possible',
        'Allow recording lessons or self-narration during revision',
      ] : [
        'Prioritise reading-based curricula and well-structured texts',
        'Encourage detailed note-taking and summary writing',
        'Use written reflection as a learning tool',
        'Provide essay-style assessments where possible',
      ],
    },
    {
      title: 'Structure & Routine',
      items: [
        'Daily check-ins and clear learning milestones',
        'Break sessions into 20–25 minute focused blocks',
        'Consistent start and end times support focus',
        'Weekly review of progress keeps momentum visible',
      ],
    },
    {
      title: 'Social & Community',
      items: [
        'Prioritise programmes with peer interaction and collaboration',
        'Extramurals are not optional — they are part of the education',
        'Seek curriculum with built-in accommodations and differentiated instruction',
        'Connect with other homeschool families in your area',
      ],
    },
  ];
}

// ─── PDF Builder ────────────────────────────────────────────────────
class ReportBuilder {
  doc: jsPDF;
  data: FullAssessmentData;
  fn: string;
  curricula: CurriculumData[];
  pageNum: number = 0;
  totalPages: number = 6;

  constructor(data: FullAssessmentData) {
    this.doc = new jsPDF({ unit: 'px', format: [PW, PH], hotfixes: ['px_scaling'] });
    this.data = data;
    this.fn = fnOf(data.childName);
    this.curricula = buildCurricula(data.learningStyle, this.fn);
  }

  // ── Primitives ──
  private setRGB(c: [number, number, number]) { this.doc.setTextColor(c[0], c[1], c[2]); }
  private fill(c: [number, number, number]) { this.doc.setFillColor(c[0], c[1], c[2]); }
  private stroke(c: [number, number, number]) { this.doc.setDrawColor(c[0], c[1], c[2]); }

  private rect(x: number, y: number, w: number, h: number, fillC: [number, number, number]) {
    this.fill(fillC); this.doc.rect(x, y, w, h, 'F');
  }
  private rrect(x: number, y: number, w: number, h: number, r: number, fillC: [number, number, number] | null, strokeC?: [number, number, number], lw = 1) {
    if (fillC) this.fill(fillC);
    if (strokeC) { this.stroke(strokeC); this.doc.setLineWidth(lw); }
    const style = fillC && strokeC ? 'FD' : fillC ? 'F' : 'S';
    this.doc.roundedRect(x, y, w, h, r, r, style);
  }
  private circle(cx: number, cy: number, r: number, fillC: [number, number, number]) {
    this.fill(fillC); this.doc.circle(cx, cy, r, 'F');
  }
  // Bullet dot using • U+2022 — renders in jsPDF Helvetica when sized at 16px
  private bullet(x: number, y: number, color: [number, number, number] = C.emerald, _size = 4) {
    const prevSize = (this.doc as any).getFontSize?.() ?? 10;
    this.doc.setFont(FONT_BODY, 'normal');
    this.doc.setFontSize(16);
    this.setRGB(color);
    // Nudge bullet up slightly to align with text baseline of body
    this.doc.text('\u2022', x, y + 1);
    this.doc.setFontSize(prevSize);
  }
  // En dash arrow — replaces → which doesn't render in jsPDF Helvetica
  private static DASH = '\u2013  ';

  // text helpers
  private setText(font: string, weight: 'normal' | 'bold' | 'italic' | 'bolditalic', sizePx: number, color: [number, number, number]) {
    this.doc.setFont(font, weight);
    // jsPDF px units: setFontSize uses pt; convert px→pt approximate (1 pt ≈ 1.333 px)
    this.doc.setFontSize(sizePx);
    this.doc.setLineHeightFactor(1.45);
    this.setRGB(color);
  }

  private text(s: string, x: number, y: number, opts?: { align?: 'left' | 'center' | 'right'; maxW?: number }) {
    if (opts?.maxW) {
      const lines = this.doc.splitTextToSize(s, opts.maxW);
      this.doc.text(lines, x, y, { align: opts.align || 'left' });
      return Array.isArray(lines) ? lines.length : 1;
    }
    this.doc.text(s, x, y, { align: opts?.align || 'left' });
    return 1;
  }

  // letter-spacing simulation by adding small gaps — for short labels we just call text normally; jsPDF does not natively support letter-spacing, but mockup look will still be solid.

  private newPage() {
    this.doc.addPage([PW, PH], 'portrait');
    this.pageNum++;
  }

  // ── Header / Footer ──
  private drawHeader(sectionLabel: string) {
    this.rect(0, 0, PW, HEADER_H, C.navy);
    // Logo "P²"
    this.setText(FONT_HEAD, 'bold', 22, C.emerald);
    this.doc.text('P\u00B2', 40, 32);
    // Section label
    this.setText(FONT_BODY, 'normal', 10, C.white);
    this.doc.text(sectionLabel.toUpperCase(), 70, 30);
    // Right info
    this.setText(FONT_BODY, 'normal', 10, C.slate);
    const info = `${this.data.childName} \u00B7 ${this.data.grade} \u00B7 ${todayZA()}`;
    this.doc.text(info, PW - 40, 32, { align: 'right' });
  }

  private drawFooter() {
    const fy = PH - FOOTER_H;
    this.stroke(C.gray200); this.doc.setLineWidth(1);
    this.doc.line(40, fy, PW - 40, fy);
    this.setText(FONT_BODY, 'normal', 8, C.gray400);
    const disclaimer = 'This learner profile is an educational insight tool, not a psychological assessment or clinical diagnosis. P-Squared | mypsquared.com';
    const lines = this.doc.splitTextToSize(disclaimer, PW - 200);
    this.doc.text(lines, 40, fy + 14);
    this.setText(FONT_BODY, 'bold', 9, C.gray400);
    this.doc.text(`${this.pageNum} of ${this.totalPages}`, PW - 40, fy + 18, { align: 'right' });
  }

  private interiorPage(sectionLabel: string) {
    this.newPage();
    this.drawHeader(sectionLabel);
    this.drawFooter();
  }

  // Section title with line after
  private sectionTitle(text: string, x: number, y: number, maxW: number) {
    this.setText(FONT_BODY, 'bold', 9, C.emerald);
    this.doc.text(text.toUpperCase(), x, y);
    const tw = this.doc.getTextWidth(text.toUpperCase());
    // line after
    this.stroke(C.emeraldMid); this.doc.setLineWidth(1);
    const lineX = x + tw + 10;
    this.doc.line(lineX, y - 3, x + maxW, y - 3);
  }

  // ── Page 1: Cover ──
  page1Cover() {
    this.pageNum = 0; // cover is unnumbered
    if (this.doc.getNumberOfPages() === 0) {
      // first page already exists when jsPDF created
    }
    // Background
    this.rect(0, 0, PW, PH, C.navy);
    // Top accent
    this.rect(0, 0, PW, 6, C.emerald);

    // Top row
    this.setText(FONT_HEAD, 'bold', 48, C.emerald);
    this.doc.text('P\u00B2', 60, 110);
    this.setText(FONT_BODY, 'normal', 11, C.white);
    this.doc.text('P-SQUARED EDUCATION', 130, 95);
    this.setText(FONT_BODY, 'normal', 9, C.gray400);
    this.doc.text('POWERED BY KASIAIHUB', 130, 112);

    // Center block
    const cy = 360;
    // Tag pill
    this.fill(C.emerald);
    this.doc.roundedRect(60, cy - 60, 270, 26, 3, 3, 'F');
    this.setText(FONT_BODY, 'bold', 10, C.white);
    this.doc.text('PERSONALISED LEARNER PROFILE', 75, cy - 43);

    // Child name (Playfair-equivalent)
    this.setText(FONT_HEAD, 'bold', 52, C.white);
    const nameLines = this.doc.splitTextToSize(this.data.childName, PW - 120);
    let ny = cy + 30;
    (nameLines as string[]).forEach((l) => { this.doc.text(l, 60, ny); ny += 56; });

    // Subtitle
    this.setText(FONT_BODY, 'normal', 18, C.emerald);
    this.doc.text(`${this.data.grade} \u00B7 ${this.curricula[0].name} Curriculum`, 60, ny + 4);

    // Meta row
    const my = ny + 60;
    const metaItems = [
      { label: 'Learning Archetype', value: this.data.learningStyle },
      { label: 'Recommended Curriculum', value: this.curricula[0].name },
      { label: 'Generated', value: todayZA() },
    ];
    let mx = 60;
    metaItems.forEach((m) => {
      this.setText(FONT_BODY, 'bold', 9, C.slateBg);
      this.doc.text(m.label.toUpperCase(), mx, my);
      this.setText(FONT_BODY, 'bold', 13, C.white);
      this.doc.text(m.value, mx, my + 18);
      mx += 230;
    });

    // Bottom
    const by = PH - 90;
    this.stroke([255, 255, 255]); this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(255, 255, 255);
    // faint divider
    this.fill([255, 255, 255]);
    this.doc.setGState(this.doc.GState({ opacity: 0.1 }));
    this.doc.rect(60, by - 20, PW - 120, 1, 'F');
    this.doc.setGState(this.doc.GState({ opacity: 1 }));

    this.setText(FONT_HEAD, 'italic', 16, C.white);
    this.doc.setGState(this.doc.GState({ opacity: 0.45 }));
    this.doc.text('Education = You\u00B2', 60, by + 5);
    this.doc.setGState(this.doc.GState({ opacity: 0.4 }));
    this.setText(FONT_BODY, 'normal', 11, C.white);
    this.doc.text('mypsquared.com', PW - 60, by, { align: 'right' });
    this.doc.setGState(this.doc.GState({ opacity: 1 }));
  }

  // ── Page 2: Profile Summary ──
  page2Summary() {
    this.totalPages = 6;
    this.interiorPage('Learner Profile');
    let y = HEADER_H + 36;

    this.sectionTitle('Learner Profile Summary', CONTENT_X, y, CONTENT_W);
    y += 24;

    // Hero card — dynamic height
    const heroX = CONTENT_X;
    const heroW = CONTENT_W;
    const heroPadX = 24;
    const traits = (ARCHETYPE_TRAITS[this.data.learningStyle] || ARCHETYPE_TRAITS['Multimodal Learner']).slice(0, 6);
    const traitMaxWidth = heroW - heroPadX * 2;

    // measure intro
    this.doc.setFont(FONT_BODY, 'normal');
    this.doc.setFontSize(13);
    const intro = archetypeIntro(this.data.learningStyle, this.fn);
    const introLines = this.doc.splitTextToSize(intro, heroW - heroPadX * 2);

    // measure traits
    this.doc.setFont(FONT_BODY, 'normal');
    this.doc.setFontSize(10);
    const traitLineH = 16;
    const traitGap = 10;
    const traitWrappedCounts = traits.map((t) => {
      const lines = this.doc.splitTextToSize(t, traitMaxWidth - 12);
      return Array.isArray(lines) ? lines.length : 1;
    });
    const traitBlockHeight = traitWrappedCounts.reduce((sum, n) => sum + n * traitLineH + traitGap, 0);

    const introH = introLines.length * 19;
    const heroH = 20 + 22 + 16 + 32 + 18 + introH + 18 + traitBlockHeight + 24;

    this.rrect(heroX, y, heroW, heroH, 12, C.navy);
    this.doc.setGState(this.doc.GState({ opacity: 0.08 }));
    this.circle(heroX + heroW - 10, y + 10, 60, C.emerald);
    this.doc.setGState(this.doc.GState({ opacity: 0.05 }));
    this.circle(heroX + heroW - 60, y + heroH + 20, 90, C.emerald);
    this.doc.setGState(this.doc.GState({ opacity: 1 }));

    // Tag
    this.fill(C.emerald);
    this.doc.roundedRect(heroX + heroPadX, y + 20, 200, 22, 3, 3, 'F');
    this.setText(FONT_BODY, 'bold', 9, C.white);
    this.doc.text('PRIMARY LEARNING ARCHETYPE', heroX + heroPadX + 14, y + 35);

    // Name
    this.setText(FONT_HEAD, 'bold', 32, C.white);
    this.doc.text(`The ${this.data.learningStyle}`, heroX + heroPadX, y + 20 + 22 + 16 + 24);

    // Intro
    this.setText(FONT_BODY, 'normal', 13, [255, 255, 255]);
    this.doc.setLineHeightFactor(1.45);
    this.doc.setGState(this.doc.GState({ opacity: 0.7 }));
    const introY = y + 20 + 22 + 16 + 32 + 18 + 12;
    this.doc.text(introLines, heroX + heroPadX, introY, { lineHeightFactor: 1.45 } as any);
    this.doc.setGState(this.doc.GState({ opacity: 1 }));

    // Traits — single column with filled emerald square bullets
    let traitY = introY + introH + 12;
    traits.forEach((t, idx) => {
      this.bullet(heroX + heroPadX, traitY, C.emerald, 4);
      this.setText(FONT_BODY, 'normal', 10, [255, 255, 255]);
      this.doc.setGState(this.doc.GState({ opacity: 0.88 }));
      const lines = this.doc.splitTextToSize(t, traitMaxWidth - 12);
      (Array.isArray(lines) ? lines : [lines]).forEach((line: string, li: number) => {
        this.doc.text(line, heroX + heroPadX + 12, traitY + li * traitLineH);
      });
      this.doc.setGState(this.doc.GState({ opacity: 1 }));
      traitY += traitWrappedCounts[idx] * traitLineH + traitGap;
    });
    y += heroH + 18;

    // disclaimer italic
    this.setText(FONT_BODY, 'italic', 10, C.gray400);
    const disc = `This archetype is a starting point, not a label. It may shift as ${this.fn} grows and encounters new learning experiences.`;
    const dl = this.doc.splitTextToSize(disc, CONTENT_W - 80);
    this.doc.text(dl, PW / 2, y, { align: 'center' });
    y += dl.length * 12 + 14;

    // Pattern breakdown
    this.sectionTitle('Learning Pattern Breakdown', CONTENT_X, y, CONTENT_W);
    y += 22;

    const styles = ['Kinesthetic', 'Visual', 'Auditory', 'Read-Write'];
    const scores = this.estimateScores(); // out of 12
    const order = scores.map((s, i) => ({ s, i })).sort((a, b) => b.s - a.s);
    const labels: Record<number, { tag: string; bg: [number, number, number]; fg: [number, number, number]; bar: [number, number, number] }> = {};
    order.forEach((o, rank) => {
      if (rank === 0) labels[o.i] = { tag: 'DOMINANT', bg: C.emeraldLt, fg: C.emerald, bar: C.emerald };
      else if (rank === 1) labels[o.i] = { tag: 'SECONDARY', bg: C.blueLt, fg: C.blue600, bar: C.blue500 };
      else labels[o.i] = { tag: 'DEVELOPING', bg: C.gray100, fg: C.gray500, bar: C.graybar };
    });

    order.forEach(({ i }) => {
      const style = styles[i];
      const score = scores[i];
      const meta = labels[i];
      const ry = y + 6;
      this.setText(FONT_BODY, 'bold', 11, C.gray700);
      this.doc.text(style, CONTENT_X, ry);
      const barX = CONTENT_X + 100;
      const barW = CONTENT_W - 100 - 60 - 90;
      this.rrect(barX, ry - 7, barW, 8, 4, C.gray200);
      this.rrect(barX, ry - 7, (score / 12) * barW, 8, 4, meta.bar);
      this.setText(FONT_BODY, 'bold', 11, C.gray700);
      this.doc.text(`${score}/12`, barX + barW + 8, ry);
      const badgeX = barX + barW + 50;
      this.rrect(badgeX, ry - 10, 90, 16, 3, meta.bg);
      this.setText(FONT_BODY, 'bold', 8, meta.fg);
      this.doc.text(meta.tag, badgeX + 45, ry, { align: 'center' });
      y += 22;
    });

    y += 10;

    // Strengths + Growth
    const cardY = y;
    const cardH = 160;
    const cardGap = 16;
    const cardW = (CONTENT_W - cardGap) / 2;

    this.rrect(CONTENT_X, cardY, cardW, cardH, 8, C.gray100);
    this.setText(FONT_BODY, 'bold', 9, C.gray500);
    this.doc.text('STRENGTHS & ABILITIES', CONTENT_X + 18, cardY + 24);
    let sy = cardY + 48;
    ensureFourStrengths(this.data.strengths, this.data.learningStyle).forEach((s) => {
      this.bullet(CONTENT_X + 18, sy, C.emerald, 4);
      this.setText(FONT_BODY, 'normal', 11, C.gray700);
      const lines = this.doc.splitTextToSize(s, cardW - 38);
      lines.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + 32, sy + i * 16));
      sy += lines.length * 16 + 6;
    });

    this.rrect(CONTENT_X + cardW + cardGap, cardY, cardW, cardH, 8, C.gray100);
    this.setText(FONT_BODY, 'bold', 9, C.gray500);
    this.doc.text('AREAS FOR GROWTH', CONTENT_X + cardW + cardGap + 18, cardY + 24);
    let gy = cardY + 48;
    this.data.challenges.slice(0, 4).forEach((c) => {
      this.setText(FONT_BODY, 'normal', 11, C.gray700);
      const lines = this.doc.splitTextToSize('\u2013  ' + c, cardW - 28);
      lines.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + cardW + cardGap + 18, gy + i * 16));
      gy += lines.length * 16 + 6;
    });
    y = cardY + cardH + 18;

    // Curriculum nav callout
    const top = this.curricula[0];
    const calloutH = 48;
    this.rrect(CONTENT_X, y, CONTENT_W, calloutH, 6, C.emeraldLt);
    this.rect(CONTENT_X, y, 4, calloutH, C.emerald);
    this.setText(FONT_BODY, 'normal', 11, C.gray700);
    const ct = `Full curriculum comparison and school recommendations are on the following pages. Your recommended curriculum is ${top.name} (${top.matchScore}% match).`;
    const ctL = this.doc.splitTextToSize(ct, CONTENT_W - 30);
    this.doc.text(ctL, CONTENT_X + 16, y + 18);
  }

  // Page 3 — Curriculum comparison
  page3Curricula() {
    this.interiorPage('Curriculum Comparison');
    let y = HEADER_H + 36;

    this.sectionTitle('Curriculum Options — Full Comparison', CONTENT_X, y, CONTENT_W);
    y += 24;

    this.curricula.forEach((c, idx) => {
      const isRec = idx === 0;
      const cardH = 250;
      // border
      this.rrect(CONTENT_X, y, CONTENT_W, cardH, 10, [255, 255, 255], isRec ? C.emerald : C.gray200, 1.5);
      // header band
      const hdrH = 64;
      if (isRec) {
        // light emerald header
        this.fill(C.emeraldLt);
        this.doc.roundedRect(CONTENT_X, y, CONTENT_W, hdrH, 10, 10, 'F');
        // square off bottom
        this.rect(CONTENT_X, y + hdrH - 10, CONTENT_W, 10, C.emeraldLt);
      }
      // pre-label
      let nameY = y + 38;
      if (isRec) {
        this.setText(FONT_BODY, 'bold', 9, C.emerald);
        this.doc.text(`RECOMMENDED FOR ${this.fn.toUpperCase()}`, CONTENT_X + 24, y + 22);
        nameY = y + 48;
      }
      this.setText(FONT_HEAD, 'bold', 18, C.navy);
      this.doc.text(c.name, CONTENT_X + 24, nameY);

      // Right column: score stacked above badge
      const rightX = CONTENT_X + CONTENT_W - 24;
      const scoreY = y + 22;
      this.setText(FONT_HEAD, 'bold', 20, isRec ? C.emerald : C.gray700);
      this.doc.text(`${c.matchScore}%`, rightX, scoreY, { align: 'right' });
      this.setText(FONT_BODY, 'bold', 7, C.gray500);
      this.doc.text('MATCH', rightX, scoreY + 9, { align: 'right' });
      if (isRec) {
        // Best Fit badge BELOW score
        const badgeText = 'BEST FIT';
        this.doc.setFontSize(7);
        const badgeTextWidth = this.doc.getTextWidth(badgeText);
        const badgeW = badgeTextWidth + 16;
        const badgeH = 14;
        const bx = rightX - badgeW;
        const by = scoreY + 9 + 8;
        this.rrect(bx, by, badgeW, badgeH, 2, C.emerald);
        this.setText(FONT_BODY, 'bold', 7, C.white);
        this.doc.text(badgeText, bx + badgeW / 2, by + 9, { align: 'center' });
      }

      // Body — two col
      const bx = CONTENT_X + 24;
      const bw = (CONTENT_W - 60) / 2;
      let lyL = y + hdrH + 22;
      this.setText(FONT_BODY, 'bold', 9, C.gray500);
      this.doc.text('WHY IT FITS', bx, lyL);
      lyL += 18;
      c.whyFits.slice(0, 4).forEach((w) => {
        this.bullet(bx, lyL, C.emerald, 4);
        this.setText(FONT_BODY, 'normal', 10, C.gray700);
        const lines = this.doc.splitTextToSize(w, bw - 16);
        lines.forEach((ln: string, i: number) => this.doc.text(ln, bx + 12, lyL + i * 15));
        lyL += lines.length * 15 + 4;
      });

      const rx = bx + bw + 12;
      let lyR = y + hdrH + 22;
      this.setText(FONT_BODY, 'bold', 9, C.gray500);
      this.doc.text('BEST FOR', rx, lyR);
      lyR += 18;
      this.setText(FONT_BODY, 'normal', 10, C.gray700);
      const bfL = this.doc.splitTextToSize(c.bestFor, bw);
      bfL.forEach((ln: string, i: number) => this.doc.text(ln, rx, lyR + i * 15));
      lyR += bfL.length * 15 + 10;
      this.setText(FONT_BODY, 'bold', 9, C.gray500);
      this.doc.text('CONSIDERATION', rx, lyR);
      lyR += 18;
      this.setText(FONT_BODY, 'normal', 10, C.gray700);
      const csL = this.doc.splitTextToSize(c.consideration, bw);
      csL.forEach((ln: string, i: number) => this.doc.text(ln, rx, lyR + i * 15));
      lyR += csL.length * 15 + 8;
      // Currency note
      const priceL = this.doc.splitTextToSize(c.price, bw - 16);
      const cnH = 14 + priceL.length * 14;
      this.rrect(rx, lyR, bw, cnH, 4, C.gray100);
      this.setText(FONT_BODY, 'normal', 10, C.gray500);
      priceL.forEach((ln: string, i: number) => this.doc.text(ln, rx + 8, lyR + 14 + i * 14));

      y += cardH + 14;
    });
  }

  // Page 4 — Schools
  page4Schools() {
    this.interiorPage('School Recommendations');
    let y = HEADER_H + 36;
    this.sectionTitle(`Top 3 Recommended Schools for ${this.fn}`, CONTENT_X, y, CONTENT_W);
    y += 22;

    this.setText(FONT_BODY, 'normal', 11, C.gray500);
    const top = this.curricula[0];
    const intro = `Based on ${this.fn}'s ${archetypeAdjective(this.data.learningStyle)} learning pattern, ${top.name} curriculum match (${top.matchScore}%), and your family's priorities.`;
    const introL = this.doc.splitTextToSize(intro, CONTENT_W);
    this.doc.text(introL, CONTENT_X, y);
    y += introL.length * 14 + 14;

    SCHOOLS.forEach((s) => {
      const cardH = 156;
      this.rrect(CONTENT_X, y, CONTENT_W, cardH, 10, [255, 255, 255], C.gray200, 1.5);
      // Left col
      this.setText(FONT_BODY, 'bold', 9, C.gray400);
      this.doc.text(s.rankLabel.toUpperCase(), CONTENT_X + 22, y + 24);
      this.setText(FONT_HEAD, 'bold', 17, C.navy);
      this.doc.text(s.name, CONTENT_X + 22, y + 46);
      this.setText(FONT_BODY, 'bold', 11, C.emerald);
      this.doc.text(s.curriculum, CONTENT_X + 22, y + 64);

      let py = y + 86;
      s.points.forEach((p) => {
        this.bullet(CONTENT_X + 22, py, C.emerald, 4);
        this.setText(FONT_BODY, 'normal', 10, C.gray700);
        const lines = this.doc.splitTextToSize(p, CONTENT_W - 200);
        lines.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + 34, py + i * 14));
        py += lines.length * 14 + 3;
      });

      // Right col
      const rx = CONTENT_X + CONTENT_W - 24;
      this.setText(FONT_HEAD, 'bold', 20, C.navy);
      this.doc.text(s.rating, rx, y + 32, { align: 'right' });
      this.setText(FONT_BODY, 'normal', 10, C.gray400);
      this.doc.text('/5', rx, y + 32, { align: 'right' });
      this.setText(FONT_BODY, 'normal', 10, C.gray500);
      this.doc.text(s.feeRange, rx, y + 54, { align: 'right' });
      this.setText(FONT_BODY, 'bold', 10, C.emerald);
      this.doc.textWithLink(s.url, rx, y + 74, { url: `https://${s.url}`, align: 'right' } as any);

      y += cardH + 14;
    });

    // Questions box — single column, dynamic height
    const qs = [
      `How do you accommodate different learning patterns?`,
      `What support is available for ${archetypeAdjective(this.data.learningStyle)} learners?`,
      'Can we do a trial period before committing?',
      'What are your matric pass rates?',
    ];
    const qInnerW = CONTENT_W - 24;
    this.doc.setFont(FONT_BODY, 'normal'); this.doc.setFontSize(10);
    const qWrapped = qs.map((q) => this.doc.splitTextToSize('\u2013  ' + q, qInnerW));
    const qBlockH = qWrapped.reduce((sum, lns) => sum + lns.length * 13 + 6, 0);
    const qH = 22 + qBlockH + 12;
    this.rrect(CONTENT_X, y, CONTENT_W, qH, 8, C.gray100);
    this.setText(FONT_BODY, 'bold', 9, C.gray500);
    this.doc.text('QUESTIONS TO ASK EVERY SCHOOL', CONTENT_X + 12, y + 14);
    let qY = y + 30;
    qWrapped.forEach((lns) => {
      this.setText(FONT_BODY, 'normal', 10, C.gray700);
      lns.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + 12, qY + i * 13));
      qY += lns.length * 13 + 6;
    });
  }

  // Page 5 — Parent recommendations
  page5Parent() {
    this.interiorPage('Parent Recommendations');
    let y = HEADER_H + 36;
    this.sectionTitle(`How to Support ${this.fn}'s Learning Pattern`, CONTENT_X, y, CONTENT_W);
    y += 22;

    this.setText(FONT_BODY, 'normal', 11, C.gray500);
    const intro = `Personalised guidance based on ${this.fn}'s ${archetypeAdjective(this.data.learningStyle)} learning pattern.`;
    const il = this.doc.splitTextToSize(intro, CONTENT_W);
    this.doc.text(il, CONTENT_X, y);
    y += il.length * 14 + 12;

    const cards = parentCards(this.data.learningStyle, this.fn);
    const cardW = (CONTENT_W - 14) / 2;
    const cardH = 200;
    cards.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = CONTENT_X + col * (cardW + 14);
      const cy = y + row * (cardH + 14);
      this.rrect(cx, cy, cardW, cardH, 8, C.gray100);
      this.setText(FONT_BODY, 'bold', 9, C.gray500);
      this.doc.text(c.title.toUpperCase(), cx + 18, cy + 24);
      let iy = cy + 50;
      c.items.forEach((it) => {
        this.bullet(cx + 18, iy, C.emerald, 4);
        this.setText(FONT_BODY, 'normal', 10, C.gray700);
        const lines = this.doc.splitTextToSize(it, cardW - 38);
        lines.forEach((ln: string, li: number) => this.doc.text(ln, cx + 32, iy + li * 14));
        iy += lines.length * 14 + 6;
      });
    });
    y += 2 * (cardH + 14) + 6;

    // Family context callout
    this.setText(FONT_BODY, 'normal', 12, C.gray700);
    const body = `Every family's path is different. The right curriculum, supportive pacing, and a space where ${this.fn} can grow with confidence — that is what choosing this approach is about.`;
    const bL = this.doc.splitTextToSize(body, CONTENT_W - 36);
    this.setText(FONT_BODY, 'bold', 12, C.navy);
    const close = `${this.fn}'s circumstances don't define their potential. They shape the path — and you're choosing the right one.`;
    const cL = this.doc.splitTextToSize(close, CONTENT_W - 36);
    const calloutH = 24 + 16 + bL.length * 17 + 12 + cL.length * 17 + 18;
    this.rrect(CONTENT_X, y, CONTENT_W, calloutH, 8, C.emeraldLt);
    this.rect(CONTENT_X, y, 4, calloutH, C.emerald);
    this.setText(FONT_BODY, 'bold', 9, C.emerald);
    this.doc.text("YOUR FAMILY'S CONTEXT", CONTENT_X + 18, y + 24);
    this.setText(FONT_BODY, 'normal', 12, C.gray700);
    bL.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + 18, y + 46 + i * 17));
    let cy2 = y + 46 + bL.length * 17 + 14;
    this.setText(FONT_BODY, 'bold', 12, C.navy);
    cL.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + 18, cy2 + i * 17));
  }

  // Page 6 — Action plan
  page6Action() {
    this.interiorPage('Your Action Plan');
    let y = HEADER_H + 36;
    this.sectionTitle('Your Personalised Action Plan', CONTENT_X, y, CONTENT_W);
    y += 24;

    const drawStep = (n: number, title: string, body: string, list?: string[], extra?: () => number): number => {
      const cx = CONTENT_X + 18;
      this.circle(cx, y + 12, 18, C.emerald);
      this.setText(FONT_HEAD, 'bold', 14, C.white);
      this.doc.text(`${n}`, cx, y + 17, { align: 'center' });
      this.setText(FONT_BODY, 'bold', 12, C.navy);
      this.doc.text(title.toUpperCase(), cx + 30, y + 8);
      this.setText(FONT_BODY, 'normal', 11, C.gray700);
      const bL = this.doc.splitTextToSize(body, CONTENT_W - 60);
      bL.forEach((ln: string, i: number) => this.doc.text(ln, cx + 30, y + 28 + i * 16));
      let cur = y + 28 + bL.length * 16 + 8;
      if (list) {
        list.forEach((it) => {
          this.bullet(cx + 30, cur, C.emerald, 4);
          this.setText(FONT_BODY, 'normal', 11, C.gray700);
          const lines = this.doc.splitTextToSize(it, CONTENT_W - 80);
          lines.forEach((ln: string, i: number) => this.doc.text(ln, cx + 44, cur + i * 16));
          cur += lines.length * 16 + 4;
        });
      }
      if (extra) cur = extra();
      return cur;
    };

    y = drawStep(1,
      `Create a ${archetypeAdjective(this.data.learningStyle)} learning environment`,
      `Set up ${this.fn}'s learning space to match their learning pattern. This is where the magic happens.`,
      parentCards(this.data.learningStyle, this.fn)[0].items.slice(0, 3),
    ) + 10;

    y = drawStep(2,
      'Enrol in your chosen school',
      `Your top 3 recommendations based on ${this.fn}'s profile:`,
      [
        'CambriLearn (Cambridge) — 4.7/5 — R35,000–R115,000/year',
        'Wingu Academy (Cambridge) — 4.5/5 — R52,000–R68,000/year',
        'Think Digital Academy (Cambridge) — 4.1/5 — R13,000–R18,000/year — best value',
      ],
    ) + 10;

    // Step 3 with DBE box
    y = drawStep(3,
      'Make it official — DBE Registration',
      'If homeschooling, you must register with the Department of Basic Education in your province.',
      undefined,
      () => {
        const cx = CONTENT_X + 48;
        const boxW = CONTENT_W - 70;
        const boxY = y + 24 + 16 + 4 + 8;
        // measure first
        this.doc.setFont(FONT_BODY, 'normal'); this.doc.setFontSize(11);
        const t1 = 'P-Squared generates your complete province-specific DBE registration package in 30 minutes — including your application letter, curriculum motivation, subject plan, and all required forms.';
        const t1L = this.doc.splitTextToSize(t1, boxW - 24);
        // t2 starts with bold "R999 once-off." rendered separately, body wraps with hanging indent
        const priceLabel = 'R999 once-off. ';
        this.doc.setFont(FONT_BODY, 'bold');
        const priceW = this.doc.getTextWidth(priceLabel);
        this.doc.setFont(FONT_BODY, 'normal');
        const t2Body = 'Includes 7 days of My Learning Coach free — your calm daily guide through your first week. You submit the documents yourself, directly to your provincial DBE office.';
        // first line of t2Body fits next to price label, rest wraps full width
        const firstLineW = boxW - 24 - priceW;
        const firstWords = this.doc.splitTextToSize(t2Body, firstLineW);
        const firstLine = Array.isArray(firstWords) ? firstWords[0] : firstWords;
        const remaining = t2Body.substring(firstLine.length).trim();
        const restL = remaining ? this.doc.splitTextToSize(remaining, boxW - 24) : [];
        const t2LineCount = 1 + restL.length;
        const urlLine = '\u2013  mypsquared.com/dbe-registration  \u00B7  WhatsApp: +27 81 890 5861';
        const boxH = 18 + t1L.length * 16 + 12 + t2LineCount * 16 + 14 + 14 + 10;
        this.rrect(cx, boxY, boxW, boxH, 8, C.emeraldLt, C.emerald, 1.5);
        this.setText(FONT_BODY, 'normal', 11, C.navy);
        t1L.forEach((ln: string, i: number) => this.doc.text(ln, cx + 12, boxY + 20 + i * 16));
        let by = boxY + 20 + t1L.length * 16 + 14;
        // bold price label
        this.setText(FONT_BODY, 'bold', 11, C.emerald);
        this.doc.text(priceLabel, cx + 12, by);
        this.setText(FONT_BODY, 'normal', 11, C.navy);
        this.doc.text(firstLine, cx + 12 + priceW, by);
        restL.forEach((ln: string, i: number) => this.doc.text(ln, cx + 12, by + (i + 1) * 16));
        by += t2LineCount * 16 + 10;
        this.setText(FONT_BODY, 'normal', 10, C.gray500);
        this.doc.text(urlLine, cx + 12, by);
        return boxY + boxH + 6;
      }
    ) + 10;

    y = drawStep(4,
      `Build ${this.fn}'s community and support network`,
      `${this.fn}'s education is a team effort. You don't have to do this alone.`,
      [
        'Join local homeschool groups in your area',
        'Connect with other P-Squared families on our WhatsApp community',
        'Enrol in at least one structured extramural (sport, arts, coding, debate)',
      ],
    );
  }

  // Page 7 — Encouragement + Important Note + Contact
  page7Final() {
    this.interiorPage('Final Note');
    let y = HEADER_H + 36;
    this.sectionTitle(`A Note for ${this.fn}'s Parent`, CONTENT_X, y, CONTENT_W);
    y += 24;

    // ── Encouragement card (dark navy bg) — measure first, then draw bg, then text
    const ePadX = 28;
    const ePadY = 28;
    const eInnerW = CONTENT_W - ePadX * 2;
    const head = `You saw ${this.fn} when the system didn't.`;
    this.doc.setFont(FONT_HEAD, 'bold'); this.doc.setFontSize(20);
    const hL = this.doc.splitTextToSize(head, eInnerW);
    this.doc.setFont(FONT_BODY, 'normal'); this.doc.setFontSize(11);
    const paras = [
      `By completing this learner profile, you've already done something most parents never do. You stopped accepting a one-size-fits-all answer for a child who is anything but one-size-fits-all.`,
      `The journey ahead will have its challenges. But ${this.fn} has something many children don't — a parent who sees them clearly, understands how they learn, and is willing to build an education around who they truly are.`,
      `Not every parent takes this step. The fact that you're here, researching, planning, and investing in understanding ${this.fn}'s learning pattern — that says everything about the kind of parent you are.`,
    ];
    const paraLineH = 16;
    const paraGap = 10;
    const paraLineCounts = paras.map((p) => {
      const lns = this.doc.splitTextToSize(p, eInnerW);
      return Array.isArray(lns) ? lns.length : 1;
    });
    this.doc.setFont(FONT_HEAD, 'italic'); this.doc.setFontSize(13);
    const tag = `Education = You\u00B2. And ${this.fn} is the constant.`;
    const tagL = this.doc.splitTextToSize(tag, eInnerW);

    const eH =
      ePadY +
      hL.length * 26 + 12 +
      paraLineCounts.reduce((s, n) => s + n * paraLineH + paraGap, 0) + 6 +
      tagL.length * 16 +
      ePadY;

    // Background
    this.rrect(CONTENT_X, y, CONTENT_W, eH, 10, C.navy);

    // Headline
    this.setText(FONT_HEAD, 'bold', 20, C.white);
    let ty = y + ePadY + 18;
    hL.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + ePadX, ty + i * 26));
    ty += hL.length * 26 + 12;

    // Paragraphs
    this.setText(FONT_BODY, 'normal', 11, [220, 230, 240]);
    paras.forEach((p, idx) => {
      const lns = this.doc.splitTextToSize(p, eInnerW);
      (Array.isArray(lns) ? lns : [lns]).forEach((ln: string, i: number) =>
        this.doc.text(ln, CONTENT_X + ePadX, ty + i * paraLineH));
      ty += paraLineCounts[idx] * paraLineH + paraGap;
    });
    ty += 6;

    // Tagline
    this.setText(FONT_HEAD, 'italic', 13, C.emerald);
    tagL.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + ePadX, ty + i * 16));

    y += eH + 18;

    // ── Important Note (emerald border + light green bg) — dynamic
    this.doc.setFont(FONT_BODY, 'normal'); this.doc.setFontSize(11);
    const note = "The learning archetype in this report is a metaphorical framework designed to help parents understand their child's natural learning patterns. It is not a clinical assessment, psychological evaluation, or medical diagnosis. Archetypes may shift as your child grows and develops. If you have concerns about your child's learning, behaviour, or development, we recommend consulting a registered educational psychologist. To find one in South Africa, contact the Health Professions Council of South Africa (HPCSA) at hpcsa.co.za.";
    const nL = this.doc.splitTextToSize(note, CONTENT_W - 44);
    const iH = 22 + 14 + nL.length * 16 + 18;
    this.rrect(CONTENT_X, y, CONTENT_W, iH, 8, C.emeraldLt, C.emerald, 1.5);
    this.setText(FONT_BODY, 'bold', 9, C.emerald);
    this.doc.text('IMPORTANT NOTE', CONTENT_X + 22, y + 22);
    this.setText(FONT_BODY, 'normal', 11, C.gray700);
    nL.forEach((ln: string, i: number) => this.doc.text(ln, CONTENT_X + 22, y + 44 + i * 16));
    y += iH + 18;

    // ── Contact section (gray bg, 3 cols)
    this.sectionTitle('Need Support?', CONTENT_X, y, CONTENT_W);
    y += 18;
    const contactH = 60;
    this.rrect(CONTENT_X, y, CONTENT_W, contactH, 6, C.gray100);
    const contacts = [
      { label: 'WHATSAPP', value: '+27 81 890 5861' },
      { label: 'WEBSITE', value: 'mypsquared.com' },
    ];
    const colW = CONTENT_W / 2;
    contacts.forEach((c, i) => {
      const cx = CONTENT_X + i * colW + 18;
      this.setText(FONT_BODY, 'bold', 8, C.gray400);
      this.doc.text(c.label, cx, y + 20);
      this.setText(FONT_BODY, 'bold', 11, C.navy);
      this.doc.text(c.value, cx, y + 40);
    });
    y += contactH + 22;

    this.setText(FONT_BODY, 'italic', 11, C.gray400);
    this.doc.text("We're here for your journey. You're not alone.", PW / 2, y, { align: 'center' });
  }

  // ── Helpers ──
  private estimateScores(): number[] {
    // order: Kinesthetic, Visual, Auditory, Read-Write
    const base = [5, 5, 5, 5];
    if (this.data.learningStyle.includes('Kinesthetic')) { base[0] = 10; base[1] = 6; }
    else if (this.data.learningStyle.includes('Visual')) { base[1] = 10; base[0] = 6; }
    else if (this.data.learningStyle.includes('Auditory')) { base[2] = 10; base[3] = 6; }
    else if (this.data.learningStyle.includes('Read')) { base[3] = 10; base[2] = 6; }
    else { base[1] = 8; base[0] = 7; }
    // try to use stored scores if present
    const s = this.data.learningStyleScores;
    if (s && typeof s === 'object') {
      const k = (n: any) => typeof n === 'number' ? Math.max(0, Math.min(12, n)) : null;
      const guess = [k(s.kinesthetic), k(s.visual), k(s.auditory), k(s.reading || s.read || s['read-write'])];
      guess.forEach((g, i) => { if (g !== null) base[i] = g as number; });
    }
    return base;
  }

  // ── Build ──
  generate() {
    this.page1Cover();
    this.page2Summary();
    this.page3Curricula();
    this.page4Schools();
    this.page5Parent();
    this.page6Action();
    this.page7Final();

    const safe = this.data.childName.replace(/\s+/g, '_');
    this.doc.save(`${safe}_Learner_Profile.pdf`);
  }
}

// ─── Public API ─────────────────────────────────────────────────────
export function generateLearnerProfilePDF(data: FullAssessmentData): void {
  const builder = new ReportBuilder(data);
  builder.generate();
}

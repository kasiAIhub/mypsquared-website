import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, FileText, Compass, User, Equal, Lightbulb, Star, ArrowRight, Heart } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { usePageMeta } from '@/hooks/usePageMeta';


import family01 from '../assets/families/family-01-tembisa-mother.jpg';
import family02 from '../assets/families/family-02-durban-grandmother.jpg';
import family03 from '../assets/families/family-03-freestate-farm.jpg';
import family04 from '../assets/families/family-04-capeflats-father.jpg';
import family05 from '../assets/families/family-05-sandton-couple.jpg';
import family06 from '../assets/families/family-06-joburg-zimbabwean.jpg';
import family07 from '../assets/families/family-07-capetown-postcovid.jpg';
import family08 from '../assets/families/family-08-northcliff-blended.jpg';
import family09 from '../assets/families/family-09-pretoria-afrikaans.jpg';
import family10 from '../assets/families/family-10-cyrildene-gifted.jpg';
import kitchenTable from '../assets/about-kitchen-table.jpg';

const EMERALD = '#10B981';
const NAVY = '#0F172A';
const CREAM = '#F5F0E8';
const GRAY = '#374151';

type Family = {
  id: number;
  name: string;
  bg: string;
  icon: string;
  image?: string;
  problem: string;
  location: string;
  sentence: string;
  tag: string;
  headline: string;
  reality: string;
  stat: string;
  deeperContext: string;
  stat2: string;
  pSquared: string;
  cta: string;
};

const families: Family[] = [
  {
    id: 2, name: 'The Naidoo Family', bg: '#3B2A1A', icon: '👵🏽', image: family02,
    problem: 'Neurodivergent child.',
    location: 'Durban · Indian family',
    sentence: '"Her teacher said she was shy. Her grandmother knew she was just waiting for a classroom that listened."',
    tag: 'Grandmother caregiver',
    headline: 'Knowing your child is not enough. You need a system that knows them too.',
    reality: 'Neurodivergent learners — children with ADHD, dyslexia, autism spectrum profiles, sensory processing differences, or anxiety disorders — do not have a learning disability. They have a learning difference that requires a different environment. In a South African public school classroom of 40 to 50 children, that environment does not exist. Teachers are not trained to differentiate. The curriculum does not flex. The assessment is standardised. The neurodivergent child who processes differently, responds differently, or needs more time is quietly labelled as slow, difficult, or disruptive. The label follows them.',
    stat: 'UNESCO data shows that 1 in 3 South African learners is physically bullied at school at least once a month. For neurodivergent children who process social cues differently, the risk of social isolation and targeted bullying is significantly higher.',
    deeperContext: 'University of Johannesburg researchers studying teenagers in under-resourced Gauteng high schools describe a silent mental health crisis — chronic stress, anxiety, and a quiet hopelessness that sets in years before matric. For neurodivergent learners, this crisis begins earlier. They know they are different. They know the classroom does not work for them. What they do not know — and what no one is telling them — is that the classroom is the problem, not them. Adaptive learning platforms, which adjust pace, format, and content to the individual learner, have been shown to improve academic outcomes by as much as 62% for learners who struggle in standard classroom environments.',
    stat2: "Adaptive personalised learning environments show a 62% improvement in test scores compared to standard classroom delivery — because the platform moves at the learner's pace, not the group's.",
    pSquared: "P-Squared's learner assessment identifies your grandchild's specific learning archetype — The Observer, The Architect, The Inventor, The Caregiver, and 16 others. Each archetype comes with specific recommendations: how she learns best, what environments help her focus, what triggers disengagement, and what curriculum format matches who she is. The Learning Coach's Day 4 is built entirely around her archetype — so you know exactly how to support her, not just what to teach her. You stop guessing. You start knowing.",
    cta: "Join the Learner Blueprint Waitlist",
  },
  {
    id: 3, name: 'The Van der Berg Family', bg: '#2C1F0E', icon: '👨‍👦', image: family03,
    problem: 'Quality education without borders.',
    location: 'Bloemfontein · Afrikaner family',
    sentence: '"The school is 45 kilometres away. Their child\'s education was not going to live in a minibus."',
    tag: 'Rural family',
    headline: "A child's future should not be decided by their postal code.",
    reality: "South Africa's education system was designed around urban infrastructure — schools within walking distance, transport routes, administrative offices in town. Rural families exist outside this design. The nearest functional school may be 30 to 45 kilometres away on a road that floods in summer and ices in winter. Transport is not guaranteed. A child who misses the taxi misses the day. A child who falls behind in a 50:1 classroom has no mechanism to catch up. The quality of education a South African child receives is determined almost entirely by the province they live in, the suburb their school is in, and the wealth of the parents on the school governing body.",
    stat: "South Africa's national learner-educator ratio is 33:1 — already double the OECD average of 16:1. In high-pressure rural and township areas, the real ratio frequently exceeds 50:1. A teacher with 50 children cannot give any individual child meaningful attention.",
    deeperContext: 'The Pestalozzi Trust\'s 2025 national survey of DBE homeschool registration outcomes revealed that in rural provinces — Limpopo, Eastern Cape, North West — application approval rates are among the lowest in the country. Applications disappear into provincial systems. Families wait months for responses that never arrive. The "deemed registered" protection exists on paper but carries no certificate, no formal acknowledgment, and no legal clarity for university admissions. Rural families carry the highest administrative burden with the least institutional support. Online education removes the geography. A child in the Karoo with a laptop and a curriculum can access Cambridge International content, live teacher check-ins, and a personalised learning plan — the same as a child in Sandton.',
    stat2: "Impaq Education's CAPS-aligned Afrikaans curriculum starts from R5,000 per year. CambriLearn's Cambridge pathway starts from R15,000. Either option is a fraction of what transport, uniforms, and school fees cost a rural family annually — with better academic outcomes and no commute.",
    pSquared: "P-Squared matches your child to the right curriculum — CAPS in Afrikaans if that is your language, Cambridge if you want an internationally recognised pathway, IEB if you want South African rigour with more flexibility. The DBE registration package is generated for your specific province, with the correct forms, the correct motivational letter, and the correct supporting documents. You submit it from your own email. P-Squared stores the record. The Learning Coach delivers your daily guide at 7am via WhatsApp — no data-heavy apps, no login required. Just the next clear step, every morning.",
    cta: "Join the Learner Blueprint Waitlist",
  },
  {
    id: 4, name: 'The Adams Family', bg: '#1A1A2E', icon: '👨‍👦🏽', image: family04,
    problem: 'Bullying.',
    location: 'Cape Flats · Single father',
    sentence: '"He reported it three times. On the fourth he stopped reporting and started building something different."',
    tag: 'Safety concern',
    headline: 'Removing your child from danger is not failure. It is the first act of good parenting.',
    reality: "UNESCO's global school violence data places South Africa among the countries with the highest rates of school bullying. One in three South African learners reports being physically bullied at school at least once in the preceding month. In urban peripheral schools — the Cape Flats, the East Rand, Johannesburg South — this violence is compounded by gang proximity, weak institutional discipline, and teachers who are themselves managing classrooms of 50 under conditions of chronic under-resourcing. When a parent reports bullying and nothing happens, it is not because the school does not care. It is because the school does not have the capacity to respond.",
    stat: '1 in 3 South African learners is physically bullied at school at least once a month — UNESCO 2024. In high-density urban schools where class sizes exceed 45, teachers cannot monitor social dynamics between lessons, during breaks, or in corridors.',
    deeperContext: 'University of Johannesburg research into schools in Gauteng\'s industrial corridor describes learners who arrive at high school already "tired and exhausted" — not from academic work, but from the accumulated stress of unsafe environments. Children who are bullied do not simply suffer socially. Their cortisol levels remain elevated. Their working memory is impaired. Their ability to learn, retain, and recall information is directly compromised by the chronic stress response that bullying triggers. The child who was bullied is not falling behind because they are less capable. They are falling behind because their nervous system has been in survival mode for months or years. A safe learning environment is not a luxury. It is a precondition for learning.',
    stat2: 'Chronic stress from unsafe school environments impairs working memory, reduces attention span, and disrupts the neural pathways required for learning. Removing a child from the source of stress is not overreacting. It is the evidence-based response.',
    pSquared: "P-Squared builds the alternative. A curriculum matched to your son's learning profile — not the class average. A safe, consistent learning space at home where his nervous system can regulate and his brain can actually function. Legal DBE registration so his academic record remains intact and uninterrupted — no gap year, no starting over. The Learning Coach walks you through setting up the physical learning space on Day 1, the daily rhythm on Day 3, and the social plan — extramurals, sports clubs, community connections — on Day 6. Your child does not have to choose between safety and education. P-Squared makes both possible.",
    cta: "Join the Learner Blueprint Waitlist",
  },
  {
    id: 5, name: 'The Mokoena Family', bg: '#1A2E1A', icon: '👨‍👩‍👧🏿', image: family05,
    problem: 'Unsustainable private school fees.',
    location: 'Sandton · Black professional couple',
    sentence: '"The fee statement arrived on the same day the school lost her science project. They made a decision that evening."',
    tag: 'Cost vs quality',
    headline: "R350,000 by matric buys a school's name. It does not buy your child being seen.",
    reality: 'Top private schools in Johannesburg charge between R150,000 and R350,000 per year by the time a child reaches matric. These fees buy brand, infrastructure, and reputation. What they frequently do not buy is individual attention. In a school of 800 learners — even a well-resourced one — a child can be invisible. A missed assignment, a social struggle, a subject that is not clicking — in a high-performing institution where everyone is expected to succeed, these signals are easily overlooked. Parents pay premium fees on the assumption that their child is being seen. Often, they are not.',
    stat: "CambriLearn's Cambridge International curriculum costs between R15,000 and R50,000 per year. UCT Online High School's CAPS programme runs R35,000 to R40,000 annually. Top Johannesburg private schools charge up to ten times these amounts. The academic outcomes of well-supported online learners are increasingly comparable — and in some cases superior.",
    deeperContext: "The online education market in South Africa has matured significantly since 2020. Providers like CambriLearn, UCT Online High School, Impaq, and Think Digital Academy offer structured daily lessons, live teacher interaction, SACAI-accredited assessment, and internationally recognised qualifications. CambriLearn learners write the same Cambridge International examinations as students in the UK, Singapore, and Kenya. UCT Online is backed by one of Africa's leading universities. The quality gap between online and private school — once significant — has closed. What online education offers that private school cannot is genuine personalisation: your child's pace, your child's archetype, your child's path.",
    stat2: 'Of the 1.2 million children who started Grade 1 in 2013, fewer than 15% are projected to enrol at university. Private school fees do not guarantee university entry. The right curriculum match, at the right pace, for the right learner does.',
    pSquared: "P-Squared identifies whether CAPS, IEB, or Cambridge is the right pathway for your daughter — based on her learning profile, not the school's marketing. The recommendation is free. The DBE registration is done for you. The curriculum is matched to who she is. And the Learning Coach walks you through the first week so you know how to facilitate her learning without becoming a full-time teacher. You are not the teacher. The online school is. You are the facilitator, the manager, the advocate. P-Squared shows you exactly how to do that.",
    cta: "Join the Learner Blueprint Waitlist",
  },
  {
    id: 6, name: 'The Moyo Family', bg: '#1F1A2E', icon: '👩‍👦🏽', image: family06,
    problem: 'Education disruption.',
    location: 'Johannesburg · Zimbabwean family',
    sentence: '"She crossed a border to give her son a better life. The school system handed her a form she couldn\'t decode."',
    tag: 'Relocation · Immigration',
    headline: 'You navigated a border. You can navigate this. We will help you.',
    reality: "South Africa's school placement system assumes that every family knows the process, speaks the administrative language, has the correct documentation format, and understands which provincial office to contact. Immigrant and relocated families arrive without any of these advantages. The DBE's processes vary by province, by district, and often by individual official. There is no single national guide, no helpline with consistent answers, and no system that accounts for foreign academic records or non-standard family structures. Families who have relocated — from Zimbabwe, from the Democratic Republic of Congo, from within South Africa itself — face a bureaucratic maze with no map.",
    stat: "The Pestalozzi Trust's 2025 national survey found that Gauteng's DBE homeschool approval rate sits at 40.37% — and KwaZulu-Natal's at just 1.69%. Even South African-born families with full documentation face a 60% non-response rate from provincial DBE offices. For immigrant families, the barrier is compounded further.",
    deeperContext: 'The BELA Act of 2024 introduced new registration requirements for home education — but the administrative infrastructure to process these applications has not kept pace with the legislation. Families are caught in what the Pestalozzi Trust calls "deemed registered" limbo — technically protected from prosecution while their applications are pending, but without the formal certificate that universities, immigration officials, and future employers require. For immigrant families navigating this system in a second or third language, without local networks or institutional knowledge, the risk of making an error that costs their child\'s academic record is real.',
    stat2: '"Deemed registered" status protects a homeschooling family legally — but it does not produce a certificate. Without a formal DBE approval letter, university applications, scholarship assessments, and institutional enrolments can be challenged or rejected.',
    pSquared: "P-Squared generates your complete DBE registration package in plain, accessible language. Every document. Every form. A motivational letter that accurately reflects your family's situation — including your immigration status, your child's previous academic history, and your chosen curriculum. You submit the package yourself from your own email address — which is the legally required method. P-Squared stores the record and supports you through any follow-up correspondence with the provincial DBE office. You do not navigate this alone.",
    cta: "Join the Learner Blueprint Waitlist",
  },
  {
    id: 7, name: 'The Erasmus Family', bg: '#1A2030', icon: '👩‍👦🏻', image: family07,
    problem: 'Social anxiety.',
    location: 'Cape Town · Post-COVID family',
    sentence: '"Lockdown broke most things. It fixed her son. She decided not to undo that."',
    tag: 'Anxiety · School refusal',
    headline: 'What you saw during lockdown was not an accident. It was your child without noise.',
    reality: 'Social anxiety in children is not shyness. It is a neurological response to environments that feel unpredictable, socially demanding, or threatening. A traditional school classroom — 40 to 50 children, constant social negotiation, unpredictable teacher responses, performance evaluation in front of peers — is one of the most socially complex environments a child with anxiety can be placed in. During the COVID-19 lockdowns of 2020 and 2021, many anxious children experienced something they had never had before: a calm, structured, low-stimulation environment where they could learn at their own pace without social threat. When schools reopened, these children did not simply adjust. Many regressed significantly and rapidly.',
    stat: 'University of Johannesburg researchers studying teenagers in Gauteng\'s under-resourced schools describe widespread "emotional exhaustion" — learners who are chronically stressed, anxious, and disengaged not because of academic difficulty, but because the school environment itself is psychologically overwhelming.',
    deeperContext: "Post-COVID research globally shows a consistent pattern: children with pre-existing anxiety, sensory sensitivities, or social communication differences thrived during home-based learning and deteriorated when returned to institutional settings. This is not a reflection of the child's academic capability. It is a reflection of environmental fit. The school was not designed for them. Home — with the right structure, the right curriculum, and the right daily rhythm — was. Adaptive learning platforms that allow a child to pause, rewind, revisit, and move forward at their own pace have shown a 62% improvement in outcomes for learners who struggled in standard classroom settings. The environment was always the variable.",
    stat2: "62% improvement in academic outcomes has been documented in learners using adaptive personalised learning platforms — because the platform adjusts to the learner's pace, not the class average. For anxious learners, removing the social pressure of performing in front of peers is equally significant.",
    pSquared: "P-Squared identifies your son's learning archetype — whether he is an Observer who needs time to process before responding, an Architect who needs depth before breadth, or an Explorer who needs novelty to stay engaged. This archetype shapes every curriculum recommendation, every daily structure, every provider match. The Learning Coach's Day 3 builds a daily rhythm with breathing room built in — 3 hours of focused learning, not 7 hours of institutional performance. By Day 7, most parents report that their child is more engaged, more confident, and more academically productive than they had been in months of traditional schooling.",
    cta: "Join the Learner Blueprint Waitlist",
  },
  {
    id: 8, name: 'The Williams-Jacobs Family', bg: '#2A1A20', icon: '👨‍👩‍👧‍👦', image: family08,
    problem: 'Different learning patterns.',
    location: 'Northcliff · Blended family',
    sentence: '"Three children. Three completely different ways of learning. One decision that finally made sense for all of them."',
    tag: 'Multiple children',
    headline: 'No single school was ever going to work for all three. You are not the problem.',
    reality: 'The South African school system operates on a single, standardised model: every child in a grade receives the same content, at the same pace, assessed by the same instrument, regardless of who they are. This model is efficient for administration. It is catastrophic for learning. In a blended family with children of different ages, different learning profiles, and different emotional histories, the idea that one school — or even two different schools — can serve all of them appropriately is statistically improbable. Children who have been through family transitions — divorce, bereavement, relocation, parent remarriage — carry additional emotional load that a standardised system is not equipped to manage.',
    stat: 'P-Squared has identified 20 distinct learning archetypes — from The Architect (slow, deep, mastery-oriented) to The Explorer (fast, broad, novelty-seeking) to The Caregiver (relational, collaborative, empathy-driven). Two children in the same family can be at opposite ends of this spectrum. One curriculum, one pace, one method cannot serve both.',
    deeperContext: 'Research on blended families and educational outcomes consistently shows that transitions — new household structure, new school, new peer group, new routines — are among the highest-risk periods for academic disengagement. Children need consistency, predictability, and felt safety in order to learn effectively. A home-based learning environment, structured around each child\'s individual profile and anchored by a consistent daily rhythm, provides the stability that institutional schooling — with its fixed terms, changing teachers, and social complexity — frequently cannot. The family that homeschools multiple children is not taking on more than a school could manage. It is taking on something a school was never designed to do: see each child individually.',
    stat2: 'Homeschool co-operatives — where families share facilitation responsibilities, run group projects, and organise structured social time — are growing rapidly across South Africa. Children in these environments get the social breadth of traditional schooling with the academic depth of personalised learning.',
    pSquared: "P-Squared runs the free learner assessment for each child — separately, individually, with separate recommendations. Your eldest might be matched to Cambridge for its academic rigour. Your middle child to CAPS for its structured familiarity. Your youngest to an adaptive platform that adjusts daily. The Learning Coach delivers a daily guide personalised to each child's archetype. The DBE registration covers each child with the correct provincial documentation. One platform, three individual children, three individual plans.",
    cta: "Join the Learner Blueprint Waitlist",
  },
  {
    id: 9, name: 'The Pretorius Family', bg: '#1A1E2A', icon: '👩‍👧‍👦🏻', image: family09,
    problem: 'Religious values not represented.',
    location: 'Centurion · Afrikaner family',
    sentence: '"They were not running away from education. They were running toward something that matched who they are."',
    tag: 'Faith-based education',
    headline: 'Values are not optional extras in education. They are the foundation.',
    reality: "South Africa's post-apartheid curriculum was deliberately designed to be secular, non-racial, and values-neutral — a necessary corrective to a system that had embedded racial ideology into every subject. But in the process, it created a curriculum that feels actively foreign to families for whom faith, language, and cultural heritage are inseparable from education. For Afrikaner families, this friction is specific and felt: a mother tongue that is underrepresented in the national curriculum, a history that is contested and politically charged, and a faith tradition that is treated as a private matter rather than a formative one. The school that was once the centre of community life now feels like an alien institution.",
    stat: "Impaq Education, South Africa's largest homeschool curriculum provider, offers a fully CAPS-aligned curriculum available in Afrikaans — the most-used homeschool provider among Afrikaner families. Over 50,000 South African learners use Impaq annually, and its SACAI-registered matric pathway is fully accepted by South African universities.",
    deeperContext: 'Section 13 of the South African Schools Act explicitly protects a parent\'s right to educate their child according to their own religious and philosophical convictions — provided the child receives an adequate education. The BELA Act of 2024 introduced new registration requirements for home education but did not remove or diminish this protection. What changed is the administrative requirement: families must now formally register with the DBE and submit an annual progress report. The freedom to integrate faith, language, and values into daily learning is legally intact. What P-Squared does is ensure the paperwork reflects that freedom correctly — so it cannot be challenged.',
    stat2: "Gauteng's DBE homeschool application approval rate is 40.37% — meaning that even compliant, well-documented applications face a significant chance of silence or rejection. The difference between an approved application and a rejected one frequently comes down to the motivational letter. P-Squared's package includes a motivational letter written specifically for your family's values and circumstances.",
    pSquared: "P-Squared matches your family to the provider that aligns with your language, your values, and your academic goals — not the most prestigious option, the right one. Impaq's Afrikaans CAPS curriculum is available from Grade R to Grade 12. The DBE registration package is generated with the correct provincial forms, the correct supporting documents, and a motivational letter that accurately represents your family's educational philosophy. Legal. Correct. Yours. The Learning Coach walks you through setting up a daily rhythm that integrates your family's values from the first morning.",
    cta: "Join the Learner Blueprint Waitlist",
  },
  {
    id: 10, name: 'The Chen Family', bg: '#1A2A2A', icon: '👩‍👧🏻', image: family10,
    problem: 'The gifted child.',
    location: 'Cyrildene · Chinese SA family',
    sentence: '"Her daughter finished the Grade 4 maths workbook in three weeks. The school asked her to wait for the rest of the class."',
    tag: 'Gifted learner',
    headline: 'Waiting for the group is not patience. It is the quiet suffocation of a gifted mind.',
    reality: 'Gifted learners are among the most educationally neglected children in the South African school system. The system has no formal gifted education programme. There is no differentiated curriculum for advanced learners. There is no mechanism for a Grade 4 child who has mastered Grade 7 mathematics to progress accordingly. The teacher managing 45 children cannot provide extension work for one while keeping pace with the rest. The result is a child who is told to wait. Who colours in. Who re-does work she has already mastered. Who is quietly, systematically disengaged from learning by a system that cannot move at her speed. By adolescence, many gifted learners have developed elaborate avoidance strategies — they appear unmotivated because motivation requires challenge, and challenge has not been available to them for years.',
    stat: 'Cambridge International curriculum, available through providers like CambriLearn and Think Digital Academy, has no prescribed pace. A learner can progress through a unit in two weeks or two months — based on demonstrated mastery, not age or grade. There is no ceiling. There is no waiting.',
    deeperContext: 'Underachievement in gifted learners is one of the most documented phenomena in educational psychology — and one of the most preventable. Gifted children who are not challenged become bored. Bored children disengage. Disengaged children underperform. Their teachers, who are measuring performance against grade-level standards, often miss the root cause entirely. The child who finishes every worksheet in ten minutes and then disrupts the class is not a behaviour problem. She is a containment problem — contained by a curriculum that was never designed for her. Adaptive learning platforms that allow a child to progress at her actual pace — not the grade\'s pace — consistently show dramatic improvements in engagement, motivation, and achievement for advanced learners.',
    stat2: 'Research on acceleration — allowing gifted learners to progress through curriculum at their own pace — shows significant long-term benefits: higher academic achievement, greater career satisfaction, and stronger sense of personal identity. The fear that acceleration damages social development is not supported by evidence when acceleration is paired with strong social structures.',
    pSquared: "P-Squared's learner assessment identifies your daughter's archetype — The Scientist, The Engineer, The Inventor, The Philosopher — and maps her to the curriculum that has no ceiling. Cambridge International, available through CambriLearn or Think Digital Academy, allows her to progress through each subject at her demonstrated pace. The DBE registration ensures her academic record is legally recognised regardless of how far ahead she progresses. The Learning Coach's Day 4 uses her specific archetype to give you tools for when she finishes early, goes deep on something unexpected, or needs a challenge that goes beyond the curriculum. You do not slow her down. You learn how to keep up.",
    cta: "Join the Learner Blueprint Waitlist",
  },
];

// SEO hook
function useSEO() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'About P² — Built by a Mother. For Parents.';

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return el;
    };

    const desc = 'P² was built by a South African mother who homeschools her twin sons. We start with the learner, not the curriculum.';
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:title"]', 'property', 'og:title', 'About P² — Built by a Mother. For Parents.');
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:url"]', 'property', 'og:url', 'https://mypsquared.com/about');


    const ldId = 'about-jsonld';
    let ld = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement('script');
      ld.id = ldId;
      ld.type = 'application/ld+json';
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'P-Squared Education',
      url: 'https://mypsquared.com',
      description: 'South African homeschooling support platform offering free learner assessments, curriculum matching, and DBE registration services.',
      foundingLocation: 'Johannesburg, South Africa',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+27818905861',
        contactType: 'customer support',
        availableLanguage: ['English', 'Afrikaans'],
      },
    });

    return () => {
      document.title = prevTitle;
    };
  }, []);
}

const CARD_GAP = 12;

function getCardWidth() {
  if (typeof window === 'undefined') return 280;
  const w = window.innerWidth;
  if (w < 768) {
    // Mobile: 1 card + edge of second
    return Math.max(240, Math.min(320, w * 0.82));
  }
  // Desktop: ~3 larger cards visible
  // viewport padding = 80 (40 each side), gap total = 36 (12 × 3)
  return Math.min(400, Math.max(300, (w - 80 - 36) / 3));
}

export default function AboutPage() {
  useSEO();
  const navigate = useNavigate();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    x: 0,
    speed: 0.4,
    targetSpeed: 0.4,
    baseSpeed: 0.4,
    dragging: false,
    dragStartX: 0,
    dragScrollX: 0,
    expandedIndex: null as number | null,
    cardWidth: getCardWidth(),
    totalWidth: (getCardWidth() + CARD_GAP) * 10,
    isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
  });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [, setTick] = useState(0);

  const recompute = useCallback(() => {
    const cw = getCardWidth();
    stateRef.current.cardWidth = cw;
    stateRef.current.totalWidth = (cw + CARD_GAP) * 10;
    stateRef.current.isMobile = window.innerWidth < 768;
    stateRef.current.baseSpeed = stateRef.current.isMobile ? 0.3 : 0.4;
    if (stateRef.current.expandedIndex === null) {
      stateRef.current.targetSpeed = stateRef.current.baseSpeed;
    }
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    recompute();
    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, [recompute]);

  // Animation loop
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const s = stateRef.current;
      const track = trackRef.current;
      if (track && !s.dragging && s.expandedIndex === null) {
        s.speed += (s.targetSpeed - s.speed) * 0.04;
        s.x += s.speed;
        if (s.x >= s.totalWidth) s.x -= s.totalWidth;
        if (s.x < 0) s.x += s.totalWidth;
        track.style.transform = `translate3d(${-s.x}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Hover & drag handlers
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const s = stateRef.current;

    const onEnter = () => {
      if (s.expandedIndex === null) s.targetSpeed = 2.2;
    };
    const onLeave = () => {
      if (s.expandedIndex === null) s.targetSpeed = s.baseSpeed;
    };
    const onMouseDown = (e: MouseEvent) => {
      if (s.expandedIndex !== null) return;
      s.dragging = true;
      s.dragStartX = e.pageX;
      s.dragScrollX = s.x;
      viewport.style.cursor = 'grabbing';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!s.dragging) return;
      const next = s.dragScrollX + (s.dragStartX - e.pageX);
      s.x = ((next % s.totalWidth) + s.totalWidth) % s.totalWidth;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-s.x}px,0,0)`;
    };
    const onMouseUp = () => {
      if (!s.dragging) return;
      s.dragging = false;
      viewport.style.cursor = 'grab';
    };

    const onTouchStart = (e: TouchEvent) => {
      if (s.expandedIndex !== null) return;
      s.dragStartX = e.touches[0].pageX;
      s.dragScrollX = s.x;
      s.dragging = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!s.dragging) return;
      const next = s.dragScrollX + (s.dragStartX - e.touches[0].pageX);
      s.x = ((next % s.totalWidth) + s.totalWidth) % s.totalWidth;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-s.x}px,0,0)`;
    };
    const onTouchEnd = () => {
      s.dragging = false;
    };

    viewport.addEventListener('mouseenter', onEnter);
    viewport.addEventListener('mouseleave', onLeave);
    viewport.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: true });
    viewport.addEventListener('touchend', onTouchEnd);

    return () => {
      viewport.removeEventListener('mouseenter', onEnter);
      viewport.removeEventListener('mouseleave', onLeave);
      viewport.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const openCard = (familyIdx: number, _cardEl: HTMLElement | null) => {
    const s = stateRef.current;
    // Toggle: clicking the same card closes the panel
    if (s.expandedIndex === familyIdx) {
      s.expandedIndex = null;
      s.targetSpeed = s.baseSpeed;
      setExpandedIndex(null);
      return;
    }
    s.expandedIndex = familyIdx;
    s.targetSpeed = 0;
    s.speed = 0;
    setExpandedIndex(familyIdx);
  };

  const closeCard = () => {
    const s = stateRef.current;
    s.expandedIndex = null;
    s.targetSpeed = s.baseSpeed;
    setExpandedIndex(null);
  };

  const selectedFamily = expandedIndex !== null ? families[expandedIndex] : null;

  // Render: 20 cards (10 × 2) for seamless loop
  const loopedCards = [...families, ...families];

  usePageMeta({
    title: 'About P² — Personalised Learning Built for South African Families',
    description: 'P² started at a kitchen table — built by a South African mother for the families the school system was never designed for. Read our story.',
    ogTitle: 'About P² — Built by a Mother, For South African Families',
    ogDescription: 'How P-Squared began: one mother, two children, and the question that built a personalised learning service for South Africa.',
    ogUrl: 'https://mypsquared.com/about',
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <h1 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
        About P² — Personalised Learning Built by a Mother for South African Families
      </h1>



      {/* SECTION 1 — HOW IT STARTED HEADER */}
      <section className="about-section1" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img
          className="about-section1-bg"
          src={kitchenTable}
          alt="A South African mother writing in a notebook with her twin sons at the kitchen table"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 35%',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(10,20,15,0.88) 0%, rgba(10,20,15,0.80) 40%, rgba(10,20,15,0.50) 70%, rgba(10,20,15,0.20) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div className="about-section1-left" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ color: EMERALD, textTransform: 'uppercase', fontSize: 16, letterSpacing: '0.2em', fontWeight: 700 }}>
            HOW IT STARTED
          </div>
          <div style={{ width: 40, height: 3, background: EMERALD, marginTop: 8, marginBottom: 28, borderRadius: 2 }} />
          <p style={{ color: '#F5F0E8', fontSize: 16, lineHeight: 1.9, margin: 0 }}>
            P-Squared began at a kitchen table. Not in a boardroom. Not with investors. Not with a business plan. It began with a mother trying to figure out how to help her children.
          </p>
          <p style={{ color: '#F5F0E8', fontSize: 16, lineHeight: 1.9, marginTop: 20 }}>
            She didn't have a PhD in education. No formal training. What she had was time — and the realisation that the most meaningful gift she could give her children was exactly that. With the best curriculum available. Taught not as a system — but as a conversation between a mother and the two individuals sitting across from her, she asked:
          </p>
          <p style={{ color: EMERALD, fontSize: 22, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4, marginTop: 24 }}>
            How do I give them the education they deserve?
          </p>

        </div>
      </section>

      {/* SECTION 2 — THREE LINE INSIGHT */}
      <section
        className="about-section2"
        style={{ background: CREAM, padding: '40px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
      >
        <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 220, opacity: 0.08, background: 'radial-gradient(ellipse at left center, #8B7355 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 220, opacity: 0.08, background: 'radial-gradient(ellipse at right center, #8B7355 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          {[
            'The education system starts with the curriculum.',
            'Parents start with their child.',
            'Those are not the same thing.',
          ].map((line) => (
            <div key={line}>
              <div className="about-s2-line" style={{ color: NAVY, fontWeight: 700, lineHeight: 1.2, fontFamily: 'Georgia, serif' }}>
                {line}
              </div>
              <div style={{ width: 80, height: 3, background: EMERALD, borderRadius: 2, margin: '12px auto 0' }} />
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <div style={{ color: EMERALD, textTransform: 'uppercase', fontSize: 16, letterSpacing: '0.2em', fontWeight: 700 }}>
              THE P² PRINCIPLE
            </div>
            <div style={{ width: 40, height: 2, background: EMERALD, margin: '8px auto 0', borderRadius: 1 }} />
          </div>
        </div>
      </section>

      {/* SECTION 3 — TWO COLUMN NARRATIVE */}
      <section className="about-section3" style={{ background: '#fff' }}>
        <div>
          <div style={{ color: EMERALD, textTransform: 'uppercase', fontSize: 16, letterSpacing: '0.2em', fontWeight: 700 }}>
            OUR STORY IN BRIEF
          </div>
          <div style={{ width: 40, height: 3, background: EMERALD, marginTop: 8, marginBottom: 32, borderRadius: 2 }} />

          <div style={{ position: 'relative' }}>
            <div aria-hidden style={{ position: 'absolute', left: 21, top: 22, bottom: 22, borderLeft: `1px dashed ${EMERALD}` }} />
            {[
              { Icon: Search, title: 'She searched.', body: 'Overwhelmed by choices. Few real answers. Nobody asked: Who is this child?' },
              { Icon: Users, title: 'She discovered.', body: 'Thousands of South African parents were walking the same road. Alone.' },
              { Icon: FileText, title: 'She saw the problem.', body: 'Families were navigating DBE registration, paperwork, curriculum choices and legal uncertainty in isolation.' },
              { Icon: Compass, title: 'So she built one.', body: 'Not a school. Not a curriculum. A map. One I built with my boys, one question, one mistake and one breakthrough at a time.' },
            ].map(({ Icon, title, body }) => (
              <div key={title} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 28, position: 'relative' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: EMERALD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <Icon size={20} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ color: NAVY, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{title}</div>
                  <div style={{ color: GRAY, fontSize: 14, lineHeight: 1.7 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.8, marginTop: 32 }}>
            P-Squared exists to help families navigate one of the most important decisions they will ever make.
          </p>
          <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.8, marginTop: 16 }}>
            Because every child is different. Every family is different. Every learning journey is different.
          </p>
        </div>

        <div>
          <div style={{ color: EMERALD, textTransform: 'uppercase', fontSize: 16, letterSpacing: '0.2em', fontWeight: 700 }}>
            THE P² PRINCIPLE
          </div>
          <div style={{ width: 40, height: 3, background: EMERALD, marginTop: 8, marginBottom: 32, borderRadius: 2 }} />

          {[
            { Icon: User, text: 'We believe the system should bend to fit the child. Not the other way around.' },
            { Icon: Equal, text: 'Education = You². The child is the constant. The system is the variable.' },
            { Icon: Lightbulb, text: "Einstein's formula changed physics. Ours changes education." },
            { Icon: Star, text: 'High standards and rigour still matter. Knowledge matters. Discipline matters. Mastery matters.' },
          ].map(({ Icon, text }, i, arr) => (
            <div
              key={text}
              style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                borderBottom: i < arr.length - 1 ? '0.5px solid #E5E7EB' : 'none',
                paddingBottom: 20, marginBottom: 20,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: EMERALD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color="#fff" strokeWidth={2} />
              </div>
              <div style={{ color: GRAY, fontSize: 14, lineHeight: 1.7 }}>{text}</div>
            </div>
          ))}

          <div className="about-s3-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
            {[
              { a: 'What changes is not the destination.', b: 'What changes is the route.' },
              { a: 'The goal is not easier learning.', b: 'The goal is deeper learning.' },
              { a: 'Not less challenge. More meaningful challenge. Not lower standards.', b: 'Better pathways.' },
            ].map((c) => (
              <div key={c.b} style={{ background: NAVY, borderRadius: 8, padding: '20px 16px' }}>
                <ArrowRight size={20} color={EMERALD} style={{ marginBottom: 12 }} />
                <div style={{ color: CREAM, fontSize: 13, lineHeight: 1.7 }}>{c.a}</div>
                <div style={{ color: CREAM, fontSize: 13, lineHeight: 1.7, fontWeight: 700, marginTop: 4 }}>{c.b}</div>
              </div>
            ))}
          </div>

          <p style={{ color: NAVY, fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginTop: 32 }}>
            And when parents understand their children, they become capable of building extraordinary learning journeys.
          </p>
        </div>
      </section>

      {/* SECTION 4 — BELIEF + SIGNATURE */}
      <section className="about-section4" style={{ background: CREAM }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ color: EMERALD, fontSize: 96, lineHeight: 0.8, fontFamily: 'Georgia, serif', marginBottom: 16 }}>
            “
          </div>
          <p className="about-s4-quote" style={{ color: NAVY, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4, fontFamily: 'Georgia, serif', margin: 0 }}>
            The child is the universal constant. Everything else bends to fit them. Not the other way around.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div
            className="about-s4-sig"
            style={{ color: NAVY, fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontWeight: 400, lineHeight: 1.2 }}
          >
            Tsholo Monyausi
          </div>
          <div style={{ color: NAVY, fontSize: 12, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 12 }}>
            FOUNDER, P-SQUARED
          </div>
          <div style={{ width: 40, height: 2, background: EMERALD, marginTop: 12, borderRadius: 1 }} />
        </div>
      </section>





      {/* SECTION 3 — FAMILY GALLERY (moved before founder story) */}
      <section className="bg-white">
        {/* Header */}
        <div
          className="flex items-end justify-between about-gallery-header"
          style={{ padding: '32px 40px 16px' }}
        >
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 4 }}>
              Find your story.
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
              Click the family that sounds like yours.
            </p>
          </div>
          <div className="hidden md:flex items-center" style={{ gap: 6 }}>
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: EMERALD,
                animation: 'aboutPulse 1.5s infinite',
              }}
            />
            <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
              Hover to speed up · Drag to control
            </span>
          </div>
        </div>

        {/* Viewport */}
        <div
          ref={viewportRef}
          className="about-scroll-viewport"
          role="region"
          aria-label="Scrolling family stories — drag or hover to control speed"
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            padding: '4px 0 28px',
            cursor: 'grab',
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: CARD_GAP,
              width: 'max-content',
              willChange: 'transform',
              padding: '0 40px',
            }}
          >
            {loopedCards.map((fam, idx) => {
              const familyIdx = idx % 10;
              const isExpanded = expandedIndex === familyIdx;
              return (
                <FamilyCard
                  key={idx}
                  dataIndex={familyIdx}
                  family={fam}
                  expanded={isExpanded}
                  isMobile={stateRef.current.isMobile}
                  defaultWidthPx={stateRef.current.cardWidth}
                  onOpen={(el) => openCard(familyIdx, el)}
                  onClose={closeCard}
                  onCTA={() => navigate('/waitlist')}
                />
              );
            })}
          </div>
        </div>

        {/* Animated arrow indicator strip — visible when a card is selected */}
        {selectedFamily && (
          <div
            style={{
              background: '#0F172A',
              padding: '10px',
              textAlign: 'center',
              color: EMERALD,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span style={{ display: 'inline-block', animation: 'aboutArrowBounce 1s infinite' }}>↓</span>
            <span style={{ margin: '0 8px' }}>Their story is below</span>
            <span style={{ display: 'inline-block', animation: 'aboutArrowBounce 1s infinite' }}>↓</span>
          </div>
        )}

        {/* STORY PANEL — opens below the carousel */}
        <div
          aria-hidden={!selectedFamily}
          style={{
            overflow: 'hidden',
            maxHeight: selectedFamily ? '4000px' : '0px',
            transition: 'max-height 300ms ease-in-out',
          }}
        >

          {selectedFamily && (
            <div
              className="about-story-panel"
              style={{
                background: '#1E293B',
                borderTop: `2px solid ${EMERALD}`,
                borderRadius: '0 0 12px 12px',
                padding: '32px 40px',
                animation: 'aboutFadePanel 0.3s ease both',
              }}
            >
              {/* Header row */}
              <div
                className="about-story-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    className="about-story-eyebrow"
                    style={{
                      fontSize: 13,
                      color: EMERALD,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {selectedFamily.location}
                  </div>
                  <div
                    className="about-story-headline"
                    style={{
                      fontSize: 20,
                      color: '#F5F0E8',
                      fontWeight: 700,
                      marginTop: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {selectedFamily.headline}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCard}
                  className="about-story-close"
                  style={{
                    background: 'transparent',
                    border: '1px solid #334155',
                    color: '#94A3B8',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'border-color 150ms, color 150ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = EMERALD;
                    e.currentTarget.style.color = '#F5F0E8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.color = '#94A3B8';
                  }}
                >
                  Close ✕
                </button>
              </div>

              {/* Story text */}
              <div
                className="about-story-body"
                style={{
                  fontSize: 15,
                  color: '#94A3B8',
                  lineHeight: 1.8,
                  maxWidth: 720,
                }}
              >
                <p style={{ margin: 0 }}>{selectedFamily.reality}</p>
                <p style={{ margin: '16px 0 0', color: '#CBD5E1', fontWeight: 500 }}>
                  {selectedFamily.stat}
                </p>
                <p style={{ margin: '16px 0 0' }}>{selectedFamily.deeperContext}</p>
                <p style={{ margin: '16px 0 0', color: '#CBD5E1', fontWeight: 500 }}>
                  {selectedFamily.stat2}
                </p>
                <p style={{ margin: '16px 0 0' }}>{selectedFamily.pSquared}</p>
              </div>

              {/* CTA row */}
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => navigate('/assessment')}
                  style={{
                    color: EMERALD,
                    fontWeight: 700,
                    fontSize: 14,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  Start the Free Assessment →
                </button>
              </div>

              {/* Mobile close (full width, after story) */}
              <button
                type="button"
                onClick={closeCard}
                className="about-story-close-mobile"
                style={{
                  display: 'none',
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid #334155',
                  color: '#94A3B8',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 16,
                }}
              >
                Close ✕
              </button>
            </div>
          )}
        </div>
      </section>




      {/* SECTION 5 — KASIAHUB FOOTER BAR (moved to just above footer) */}
      <section className="about-section5" style={{ background: NAVY }}>
        <div className="about-s5-left">
          <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 16, letterSpacing: '0.02em' }}>
            BUILT BY A MOTHER.<br />FOR PARENTS.
          </h3>
          <p style={{ color: CREAM, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            P-Squared is powered by kasiAIhub — a community-focused innovation lab building practical solutions for South African families, entrepreneurs and educators.
          </p>
          <div style={{ color: '#fff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            kasi<span style={{ color: EMERALD }}>AI</span>hub<span style={{ color: EMERALD }}>.</span>
          </div>
        </div>
        <div className="about-s5-right">
          <Heart size={64} color={EMERALD} strokeWidth={2} fill="none" style={{ marginBottom: 20 }} />
          <p style={{ color: CREAM, fontSize: 18, fontStyle: 'italic', lineHeight: 1.6, fontFamily: 'Georgia, serif', margin: 0, textAlign: 'center' }}>
            Because no parent should have to navigate this journey alone.
          </p>
        </div>
      </section>

      <Footer />


      {/* Local styles */}
      <style>{`
        @keyframes aboutPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes aboutFadePanel {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes aboutArrowBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        .about-hero-inner {
          padding: 100px 48px 72px;
          scroll-margin-top: 80px;
        }
        .about-hero-tag { font-size: 13px; }
        .about-hero-headline { font-size: 38px; }
        .about-hero-formula { font-size: 22px; }
        .about-hero-supporting { font-size: 15px; }
        .about-stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .about-founder { padding: 52px 48px; }
        .about-founder-headline { font-size: 30px; }
        .about-founder-body { font-size: 16px; line-height: 1.85; }
        .about-quality { padding: 48px 40px; }
        .about-scroll-viewport::before,
        .about-scroll-viewport::after {
          display: none !important;
        }
        @media (max-width: 767px) {
          .about-hero-inner { padding: 80px 20px 56px; }
          .about-hero-tag { font-size: 12px; }
          .about-hero-headline { font-size: 26px; }
          .about-hero-formula { font-size: 17px; }
          .about-hero-supporting { font-size: 14px; }
          .about-pillars {
            grid-template-columns: 1fr !important;
          }
          .about-stats-bar {
            grid-template-columns: repeat(2, 1fr);
          }
          .about-stat-cell:nth-child(2) {
            border-right: none !important;
          }
          .about-stat-cell:nth-child(1),
          .about-stat-cell:nth-child(2) {
            border-bottom: 0.5px solid hsl(var(--border));
          }
          .about-founder { padding: 40px 24px; }
          .about-founder-headline { font-size: 24px; }
          .about-founder-body { font-size: 15px; line-height: 1.8; }
          .about-quality { padding: 36px 20px; }
          .about-quality-grid {
            grid-template-columns: 1fr !important;
          }
          .about-gallery-header {
            padding: 20px 20px 12px !important;
          }
          .about-section1 { padding-bottom: 56px !important; }
        }


        /* New About sections */
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&display=swap');
        .about-section1 {
          padding: 96px 64px;
          min-height: 760px;
          display: flex;
          align-items: center;
        }
        .about-section1-left { max-width: 580px; }
        .about-section1-bg { pointer-events: none; }
        .about-s2-line { font-size: 36px; }
        .about-section3 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding: 80px 64px;
        }
        .about-section4 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          padding: 40px 64px;
          align-items: center;
        }
        .about-s4-quote { font-size: 28px; }
        .about-s4-sig { font-size: 36px; }
        .about-section5 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          padding: 48px 64px;
          align-items: center;
        }
        .about-s5-left {
          padding-right: 48px;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .about-s5-right {
          padding-left: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        @media (max-width: 767px) {
          .about-section1 { padding: 96px 24px 64px; min-height: 560px; }
          .about-section2 { padding: 56px 20px !important; }
          .about-s2-line { font-size: 24px; }
          .about-section3 { grid-template-columns: 1fr; gap: 48px; padding: 40px 20px; }
          .about-s3-cards { grid-template-columns: 1fr !important; }
          .about-section4 { grid-template-columns: 1fr; gap: 24px; padding: 28px 20px; }
          .about-s4-quote { font-size: 22px; }
          .about-s4-sig { font-size: 28px; }
          .about-section5 { grid-template-columns: 1fr; padding: 40px 24px; }
          .about-s5-left { padding-right: 0; border-right: none; padding-bottom: 32px; margin-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .about-s5-right { padding-left: 0; }
          .about-story-panel { padding: 20px 16px !important; }
          .about-story-headline { font-size: 17px !important; }
          .about-story-body { font-size: 14px !important; }
          .about-story-header { flex-direction: row; align-items: center !important; }
          .about-story-close { display: none !important; }
          .about-story-close-mobile { display: block !important; }
      `}</style>

    </div>
  );
}

/* ---------- FamilyCard ---------- */

function FamilyCard({
  family,
  expanded,
  isMobile,
  defaultWidthPx,
  dataIndex,
  onOpen,
  onClose,
  onCTA,
}: {
  family: Family;
  expanded: boolean;
  isMobile: boolean;
  defaultWidthPx: number;
  dataIndex: number;
  onOpen: (el: HTMLElement | null) => void;
  onClose: () => void;
  onCTA: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(cardRef.current);
  };

  // Suppress unused-prop warnings (kept for API compatibility)
  void isMobile;
  void onClose;
  void onCTA;

  return (
    <div
      ref={cardRef}
      data-index={dataIndex}
      onClick={handleClick}
      className="fam-card flex-shrink-0"
      style={{
        width: `${defaultWidthPx}px`,
        borderRadius: 12,
        border: expanded ? `2px solid ${EMERALD}` : '0.5px solid hsl(var(--border))',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'hsl(var(--background))',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: expanded ? `0 0 0 1px ${EMERALD}33` : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* IMAGE PANEL */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: family.bg,
          width: '100%',
          flexShrink: 0,
          aspectRatio: '3 / 4',
        }}
      >
        {family.image ? (
          <img
            src={family.image}
            alt={`${family.name} — ${family.problem}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 80,
              opacity: 0.15,
            }}
          >
            {family.icon}
          </div>
        )}

        {/* Gradient overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.92) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top: family name + problem */}
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 2 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              marginBottom: 6,
              textShadow: '0 1px 6px rgba(0,0,0,0.9)',
            }}
          >
            {family.name}
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.3,
              textShadow: '0 2px 8px rgba(0,0,0,0.85)',
            }}
          >
            {family.problem}
          </div>
        </div>

        {/* Bottom: location + sentence */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 14px', zIndex: 2 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#6EE7B7',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 6,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {family.location}
          </div>
          <div
            style={{
              fontSize: 13,
              color: '#FFFFFF',
              fontStyle: 'italic',
              lineHeight: 1.5,
              textShadow: '0 1px 6px rgba(0,0,0,0.85)',
            }}
          >
            {family.sentence}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '0.5px solid hsl(var(--border))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>{family.tag}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpen(cardRef.current);
          }}
          aria-label={`Read ${family.name} story`}
          style={{
            fontSize: 14,
            color: EMERALD,
            fontWeight: 700,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          Read story →
        </button>
      </div>
    </div>
  );
}

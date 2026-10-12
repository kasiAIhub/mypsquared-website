import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  BookOpen,
  UserCheck,
  ClipboardList,
  Compass,
  FileCheck2,
  Sparkles,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  Plus,
  Minus,
  Heart,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { HeroTile } from '@/components/hero/HeroTile';
import { ServiceModal } from '@/components/hero/ServiceModal';
import { heroServices, type HeroService } from '@/lib/heroServices';
import heroBackground from '@/assets/hero-background.png.asset.json';
import { usePageMeta } from '@/hooks/usePageMeta';


/* ---------- Inline responsive styles ---------- */
const styles = `
  .psq-home { background: #ffffff; }

  /* HERO */
  .psq-hero {
    position: relative;
    background: #0F172A;
    min-height: 90vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .psq-hero-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center right;
    z-index: 0;
  }
  .psq-hero-overlay-main {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to right,
      rgba(15, 23, 42, 0.93) 0%,
      rgba(15, 23, 42, 0.85) 35%,
      rgba(15, 23, 42, 0.55) 60%,
      rgba(15, 23, 42, 0.2) 80%,
      transparent 100%
    );
    pointer-events: none;
  }
  .psq-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 120px 40px 80px;
  }
  .psq-hero-left {
    position: relative;
    z-index: 2;
    max-width: 580px;
    width: 100%;
  }
  .psq-hero-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #10B981;
    margin-bottom: 16px;
  }
  .psq-hero-headline {
    font-size: clamp(36px, 5.5vw, 64px);
    font-weight: 800;
    color: #F5F0E8;
    line-height: 1.1;
    margin-bottom: 20px;
  }
  .psq-hero-sub {
    font-size: 17px;
    color: #94A3B8;
    line-height: 1.75;
    max-width: 520px;
    margin-bottom: 32px;
  }
  .psq-hero-ctas {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
  .psq-btn-primary {
    background: #10B981;
    color: #0F172A;
    padding: 16px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
  }
  .psq-btn-primary:hover { background: #059669; }
  .psq-btn-outline {
    background: transparent;
    color: #F5F0E8;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    padding: 15px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .psq-btn-outline:hover { border-color: #10B981; color: #10B981; }
  .psq-trust-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
    align-items: center;
    margin-top: 24px;
  }
  .psq-trust-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748B;
  }
  .psq-trust-check {
    color: #10B981;
    font-weight: 700;
  }

  /* WAVE */
  .psq-wave-wrap { background: #ffffff; line-height: 0; }
  .psq-wave-wrap svg { display: block; width: 100%; height: 44px; }

  /* THREE PROBLEMS */
  .psq-problems { background: #ffffff; padding: 64px 40px; }
  .psq-problems-head { text-align: center; }
  .psq-problems-label {
    font-size: 11px;
    color: #10b981;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    text-align: center;
  }
  .psq-problems-h2 {
    font-size: 26px;
    font-weight: 700;
    color: #0d1b2a;
    text-align: center;
    margin-top: 8px;
  }
  .psq-problems-sub {
    font-size: 14px;
    color: #666;
    text-align: center;
    max-width: 480px;
    margin: 12px auto 48px;
    line-height: 1.7;
  }
  .psq-problems-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .psq-problem-card {
    border-radius: 14px;
    padding: 28px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    display: flex;
    flex-direction: column;
  }
  .psq-problem-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(13,27,42,0.06);
  }
  .psq-problem-card.red { background: #fef2f2; border: 0.5px solid #fecaca; }
  .psq-problem-card.amber { background: #fefce8; border: 0.5px solid #fde68a; }
  .psq-problem-card.green { background: #f0fdf4; border: 0.5px solid #bbf7d0; }
  .psq-problem-num {
    font-size: 48px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 16px;
    opacity: 0.15;
  }
  .psq-problem-num.red { color: #dc2626; }
  .psq-problem-num.amber { color: #d97706; }
  .psq-problem-num.green { color: #16a34a; }
  .psq-problem-fearlabel {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }
  .psq-problem-fearlabel.red { color: #dc2626; }
  .psq-problem-fearlabel.amber { color: #d97706; }
  .psq-problem-fearlabel.green { color: #16a34a; }
  .psq-problem-fear {
    font-size: 17px;
    font-weight: 700;
    color: #0d1b2a;
    line-height: 1.3;
    margin-bottom: 20px;
  }
  .psq-problem-divider {
    height: 1px;
    margin-bottom: 20px;
  }
  .psq-problem-divider.red { background: #fecaca; }
  .psq-problem-divider.amber { background: #fde68a; }
  .psq-problem-divider.green { background: #bbf7d0; }
  .psq-problem-solvedlabel {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #10b981;
    margin-bottom: 8px;
  }
  .psq-problem-answer {
    font-size: 13px;
    color: #374151;
    line-height: 1.7;
    margin-bottom: 20px;
  }
  .psq-problem-pill {
    display: inline-block;
    align-self: flex-start;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 20px;
    margin-top: auto;
  }
  .psq-problem-pill.red { background: #fecaca; color: #7f1d1d; }
  .psq-problem-pill.amber { background: #fde68a; color: #78350f; }
  .psq-problem-pill.green { background: #bbf7d0; color: #14532d; }

  /* CREDENTIAL STRIP */
  .psq-credentials {
    background: #ffffff;
    border-bottom: 0.5px solid #eee;
    padding: 12px 40px;
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
  }
  .psq-credentials-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #555;
  }
  .psq-credentials-check {
    color: #10b981;
    font-size: 15px;
    font-weight: 700;
  }

  /* SERVICE CARDS */
  .psq-services {
    padding: 64px 40px;
    background: #ffffff;
  }
  .psq-section-label {
    color: #10b981;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }
  .psq-section-h2 {
    font-size: 30px;
    font-weight: 700;
    color: #0d1b2a;
    margin-top: 8px;
  }
  .psq-section-sub {
    font-size: 16px;
    color: #555;
    margin-top: 8px;
  }
  .psq-services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-top: 32px;
  }
  .psq-service-card {
    background: #ffffff;
    border: 0.5px solid #e8e5de;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .psq-service-card:hover {
    border-color: #10b981;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(13,27,42,0.06);
  }
  .psq-service-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #f0fdf4;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #10b981;
  }
  .psq-service-title {
    font-size: 17px;
    font-weight: 700;
    color: #0d1b2a;
  }
  .psq-service-desc {
    font-size: 15px;
    color: #555;
    line-height: 1.6;
  }
  .psq-coach-card {
    border-style: dashed;
    opacity: 0.85;
  }
  .psq-coach-card .psq-service-icon {
    background: #fef9ee;
    color: #d97706;
  }
  .psq-coach-card .psq-service-title { color: #888; }
  .psq-coach-tag {
    display: inline-block;
    background: #fef9ee;
    color: #854f0b;
    border: 0.5px dashed #d97706;
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 13px;
    font-weight: 500;
    align-self: flex-start;
    margin-top: 4px;
  }

  /* HOW IT WORKS */
  .psq-how {
    background: #f9f8f4;
    padding: 64px 40px;
  }
  .psq-how-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    margin-top: 32px;
    border: 0.5px solid #e8e5de;
    border-radius: 12px;
    overflow: hidden;
  }
  .psq-how-grid-4 { grid-template-columns: repeat(4, 1fr); }
  .psq-how-step {
    background: #ffffff;
    padding: 28px;
    border-right: 0.5px solid #e8e5de;
    cursor: pointer;
    transition: background 0.15s;
  }
  .psq-how-step:last-child { border-right: none; }
  .psq-how-step:hover { background: #fafaf7; }
  .psq-how-num {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #10b981;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .psq-how-title {
    font-size: 18px;
    font-weight: 700;
    color: #0d1b2a;
    margin-bottom: 8px;
  }
  .psq-how-desc {
    font-size: 15px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 14px;
  }
  .psq-how-badge {
    display: inline-block;
    background: #f0fdf4;
    color: #10b981;
    border: 0.5px solid #bbf7d0;
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 13px;
    font-weight: 500;
  }

  /* PHILOSOPHY */
  .psq-philo {
    background: #ffffff;
    padding: 64px 40px;
  }
  .psq-philo-inner {
    max-width: 820px;
    margin: 0 auto;
    text-align: center;
  }
  .psq-philo-h2 {
    font-size: 30px;
    font-weight: 700;
    color: #0d1b2a;
    margin-top: 8px;
  }
  .psq-philo-intro {
    font-size: 16px;
    color: #444;
    line-height: 1.7;
    max-width: 680px;
    margin: 18px auto 36px;
  }
  .psq-philo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    text-align: left;
  }
  .psq-philo-card-bad {
    background: #fff5f5;
    border: 0.5px solid #fecaca;
    border-radius: 12px;
    padding: 24px;
  }
  .psq-philo-card-good {
    background: #f0fdf4;
    border: 0.5px solid #bbf7d0;
    border-radius: 12px;
    padding: 24px;
  }
  .psq-philo-bad-title {
    font-size: 16px;
    font-weight: 600;
    color: #dc2626;
    margin-bottom: 12px;
  }
  .psq-philo-good-title {
    font-size: 16px;
    font-weight: 600;
    color: #16a34a;
    margin-bottom: 12px;
  }
  .psq-philo-body {
    font-size: 15px;
    color: #444;
    line-height: 1.7;
    white-space: pre-line;
  }
  .psq-philo-list {
    font-size: 15px;
    color: #444;
    line-height: 1.7;
    margin-top: 10px;
    padding-left: 0;
    list-style: none;
  }
  .psq-philo-list li {
    position: relative;
    padding-left: 18px;
    margin-bottom: 8px;
  }
  .psq-philo-list li::before {
    content: "•";
    color: #10b981;
    position: absolute;
    left: 0;
    top: 0;
    font-size: 16px;
    line-height: 1.4;
  }
  .psq-philo-closing {
    border-top: 0.5px solid #e8e5de;
    padding-top: 24px;
    margin-top: 24px;
    text-align: center;
  }
  .psq-philo-tag1 {
    font-size: 18px;
    font-weight: 600;
    color: #0d1b2a;
  }
  .psq-philo-tag2 {
    font-size: 14px;
    color: #777;
    margin-top: 6px;
  }

  /* FAQ */
  .psq-faq {
    background: #f9f8f4;
    padding: 64px 40px;
  }
  .psq-faq-inner {
    max-width: 760px;
    margin: 0 auto;
  }
  .psq-faq-list { margin-top: 32px; }
  .psq-faq-item {
    background: #ffffff;
    border: 0.5px solid #e8e5de;
    border-radius: 10px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .psq-faq-q {
    padding: 18px 22px;
    font-size: 16px;
    font-weight: 500;
    color: #0d1b2a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
  }
  .psq-faq-toggle {
    color: #10b981;
    flex-shrink: 0;
  }
  .psq-faq-a {
    padding: 0 22px 18px;
    font-size: 15px;
    color: #555;
    line-height: 1.7;
    border-top: 0.5px solid #f0f0f0;
    padding-top: 14px;
  }

  /* CTA BANNER */
  .psq-cta {
    background: #0d3d2e;
    padding: 56px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .psq-cta-left {
    display: flex;
    flex-direction: row;
    gap: 18px;
    align-items: center;
  }
  .psq-cta-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .psq-cta-h2 {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 6px;
  }
  .psq-cta-p {
    font-size: 15px;
    color: rgba(255,255,255,0.7);
  }
  .psq-cta-btn {
    background: #10b981;
    color: #ffffff;
    padding: 15px 30px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .psq-cta-btn:hover { background: #0ea372; }

  /* MOBILE */
  @media (max-width: 767px) {
    .psq-hero {
      min-height: auto;
    }
    .psq-hero-bg {
      object-position: center center;
    }
    .psq-hero-overlay-main {
      background: rgba(15, 23, 42, 0.88);
    }
    .psq-hero-inner {
      padding: 100px 20px 60px;
    }
    .psq-hero-left {
      max-width: 100%;
    }
    .psq-hero-headline { font-size: clamp(32px, 8vw, 48px); }
    .psq-hero-sub { font-size: 15px; }
    .psq-section-h2, .psq-philo-h2 { font-size: 24px; }
    .psq-cta-h2 { font-size: 20px; }
    .psq-hero-ctas {
      flex-direction: column;
      width: 100%;
    }
    .psq-hero-ctas button { width: 100%; }
    .psq-trust-row {
      flex-wrap: wrap;
      gap: 12px;
    }
    .psq-credentials {
      padding: 12px 20px;
      gap: 16px;
    }
    .psq-services,
    .psq-how,
    .psq-philo,
    .psq-faq {
      padding: 40px 20px;
    }
    .psq-services-grid,
    .psq-how-grid,
    .psq-philo-grid,
    .psq-problems-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .psq-problems { padding: 48px 20px; }
    .psq-how-grid { gap: 0; }
    .psq-how-grid-4 { grid-template-columns: 1fr; }
    .psq-how-step {
      border-right: none;
      border-bottom: 0.5px solid #e8e5de;
    }
    .psq-how-step:last-child { border-bottom: none; }
    .psq-cta {
      flex-direction: column;
      align-items: flex-start;
      padding: 40px 20px;
    }
    .psq-cta-btn { width: 100%; }
  }
`;

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  isCoach?: boolean;
}

const services: ServiceCard[] = [
  {
    icon: <ClipboardList size={20} />,
    title: 'Assessment & Placement',
    desc: "Discover your child's learning archetype in 5 minutes. Free.",
    href: '/assessment',
  },
  {
    icon: <Compass size={20} />,
    title: 'Curriculum Advisory',
    desc: 'CAPS, IEB, or Cambridge — matched to your child with cost comparisons.',
    href: '/learner-blueprint',
  },
  {
    icon: <FileCheck2 size={20} />,
    title: 'DBE Registration',
    desc: 'Complete legal package prepared for your province in 24 hours.',
    href: '/dbe-registration',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'Personalised Learning',
    desc: 'A learning plan that adapts to your child — pace, style, and interests.',
    href: '/learner-blueprint',
  },
  {
    icon: <GraduationCap size={20} />,
    title: 'Online School Options',
    desc: 'Compare accredited online schools across CAPS, IEB, and Cambridge.',
    href: '/learner-blueprint',
  },
  {
    icon: <HeartHandshake size={20} />,
    title: 'My Learning Coach',
    desc: 'Your homeschooling companion for the whole journey. First 7 days free with DBE registration.',
    href: '/my-learning-coach',
    isCoach: true,
  },
];

const faqs = [
  {
    q: 'Do I need teaching qualifications to homeschool in South Africa?',
    a: "No. The 2024 BELA Act and DBE clarifications confirm that teaching qualifications are NOT required. You just need to demonstrate your capability to facilitate your child's learning — which we help you articulate in your application.",
  },
  {
    q: 'Is CAPS curriculum mandatory for homeschooling?',
    a: "No. The June 2025 Ministerial Guidelines confirmed that CAPS is not compulsory. Your curriculum must be 'at least comparable' to public school standards — but you are free to choose IEB, Cambridge, or your own programme.",
  },
  {
    q: 'How long does DBE approval take?',
    a: 'Gauteng and Western Cape typically respond in 14–30 days. Other provinces may take longer. Under the BELA Act, if the department does not respond within 60 days, your application is legally deemed approved. We track this with you.',
  },
  {
    q: 'What if my application gets rejected?',
    a: 'You have the right to appeal to the MEC within 14 days of receiving a rejection notice. We include guidance on the appeal process in your package, and our 30-day WhatsApp support covers exactly this situation.',
  },
  {
    q: 'Can I homeschool if I work full-time?',
    a: 'Yes. Many homeschooling families use online schools, flexible schedules, and community learning groups. The DBE requires a minimum of 3 hours contact time per day — how and when you structure that is up to you.',
  },
  {
    q: 'What\u2019s the difference between the Free Assessment and the R999 Registration?',
    a: "The free assessment gives you your child's learning archetype and a curriculum recommendation — no payment needed. The R999 DBE Registration package prepares all your legal documents, motivation letter, educational programme, and submission instructions for your specific province.",
  },
  {
    q: 'What is My Learning Coach?',
    a: "My Learning Coach is your daily companion for the homeschooling journey. The first 7 days are free with every DBE registration — guiding you through setting up your learning space, understanding your curriculum, building a daily rhythm, and using your child's archetype to personalise their education. It stays with you beyond the first week for the whole journey.",
  },
  {
    q: 'What if I have multiple children of different grades?',
    a: 'Each child needs a separate DBE registration application. We offer a discounted package for families registering more than one child. WhatsApp us on +27 81 890 5861 for multi-child pricing.',
  },
  {
    q: 'What exactly is the learner archetype — is it scientifically validated?',
    a: "The learner archetype is a metaphorical framework — a relatable, memorable way to describe your child's natural learning patterns. It is not a clinical or psychological classification. Think of it as a portrait of how your child tends to engage with learning, based on your observations as a parent. Archetypes like The Architect or The Explorer are starting points for understanding — not permanent labels. Your child may show patterns from several archetypes, and these can shift as they grow.",
  },
  {
    q: 'Should I use the learner profile instead of seeing an educational psychologist?',
    a: "No. The P-Squared learner profile is a parent guidance tool, not a substitute for professional assessment. If you have concerns about your child's learning, development, behaviour, or if a condition like dyslexia, ADHD, or autism has been suggested, please consult a registered educational psychologist. In South Africa, you can find one through the Health Professions Council of South Africa (HPCSA) at hpcsa.co.za.",
  },
];

export default function Home() {
  usePageMeta({
    title: 'P² — Personalised Learning for Every South African Child',
    description: "Personalised daily lesson plans built around how your child learns. CAPS, IEB and Cambridge aligned. Join the waitlist - we open soon.",
  });

  useEffect(() => {
    const ldData = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'P-Squared',
        alternateName: 'P²',
        url: 'https://mypsquared.com',
        description: 'Personalised learning service for South African children — daily lesson plans aligned to CAPS, IEB, Cambridge or DBE, delivered via WhatsApp.',
        areaServed: 'ZA',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'P²',
        url: 'https://mypsquared.com',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ];
    const id = 'psq-home-jsonld';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(ldData);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<HeroService | null>(null);



  const getTileClassName = (id: number) => {
    if (id === 2 || id === 4 || id === 7 || id === 10) return 'row-span-2';
    return 'row-span-1';
  };

  return (
    <div className="psq-home">
      <style>{styles}</style>
      <Navbar />

      {/* Spacer for fixed nav */}
      <div style={{ height: 80 }} />

      {/* HERO */}
      <section className="psq-hero">
        <img
          className="psq-hero-bg"
          src={heroBackground.url}
          alt="A young South African teenager with a P² backpack looking out over a glowing landscape toward a futuristic city at sunset."
          loading="eager"
        />
        <div className="psq-hero-overlay-main" aria-hidden="true" />

        <div className="psq-hero-inner">
          <div className="psq-hero-left">
            <div className="psq-hero-eyebrow">Personalised Learning System</div>

            <h1 className="psq-hero-headline">
              Every Child Is Unique.
              <br />
              <span style={{ color: '#10B981' }}>Their Learning Journey</span>
              <br />
              <span style={{ color: '#10B981' }}>Should Be Too.</span>
            </h1>

            <p className="psq-hero-sub">
              Whether your child is in school or learning at home, P² is building a personalised daily lesson plan around who they are, matched to their curriculum and sent to your WhatsApp. Join the waitlist to be first in. Homeschooling parents: start with the free Homeschool Readiness Guide to find your path first.
            </p>

            <div className="psq-hero-ctas">
              <button className="psq-btn-primary" onClick={() => navigate('/waitlist')}>
                Join the Learner Blueprint Waitlist →
              </button>
              <button className="psq-btn-outline" onClick={() => navigate('/assessment')}>
                Homeschool Readiness Guide
              </button>
            </div>

            <div className="psq-trust-row">
              <div className="psq-trust-badge">
                <span className="psq-trust-check">✓</span>
                <span>Join the waitlist - we open soon</span>
              </div>
              <div className="psq-trust-badge">
                <span className="psq-trust-check">✓</span>
                <span>Built around your child</span>
              </div>
              <div className="psq-trust-badge">
                <span className="psq-trust-check">✓</span>
                <span>Delivered via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAVE */}
      <div className="psq-wave-wrap" aria-hidden="true">
        <svg viewBox="0 0 1440 44" preserveAspectRatio="none" fill="none">
          <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="white" />
        </svg>
      </div>

      {/* CREDENTIAL STRIP */}
      <div className="psq-credentials">
        {[
          'All 9 provinces covered',
          'Legally prepared documents',
          'Package ready in 24 hours',
          'POPIA compliant',
        ].map((item) => (
          <div key={item} className="psq-credentials-item">
            <span className="psq-credentials-check">✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* THREE HOMESCHOOLING PROBLEMS SOLVED */}
      <section className="psq-problems">
        <div className="psq-problems-head">
          <div className="psq-problems-label">Why P-Squared exists</div>
          <h2 className="psq-problems-h2">Three homeschooling problems solved.</h2>
          <p className="psq-problems-sub">
            Every parent who chooses homeschooling carries the same three fears.
            Here is exactly how P-Squared removes them.
          </p>
        </div>

        <div className="psq-problems-grid">
          {/* CARD 1 — LEGAL FEAR */}
          <div
            className="psq-problem-card red"
            onClick={() => navigate('/dbe-registration')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/dbe-registration');
              }
            }}
          >
            <div className="psq-problem-num red">1</div>
            <div className="psq-problem-fearlabel red">The legal fear</div>
            <div className="psq-problem-fear">
              Am I doing this legally? Can I actually go to prison for this?
            </div>
            <div className="psq-problem-divider red" />
            <div className="psq-problem-solvedlabel">✓ Solved</div>
            <div className="psq-problem-answer">
              Your <strong>DBE registration package</strong> is prepared province-specific,
              legally correct, and ready to submit. Motivation letter, learning plan, all
              required documents — <strong>done for you in under an hour</strong>. You submit
              it yourself. You are fully protected.
            </div>
            <span className="psq-problem-pill red">DBE Registration — R999</span>
          </div>

          {/* CARD 2 — DAILY FEAR */}
          <div
            className="psq-problem-card amber"
            onClick={() => navigate('/assessment')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/assessment');
              }
            }}
          >
            <div className="psq-problem-num amber">2</div>
            <div className="psq-problem-fearlabel amber">The daily fear</div>
            <div className="psq-problem-fear">
              Will I know what to do every morning? Where do I even start?
            </div>
            <div className="psq-problem-divider amber" />
            <div className="psq-problem-solvedlabel">✓ Solved</div>
            <div className="psq-problem-answer">
              Your child's <strong>learner profile</strong> tells you who they are as a
              learner. The <strong>curriculum match</strong> tells you what to teach. The{' '}
              <strong>Learning Coach</strong> walks you through every morning — setting
              up your space, building your timetable, choosing extramurals, and starting
              project-based learning where your child solves real community problems. Step by
              step. Every day.
            </div>
            <span className="psq-problem-pill amber">Free learner profile + Coach</span>
          </div>

          {/* CARD 3 — FUTURE FEAR */}
          <div
            className="psq-problem-card green"
            onClick={() => navigate('/dbe-registration')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/dbe-registration');
              }
            }}
          >
            <div className="psq-problem-num green">3</div>
            <div className="psq-problem-fearlabel green">The future fear</div>
            <div className="psq-problem-fear">
              Will I mess up my child's future? Will they still get into university?
            </div>
            <div className="psq-problem-divider green" />
            <div className="psq-problem-solvedlabel">✓ Solved</div>
            <div className="psq-problem-answer">
              Your <strong>learning plan</strong> is aligned to <strong>DBE milestones</strong>{' '}
              — the same requirements that determine university entry. Your child progresses
              at their own pace without falling behind what matters. At the end of the year,
              you will know exactly where they stand.
            </div>
            <span className="psq-problem-pill green">Learning plan included</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="psq-how">
        <div style={{ textAlign: 'center' }}>
          <div className="psq-section-label">HOW IT WORKS</div>
          <h2 className="psq-section-h2">From decision to homeschooling in four steps</h2>
          <p className="psq-section-sub">
            P-Squared walks with you through every part of the journey — from understanding
            your child to their first day of learning.
          </p>
        </div>

        <div className="psq-how-grid psq-how-grid-4">
          {[
            {
              n: 1,
              title: 'Know your child',
              desc: 'Start with the free learner profile. 5 minutes. Discover how your child actually thinks and learns. This drives everything that follows.',
              badge: 'Free · No signup needed',
              href: '/assessment',
            },
            {
              n: 2,
              title: 'Know your path',
              desc: "Get your curriculum match. CAPS, IEB, or Cambridge — chosen specifically for your child's learner profile, your province, and your family's budget.",
              badge: 'Instant results',
              href: '/learner-blueprint',
            },
            {
              n: 3,
              title: 'Get legal',
              desc: 'Your complete DBE registration package — prepared for your specific province, legally correct, and ready to submit. Done in under an hour. You are fully protected.',
              badge: 'R999 once-off',
              href: '/dbe-registration',
            },
            {
              n: 4,
              title: 'Know what to do tomorrow',
              desc: 'Your Learning Coach walks you through the first 7 days — setting up your learning space, building your timetable, choosing extramurals, and starting project-based learning. Free with DBE registration.',
              badge: 'Free with DBE package',
              href: '/my-learning-coach',
            },
          ].map((step) => (
            <div
              key={step.n}
              className="psq-how-step"
              onClick={() => navigate(step.href)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(step.href);
                }
              }}
            >
              <div className="psq-how-num">{step.n}</div>
              <div className="psq-how-title">{step.title}</div>
              <div className="psq-how-desc">{step.desc}</div>
              <span className="psq-how-badge">{step.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section className="psq-services">
        <div style={{ textAlign: 'center' }}>
          <div className="psq-section-label">OUR SERVICES</div>
          <h2 className="psq-section-h2">Why families choose P²</h2>
          <p className="psq-section-sub">
            The system adapts to your child — not the other way around.
          </p>
        </div>

        <div className="hero-grid-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[280px]" style={{ marginTop: 28 }}>
          {heroServices.map((service, index) => (
            <div key={service.id} className={`hero-tile ${getTileClassName(service.id)}`}>
              <HeroTile
                service={service}
                onClick={() => setSelectedService(service)}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="psq-philo">
        <div className="psq-philo-inner">
          <div className="psq-section-label">OUR PHILOSOPHY</div>
          <h2 className="psq-philo-h2">
            Education = <span style={{ color: '#10b981' }}>You²</span>
          </h2>
          <p className="psq-philo-intro">
            Einstein made light (c) the universal constant — everything in physics bends around it.
            It's time that You (the learner) became the universal constant — and for everything in
            education to bend around you.
          </p>

          <div className="psq-philo-grid">
            <div className="psq-philo-card-bad">
              <div className="psq-philo-bad-title">✕ The Problem with Traditional Education</div>
              <div className="psq-philo-body">
                {`Traditional schools say: 'Here's the system. Fit yourself into it.'

One curriculum. One pace. One teaching style. 30+ children in a room, all expected to learn the same way, at the same speed.`}
              </div>
            </div>

            <div className="psq-philo-card-good">
              <div className="psq-philo-good-title">✓ The P-Squared Approach</div>
              <div className="psq-philo-body">
                We say: 'Here's who you are. We'll build the system around you.'
              </div>
              <ul className="psq-philo-list">
                <li>The curriculum adapts to your child's learning pattern</li>
                <li>
                  My Learning Coach guides you through your first 7 days — then stays with you
                  for the whole journey
                </li>
                <li>The pace matches your child's processing speed — no rushing, no boredom</li>
                <li>The content connects to your child's interests and real-world context</li>
              </ul>
            </div>
          </div>

          <div className="psq-philo-closing">
            <div className="psq-philo-tag1">
              Education doesn't mold you. Education{' '}
              <span style={{ color: '#10b981' }}>amplifies</span> you.
            </div>
            <div className="psq-philo-tag2">
              In the age of AI, adaptive solutions are finally possible. Your child is the constant.
              Everything else adapts.
            </div>
          </div>
        </div>
      </section>


      {/* CTA BANNER */}
      <section className="psq-cta">
        <div className="psq-cta-left">
          <div className="psq-cta-icon">
            <Heart size={26} stroke="#ffffff" fill="none" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="psq-cta-h2">Ready to begin your homeschooling journey?</h2>
            <p className="psq-cta-p">Take the first step today. We're here to walk with you.</p>
          </div>
        </div>
        <button className="psq-cta-btn" onClick={() => navigate('/waitlist')}>
          Join the Learner Blueprint Waitlist <ArrowRight size={16} style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle' }} />
        </button>
      </section>

      <Footer />
      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
}

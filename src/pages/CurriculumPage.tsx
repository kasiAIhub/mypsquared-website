import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  ArrowRight,
  HelpCircle,
  BookOpen,
  Brain,
  Globe,
  CalendarClock,
  MessageSquare,
  Rocket,
  School,
  GraduationCap,
  Tag,
  Flag,
  Eye,
  Target,
  BarChart3,
  Gift,
  Clock,
  FileText,
  ShieldCheck,
  Check,
} from 'lucide-react';
import heroImg from '@/assets/curriculum-hero-clean.jpg';
import { Lightbulb } from 'lucide-react';
import ctaImg from '@/assets/curriculum-cta.png';

const EMERALD = '#10B981';
const NAVY = '#0F172A';
const PURPLE = '#7C3AED';
const AMBER = '#D97706';
const CREAM = '#F5F0E8';

export default function CurriculumPage() {
  useEffect(() => {
    document.title = 'Curriculum Guide | P-Squared Education';
  }, []);

  const tableRows = [
    { Icon: CalendarClock, color: EMERALD, label: 'Needs routine and certainty', caps: true, ieb: false, cam: false },
    { Icon: MessageSquare, color: PURPLE, label: 'Loves projects and discussion', caps: false, ieb: true, cam: false },
    { Icon: Rocket, color: AMBER, label: 'Learns quickly and independently', caps: false, ieb: false, cam: true },
    { Icon: School, color: EMERALD, label: 'May return to traditional school', caps: true, ieb: false, cam: false },
    { Icon: GraduationCap, color: PURPLE, label: 'University-focused in South Africa', caps: false, ieb: true, cam: false },
    { Icon: Globe, color: AMBER, label: 'International opportunities', caps: false, ieb: false, cam: true },
    { Icon: Tag, color: EMERALD, label: 'Budget is a key consideration', caps: true, ieb: false, cam: false },
    { Icon: Flag, color: PURPLE, label: 'Thrives with challenge and depth', caps: false, ieb: true, cam: false },
  ];

  const Cell = ({ on, color }: { on: boolean; color: string }) => (
    <td className="text-center px-3 py-4 align-middle">
      {on ? (
        <Check className="inline-block w-6 h-6" style={{ color }} strokeWidth={3} />
      ) : (
        <span className="text-base" style={{ color: '#9CA3AF' }}>—</span>
      )}
    </td>
  );

  return (
    <div style={{ fontFamily: 'Lato, system-ui, sans-serif' }}>
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section
        className="relative pt-20 md:pt-24 overflow-hidden"
        style={{ backgroundColor: CREAM }}
      >
        {/* Mobile image (top) */}
        <div className="md:hidden w-full">
          <img
            src={heroImg}
            alt="Young South African girl writing in her notebook"
            className="w-full h-[300px] object-cover"
          />
        </div>

        {/* Desktop image (right, gradient-masked into cream) */}
        <div
          className="hidden md:block absolute top-0 right-0 bottom-0 pointer-events-none"
          style={{ width: '55%' }}
        >
          <img
            src={heroImg}
            alt="Young South African girl writing in her notebook"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: 'center top',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 20%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 20%)',
            }}
          />
          {/* Floating icons over image */}
          <Lightbulb
            className="absolute"
            style={{ top: '22%', left: '34%', color: AMBER, width: 32, height: 32 }}
            strokeWidth={1.75}
          />
          <Globe
            className="absolute"
            style={{ top: '24%', right: '10%', color: '#1F5F5B', width: 32, height: 32 }}
            strokeWidth={1.75}
          />
          <GraduationCap
            className="absolute"
            style={{ top: '48%', left: '24%', color: NAVY, width: 32, height: 32 }}
            strokeWidth={1.75}
          />
          <BookOpen
            className="absolute"
            style={{ bottom: '30%', right: '12%', color: AMBER, width: 32, height: 32 }}
            strokeWidth={1.75}
          />
        </div>

        {/* Text content */}
        <div className="relative z-10 px-5 py-10 md:py-24 md:pl-16 lg:pl-24">
          <div style={{ maxWidth: 520 }}>
            <h1
              className="font-extrabold leading-[1.1]"
              style={{ color: NAVY, fontSize: 'clamp(36px, 5vw, 52px)' }}
            >
              The curriculum stays the same. The journey becomes personal.
            </h1>
            <p
              className="mt-5"
              style={{ color: '#374151', fontSize: 17, lineHeight: 1.7, maxWidth: 400 }}
            >
              Understanding CAPS, IEB and Cambridge is the first step to helping your child thrive.
            </p>

            <div
              className="mt-5 inline-flex items-start gap-3 px-4 py-3"
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: 50,
                maxWidth: 380,
                backgroundColor: 'rgba(255,255,255,0.9)',
              }}
            >
              <HelpCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
              <div className="text-sm leading-snug">
                <div className="font-bold" style={{ color: NAVY }}>Not sure which is the best fit?</div>
                <div style={{ color: '#6B7280' }}>Our free assessment reveals what suits your child.</div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 rounded-lg font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: EMERALD, padding: '14px 28px', fontSize: 16 }}
              >
                Discover Your Child's Learning Profile <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — THREE CURRICULA CARDS */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-center font-bold"
            style={{ color: NAVY, fontSize: 'clamp(26px, 4vw, 36px)' }}
          >
            Understanding the 3 Curricula
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                color: EMERALD,
                Icon: BookOpen,
                title: 'CAPS',
                desc: "South Africa's national curriculum. Structured, mastery-based, locally relevant.",
                bestFor: 'Children who thrive with structure, routine and clear step-by-step learning.',
                typical: 'Consistent, practical, benefits from repetition and mastery.',
              },
              {
                color: PURPLE,
                Icon: Brain,
                title: 'IEB',
                desc: "South Africa's premium private curriculum. Balanced assessment with projects and critical thinking.",
                bestFor: 'Children who enjoy deep thinking, projects and exploring ideas in detail.',
                typical: 'Analytical, curious, independent thinker.',
              },
              {
                color: AMBER,
                Icon: Globe,
                title: 'Cambridge',
                desc: 'Globally recognised in 150+ countries. Inquiry-based, self-paced, internationally mobile.',
                bestFor: 'Children who learn quickly, prefer independence and may study internationally.',
                typical: 'Self-motivated, fast processor, globally minded.',
              },
            ].map(({ color, Icon, title, desc, bestFor, typical }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-8 text-center"
                style={{ border: '1px solid #E5E7EB' }}
              >
                <div
                  className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ border: `2px solid ${color}` }}
                >
                  <Icon className="w-8 h-8" style={{ color }} strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-extrabold" style={{ color, fontSize: 32 }}>
                  {title}
                </h3>
                <p className="mt-3" style={{ color: '#374151', fontSize: 15, lineHeight: 1.7 }}>
                  {desc}
                </p>
                <div className="my-5" style={{ borderTop: '1px solid #E5E7EB' }} />
                <div
                  className="font-bold uppercase"
                  style={{ color, fontSize: 13, letterSpacing: '0.05em' }}
                >
                  Best for:
                </div>
                <p className="mt-2" style={{ color: '#374151', fontSize: 14, lineHeight: 1.7 }}>
                  {bestFor}
                </p>
                <div
                  className="font-bold uppercase mt-4"
                  style={{ color, fontSize: 13, letterSpacing: '0.05em' }}
                >
                  Typical learner:
                </div>
                <p className="mt-2" style={{ color: '#374151', fontSize: 14, lineHeight: 1.7 }}>
                  {typical}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — MATCHING TABLE */}
      <section className="bg-white pt-4 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-center font-bold"
            style={{ color: NAVY, fontSize: 'clamp(26px, 4vw, 36px)' }}
          >
            Which Curriculum Fits Your Child?
          </h2>
          <p className="text-center mt-2" style={{ color: '#6B7280', fontSize: 16 }}>
            A quick guide to help you compare.
          </p>

          <div
            className="mt-10 overflow-hidden rounded-xl overflow-x-auto"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  <th
                    className="text-left font-semibold text-white px-5 py-4"
                    style={{ backgroundColor: NAVY, fontSize: 15 }}
                  >
                    Child Trait / Goal
                  </th>
                  <th className="text-center font-bold text-white px-4 py-4" style={{ backgroundColor: EMERALD }}>
                    CAPS
                  </th>
                  <th className="text-center font-bold text-white px-4 py-4" style={{ backgroundColor: PURPLE }}>
                    IEB
                  </th>
                  <th className="text-center font-bold text-white px-4 py-4" style={{ backgroundColor: AMBER }}>
                    Cambridge
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      backgroundColor: i % 2 === 1 ? '#F9FAFB' : '#FFFFFF',
                      borderBottom: '1px solid #E5E7EB',
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <row.Icon className="w-6 h-6 flex-shrink-0" style={{ color: row.color }} strokeWidth={1.75} />
                        <span style={{ color: NAVY, fontSize: 14, fontWeight: 500 }}>{row.label}</span>
                      </div>
                    </td>
                    <Cell on={row.caps} color={EMERALD} />
                    <Cell on={row.ieb} color={PURPLE} />
                    <Cell on={row.cam} color={AMBER} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CTA + DISCLAIMER */}
      <section>
        <div style={{ backgroundColor: CREAM }} className="py-16">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <img
                src={ctaImg}
                alt="South African child looking up thoughtfully"
                className="w-full h-auto rounded-2xl"
              />
            </div>
            <div className="order-2">
              <h2
                className="font-bold leading-tight"
                style={{ color: NAVY, fontSize: 'clamp(24px, 3.5vw, 32px)' }}
              >
                Still not sure which curriculum is the right fit?
              </h2>
              <p className="mt-4" style={{ color: '#374151', fontSize: 16, lineHeight: 1.7 }}>
                Our Learning Profile Assessment analyses your child's:
              </p>

              <div className="mt-5 grid grid-cols-5 gap-3">
                {[
                  { Icon: Eye, label: 'Attention patterns', color: EMERALD },
                  { Icon: Brain, label: 'Processing style', color: PURPLE },
                  { Icon: Target, label: 'Motivation drivers', color: AMBER },
                  { Icon: BookOpen, label: 'Learning preferences', color: '#2563EB' },
                  { Icon: BarChart3, label: 'Academic readiness', color: EMERALD },
                ].map(({ Icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center text-center">
                    <Icon className="w-8 h-8" style={{ color }} strokeWidth={1.75} />
                    <span className="mt-2" style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.3 }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-5" style={{ color: '#374151', fontSize: 15, lineHeight: 1.7 }}>
                You'll receive a personalised report showing which curriculum environment your child is most likely to thrive in — and why.
              </p>

              <Link
                to="/assessment"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg font-bold text-white transition hover:opacity-90 w-full md:w-auto"
                style={{ backgroundColor: EMERALD, padding: '16px 32px', fontSize: 17 }}
              >
                Discover Your Child's Learning Profile <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-5 flex flex-wrap gap-6" style={{ color: '#6B7280', fontSize: 13 }}>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4" style={{ color: EMERALD }} /> 100% Free
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: EMERALD }} /> Takes 5 Minutes
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: EMERALD }} /> Instant Personalised Report
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: EMERALD }} className="py-5 px-6 md:px-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <ShieldCheck className="w-7 h-7 text-white flex-shrink-0" strokeWidth={2} />
            <p className="text-white" style={{ fontSize: 15, lineHeight: 1.6 }}>
              Our recommendations are curriculum-focused, not school-branded. We help you choose what's best for your child, without bias.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

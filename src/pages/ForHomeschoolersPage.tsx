import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  GraduationCap,
  Clock,
  Search,
  BookOpen,
  FileText,
  MessageCircle,
  ArrowRight,
  Check,
  CalendarCheck,
  MessageCircleMore,
  Fingerprint,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import heroPdf from "@/assets/for-homeschoolers-hero-pdf.png";
import samplePdf from "@/assets/for-homeschoolers-sample-pdf.png";
import founderImg from "@/assets/for-homeschoolers-founder.jpg";
import coachingDayImg from "@/assets/coaching-day-panels.png.asset.json";
import { Phone, Smile, Paperclip, Camera as CameraIcon, Mic, Target, Camera } from "lucide-react";

const EMERALD = "#10B981";
const NAVY = "#0F172A";
const CREAM = "#F5F0E8";

const scrollToHowItWorks = (e: React.MouseEvent) => {
  e.preventDefault();
  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
};

const Eyebrow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`uppercase font-bold ${className}`}
    style={{ color: EMERALD, fontSize: 16, letterSpacing: "0.15em" }}
  >
    {children}
  </div>
);

const TrustItem = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5" style={{ color: CREAM, opacity: 0.85 }}>
    <Check className="w-3.5 h-3.5" style={{ color: EMERALD }} strokeWidth={3} />
    {children}
  </span>
);

const FearCard = ({
  Icon,
  title,
  body,
}: {
  Icon: typeof Scale;
  title: string;
  body: string;
}) => (
  <div className="rounded-2xl p-8" style={{ background: "#F9FAFB" }}>
    <Icon className="w-8 h-8 mb-6" style={{ color: EMERALD }} strokeWidth={2} />
    <h3 className="font-bold mb-4" style={{ color: NAVY, fontSize: 20 }}>
      {title}
    </h3>
    <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.7 }}>{body}</p>
  </div>
);

const FeatureRow = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span
      className="shrink-0 inline-flex items-center justify-center rounded-full mt-0.5"
      style={{ background: EMERALD, width: 22, height: 22 }}
    >
      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </span>
    <span style={{ color: "white", fontSize: 15 }}>{children}</span>
  </li>
);

const Step = ({
  Icon,
  number,
  label,
  desc,
  badgeBg,
  badgeText,
}: {
  Icon: typeof Search;
  number: number;
  label: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
}) => (
  <div className="flex flex-col items-center text-center px-2">
    <Icon className="w-8 h-8 mb-3" style={{ color: NAVY }} strokeWidth={2} />
    <div
      className="rounded-full flex items-center justify-center text-white font-bold mb-3"
      style={{ background: EMERALD, width: 48, height: 48, fontSize: 18 }}
    >
      {number}
    </div>
    <div className="font-bold mb-2" style={{ color: NAVY, fontSize: 18 }}>
      {label}
    </div>
    <p
      style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.6, maxWidth: 180 }}
      className="mb-4"
    >
      {desc}
    </p>
    <span
      className="inline-flex items-center justify-center font-bold"
      style={{
        background: badgeBg,
        color: "white",
        fontSize: 13,
        padding: "8px 16px",
        borderRadius: 20,
      }}
    >
      {badgeText}
    </span>
  </div>
);

const Arrow = () => (
  <div className="hidden md:flex items-center justify-center pt-4" aria-hidden="true">
    <ArrowRight className="w-7 h-7" style={{ color: EMERALD }} strokeWidth={2} />
  </div>
);

const DOCS: { title: string; subtitle: string }[] = [
  { title: "DBE Application Form", subtitle: "All 103 fields completed" },
  { title: "Professional Motivation Letter", subtitle: "Section 51 SASA compliant" },
  { title: "Comprehensive Educational Programme", subtitle: "Curriculum, subjects, daily structure" },
  { title: "Weekly Timetable", subtitle: "Ready to submit" },
  { title: "Assessment Commitment Letter", subtitle: "Satisfies DBE evidence requirement" },
  { title: "Document Checklist", subtitle: "Nothing missing, nothing forgotten" },
  { title: "Email Cover Letter", subtitle: "Professionally written, province-specific" },
  { title: "Submission Instructions", subtitle: "Exactly what to do, step by step" },
];

const CoachingDaySection = () => {
  const timeline = [
    {
      Icon: MessageCircle,
      label: "7:00 AM",
      title: "Your coach has a plan.",
      body: "Your coach sends a clear WhatsApp message with today's learning focus, lesson links and guidance — built around your child's learning profile.",
    },
    {
      Icon: BookOpen,
      label: "Learning Time",
      title: "Your personalised learning world.",
      body: "Your child steps into story-driven lessons packed with real-world problems, bold visuals and characters they connect with. Built for their curriculum. Designed for how they learn.",
    },
    {
      Icon: Target,
      label: "After Learning",
      title: "Quiz app. Reinforce. Remember.",
      body: "Your child completes a short quiz that reinforces learning, builds confidence and shows what they've mastered.",
    },
    {
      Icon: Camera,
      label: "Anytime",
      title: "Capture the moments that matter.",
      body: "A breakthrough. A frustration. A question. A moment of confidence. Whenever you notice something important, simply send a WhatsApp message, voice note or photo.",
      extras: true,
    },
  ];

  const subjects = [
    { bg: "#3B82F6", letter: "M", name: "Mathematics", detail: "Multiplication" },
    { bg: "#10B981", letter: "N", name: "Natural Sciences", detail: "Bones & Muscles" },
    { bg: "#F97316", letter: "L", name: "Life Skills", detail: "The Big Build" },
    { bg: "#A855F7", letter: "P", name: "Presentation", detail: "Show What You Know" },
  ];

  return (
    <section
      id="coaching-day"
      style={{ background: NAVY }}
      className="px-5 py-8 md:px-16 md:py-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[25fr_35fr_40fr] gap-10 lg:gap-8">
        <div>
          <h2
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1 }}
          >
            A day in the life of<br />
            <span style={{ color: EMERALD }}>a personalised<br />learner</span>
          </h2>
          <p style={{ color: CREAM, fontSize: 15, lineHeight: 1.7, marginTop: 16 }}>
            Not worksheets. Not homework.<br />
            A learning experience built around{" "}
            <span style={{ color: EMERALD }}>who your child is becoming.</span>
          </p>

          <div
            className="mt-8 mx-auto"
            style={{
              maxWidth: 300,
              background: "#000",
              borderRadius: 32,
              padding: 10,
              border: "2px solid #1f2937",
            }}
          >
            <div style={{ background: "#0b141a", borderRadius: 24, overflow: "hidden", paddingBottom: 8 }}>
              <div className="flex justify-between items-center px-4 pt-2 pb-1" style={{ color: "#fff", fontSize: 11 }}>
                <span>07:00</span>
                <span>• • •</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#1f2c34" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background: EMERALD }}>P²</div>
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">P² Coach</div>
                  <div style={{ color: "#9CA3AF", fontSize: 10 }}>online</div>
                </div>
                <Phone className="w-4 h-4" style={{ color: "#9CA3AF" }} />
              </div>
              <div style={{ background: "#0b141a", padding: 12, minHeight: 280 }}>
                <div style={{ background: "#FFF8E7", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: "#111", marginBottom: 6 }}>
                    Hi Lihle! 👋<br />Here's your plan for today:
                  </div>
                  {subjects.map((s) => (
                    <div key={s.name} className="flex items-center gap-2 mb-1">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-white font-bold"
                        style={{ background: s.bg, fontSize: 10 }}
                      >
                        {s.letter}
                      </div>
                      <span style={{ fontSize: 11, color: "#111", fontWeight: 600 }}>{s.name}</span>
                      <span style={{ fontSize: 10, color: "#555" }}>{s.detail}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 9, color: "#777", textAlign: "right", marginTop: 4 }}>07:00</div>
                </div>
                <div style={{ background: "#FFF8E7", borderRadius: 8, padding: 10, maxWidth: "75%" }}>
                  <div style={{ fontSize: 12, color: "#111" }}>Let's make it a powerful day! 💪</div>
                  <div style={{ fontSize: 9, color: "#777", textAlign: "right", marginTop: 2 }}>07:00</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#1f2c34" }}>
                <Smile className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                <div className="flex-1 rounded-full px-3 py-1" style={{ background: "#2a3942", color: "#9CA3AF", fontSize: 11 }}>Message</div>
                <Paperclip className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                <CameraIcon className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: EMERALD }}>
                  <Mic className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute left-6 top-6 bottom-6 hidden md:block"
            style={{ borderLeft: `2px dashed ${EMERALD}`, opacity: 0.5 }}
          />
          <div className="space-y-8">
            {timeline.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className="flex-shrink-0 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    width: 48,
                    height: 48,
                    border: `2px solid ${EMERALD}`,
                    background: NAVY,
                  }}
                >
                  <s.Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div style={{ color: EMERALD, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                  <h3 className="text-white font-bold" style={{ fontSize: 17 }}>{s.title}</h3>
                  <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.6, marginTop: 6 }}>{s.body}</p>
                  {s.extras && (
                    <>
                      <div className="flex flex-wrap gap-4 mt-3">
                        {["No forms.", "No reports.", "No admin."].map((t) => (
                          <span key={t} className="inline-flex items-center gap-2" style={{ color: CREAM, fontSize: 12 }}>
                            <Check className="w-3.5 h-3.5" style={{ color: EMERALD }} strokeWidth={3} />
                            {t}
                          </span>
                        ))}
                      </div>
                      <p style={{ color: EMERALD, fontSize: 13, fontStyle: "italic", marginTop: 10 }}>
                        These observations help us understand your child more deeply.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: "#000" }}>
          <img
            src={coachingDayImg.url}
            alt="A day in the life of a personalised learner — morning message, learning slides, quiz results, captured moments"
            className="w-full h-full object-cover"
            style={{ objectPosition: "right center" }}
          />
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto mt-12 rounded-xl flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 sm:justify-between"
        style={{ background: "#0B1220", padding: "20px 32px" }}
      >
        <div>
          <div className="text-white font-extrabold leading-none" style={{ fontSize: 32 }}>
            R500<span className="text-white/70 font-semibold" style={{ fontSize: 16 }}>/month</span>
          </div>
          <div style={{ color: EMERALD, fontSize: 14, fontWeight: 600, marginTop: 8 }}>
            First assessment: FREE
          </div>
          <div className="text-white/60" style={{ fontSize: 13, marginTop: 2 }}>
            Cancel anytime
          </div>
        </div>
        <Link
          to="/waitlist"
          className="inline-flex items-center justify-center gap-2 text-white font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ background: EMERALD, padding: "18px 32px", fontSize: 18 }}
        >
          Join the Learner Blueprint Waitlist <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default function ForHomeschoolersPage() {
  useEffect(() => {
    const title = "For Homeschoolers — P² Homeschool Readiness Guide";
    const desc =
      "Start your homeschool journey with confidence. The P² Homeschool Readiness Guide helps you understand your child, choose the right curriculum, and get DBE registered.";
    document.title = title;
    const setMeta = (sel: string, attr: string, key: string, name: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(key, name);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", "name", "description", desc);
    setMeta('meta[property="og:title"]', "content", "property", "og:title", title);
    setMeta('meta[property="og:description"]', "content", "property", "og:description", desc);
    setMeta('meta[property="og:url"]', "content", "property", "og:url", "https://mypsquared.com/for-homeschoolers");
    setMeta('meta[name="twitter:title"]', "content", "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "content", "name", "twitter:description", desc);
  }, []);



  return (
    <div className="min-h-screen" style={{ fontFamily: "'Lato', system-ui, sans-serif" }}>
      <Navbar />

      <section style={{ background: NAVY }} className="pt-28 pb-8 lg:pt-36 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Eyebrow className="mb-5">For Homeschooling Parents</Eyebrow>
              <h1
                className="font-extrabold leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(32px, 5vw, 52px)" }}
              >
                <span style={{ color: "white" }}>
                  You've decided to put your child first.
                </span>
                <br />
                <span style={{ color: EMERALD }}>Now let's make it official.</span>
              </h1>
              <p
                className="mt-6"
                style={{
                  color: CREAM,
                  fontSize: 17,
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}
              >
                Homeschooling in South Africa is legal, structured, and more supported than ever. P²
                walks you through every step — from understanding how your child learns, to getting
                officially registered with the DBE, to your first day of confident teaching.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 rounded-lg font-bold text-white transition hover:brightness-110"
                  style={{ background: EMERALD, padding: "14px 28px" }}
                >
                  Homeschool Readiness Guide <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/dbe-registration"
                  className="psq-hs-outline inline-flex items-center gap-2 rounded-lg font-bold transition"
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    padding: "14px 28px",
                  }}
                >
                  Start Your DBE Registration
                </Link>
                <style>{`
                  .psq-hs-outline:hover { border-color: ${EMERALD} !important; color: ${EMERALD} !important; }
                `}</style>
              </div>

              <div
                className="mt-4 flex flex-wrap gap-x-5 gap-y-2"
                style={{ fontSize: 13 }}
              >
                <TrustItem>Free</TrustItem>
                <TrustItem>5 minutes</TrustItem>
                <TrustItem>Instant results</TrustItem>
                <TrustItem>No qualifications needed</TrustItem>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span
                className="inline-flex items-center font-bold uppercase tracking-[0.15em] rounded-full mb-4"
                style={{
                  border: `1.5px solid ${EMERALD}`,
                  color: EMERALD,
                  padding: "6px 16px",
                  fontSize: 11,
                }}
              >
                Your Free Report
              </span>
              <img
                src={heroPdf}
                alt="P² Learner Profile sample report — cover and fanned pages"
                className="w-full max-w-xl h-auto select-none"
                draggable={false}
              />
              <p
                className="mt-4 italic text-center"
                style={{ color: CREAM, fontSize: 14, opacity: 0.9 }}
              >
                Yours instantly. <span style={{ color: EMERALD, fontStyle: "normal" }}>Free.</span>{" "}
                After a 5-minute assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CoachingDaySection />

      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eyebrow className="mb-3">Before You Ask</Eyebrow>
            <h2
              className="font-bold mx-auto"
              style={{ color: NAVY, fontSize: "clamp(26px, 4vw, 36px)" }}
            >
              We know what you're wondering.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FearCard
              Icon={Scale}
              title="Is this even legal?"
              body="Yes. Completely. The BELA Act 2024 gives every South African parent the legal right to homeschool. You just need to register with your provincial DBE. We handle that part."
            />
            <FearCard
              Icon={GraduationCap}
              title="Do I need teaching qualifications?"
              body="No. The DBE does not require teaching qualifications. You need a plan, a curriculum, and the right documentation. P² generates all of it for you."
            />
            <FearCard
              Icon={Clock}
              title="How much time will this take?"
              body="About 3 hours a day. You are the facilitator, not the teacher. Your job is to be present, consistent, and encouraging."
            />
          </div>
        </div>
      </section>

      <section id="learner-profile" style={{ background: NAVY }} className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative flex justify-center">
              <div
                className="absolute inset-0 blur-3xl opacity-40 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${EMERALD}55, transparent 60%)`,
                }}
                aria-hidden="true"
              />
              <img
                src={samplePdf}
                alt="P² Learner Profile sample — cover, profile summary, curriculum comparison"
                className="relative w-full max-w-lg h-auto select-none"
                draggable={false}
              />
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-center text-white font-bold uppercase tracking-wide"
                style={{
                  background: EMERALD,
                  width: 110,
                  height: 110,
                  fontSize: 13,
                  lineHeight: 1.2,
                  boxShadow: "0 10px 30px rgba(16,185,129,0.4)",
                }}
              >
                Sample
                <br />
                Report
              </div>
            </div>
            <div>
              <Eyebrow className="mb-3">What You Receive Free</Eyebrow>
              <h2
                className="font-bold"
                style={{ color: "white", fontSize: "clamp(26px, 4vw, 36px)", lineHeight: 1.15 }}
              >
                A complete picture of how a child learns.
              </h2>
              <p className="mt-6" style={{ color: CREAM, fontSize: 16, lineHeight: 1.8 }}>
                Most parents spend years guessing why their child struggles — or why they're bored.
                In 5 minutes, P² builds a personalised Learner Profile that shows you exactly how a
                child thinks, what curriculum fits them, and which schools match who they are.
              </p>
              <ul className="mt-7 flex flex-col gap-3">
                <FeatureRow>Primary learning archetype identified</FeatureRow>
                <FeatureRow>CAPS / IEB / Cambridge curriculum match</FeatureRow>
                <FeatureRow>Top 3 school recommendations with pricing</FeatureRow>
                <FeatureRow>Personalised action plan for your family</FeatureRow>
              </ul>
              <Link
                to="/assessment"
                className="mt-6 inline-flex items-center gap-2 rounded-lg font-bold text-white transition hover:brightness-110"
                style={{ background: EMERALD, padding: "14px 28px" }}
              >
                Homeschool Readiness Guide <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Eyebrow className="mb-3">Your Path</Eyebrow>
            <h2 className="font-bold" style={{ color: NAVY, fontSize: "clamp(26px, 4vw, 36px)" }}>
              From decision to confidence. Step by step.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-y-10 md:gap-y-0 items-start">
            <Step
              Icon={Search}
              number={1}
              label="Discover"
              desc="Free 5-minute Learner Profile Assessment"
              badgeBg={EMERALD}
              badgeText="FREE"
            />
            <Arrow />
            <Step
              Icon={BookOpen}
              number={2}
              label="Match"
              desc="Personalised curriculum recommendation"
              badgeBg={EMERALD}
              badgeText="FREE"
            />
            <Arrow />
            <Step
              Icon={FileText}
              number={3}
              label="Register"
              desc="Complete DBE registration package"
              badgeBg={NAVY}
              badgeText="R999"
            />
            <Arrow />
            <Step
              Icon={MessageCircle}
              number={4}
              label="Coach"
              desc="Daily WhatsApp guide for your first 7 days"
              badgeBg={NAVY}
              badgeText="R500/month"
            />
          </div>
          <div
            className="mx-auto mt-10 flex items-center gap-4 rounded-lg"
            style={{
              background: "#F0FDF4",
              borderLeft: `4px solid ${EMERALD}`,
              padding: "20px 24px",
              maxWidth: 600,
            }}
          >
            <CalendarCheck className="w-6 h-6 shrink-0" style={{ color: EMERALD }} />
            <p style={{ color: NAVY, fontSize: 16, fontWeight: 500 }}>
              DBE Registration includes 7 days of My Learning Coach{" "}
              <span style={{ color: EMERALD, fontWeight: 700 }}>FREE.</span>
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#F9FAFB" }} className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <Eyebrow className="mb-3">Make It Official</Eyebrow>
              <h2
                className="font-bold"
                style={{ color: NAVY, fontSize: "clamp(26px, 4vw, 36px)", lineHeight: 1.15 }}
              >
                Your complete DBE registration package. Done in 30 minutes.
              </h2>
              <p className="mt-5" style={{ color: "#374151", fontSize: 15, lineHeight: 1.7 }}>
                We create every document your provincial DBE requires — completed, formatted, and
                ready for you to submit. No lawyers. No confusion. No rejections from missing
                paperwork.
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {[
                  ["DBE Application Form", "all 103 fields completed"],
                  ["Professional Motivation Letter", "Section 51 SASA compliant"],
                  ["Comprehensive Educational Programme", "curriculum, subjects, daily structure"],
                  ["Weekly Timetable", "ready to submit"],
                  ["Assessment Commitment Letter", "satisfies DBE evidence requirement"],
                  ["Document Checklist", "nothing missing, nothing forgotten"],
                  ["Email Cover Letter", "professionally written, province-specific"],
                  ["Submission Instructions", "exactly what to do, step by step"],
                ].map(([t, s]) => (
                  <li key={t} className="flex items-start gap-3">
                    <span
                      className="shrink-0 inline-flex items-center justify-center rounded-full mt-0.5"
                      style={{ background: EMERALD, width: 22, height: 22 }}
                    >
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </span>
                    <span style={{ color: NAVY, fontSize: 15 }}>
                      <strong className="font-bold">{t}</strong>
                      <span style={{ color: "#374151" }}> — {s}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div
                className="mt-6 rounded-lg"
                style={{
                  background: "#F0FDF4",
                  border: `1px solid ${EMERALD}`,
                  padding: "16px 20px",
                }}
              >
                <p style={{ color: NAVY, fontSize: 15, fontWeight: 500 }}>
                  + 7 days My Learning Coach{" "}
                  <span style={{ color: EMERALD, fontWeight: 700 }}>FREE</span> with every purchase
                </p>
              </div>
              <div className="mt-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-extrabold" style={{ color: NAVY, fontSize: 48 }}>
                    R999
                  </span>
                  <span
                    style={{
                      color: "#9CA3AF",
                      fontSize: 20,
                      textDecoration: "line-through",
                    }}
                  >
                    R1,499
                  </span>
                </div>
                <span className="block mt-1" style={{ color: "#6B7280", fontSize: 13 }}>
                  once-off · no subscription
                </span>
              </div>
              <Link
                to="/dbe-registration"
                className="mt-6 inline-flex items-center gap-2 rounded-lg font-bold text-white transition hover:brightness-110"
                style={{ background: EMERALD, padding: "14px 28px" }}
              >
                Get Your DBE Package <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div>
              <div className="flex justify-end mb-5">
                <span
                  className="inline-flex items-center font-bold rounded-full text-white"
                  style={{ background: EMERALD, padding: "8px 16px", fontSize: 13 }}
                >
                  8 documents · Province-specific · Ready to submit
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {DOCS.map((d, i) => (
                  <div
                    key={d.title}
                    className="relative bg-white rounded-lg shadow-sm p-4 text-center"
                    style={{ minHeight: 150 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="font-extrabold leading-none"
                        style={{ color: EMERALD, fontSize: 12 }}
                      >
                        P²
                      </span>
                      <span
                        className="inline-flex items-center justify-center rounded-full text-white font-bold"
                        style={{ background: EMERALD, width: 24, height: 24, fontSize: 12 }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <div
                      className="font-semibold mt-1"
                      style={{ color: NAVY, fontSize: 13, lineHeight: 1.3 }}
                    >
                      {d.title}
                    </div>
                    <div className="mt-1.5" style={{ color: "#6B7280", fontSize: 11, lineHeight: 1.4 }}>
                      {d.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white" style={{ padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
            <img
              src={founderImg}
              alt="P-Squared founder, a homeschooling mother in Johannesburg"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "40%",
                background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))",
              }}
            />
            <div
              className="absolute bottom-0 left-0"
              style={{
                color: CREAM,
                fontSize: 18,
                fontStyle: "italic",
                padding: 24,
                lineHeight: 1.6,
                fontFamily: "Georgia, serif",
              }}
            >
              "I built this because I needed it and it didn't exist."
            </div>
          </div>

          <div>
            <Eyebrow>WHY THIS EXISTS</Eyebrow>
            <h2
              className="font-bold mt-4 text-[26px] md:text-[36px]"
              style={{ color: NAVY, lineHeight: 1.2 }}
            >
              Built by a homeschooling parent. For homeschooling parents.
            </h2>
            <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.8, marginTop: 16 }}>
              P-Squared was founded in Johannesburg after one mother registered her twin sons with the DBE, spent 40+ hours navigating the BELA Act and provincial variations — and decided no parent should have to do that alone.
            </p>
            <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.8, marginTop: 16 }}>
              Every tool, every document, every WhatsApp message is built from that experience. Not a template. A tested system.
            </p>
            <Link
              to="/about"
              className="block underline"
              style={{ color: EMERALD, fontSize: 14, fontWeight: 600, marginTop: 24 }}
            >
              Read the full story →
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: EMERALD, padding: "80px 0" }}>
        <div className="mx-auto px-6 text-center" style={{ maxWidth: 700 }}>
          <h2
            className="text-white font-extrabold text-[32px] md:text-[52px]"
            style={{ lineHeight: 1.1 }}
          >
            Your child's education shouldn't wait.
          </h2>
          <p className="text-white mx-auto" style={{ fontSize: 18, lineHeight: 1.7, marginTop: 20 }}>
            Start with the free assessment. 5 minutes. Instant results. No qualifications needed.
          </p>
          <div className="mt-8">
            <Link
              to="/waitlist"
              className="inline-flex items-center gap-2 font-bold rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#fff", color: EMERALD, padding: "16px 40px", fontSize: 18 }}
            >
              Join the Learner Blueprint Waitlist <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="text-white" style={{ fontSize: 13, opacity: 0.8, marginTop: 16 }}>
            mypsquared.com · WhatsApp: +27 81 890 5861
          </div>

          <div className="mt-12 text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircleMore className="w-5 h-5" />
              <span className="font-semibold">Prefer WhatsApp?</span>
            </div>
            <a
              href="https://api.whatsapp.com/send?phone=27818905861"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Chat to us directly
            </a>
          </div>
        </div>
      </section>

      <section style={{ background: NAVY, padding: "72px 0" }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Eyebrow className="justify-center">The P² Principle</Eyebrow>
          <h2
            className="text-white font-bold mt-4"
            style={{ fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.15 }}
          >
            We don't start with curriculum.
            <br />
            We start with the child.
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                Icon: Fingerprint,
                title: "Every child learns differently",
                body: "Some need structure. Some need movement. Some need story. We identify the pattern first.",
              },
              {
                Icon: BookOpen,
                title: "Curriculum comes second",
                body: "Once we know how a child learns, we match them to CAPS, IEB, or Cambridge — and then build the plan.",
              },
              {
                Icon: MessageCircle,
                title: "Support must be daily",
                body: "Confidence doesn't come from one big document. It comes from knowing what to do next, every day.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl p-8" style={{ background: "#111827" }}>
                <card.Icon className="w-8 h-8 mb-5" style={{ color: EMERALD }} strokeWidth={2} />
                <h3 className="text-white font-bold mb-3" style={{ fontSize: 20 }}>{card.title}</h3>
                <p style={{ color: "#D1D5DB", fontSize: 15, lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

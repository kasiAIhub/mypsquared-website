import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Check, Target, UserRound, Zap, MessageSquare, Clock, Lock, Brain, MessagesSquare } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import StudySmarter from "@/components/StudySmarter";
import psBrand7 from "@/assets/ps-brand-7.jpg.asset.json";
import psBrand8 from "@/assets/ps-brand-8.jpg.asset.json";
import psBrand9 from "@/assets/ps-brand-9.jpg.asset.json";
import psBrand10 from "@/assets/ps-brand-10.jpg.asset.json";
import proof1 from "@/assets/proof-1-cover.png.asset.json";
import proof2 from "@/assets/proof-2-alliteration.png.asset.json";
import proof3 from "@/assets/proof-3-casestudy.png.asset.json";
import proof4 from "@/assets/proof-4-backcover.png.asset.json";
import phahamosMethod1 from "@/assets/phahamos-multiplication-method-1.png.asset.json";
import phahamosMethod2 from "@/assets/phahamos-multiplication-method-2.png.asset.json";
import kenningPoems from "@/assets/kenning-poems.png.asset.json";
import writingKenningPoem from "@/assets/writing-kenning-poem.png.asset.json";
import caseStudy from "@/assets/case-study.png.asset.json";

const EMERALD = "#10B981";
const NAVY = "#0F172A";
const CREAM = "#F5F0E8";
const GRAY = "#374151";

const featureItems = [
  "Built around what your child loves",
  "Aligned to their existing school curriculum",
  "Will be sent to your WhatsApp once the waitlist opens",
  "Join the waitlist - we open soon",
];

const proofImages = [
  { src: proof4.url, alt: "Words Can Move People — back cover" },
  { src: proof1.url, alt: "The Poet and the Protest — front cover" },
  { src: proof2.url, alt: "Words Have Power — alliteration lesson" },
  { src: kenningPoems.url, alt: "Kenning Poems" },
  { src: writingKenningPoem.url, alt: "Writing a Kenning Poem" },
  { src: caseStudy.url, alt: "Case study — The Poet and the Protest" },
];

const proofPoints = [
  { icon: UserRound, text: "Their name on every page" },
  { icon: Target, text: "Built around their interests" },
  { icon: BookOpen, text: "Aligned to their school curriculum" },
  { icon: Zap, text: "Designed for how they learn best" },
];

const journeySteps = [
  {
    number: 1,
    label: "Tell us about your child",
    description: "5 questions. What they love. Where they struggle.",
    badge: "FREE",
    circleBg: EMERALD,
    badgeBg: EMERALD,
    badgeColor: "#ffffff",
  },
  {
    number: 2,
    label: "Receive their world",
    description: "7 days of personalised digital books delivered via WhatsApp.",
    badge: "WAITLIST",
    circleBg: EMERALD,
    badgeBg: EMERALD,
    badgeColor: "#ffffff",
  },
  {
    number: 3,
    label: "Continue their journey",
    description: "New books will be sent once the waitlist opens. Their world keeps growing.",
    badge: "R500/month",
    circleBg: NAVY,
    badgeBg: NAVY,
    badgeColor: "#ffffff",
  },
];

const FeatureRow = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: EMERALD }} strokeWidth={3} />
    <span style={{ color: NAVY, fontSize: 15, fontWeight: 700 }}>{text}</span>
  </li>
);

export default function ForSchoolParentsPage() {
  useEffect(() => {
    const title = "For School Parents — P² Your Child's Daily Lesson Plans";
    const desc =
      "Your child is in school but something isn't adding up. P² builds personalised daily lesson plans around who they are — aligned to their curriculum, delivered to your WhatsApp.";
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
    setMeta('meta[property="og:url"]', "content", "property", "og:url", "https://mypsquared.com/for-mainstream-parents");
    setMeta('meta[name="twitter:title"]', "content", "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "content", "name", "twitter:description", desc);
  }, []);



  return (
    <div style={{ fontFamily: "Lato, system-ui, sans-serif", background: "#ffffff" }}>
      <Navbar />

      <section style={{ background: NAVY }} className="pt-28 pb-10 lg:pt-36 lg:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p
                className="mb-5 uppercase font-bold"
                style={{ color: EMERALD, fontSize: 16, letterSpacing: "0.15em" }}
              >
                For School Parents
              </p>
              <h1 className="font-extrabold leading-[1.05] tracking-tight" style={{ fontSize: "clamp(34px, 5vw, 58px)" }}>
                <span style={{ color: "#ffffff" }}>Your child is in school.</span>
                <br />
                <span style={{ color: EMERALD }}>But something isn't adding up.</span>
              </h1>
              <p
                className="mt-6 max-w-[620px]"
                style={{ color: CREAM, fontSize: 17, lineHeight: 1.75 }}
              >
                They study. They try. They come home defeated. And you don’t know how to help because nobody has told you how your child actually learns. P² starts there.
              </p>
              <div className="mt-8">
                <Link
                  to="/waitlist"
                  className="inline-flex items-center gap-2 rounded-lg font-bold text-white transition hover:brightness-110"
                  style={{ background: EMERALD, padding: "14px 28px", fontSize: 18 }}
                >
                  Join the Learner Blueprint Waitlist <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p
                className="mt-4"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}
              >
                ✓ Join the waitlist - we open soon &nbsp;·&nbsp; ✓ Built around your child &nbsp;·&nbsp; ✓ Delivered via WhatsApp &nbsp;·&nbsp; ✓ No qualifications needed
              </p>
            </div>

            <div className="hidden md:block">
              <div
                className="relative mx-auto"
                style={{ width: "min(72%, 360px)", aspectRatio: "3 / 4" }}
              >
                {[
                  { img: psBrand10, scale: 0.88, rotate: 4, z: 1, top: "12%", left: "-28%", shadow: "0 10px 30px rgba(0,0,0,0.35)", glow: false },
                  { img: psBrand9, scale: 0.92, rotate: -5, z: 2, top: "5%", left: "-8%", shadow: "0 15px 40px rgba(0,0,0,0.4)", glow: false },
                  { img: psBrand8, scale: 0.96, rotate: 6, z: 3, top: "8%", left: "35%", shadow: "0 20px 50px rgba(0,0,0,0.45)", glow: false },
                  { img: psBrand7, scale: 1.0, rotate: -8, z: 4, top: "0%", left: "15%", shadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.15)", glow: true },
                ].map((c, i) => (
                  <img
                    key={i}
                    src={c.img.url}
                    alt={`P² personalised study guide cover ${i + 1}`}
                    loading="eager"
                    style={{
                      position: "absolute",
                      top: c.top,
                      left: c.left,
                      width: `${c.scale * 100}%`,
                      transform: `rotate(${c.rotate}deg)`,
                      zIndex: c.z,
                      borderRadius: 8,
                      boxShadow: c.shadow,
                      display: "block",
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <StudySmarter />



      <section style={{ backgroundColor: "#ffffff" }} className="px-4 md:px-8 pt-6 pb-12 md:pb-16">
        <style>{`
          @keyframes proof-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .proof-track {
            display: flex;
            gap: 16px;
            width: max-content;
            animation: proof-marquee 40s linear infinite;
          }
          .proof-marquee-wrapper:hover .proof-track { animation-play-state: paused; }
          .proof-card {
            flex: 0 0 auto;
            width: calc((100vw - 96px) / 4);
            max-width: 300px;
            aspect-ratio: 9 / 16;
            border-radius: 12px;
            object-fit: cover;
          }
          @media (max-width: 768px) {
            .proof-card { width: calc((100vw - 64px) / 2); }
          }
        `}</style>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ fontSize: "20px", fontWeight: 700, color: EMERALD, marginBottom: "12px", letterSpacing: "0.05em" }}>
            See what a real day looks like.
          </p>
          <h2 className="font-bold" style={{ color: NAVY, fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1 }}>
            This isn&apos;t more work.
            <br />
            This is how they finally learn.
          </h2>
          <p
            className="mx-auto mt-6 max-w-4xl"
            style={{ color: "#4B5563", fontSize: 16, lineHeight: 1.8 }}
          >
            Every guide is personalised. Every lesson is visual, engaging, and curriculum-aligned. Your child&apos;s name. Their world. Their way.
          </p>

          <div className="proof-marquee-wrapper mt-8 overflow-hidden" style={{ width: "100%" }}>
            <div className="proof-track">
              {[...proofImages, ...proofImages].map((img, i) => (
                <img
                  key={`${img.alt}-${i}`}
                  src={img.src}
                  alt={img.alt}
                  className="proof-card"
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <p style={{ color: "#9CA3AF", fontSize: 11, fontStyle: "italic", marginTop: 12 }}>
            Day 7 · English Home Language · Grade 4 · Wild Forces of Language
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="uppercase font-bold" style={{ color: EMERALD, fontSize: 11, letterSpacing: "0.15em" }}>
              Overview
            </p>
            <h2 className="mt-4 font-bold" style={{ color: NAVY, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.15 }}>
              How your child&apos;s learning world begins
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {journeySteps.map((step) => (
              <div key={step.number} className="text-center px-3">
                <div
                  className="mx-auto flex items-center justify-center rounded-full text-white font-bold"
                  style={{ width: 52, height: 52, background: step.circleBg, fontSize: 18 }}
                >
                  {step.number}
                </div>
                <h3 className="mt-4 font-bold" style={{ color: NAVY, fontSize: 20 }}>
                  {step.label}
                </h3>
                <p className="mx-auto mt-3 max-w-[240px]" style={{ color: "#4B5563", fontSize: 15, lineHeight: 1.7 }}>
                  {step.description}
                </p>
                <span
                  className="mt-4 inline-flex items-center justify-center rounded-full font-bold"
                  style={{
                    background: step.badgeBg,
                    color: step.badgeColor,
                    padding: "8px 16px",
                    fontSize: 13,
                  }}
                >
                  {step.badge}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mx-auto mt-10 rounded-xl text-center"
            style={{ maxWidth: 640, background: "#F0FDF4", border: "1px solid rgba(16,185,129,0.2)", padding: "18px 22px" }}
          >
            <p style={{ color: NAVY, fontSize: 16, lineHeight: 1.7, fontWeight: 500 }}>
              The 7 days are for you to see the value of what your child receives every day.
              <br />
              No pressure. No obligation.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto text-center rounded-xl"
          style={{
            maxWidth: 600,
            margin: "0 auto",
            background: NAVY,
            padding: "48px 40px",
          }}
        >
          <h2 className="font-bold text-white" style={{ fontSize: 28, lineHeight: 1.2 }}>
            Your child is ready
            <br />
            to be seen.
          </h2>
          <p
            className="mx-auto mt-3"
            style={{ color: CREAM, fontSize: 16, lineHeight: 1.7, maxWidth: 460 }}
          >
            Tell us what they love and where they struggle. We&apos;ll build their world around it.
          </p>
          <Link
            to="/waitlist"
            className="mt-6 inline-flex items-center gap-2 rounded-lg font-bold text-white transition hover:brightness-110"
            style={{ background: EMERALD, padding: "16px 40px", fontSize: 17 }}
          >
            Join the Learner Blueprint Waitlist <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3" style={{ color: CREAM, fontSize: 13, opacity: 0.5 }}>
            Join the waitlist - we open soon
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

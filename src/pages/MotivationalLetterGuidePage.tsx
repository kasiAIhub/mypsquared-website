import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, FileText, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const EMERALD = "#10B981";
const NAVY = "#0F172A";

export default function MotivationalLetterGuidePage() {
  usePageMeta({
    title: "DBE Motivational Letter: Help With Your Submission",
    description:
      "How to write the motivational letter for your DBE home education submission in South Africa, with structure, tips and examples.",
    ogTitle: "DBE Motivational Letter: Help With Your Submission",
    ogDescription:
      "How to write the motivational letter for your DBE home education submission in South Africa, with structure, tips and examples.",
    ogUrl: "https://mypsquared.com/blog/dbe-registration-motivational-letter",
  });

  useEffect(() => {
    // JSON-LD Article schema
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "DBE Motivational Letter: Help With Your Submission",
      description:
        "How to write the motivational letter for your DBE home education submission in South Africa.",
      publisher: { "@type": "Organization", name: "P² Personalised Learning System" },
      mainEntityOfPage: "https://mypsquared.com/blog/dbe-registration-motivational-letter",
    });
    document.head.appendChild(ld);
    return () => {
      document.head.removeChild(ld);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ background: NAVY }} className="pt-24 pb-20 text-white">
        <article className="max-w-3xl mx-auto px-6">
          <div
            className="uppercase font-bold mb-4"
            style={{ color: EMERALD, fontSize: 13, letterSpacing: "0.18em" }}
          >
            DBE Registration Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Motivational Letter for Home Education Registration in South Africa
          </h1>
          <p className="text-lg text-white/80 mb-10">
            The motivational letter is one of the most important documents in your DBE home
            education application. This guide walks South African parents through exactly what
            provincial officials look for, how to structure your letter, and how to avoid the
            common reasons applications get rejected.
          </p>

          <div
            className="rounded-lg p-6 mb-10 border"
            style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.35)" }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 shrink-0 mt-1" style={{ color: EMERALD }} />
              <div>
                <div className="font-semibold mb-1">Short on time?</div>
                <p className="text-white/80 mb-3 text-sm">
                  Our DBE Registration tool generates a personalised motivational letter based on
                  your child and family — vetted against provincial requirements.
                </p>
                <Link
                  to="/dbe-registration"
                  className="inline-flex items-center gap-2 font-semibold"
                  style={{ color: EMERALD }}
                >
                  Generate my letter <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4">
            What is the motivational letter?
          </h2>
          <p className="text-white/80 mb-6">
            When you register your child for home education under the BELA Act and the DBE Home
            Education Policy, the provincial Head of Department requires a letter from you
            explaining <em>why</em> home education is in the best interest of the child. It sits
            alongside your learning plan, curriculum evidence, and parent qualifications.
          </p>
          <p className="text-white/80 mb-8">
            It is not a formality. Provincial reviewers read it to confirm you understand your
            legal responsibilities and that your reasons are child-centred, not merely convenient.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4">
            What DBE officials look for
          </h2>
          <ul className="space-y-3 mb-8">
            {[
              "A child-centred reason — how home education serves this specific child.",
              "Acknowledgement of the BELA Act and the parent's legal obligations.",
              "A clear plan for socialisation, assessment, and record-keeping.",
              "Alignment with a recognised curriculum (CAPS, IEB, Cambridge, or equivalent).",
              "Evidence that the parent or tutor can deliver the learning plan.",
              "A respectful, professional tone — no anti-schooling rhetoric.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Check className="w-5 h-5 shrink-0 mt-1" style={{ color: EMERALD }} />
                <span className="text-white/85">{point}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4">Recommended structure</h2>
          <ol className="space-y-4 mb-8 list-decimal list-inside text-white/85">
            <li>
              <strong>Opening & addressee.</strong> Addressed to the Head of Department for
              Education in your province, with the child's full name, ID number, and grade.
            </li>
            <li>
              <strong>Your reasons.</strong> 2–4 paragraphs on why home education fits this child
              — learning pace, health, values, previous school experience.
            </li>
            <li>
              <strong>Learning approach.</strong> Curriculum choice, daily rhythm, assessment
              plan, and how you'll track progress.
            </li>
            <li>
              <strong>Support & socialisation.</strong> Co-ops, tutors, sports, community groups.
            </li>
            <li>
              <strong>Commitment.</strong> Confirm you understand the BELA Act obligations and
              will submit annual assessments.
            </li>
            <li>
              <strong>Sign-off.</strong> Signed, dated, with contact details.
            </li>
          </ol>

          <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4">Common mistakes to avoid</h2>
          <div
            className="rounded-lg p-6 mb-8 border"
            style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.3)" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-1 text-red-400" />
              <div className="font-semibold">Reasons letters get flagged or rejected</div>
            </div>
            <ul className="space-y-2 text-white/80 text-sm ml-8 list-disc">
              <li>Generic templates that don't mention the child by name or circumstance.</li>
              <li>No mention of a curriculum or assessment plan.</li>
              <li>Anti-public-schooling language instead of a positive case for home education.</li>
              <li>Missing province-specific requirements (Gauteng, WCED, KZN each differ).</li>
              <li>No parent qualifications, tutor arrangement, or evidence of capacity.</li>
            </ul>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4">
            How P² automates your motivational letter
          </h2>
          <p className="text-white/80 mb-4">
            Our DBE Registration tool asks you a few questions about your child, family, and
            learning approach, then drafts a personalised motivational letter that meets the
            requirements above — plus the rest of your registration bundle (learning plan,
            curriculum overview, parent statement) in a single PDF pack ready to submit.
          </p>
          <p className="text-white/80 mb-8">
            Every letter is tailored to your province (Gauteng, Western Cape, KZN, Eastern Cape,
            Free State, Limpopo, Mpumalanga, North West, Northern Cape) and to the specific child
            being registered — no generic templates.
          </p>

          <div
            className="rounded-lg p-8 text-center"
            style={{ background: EMERALD }}
          >
            <FileText className="w-10 h-10 mx-auto mb-3 text-white" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Get your personalised motivational letter
            </h3>
            <p className="text-white/90 mb-6">
              Answer a few questions, receive your full DBE registration bundle.
            </p>
            <Link
              to="/dbe-registration"
              className="inline-flex items-center gap-2 bg-white font-semibold px-6 py-3 rounded-md"
              style={{ color: EMERALD }}
            >
              Start DBE Registration <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/60">
            <p>
              Related:{" "}
              <Link to="/assessment" className="underline hover:text-white">
                Free Homeschool Readiness Assessment
              </Link>
              {" · "}
              <Link to="/for-homeschoolers" className="underline hover:text-white">
                For Homeschoolers overview
              </Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

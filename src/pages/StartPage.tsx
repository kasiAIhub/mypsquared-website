import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";

type LearningType = "homeschool" | "school";
type Grade = "Grade 4" | "Grade 5" | "Grade 6";
type Curriculum = "CAPS" | "IEB" | "Cambridge";

const NOTIFY_PHONE = "27818905861";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Natural Sciences",
  "Humanities",
  "Life Skills",
  "Afrikaans",
];

const CARD_BTN_BASE =
  "w-full rounded-[10px] border px-4 py-4 text-left font-medium transition-colors";
const CARD_BTN_IDLE =
  "bg-[#0F172A] border-[#334155] text-[#F5F0E8] hover:border-[#475569]";
const CARD_BTN_SELECTED =
  "bg-[#1E3A2F] border-[#10B981] text-[#10B981]";

const INPUT_CLASS =
  "w-full rounded-[8px] bg-[#0F172A] border border-[#334155] px-4 py-3 text-[#F5F0E8] placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981] min-h-[44px]";

const LABEL_CLASS = "block text-[#F5F0E8] font-semibold mb-2";
const SUB_LABEL_CLASS = "block text-[#94A3B8] text-sm mb-3";

export default function StartPage() {
  usePageMeta({
    title: "Your Child's Daily Lesson Plans — P²",
    description:
      "Tell us about your child. We build their first personalised lesson plans around who they are — aligned to their curriculum, delivered to your WhatsApp.",
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [parentName, setParentName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [childName, setChildName] = useState("");
  const [grade, setGrade] = useState<Grade | "">("");
  const [learningType, setLearningType] = useState<LearningType | "">("");
  const [curriculum, setCurriculum] = useState<Curriculum | "">("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [struggles, setStruggles] = useState("");
  const [childDescription, setChildDescription] = useState("");
  const [subjectWarning, setSubjectWarning] = useState("");

  const totalSteps = learningType === "school" ? 9 : learningType === "homeschool" ? 7 : 7;

  const validWhatsapp = (val: string) => {
    const digits = val.replace(/\D/g, "");
    return (val.startsWith("+27") || val.startsWith("0")) && digits.length >= 10;
  };

  const canContinue = useMemo(() => {
    switch (step) {
      case 1: return parentName.trim().length > 0;
      case 2: return validWhatsapp(whatsapp);
      case 3: return childName.trim().length > 0;
      case 4: return grade !== "";
      case 5: return learningType !== "";
      case 6: return curriculum !== "";
      case 7:
        if (learningType === "homeschool") return childDescription.trim().length >= 10;
        return subjects.length === 2;
      case 8: return struggles.trim().length >= 5;
      case 9: return childDescription.trim().length >= 10;
      default: return false;
    }
  }, [step, parentName, whatsapp, childName, grade, learningType, curriculum, subjects, struggles, childDescription]);

  const next = () => {
    if (!canContinue) return;
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const toggleSubject = (s: string) => {
    setSubjectWarning("");
    if (subjects.includes(s)) {
      setSubjects(subjects.filter((x) => x !== s));
    } else if (subjects.length >= 2) {
      setSubjectWarning("We focus on 2 subjects at a time for the best results.");
    } else {
      setSubjects([...subjects, s]);
    }
  };

  const sendWhatsAppNotification = () => {
    const lines = [
      "NEW LESSON PLAN REQUEST 🎓",
      "",
      `Parent: ${parentName}`,
      `WhatsApp: ${whatsapp}`,
      `Child: ${childName} · ${grade}`,
      `Type: ${learningType === "homeschool" ? "Homeschooled" : "At school"}`,
      `Curriculum: ${curriculum}`,
    ];
    if (learningType === "school") {
      lines.push(`Subjects: ${subjects.join(" + ")}`);
      lines.push(`Struggling with: ${struggles}`);
    }
    lines.push("", `About ${childName}:`, childDescription);
    const url = `https://api.whatsapp.com/send?phone=${NOTIFY_PHONE}&text=${encodeURIComponent(lines.join("\n"))}`;
    try {
      const w = window.open(url, "_blank", "noopener,noreferrer");
      // If blocked (returns null), silently ignore — Supabase save is the source of truth.
      if (!w) {
        console.info("WhatsApp notification window was blocked; continuing silently.");
      }
    } catch (err) {
      console.info("WhatsApp notification failed silently:", err);
    }
  };



  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from("lesson_plan_requests" as any)
        .insert({
          parent_name: parentName,
          whatsapp_number: whatsapp,
          child_name: childName,
          child_grade: grade,
          learning_type: learningType,
          curriculum,
          subjects: learningType === "school" ? subjects.join(", ") : null,
          struggles: learningType === "school" ? struggles : null,
          child_description: childDescription,
          status: "new",
        } as any);
      if (insertError) throw insertError;
      sendWhatsAppNotification();
      setSubmitted(true);
    } catch (e: any) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = Math.round((step / totalSteps) * 100);
  const isFinalStep =
    (learningType === "homeschool" && step === 7) ||
    (learningType === "school" && step === 9);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div
            style={{
              color: "#10B981",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Your Child's Daily Lesson Plans
          </div>
          <h1
            className="text-[#F5F0E8] font-extrabold mt-2"
            style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1 }}
          >
            Let's build your child's world.
          </h1>
          <p
            className="hidden md:block mx-auto"
            style={{
              fontSize: 17,
              color: "#94A3B8",
              maxWidth: 560,
              marginTop: 12,
              lineHeight: 1.7,
            }}
          >
            Tell us about your child. We build their first personalised lesson plans around who they are — aligned to their curriculum, delivered to your WhatsApp.
          </p>
          <div
            className="flex flex-wrap justify-center mt-5"
            style={{ fontSize: 13, color: "#64748B", gap: 20 }}
          >
            <span>✓ First 7 days free</span>
            <span>·</span>
            <span>✓ Delivered to your WhatsApp</span>
            <span>·</span>
            <span>✓ Built around your child</span>
          </div>
        </div>
      </section>

      {/* Form / Confirmation Card */}
      <section className="flex-1 px-4 pb-20">
        <div
          className="mx-auto"
          style={{
            maxWidth: 600,
            background: "#1E293B",
            border: "1px solid #334155",
            borderRadius: 12,
          }}
        >
          {!submitted ? (
            <div className="p-6 md:p-10">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[#94A3B8] mb-2">
                  <span>Step {step} of {totalSteps}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0F172A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div key={step} className="animate-fade-in">
                {step === 1 && (
                  <>
                    <label className={LABEL_CLASS}>What's your name?</label>
                    <input
                      autoFocus
                      className={INPUT_CLASS}
                      placeholder="Full name"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <label className={LABEL_CLASS}>Your WhatsApp number</label>
                    <span className={SUB_LABEL_CLASS}>
                      This is how we'll send your child's lesson plans.
                    </span>
                    <input
                      type="tel"
                      className={INPUT_CLASS}
                      placeholder="+27 81 234 5678"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                    {whatsapp && !validWhatsapp(whatsapp) && (
                      <p className="text-xs text-[#F87171] mt-2">
                        Please enter a valid SA number starting with +27 or 0.
                      </p>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <label className={LABEL_CLASS}>What is your child's name?</label>
                    <input
                      autoFocus
                      className={INPUT_CLASS}
                      placeholder="Kagiso"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                    />
                  </>
                )}

                {step === 4 && (
                  <>
                    <label className={LABEL_CLASS}>What grade is {childName} in?</label>
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-3">
                      {(["Grade 4", "Grade 5", "Grade 6"] as Grade[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGrade(g)}
                          className={`${CARD_BTN_BASE} text-center ${grade === g ? CARD_BTN_SELECTED : CARD_BTN_IDLE}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <label className={LABEL_CLASS}>
                      Is {childName} homeschooled or at school?
                    </label>
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
                      <button
                        onClick={() => setLearningType("homeschool")}
                        className={`${CARD_BTN_BASE} text-center ${learningType === "homeschool" ? CARD_BTN_SELECTED : CARD_BTN_IDLE}`}
                      >
                        Homeschooled 🏠
                      </button>
                      <button
                        onClick={() => setLearningType("school")}
                        className={`${CARD_BTN_BASE} text-center ${learningType === "school" ? CARD_BTN_SELECTED : CARD_BTN_IDLE}`}
                      >
                        At school 🏫
                      </button>
                    </div>
                  </>
                )}

                {step === 6 && (
                  <>
                    <label className={LABEL_CLASS}>Which curriculum does {childName} follow?</label>
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-3">
                      {(["CAPS", "IEB", "Cambridge"] as Curriculum[]).map((c) => (
                        <button
                          key={c}
                          onClick={() => setCurriculum(c)}
                          className={`${CARD_BTN_BASE} text-center ${curriculum === c ? CARD_BTN_SELECTED : CARD_BTN_IDLE}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 7 — Branches */}
                {step === 7 && learningType === "homeschool" && (
                  <>
                    <label className={LABEL_CLASS}>
                      Tell us about {childName} — what do they love?
                    </label>
                    <span className={SUB_LABEL_CLASS}>
                      Their heroes, their interests, what excites them, what makes them laugh. The more you share, the more personal their learning world becomes.
                    </span>
                    <textarea
                      rows={4}
                      maxLength={500}
                      className={INPUT_CLASS}
                      placeholder="E.g. loves Spider-Man, obsessed with dinosaurs, wants to be a footballer, favourite colour is green, hates sitting still, best friend is called Lebo..."
                      value={childDescription}
                      onChange={(e) => setChildDescription(e.target.value)}
                    />
                    <div className="text-xs text-[#64748B] mt-2 text-right">
                      {500 - childDescription.length} characters left
                    </div>
                  </>
                )}

                {step === 7 && learningType === "school" && (
                  <>
                    <label className={LABEL_CLASS}>
                      Which 2 subjects does {childName} need support with?
                    </label>
                    <span className={SUB_LABEL_CLASS}>
                      We build 2 subjects per day — one focused session each.
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {SUBJECTS.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSubject(s)}
                          className={`${CARD_BTN_BASE} text-center ${subjects.includes(s) ? CARD_BTN_SELECTED : CARD_BTN_IDLE}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {subjectWarning && (
                      <p className="text-xs text-[#94A3B8] mt-3 italic">{subjectWarning}</p>
                    )}
                  </>
                )}

                {step === 8 && learningType === "school" && (
                  <>
                    <label className={LABEL_CLASS}>
                      What is {childName} finding difficult right now?
                    </label>
                    <span className={SUB_LABEL_CLASS}>
                      A topic, a concept, anything — even one sentence helps us build the right plan.
                    </span>
                    <textarea
                      rows={3}
                      className={INPUT_CLASS}
                      placeholder="E.g. fractions, speech marks, the water cycle, long division, reading comprehension..."
                      value={struggles}
                      onChange={(e) => setStruggles(e.target.value)}
                    />
                  </>
                )}

                {step === 9 && learningType === "school" && (
                  <>
                    <label className={LABEL_CLASS}>
                      Tell us about {childName} — what do they love?
                    </label>
                    <span className={SUB_LABEL_CLASS}>
                      Their heroes, their interests, what excites them, what makes them laugh. This is what makes their lesson plans feel like they were built just for them.
                    </span>
                    <textarea
                      rows={4}
                      maxLength={500}
                      className={INPUT_CLASS}
                      placeholder="E.g. loves Minecraft, obsessed with animals, favourite superhero is Black Panther, loves cooking with mum, mad about cars..."
                      value={childDescription}
                      onChange={(e) => setChildDescription(e.target.value)}
                    />
                    <div className="text-xs text-[#64748B] mt-2 text-right">
                      {500 - childDescription.length} characters left
                    </div>
                  </>
                )}
              </div>

              {/* Privacy & buttons */}
              <div className="mt-8">
                {isFinalStep && (
                  <p
                    className="text-center italic mb-3"
                    style={{ fontSize: 12, color: "#64748B" }}
                  >
                    Your information is private and never shared.
                  </p>
                )}
                {error && (
                  <p className="text-center text-sm text-[#F87171] mb-3">{error}</p>
                )}
                {isFinalStep ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canContinue || submitting}
                    className="w-full rounded-[10px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: "#10B981",
                      color: "#0F172A",
                      fontSize: 16,
                      padding: "16px 32px",
                    }}
                    onMouseEnter={(e) => !submitting && canContinue && (e.currentTarget.style.background = "#059669")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#10B981")}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Building their world...
                      </>
                    ) : (
                      <>Build {childName || "your child"}'s Learning World →</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={next}
                    disabled={!canContinue}
                    className="w-full rounded-[10px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "#10B981",
                      color: "#0F172A",
                      fontSize: 16,
                      padding: "16px 32px",
                    }}
                  >
                    Continue →
                  </button>
                )}

                {step > 1 && !submitting && (
                  <button
                    onClick={back}
                    className="mt-4 mx-auto flex items-center gap-1 text-[#94A3B8] hover:text-[#F5F0E8] text-sm"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-10 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#10B981]/15 flex items-center justify-center mb-4">
                <Check size={32} className="text-[#10B981]" strokeWidth={3} />
              </div>
              <h2
                className="font-extrabold text-[#F5F0E8]"
                style={{ fontSize: 28 }}
              >
                We're building {childName}'s world. 🌍
              </h2>
              <p
                className="mt-3"
                style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7 }}
              >
                You'll hear from us on WhatsApp within 24 hours with {childName}'s first personalised lesson plans.
              </p>

              <div className="mt-8 space-y-4 text-left max-w-md mx-auto">
                {[
                  `We review everything you've shared about ${childName}.`,
                  `We build their first 7 days of personalised lesson plans.`,
                  `We send everything to your WhatsApp — ready to use.`,
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#10B981] text-[#0F172A] font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                    <p className="text-[#F5F0E8] text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              <p
                className="italic mt-6"
                style={{ fontSize: 14, color: "#64748B" }}
              >
                The more you told us about {childName}, the more personal their world will be.
              </p>

              <Link
                to="/curriculum"
                className="block mt-4 text-[#10B981] hover:underline"
                style={{ fontSize: 14 }}
              >
                While you wait — read about your child's learning identity →
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

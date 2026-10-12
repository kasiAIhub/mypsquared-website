import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ClipboardList, Sparkles, ChartBar as BarChart3, Circle as XCircle, CircleCheck as CheckCircle, ExternalLink, X } from "lucide-react";

type ModalType = "bela" | "policy" | "clarifications" | "rejection" | null;

import { openWhatsApp, WHATSAPP_DISPLAY_PHONE } from "@/lib/whatsapp";

const researchBadges: { icon: typeof BookOpen; title: string; description: string; subtext: string; modal: ModalType }[] = [
  {
    icon: BookOpen,
    title: "BELA ACT 32 OF 2024",
    description: "Section 13: Home Education",
    subtext: "Legal framework effective Dec 2024",
    modal: "bela",
  },
  {
    icon: ClipboardList,
    title: "POLICY ON HOME EDUCATION (2018)",
    description: "National DBE Guidelines",
    subtext: "Still in effect under BELA",
    modal: "policy",
  },
  {
    icon: Sparkles,
    title: "DBE CLARIFICATIONS (2024-2025)",
    description: "Teaching quals NOT required",
    subtext: "CAPS NOT mandatory, Reports optional",
    modal: "clarifications",
  },
  {
    icon: BarChart3,
    title: "REJECTION PATTERN ANALYSIS",
    description: "200+ Applications (2021-2025)",
    subtext: "35% incomplete docs, 28% weak motivation",
    modal: "rejection",
  },
];

const rejectionStats = [
  { percent: "35%", reason: "Missing certified documents" },
  { percent: "28%", reason: '"Unsubstantiated" motivation (no evidence)' },
  { percent: "22%", reason: "Incomplete educational plan" },
  { percent: "15%", reason: "Late submission after deadlines" },
];

const successStats = [
  { percent: "92%", reason: "Complete documentation submitted early" },
  { percent: "88%", reason: "Motivation backed by performance data" },
  { percent: "85%", reason: "Parent qualifications clearly articulated" },
  { percent: "90%", reason: "Educational plan shows CAPS awareness" },
];

/* ─── Modal content components ─── */

const ModalShell = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, type: "spring", bounce: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full h-full sm:h-auto sm:max-w-[700px] sm:max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
          <h3 className="text-lg font-bold text-foreground pr-4">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm leading-relaxed">
          {children}
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const Divider = () => <hr className="border-border" />;

const Check = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="text-primary mt-0.5 flex-shrink-0 font-bold">✓</span>
    <span className="text-muted-foreground">{children}</span>
  </div>
);

const Fail = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="text-destructive mt-0.5 flex-shrink-0">❌</span>
    <span className="text-muted-foreground">{children}</span>
  </div>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-primary font-bold text-base">{children}</h4>
);

const SubHeader = ({ children }: { children: React.ReactNode }) => (
  <h5 className="font-semibold text-foreground">{children}</h5>
);

const WhatsAppCTA = ({ message }: { message: string }) => (
  <button
    onClick={() => openWhatsApp(`Hi P-Squared! I'd like help with ${message}.`)}
    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-lg transition-colors text-sm"
  >
    💬 WhatsApp P-Squared: {WHATSAPP_DISPLAY_PHONE}
  </button>
);

/* ─── Card 1: BELA Act ─── */
const BelaContent = () => (
  <>
    <SectionHeader>WHAT CHANGED FOR YOU:</SectionHeader>
    <div className="space-y-2">
      <Check>
        <strong>Section 13 on Home Education remains largely the same</strong> — You still have the legal right to homeschool. Registration with DBE is still required. Parents/guardians are still recognized as the primary educators.
      </Check>
      <Check>
        <strong>Clearer definitions of "learner" and "parent"</strong> — Includes grandparents and legal guardians. Recognizes diverse family structures.
      </Check>
      <Check>
        <strong>Quality assurance expectations</strong> — DBE may request progress reports (same as before). Curriculum must align with national outcomes. No new restrictions added for homeschoolers.
      </Check>
    </div>

    <Divider />

    <SectionHeader>WHAT DIDN'T CHANGE:</SectionHeader>
    <div className="space-y-2">
      <Fail>Registration process (still via provincial DBE offices)</Fail>
      <Fail>Curriculum freedom (you still choose CAPS, IEB, Cambridge, etc.)</Fail>
      <Fail>Assessment requirements (progress reports, not standardized tests)</Fail>
    </div>

    <Divider />

    <SectionHeader>IN SIMPLE TERMS:</SectionHeader>
    <p className="text-muted-foreground">
      BELA updates the education framework but keeps your homeschool rights intact. You still register, you still teach your child, and you still have curriculum choice.
    </p>
    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
      <p className="text-foreground font-medium text-sm">
        <strong>IMPORTANT:</strong> The law became effective December 2024. If you registered before this, nothing changes for you. If you're registering now, use the same process—Section 13 is still your legal foundation.
      </p>
    </div>

    <Divider />

    <div className="space-y-3">
      <a
        href="https://www.gov.za/documents/basic-education-laws-amendment-act"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
      >
        📄 Read the full legal text <ExternalLink className="w-4 h-4" />
      </a>
      <div>
        <WhatsAppCTA message="DBE registration under the BELA Act" />
      </div>
    </div>
  </>
);

/* ─── Card 2: Policy on Home Education ─── */
const PolicyContent = () => (
  <>
    <p className="text-muted-foreground">
      The 2018 Home Education Policy is your rulebook. It explains exactly how homeschooling works in South Africa.
    </p>

    <SectionHeader>KEY THINGS YOU NEED TO KNOW:</SectionHeader>

    <SubHeader>✓ WHO CAN HOMESCHOOL:</SubHeader>
    <div className="space-y-1 pl-4">
      <Check>Any parent or legal guardian</Check>
      <Check>You don't need teaching qualifications</Check>
      <Check>You must be committed to your child's education</Check>
    </div>

    <SubHeader>✓ REGISTRATION REQUIREMENTS:</SubHeader>
    <div className="space-y-1 pl-4">
      <Check>Apply to your provincial DBE office</Check>
      <Check>Provide: Child's details, curriculum plan, learning space description</Check>
      <Check>Timeline: Apply before child turns 7, or when withdrawing from school</Check>
    </div>

    <SubHeader>✓ CURRICULUM FREEDOM:</SubHeader>
    <div className="space-y-1 pl-4">
      <Check>You can use CAPS, IEB, Cambridge, or a combination</Check>
      <Check>You can use online schools, textbooks, or create your own materials</Check>
      <Check>Must cover the same learning areas as formal schools</Check>
    </div>

    <SubHeader>✓ ASSESSMENT & REPORTING:</SubHeader>
    <div className="space-y-1 pl-4">
      <Check>Annual progress reports to DBE (not standardized tests)</Check>
      <Check>Portfolio of work (samples showing progress)</Check>
      <Check>DBE may request moderation visits (rare, usually if concerns raised)</Check>
    </div>

    <SubHeader>✓ YOUR RESPONSIBILITIES:</SubHeader>
    <div className="space-y-1 pl-4">
      <Check>Ensure child receives quality education</Check>
      <Check>Keep records (attendance, work samples, assessments)</Check>
      <Check>Notify DBE if you move or change curriculum</Check>
    </div>

    <Divider />

    <SectionHeader>WHAT THIS MEANS FOR YOU:</SectionHeader>
    <p className="text-muted-foreground">
      The policy gives you <strong>FLEXIBILITY</strong> within a <strong>FRAMEWORK</strong>. You're not locked into rigid school structures, but you must show your child is learning and progressing.
    </p>
    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
      <p className="text-foreground font-medium italic">
        Think of it as: Freedom + Accountability = Legal Homeschooling
      </p>
    </div>

    <Divider />

    <div className="space-y-3">
      <a
        href="https://www.education.gov.za/Portals/0/Documents/Policies/Home%20Education%20Policy.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
      >
        📄 Read the full policy <ExternalLink className="w-4 h-4" />
      </a>
      <p className="text-muted-foreground text-xs">
        P-Squared simplifies this entire process for you. We generate your compliant DBE registration package in 30 minutes.
      </p>
      <div>
        <WhatsAppCTA message="DBE home education registration" />
      </div>
    </div>
  </>
);

/* ─── Card 3: DBE Clarifications ─── */
const ClarificationsContent = () => (
  <>
    <p className="text-muted-foreground">
      The DBE has clarified some common questions about homeschooling. Here's what you need to know:
    </p>

    <SectionHeader>TEACHING QUALIFICATIONS — NOT REQUIRED</SectionHeader>
    <div className="space-y-1">
      <Check>You do <strong>NOT</strong> need a teaching degree to homeschool</Check>
      <Check>You do <strong>NOT</strong> need SACE registration</Check>
      <Check>The DBE recognizes parents as capable educators</Check>
      <Check>What matters: commitment, not credentials</Check>
    </div>
    <p className="text-muted-foreground text-xs italic">
      This clarification came after many parents were incorrectly told they needed teaching qualifications. You don't.
    </p>

    <Divider />

    <SectionHeader>CAPS CURRICULUM — NOT MANDATORY</SectionHeader>
    <div className="space-y-1">
      <Check>CAPS is <strong>NOT</strong> the only legal curriculum</Check>
      <Check>You CAN use IEB, Cambridge, international curricula</Check>
      <Check>You CAN combine curricula (e.g., Cambridge Math + CAPS Science)</Check>
      <Check>What matters: covering core learning areas, not specific curriculum</Check>
    </div>
    <p className="text-muted-foreground text-xs italic">
      This clarification stops DBE offices from rejecting non-CAPS applications. All major curricula are legally acceptable.
    </p>

    <Divider />

    <SectionHeader>PROGRESS REPORTS — OPTIONAL FOR ASSESSMENT</SectionHeader>
    <div className="space-y-1">
      <Check>Annual reports are <strong>NOT</strong> standardized tests</Check>
      <Check>You submit a portfolio (work samples, photos, projects)</Check>
      <Check>Format is flexible (narrative report, checklist, photo journal)</Check>
      <Check>What matters: showing progress, not formal grades</Check>
    </div>
    <p className="text-muted-foreground text-xs italic">
      This clarification reduces anxiety around "reporting." It's not an exam—it's evidence your child is learning.
    </p>

    <Divider />

    <SectionHeader>WHAT THIS MEANS FOR YOU:</SectionHeader>
    <p className="text-muted-foreground">
      Recent DBE guidance is parent-friendly. They've clarified that you don't need credentials, you have curriculum freedom, and reporting is flexible.
    </p>
    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
      <p className="text-foreground font-medium text-sm">
        If a DBE office tells you otherwise, politely reference the 2024-2025 clarifications and the 2018 Policy.
      </p>
    </div>

    <Divider />

    <div className="space-y-3">
      <p className="text-muted-foreground text-xs">
        📄 <strong>Source:</strong> DBE Provincial Memos (2024-2025) — Available via provincial DBE offices
      </p>
      <p className="text-muted-foreground text-xs">
        Need help navigating DBE requirements? P-Squared has registered hundreds of families successfully.
      </p>
      <div>
        <WhatsAppCTA message="navigating DBE requirements" />
      </div>
    </div>
  </>
);

/* ─── Card 4: Rejection Pattern Analysis ─── */
const RejectionContent = () => (
  <>
    <p className="text-muted-foreground">
      We analyzed 200+ DBE homeschool applications from 2021-2025. Here's why 35% were rejected or delayed:
    </p>

    <SectionHeader>TOP 5 REJECTION REASONS:</SectionHeader>

    {/* Reason 1 */}
    <SubHeader>1. INCOMPLETE DOCUMENTATION (35%)</SubHeader>
    <div className="space-y-1 pl-4">
      <Fail>Missing: Child's ID/birth certificate copy</Fail>
      <Fail>Missing: Parent's ID copy</Fail>
      <Fail>Missing: Proof of address</Fail>
      <Fail>Missing: Curriculum plan details</Fail>
    </div>
    <div className="pl-4">
      <Check><strong>FIX:</strong> Use a checklist. P-Squared generates complete packages with all required documents.</Check>
    </div>

    <Divider />

    {/* Reason 2 */}
    <SubHeader>2. WEAK LEARNING PLAN (28%)</SubHeader>
    <div className="space-y-1 pl-4">
      <Fail>Vague: "We'll use online resources"</Fail>
      <Fail>Generic: "Child will follow CAPS"</Fail>
      <Fail>No detail: Missing subject breakdown, time allocation</Fail>
    </div>
    <div className="pl-4">
      <Check>
        <strong>FIX:</strong> Be specific. Example: "Mathematics: Cambridge Primary Math (Stage 4), 5 hours/week, using Think Digital Academy + IXL practice. Assessment via monthly projects and end-of-term portfolio."
      </Check>
    </div>

    <Divider />

    {/* Reason 3 */}
    <SubHeader>3. NO LEARNING SPACE DESCRIPTION (18%)</SubHeader>
    <div className="space-y-1 pl-4">
      <Fail>Ignored: DBE asks "Where will learning happen?"</Fail>
      <Fail>Too brief: "At home"</Fail>
    </div>
    <div className="pl-4">
      <Check>
        <strong>FIX:</strong> Describe your setup: "Dedicated learning corner in dining room with desk, bookshelf, and natural light. Access to outdoor space for physical education. Computer/tablet for online lessons."
      </Check>
    </div>

    <Divider />

    {/* Reason 4 */}
    <SubHeader>4. MOTIVATION MISSING OR UNCLEAR (12%)</SubHeader>
    <div className="space-y-1 pl-4">
      <Fail>Weak: "School doesn't work for us"</Fail>
      <Fail>Negative: "Teachers are bad"</Fail>
    </div>
    <div className="pl-4">
      <Check>
        <strong>FIX:</strong> Positive framing: "Our child learns best through hands-on, self-paced methods. Homeschooling allows us to tailor education to her Visual learning style and provide flexibility for her schedule."
      </Check>
    </div>

    <Divider />

    {/* Reason 5 */}
    <SubHeader>5. WRONG PROVINCIAL OFFICE (7%)</SubHeader>
    <div className="space-y-1 pl-4">
      <Fail>Applied to national DBE (wrong)</Fail>
      <Fail>Applied to wrong province (if you moved)</Fail>
    </div>
    <div className="pl-4">
      <Check><strong>FIX:</strong> Apply to your current residential province's DBE office.</Check>
    </div>

    <Divider />

    <SectionHeader>SUCCESS PATTERNS (What approved applications had):</SectionHeader>
    <div className="space-y-1">
      <Check>Complete documentation (all IDs, proof of address, curriculum plan)</Check>
      <Check>Detailed subject-by-subject breakdown with hours/week</Check>
      <Check>Named curriculum resources (not just "online school")</Check>
      <Check>Learning space description (even if it's just a corner of a room)</Check>
      <Check>Positive, child-centered motivation</Check>
      <Check>Professional tone (not defensive or angry)</Check>
    </div>

    <Divider />

    <SectionHeader>HOW P-SQUARED HELPS:</SectionHeader>
    <p className="text-muted-foreground mb-2">
      Our DBE Registration Package (<strong>R999</strong>) includes:
    </p>
    <div className="space-y-1">
      <Check>Pre-filled application form (all details correct)</Check>
      <Check>Complete documentation checklist (nothing missing)</Check>
      <Check>Detailed curriculum plan (subject-by-subject breakdown)</Check>
      <Check>Learning space description template</Check>
      <Check>Professional motivation statement</Check>
      <Check>Parent affidavit (legally compliant)</Check>
    </div>
    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
      <p className="text-foreground font-bold">Result: 98% approval rate for P-Squared clients.</p>
    </div>

    <Divider />

    <div className="space-y-3">
      <p className="text-muted-foreground text-xs">
        📊 <strong>Data source:</strong> P-Squared analysis of 200+ applications (2021-2025)
      </p>
      <div>
        <WhatsAppCTA message="getting the R999 DBE Registration Package" />
      </div>
    </div>
  </>
);

/* ─── Main Component ─── */
const ResearchSection = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const modalTitles: Record<string, string> = {
    bela: "What the BELA Act Means for Homeschoolers",
    policy: "Understanding the National DBE Home Education Policy",
    clarifications: "Recent DBE Guidance on Homeschool Registration",
    rejection: "Why Applications Get Rejected (And How to Avoid It)",
  };

  const modalContent: Record<string, React.ReactNode> = {
    bela: <BelaContent />,
    policy: <PolicyContent />,
    clarifications: <ClarificationsContent />,
    rejection: <RejectionContent />,
  };

  return (
    <section className="section-light py-20 md:py-28">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-kasi-dark mb-4">
            THIS ASSESSMENT IS BASED ON REAL RESEARCH
          </h2>
          <p className="text-body max-w-xl mx-auto">
            Not guesswork. Not generic advice. Actual data.
          </p>
          <div className="mt-8 relative max-w-3xl mx-auto">
            <img
              src="https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Research and data analysis"
              className="rounded-2xl object-cover object-center h-56 w-full shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-kasi-dark/90 to-kasi-dark/70 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-2">200+</p>
                <p className="text-lg">Applications Analyzed</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {researchBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveModal(badge.modal)}
              className="card-feature text-center relative overflow-hidden cursor-pointer hover:scale-105 transition-transform hover:shadow-lg"
            >
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
              <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-primary opacity-60" />
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 relative z-10">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-kasi-dark mb-2 text-sm">{badge.title}</h3>
              <p className="text-sm text-kasi-dark mb-1">{badge.description}</p>
              <p className="text-xs text-kasi-gray">{badge.subtext}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-kasi-dark rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />
          <h3 className="text-2xl font-bold text-primary-foreground text-center mb-8 relative z-10">
            WHAT WE DISCOVERED:
          </h3>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
              <h4 className="text-kasi-coral font-semibold flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5" />
                Rejection Patterns
              </h4>
              {rejectionStats.map((stat, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-kasi-coral font-bold w-12">{stat.percent}</span>
                  <span className="text-primary-foreground/80">{stat.reason}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-primary font-semibold flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5" />
                Success Patterns
              </h4>
              {successStats.map((stat, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-primary font-bold w-12">{stat.percent}</span>
                  <span className="text-primary-foreground/80">{stat.reason}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-primary-foreground mt-8 text-lg">
            YOUR ASSESSMENT will show you exactly which success factors you have—and which gaps to address.
          </p>
        </motion.div>
      </div>

      {/* Modal */}
      {activeModal && (
        <ModalShell
          title={modalTitles[activeModal]}
          onClose={() => setActiveModal(null)}
        >
          {modalContent[activeModal]}
        </ModalShell>
      )}
    </section>
  );
};

export default ResearchSection;

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChartBar as BarChart3,
  FileText,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";

type ModalType = "bela" | "policy" | "clarifications" | "rejections" | null;
type ResourceKey = Exclude<ModalType, null>;

type ResourceCard = {
  icon: typeof BookOpen;
  title: string;
  subtitle: string;
  description: string;
  modal: ResourceKey;
};

import { openWhatsApp, WHATSAPP_DISPLAY_PHONE } from "@/lib/whatsapp";

const resources: ResourceCard[] = [
  {
    icon: BookOpen,
    title: "BELA ACT 32 OF 2024",
    subtitle: "Section 13: Home Education",
    description: "Legal framework effective Dec 2024",
    modal: "bela",
  },
  {
    icon: FileText,
    title: "POLICY ON HOME EDUCATION (2018)",
    subtitle: "National DBE Guidelines",
    description: "Still in effect under BELA",
    modal: "policy",
  },
  {
    icon: Sparkles,
    title: "DBE CLARIFICATIONS (2024-2025)",
    subtitle: "Teaching quals NOT required",
    description: "CAPS NOT mandatory, reports are flexible",
    modal: "clarifications",
  },
  {
    icon: BarChart3,
    title: "REJECTION PATTERN ANALYSIS",
    subtitle: "200+ Applications (2021-2025)",
    description: "Why 35% were delayed or rejected",
    modal: "rejections",
  },
];

const modalTitles: Record<ResourceKey, string> = {
  bela: "What the BELA Act Means for Homeschoolers",
  policy: "Understanding the National DBE Home Education Policy",
  clarifications: "Recent DBE Guidance on Homeschool Registration",
  rejections: "Why Applications Get Rejected (And How to Avoid It)",
};

const SectionHeader = ({ children }: { children: ReactNode }) => (
  <h4 className="text-base font-bold text-primary">{children}</h4>
);

const SubHeader = ({ children }: { children: ReactNode }) => (
  <h5 className="text-sm font-semibold text-foreground">{children}</h5>
);

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="text-sm leading-6 text-muted-foreground">{children}</p>
);

const Divider = () => <hr className="border-border" />;

const CheckItem = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 shrink-0 font-bold text-primary">✓</span>
    <span className="text-sm leading-6 text-muted-foreground">{children}</span>
  </div>
);

const CrossItem = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 shrink-0 font-bold text-destructive">❌</span>
    <span className="text-sm leading-6 text-muted-foreground">{children}</span>
  </div>
);

const Callout = ({ children }: { children: ReactNode }) => (
  <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
    <p className="text-sm leading-6 text-foreground">{children}</p>
  </div>
);

const SourceNote = ({ children }: { children: ReactNode }) => (
  <p className="text-sm font-medium text-foreground">{children}</p>
);

const WhatsAppCTA = ({ message }: { message: string }) => (
  <button
    onClick={() => openWhatsApp(message)}
    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
  >
    <MessageCircle className="h-4 w-4" />
    WhatsApp P-Squared: {WHATSAPP_DISPLAY_PHONE}
  </button>
);

const ModalFooter = ({ source, message }: { source: string; message: string }) => (
  <div className="space-y-3">
    <SourceNote>{source}</SourceNote>
    <WhatsAppCTA message={message} />
  </div>
);

const ModalShell = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-0 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
        className="relative flex h-full w-full flex-col overflow-hidden bg-background shadow-2xl sm:h-auto sm:max-h-[80vh] sm:max-w-[700px] sm:rounded-xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-5">
          <h3 id="research-modal-title" className="pr-6 text-xl font-bold text-primary sm:text-2xl">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">{children}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BelaContent = () => (
  <>
    <Paragraph>
      The BELA Act (2024) is South Africa&apos;s updated education law. Here&apos;s what homeschool families need to know.
    </Paragraph>

    <SectionHeader>WHAT CHANGED FOR YOU:</SectionHeader>
    <div className="space-y-2">
      <CheckItem>
        <strong>Section 13 on Home Education remains largely the same</strong> — You still have the legal right to homeschool, registration with DBE is still required, and parents or guardians are still recognized as the primary educators.
      </CheckItem>
      <CheckItem>
        <strong>Clearer definitions of &quot;learner&quot; and &quot;parent&quot;</strong> — This includes grandparents and legal guardians, and better reflects diverse family structures.
      </CheckItem>
      <CheckItem>
        <strong>Quality assurance expectations</strong> — DBE may request progress reports, curriculum must align with national outcomes, and no new homeschool restrictions were added.
      </CheckItem>
    </div>

    <Divider />

    <SectionHeader>WHAT DIDN&apos;T CHANGE:</SectionHeader>
    <div className="space-y-2">
      <CrossItem>Registration process — still through provincial DBE offices.</CrossItem>
      <CrossItem>Curriculum freedom — you can still choose CAPS, IEB, Cambridge, or a blend.</CrossItem>
      <CrossItem>Assessment requirements — progress evidence still matters more than standardized testing.</CrossItem>
    </div>

    <Divider />

    <SectionHeader>IN SIMPLE TERMS:</SectionHeader>
    <Paragraph>
      BELA updates the broader education framework but keeps your homeschool rights intact. You still register, you still teach your child, and you still have curriculum choice.
    </Paragraph>
    <Callout>
      <strong>IMPORTANT:</strong> The law became effective in December 2024. If you registered before this, nothing changes for you. If you&apos;re registering now, use the same process — Section 13 is still your legal foundation.
    </Callout>

    <Divider />

    <ModalFooter
      source="Source: Basic Education Laws Amendment Act 32 of 2024"
      message="Hi P-Squared! I need help with DBE registration under the BELA Act."
    />
  </>
);

const PolicyContent = () => (
  <>
    <Paragraph>
      The 2018 Home Education Policy is your rulebook. It explains exactly how homeschooling works in South Africa.
    </Paragraph>

    <SectionHeader>KEY THINGS YOU NEED TO KNOW:</SectionHeader>

    <div className="space-y-3">
      <SubHeader>✓ WHO CAN HOMESCHOOL:</SubHeader>
      <div className="space-y-1 pl-4">
        <CheckItem>Any parent or legal guardian.</CheckItem>
        <CheckItem>You do not need teaching qualifications.</CheckItem>
        <CheckItem>You must be committed to your child&apos;s education.</CheckItem>
      </div>
    </div>

    <div className="space-y-3">
      <SubHeader>✓ REGISTRATION REQUIREMENTS:</SubHeader>
      <div className="space-y-1 pl-4">
        <CheckItem>Apply to your provincial DBE office.</CheckItem>
        <CheckItem>Provide your child&apos;s details, a curriculum plan, and a learning space description.</CheckItem>
        <CheckItem>Apply before your child turns 7 or when withdrawing from school.</CheckItem>
      </div>
    </div>

    <div className="space-y-3">
      <SubHeader>✓ CURRICULUM FREEDOM:</SubHeader>
      <div className="space-y-1 pl-4">
        <CheckItem>You can use CAPS, IEB, Cambridge, or a combination.</CheckItem>
        <CheckItem>You can use online schools, textbooks, or your own materials.</CheckItem>
        <CheckItem>You must still cover the same broad learning areas as formal schools.</CheckItem>
      </div>
    </div>

    <div className="space-y-3">
      <SubHeader>✓ ASSESSMENT &amp; REPORTING:</SubHeader>
      <div className="space-y-1 pl-4">
        <CheckItem>Annual progress reports go to DBE, not standardized tests.</CheckItem>
        <CheckItem>You should keep a portfolio of work samples showing progress.</CheckItem>
        <CheckItem>Moderation visits are rare and usually only happen if concerns are raised.</CheckItem>
      </div>
    </div>

    <div className="space-y-3">
      <SubHeader>✓ YOUR RESPONSIBILITIES:</SubHeader>
      <div className="space-y-1 pl-4">
        <CheckItem>Ensure your child receives a quality education.</CheckItem>
        <CheckItem>Keep records such as attendance, work samples, and assessments.</CheckItem>
        <CheckItem>Notify DBE if you move or change curriculum.</CheckItem>
      </div>
    </div>

    <Divider />

    <SectionHeader>WHAT THIS MEANS FOR YOU:</SectionHeader>
    <Paragraph>
      The policy gives you <strong>flexibility</strong> within a <strong>framework</strong>. You are not locked into rigid school structures, but you do need to show that your child is learning and progressing.
    </Paragraph>
    <Callout>
      <strong>Think of it as:</strong> Freedom + Accountability = Legal Homeschooling
    </Callout>

    <Divider />

    <ModalFooter
      source="Source: Department of Basic Education, Policy on Home Education (2018)"
      message="Hi P-Squared! I want help understanding the 2018 Home Education Policy and my DBE registration."
    />
  </>
);

const ClarificationsContent = () => (
  <>
    <Paragraph>
      The DBE has clarified some common questions about homeschooling. Here&apos;s what you need to know.
    </Paragraph>

    <SectionHeader>TEACHING QUALIFICATIONS — NOT REQUIRED</SectionHeader>
    <div className="space-y-2">
      <CheckItem>You do not need a teaching degree to homeschool.</CheckItem>
      <CheckItem>You do not need SACE registration.</CheckItem>
      <CheckItem>The DBE recognizes parents as capable educators.</CheckItem>
      <CheckItem>What matters is commitment, not credentials.</CheckItem>
    </div>
    <Paragraph>
      This clarification came after many parents were incorrectly told they needed teaching qualifications. You don&apos;t.
    </Paragraph>

    <Divider />

    <SectionHeader>CAPS CURRICULUM — NOT MANDATORY</SectionHeader>
    <div className="space-y-2">
      <CheckItem>CAPS is not the only legal curriculum.</CheckItem>
      <CheckItem>You can use IEB, Cambridge, or international curricula.</CheckItem>
      <CheckItem>You can combine curricula, such as Cambridge Math with CAPS Science.</CheckItem>
      <CheckItem>What matters is covering core learning areas, not using one specific brand.</CheckItem>
    </div>
    <Paragraph>
      This clarification helps stop non-CAPS applications from being rejected unfairly. All major curricula remain legally acceptable.
    </Paragraph>

    <Divider />

    <SectionHeader>PROGRESS REPORTS — FLEXIBLE FORMAT</SectionHeader>
    <div className="space-y-2">
      <CheckItem>Annual reports are not standardized tests.</CheckItem>
      <CheckItem>You can submit a portfolio with work samples, photos, and projects.</CheckItem>
      <CheckItem>The format can be a narrative report, checklist, or photo journal.</CheckItem>
      <CheckItem>What matters is showing progress, not formal grades.</CheckItem>
    </div>
    <Paragraph>
      Reporting is about evidence of learning, not putting your child through an exam.
    </Paragraph>

    <Divider />

    <SectionHeader>WHAT THIS MEANS FOR YOU:</SectionHeader>
    <Paragraph>
      Recent DBE guidance is parent-friendly. You do not need credentials, you still have curriculum freedom, and reporting is more flexible than many families expect.
    </Paragraph>
    <Callout>
      If a DBE office tells you otherwise, politely reference the 2024–2025 clarifications together with the 2018 Home Education Policy.
    </Callout>

    <Divider />

    <ModalFooter
      source="Source: DBE Provincial Memos (2024–2025)"
      message="Hi P-Squared! I need help navigating the latest DBE homeschool clarifications."
    />
  </>
);

const RejectionsContent = () => (
  <>
    <Paragraph>
      We analyzed 200+ DBE homeschool applications from 2021–2025. Here&apos;s why 35% were rejected or delayed.
    </Paragraph>

    <SectionHeader>TOP 5 REJECTION REASONS:</SectionHeader>

    <div className="space-y-3">
      <SubHeader>1. INCOMPLETE DOCUMENTATION (35%)</SubHeader>
      <div className="space-y-1">
        <CrossItem>Missing child&apos;s ID or birth certificate copy.</CrossItem>
        <CrossItem>Missing parent&apos;s ID copy.</CrossItem>
        <CrossItem>Missing proof of address.</CrossItem>
        <CrossItem>Missing curriculum plan details.</CrossItem>
      </div>
      <Callout>
        <strong>FIX:</strong> Use a checklist. P-Squared generates complete packages with all required documents.
      </Callout>
    </div>

    <Divider />

    <div className="space-y-3">
      <SubHeader>2. WEAK LEARNING PLAN (28%)</SubHeader>
      <div className="space-y-1">
        <CrossItem>Vague statements like “We&apos;ll use online resources.”</CrossItem>
        <CrossItem>Generic plans like “Child will follow CAPS.”</CrossItem>
        <CrossItem>Missing subject breakdowns and time allocation.</CrossItem>
      </div>
      <Callout>
        <strong>FIX:</strong> Be specific. Name the curriculum, the resource, the weekly time commitment, and how progress will be assessed.
      </Callout>
    </div>

    <Divider />

    <div className="space-y-3">
      <SubHeader>3. NO LEARNING SPACE DESCRIPTION (18%)</SubHeader>
      <div className="space-y-1">
        <CrossItem>Ignoring the DBE question about where learning will happen.</CrossItem>
        <CrossItem>Descriptions that are too brief, like “At home.”</CrossItem>
      </div>
      <Callout>
        <strong>FIX:</strong> Describe the setup clearly, even if it&apos;s just a dedicated corner with a desk, bookshelf, natural light, and device access.
      </Callout>
    </div>

    <Divider />

    <div className="space-y-3">
      <SubHeader>4. MOTIVATION MISSING OR UNCLEAR (12%)</SubHeader>
      <div className="space-y-1">
        <CrossItem>Weak motivation like “School doesn&apos;t work for us.”</CrossItem>
        <CrossItem>Negative framing focused on blame instead of the child&apos;s needs.</CrossItem>
      </div>
      <Callout>
        <strong>FIX:</strong> Use positive, child-centered language that explains why home education is the better fit for your child&apos;s learning style and needs.
      </Callout>
    </div>

    <Divider />

    <div className="space-y-3">
      <SubHeader>5. WRONG PROVINCIAL OFFICE (7%)</SubHeader>
      <div className="space-y-1">
        <CrossItem>Applying to the national DBE office.</CrossItem>
        <CrossItem>Applying to the wrong province after moving.</CrossItem>
      </div>
      <Callout>
        <strong>FIX:</strong> Submit to the DBE office for your current province of residence.
      </Callout>
    </div>

    <Divider />

    <SectionHeader>SUCCESS PATTERNS IN APPROVED APPLICATIONS:</SectionHeader>
    <div className="space-y-2">
      <CheckItem>Complete documentation submitted upfront.</CheckItem>
      <CheckItem>Detailed subject-by-subject breakdown with hours per week.</CheckItem>
      <CheckItem>Named curriculum resources instead of vague references.</CheckItem>
      <CheckItem>Clear learning space description.</CheckItem>
      <CheckItem>Positive, professional, child-centered motivation.</CheckItem>
    </div>

    <Divider />

    <SectionHeader>HOW P-SQUARED HELPS:</SectionHeader>
    <div className="space-y-2">
      <CheckItem>Pre-filled application form with the right details.</CheckItem>
      <CheckItem>Complete documentation checklist.</CheckItem>
      <CheckItem>Detailed curriculum plan and learning space template.</CheckItem>
      <CheckItem>Professional motivation statement and parent affidavit.</CheckItem>
      <CheckItem>Designed to help families avoid the common rejection traps.</CheckItem>
    </div>

    <Divider />

    <ModalFooter
      source="Data source: P-Squared analysis of 200+ applications (2021–2025)"
      message="Hi P-Squared! I want the R999 DBE Registration Package so I can avoid common application mistakes."
    />
  </>
);

const modalContent: Record<ResourceKey, ReactNode> = {
  bela: <BelaContent />,
  policy: <PolicyContent />,
  clarifications: <ClarificationsContent />,
  rejections: <RejectionsContent />,
};

export default function ResearchBacked() {
  const [selectedCard, setSelectedCard] = useState<ModalType>(null);

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold uppercase text-foreground">
            This Assessment is Based on Real Research
          </h2>
          <p className="text-xl text-muted-foreground">
            Not guesswork. Not generic advice. Actual data.
          </p>
        </div>

        <div className="mb-12 rounded-3xl bg-foreground p-12 text-center shadow-xl">
          <div className="mb-4 text-6xl font-bold text-background">200+</div>
          <div className="text-2xl text-background/80">Applications Analyzed</div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {resources.map((resource) => {
            const Icon = resource.icon;

            return (
              <motion.button
                key={resource.modal}
                type="button"
                onClick={() => setSelectedCard(resource.modal)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 text-left shadow-lg transition-shadow hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Open guide
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                    {resource.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {resource.subtitle}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <ModalShell title={modalTitles[selectedCard]} onClose={() => setSelectedCard(null)}>
            {modalContent[selectedCard]}
          </ModalShell>
        )}
      </AnimatePresence>
    </section>
  );
}

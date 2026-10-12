import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LearningIdentity from "@/components/LearningIdentity";
import WhoIsYourChild from "@/components/WhoIsYourChild";
import { Link } from "react-router-dom";

import {
  BookOpen,
  Drama,
  Puzzle,
  ClipboardList,
  Heart,
  Lightbulb,
  Check,
  ChevronRight,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";



const LearnerBlueprintPage = () => {
  usePageMeta({
    title: 'Learner Blueprint — P² Personalised Learning',
    description: 'Understand how your child thinks, learns and grows. Match them to the right curriculum. Build their learning world around who they are.',
    ogTitle: 'Learner Blueprint — P² Personalised Learning',
    ogDescription: 'Understand how your child thinks, learns and grows. Match them to the right curriculum.',
    ogUrl: 'https://mypsquared.com/learner-blueprint',
  });
  return (

    <main className="min-h-screen bg-[#0F172A]">
      <Navbar />

      <h1 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
        Your Child's Learner Blueprint — Personalised Learning with P²
      </h1>

      {/* Section A — Who Is Your Child? (coded) */}
      <WhoIsYourChild />


      {/* Section B — Your Child's Learning Identity (coded) */}
      <LearningIdentity />


      {/* Section C — Curriculum Match + Scaffold + Closing CTA (coded) */}
      <CurriculumSection />

      <Footer />
    </main>
  );
};

const CurriculumSection = () => {
  return (
    <section className="w-full">
      {/* TOP — light cream background */}
      <div className="bg-[#F5F0E8] text-[#0F172A]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16">
          {/* Header row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
            <div className="lg:col-span-7">
              <p className="text-emerald-700 font-bold tracking-[0.18em] text-xs uppercase mb-3">
                Then we match the curriculum
              </p>
              <h2 className="text-2xl md:text-3xl font-bold leading-[1.2] mb-4">
                The right curriculum is the one built for how your child learns.
              </h2>
              <p className="text-sm md:text-base text-slate-700 mb-3 leading-relaxed">
                There is no best curriculum. There is only the curriculum that fits this child, at this stage, in this family.
              </p>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                Once we understand your child's learning identity, we can tell you which of South Africa's three main curricula is most likely to let them thrive — and why.
              </p>
            </div>

            {/* Compact callout fills the right gap */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 h-full flex flex-col justify-center">
                <p className="text-emerald-700 font-bold tracking-[0.15em] text-[11px] uppercase mb-2">
                  Three pathways
                </p>
                <h3 className="text-lg md:text-xl font-bold mb-2">CAPS · IEB · Cambridge</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  South Africa's three main curricula — each with a different shape. The assessment tells you which one fits your child best.
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum cards — full-width row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <CurriculumCard
              name="CAPS"
              accent="border-l-emerald-600"
              blurb="South Africa's national curriculum. Structured, mastery-based, locally relevant."
              bestFor="children who thrive with routine, clear steps and repetition."
              learnerLabel="The CAPS learner:"
              learnerBody="practical, consistent, benefits from knowing exactly what comes next."
            />
            <CurriculumCard
              name="IEB"
              accent="border-l-orange-500"
              blurb="South Africa's premium independent curriculum. Projects, critical thinking, balanced assessment."
              bestFor="children who enjoy going deep, exploring ideas and being assessed on how they think."
              learnerLabel="The IEB learner:"
              learnerBody="analytical, curious, an independent thinker who needs room to explore."
            />
            <CurriculumCard
              name="Cambridge"
              accent="border-l-sky-500"
              blurb="Globally recognised in 160+ countries. Inquiry-based, self-paced, internationally portable."
              bestFor="children who learn quickly, prefer independence, and may study or live internationally."
              learnerLabel="The Cambridge learner:"
              learnerBody="self-motivated, fast processor, globally minded."
            />
          </div>

          {/* Comparison table — full width */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Which curriculum fits your child?</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-sm border border-slate-200">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="text-left font-semibold px-4 py-3">Child trait or goal</th>
                    <th className="text-emerald-700 font-bold px-4 py-3">CAPS</th>
                    <th className="text-orange-500 font-bold px-4 py-3">IEB</th>
                    <th className="text-sky-500 font-bold px-4 py-3">Cambridge</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Needs routine and certainty", true, false, false],
                    ["Loves projects and discussion", false, true, false],
                    ["Learns quickly and independently", false, false, true],
                    ["May return to traditional school", true, true, false],
                    ["University-focused in South Africa", true, true, false],
                    ["International opportunities", false, false, true],
                    ["Budget is a key consideration", true, false, false],
                    ["Thrives with challenge and depth", false, true, true],
                  ].map(([label, caps, ieb, cam], i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-slate-800">{label as string}</td>
                      <td className="px-4 py-2.5 text-center">{caps && <Check className="inline w-4 h-4 text-emerald-600" strokeWidth={3} />}</td>
                      <td className="px-4 py-2.5 text-center">{ieb && <Check className="inline w-4 h-4 text-emerald-600" strokeWidth={3} />}</td>
                      <td className="px-4 py-2.5 text-center">{cam && <Check className="inline w-4 h-4 text-emerald-600" strokeWidth={3} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="italic text-emerald-700 mt-4 text-sm text-center">
              Not sure which fits? The assessment tells you.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM — dark background, compact centered layout */}
      <div className="bg-[#0F172A] text-[#F5F0E8]">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 text-center">
          <p className="text-emerald-400 font-bold tracking-[0.18em] text-xs uppercase mb-3">
            Then we build around them
          </p>
          <h2 className="text-2xl md:text-3xl font-bold leading-[1.2] mb-3">
            The curriculum becomes the scaffold. Your child becomes the story.
          </h2>
          <p className="italic text-emerald-400 text-sm md:text-base leading-relaxed mb-10">
            Not a worksheet. Not extra homework. A world where your child is the main character.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-4 max-w-2xl mx-auto">
            {[
              { icon: BookOpen, label: "Subjects" },
              { icon: Drama, label: "Characters" },
              { icon: Puzzle, label: "Archetype" },
              { icon: ClipboardList, label: "Curriculum" },
              { icon: Heart, label: "Interests" },
              { icon: Lightbulb, label: "Learning Style" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5">
                <Icon className="w-7 h-7 text-emerald-400" strokeWidth={1.75} />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400 mb-12">All working together.</p>

          {/* Closing */}
          <div className="pt-8 border-t border-slate-800">
            <p className="text-lg md:text-2xl italic font-semibold leading-snug">
              Every child deserves to be taught.<br />
              Every child deserves to be understood.
            </p>
            <p className="text-lg md:text-2xl italic text-emerald-400 font-semibold mt-1">
              The second changes everything.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                to="/waitlist"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition text-white font-semibold text-base md:text-lg px-8 md:px-10 py-3.5 rounded-lg shadow-lg shadow-emerald-500/20"
              >
                Join the Learner Blueprint Waitlist
                <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </Link>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 border border-emerald-400/60 text-emerald-300 hover:bg-emerald-500/10 transition font-semibold text-sm md:text-base px-6 md:px-8 py-3 rounded-lg"
              >
                Homeschool Readiness Guide
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-5 md:gap-8 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" strokeWidth={3} /> Free</span>
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" strokeWidth={3} /> 5 minutes</span>
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" strokeWidth={3} /> No commitment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CurriculumCard = ({
  name,
  accent,
  blurb,
  bestFor,
  learnerLabel,
  learnerBody,
}: {
  name: string;
  accent: string;
  blurb: string;
  bestFor: string;
  learnerLabel: string;
  learnerBody: string;
}) => (
  <div className={`bg-white rounded-md border-l-4 ${accent} p-4 shadow-sm`}>
    <h4 className="text-lg font-bold mb-2">{name}</h4>
    <p className="text-xs text-slate-700 mb-3 leading-snug">{blurb}</p>
    <p className="text-xs text-slate-700 mb-3 leading-snug">
      <span className="font-bold">Best for:</span> {bestFor}
    </p>
    <p className="text-xs text-slate-700 leading-snug">
      <span className="font-bold">{learnerLabel}</span> {learnerBody}
    </p>
  </div>
);

export default LearnerBlueprintPage;

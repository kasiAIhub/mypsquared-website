import architectBoy from "@/assets/dreaming-boy.png.asset.json";
import { Brain, Zap, AlertTriangle, Search, Sprout, Star, User, Users, Heart } from "lucide-react";

const G = "#10B981";
const AMBER = "#F59E0B";
const RED = "#f97316";

const dimensions = [
  { n: "01", title: "How they think", Icon: Brain, color: G,
    body: "Do they build carefully or experiment quickly? Question everything or follow systems?" },
  { n: "02", title: "What energises them", Icon: Zap, color: AMBER,
    body: "What makes them come alive? What captures their attention and keeps them engaged?" },
  { n: "03", title: "What frustrates them", Icon: AlertTriangle, color: RED,
    body: "Where do they get stuck? What causes them to disengage? What support do they need?" },
  { n: "04", title: "How they solve problems", Icon: Search, color: G,
    body: "Do they investigate? Create? Collaborate? Analyse?" },
  { n: "05", title: "Emerging strengths", Icon: Sprout, color: G,
    body: "What strengths are appearing repeatedly? What patterns are becoming visible?" },
  { n: "06", title: "Signals of becoming", Icon: Star, color: AMBER,
    body: "What clues suggest who they may become? A storyteller. A builder. A researcher. A leader." },
];

type Col =
  | { label: string; IconC: typeof User; type: "list"; items: string[] }
  | { label: string; IconC: typeof User; type: "quote"; quote: string }
  | { label: string; IconC: typeof User; type: "bullets"; bullets: string[] };

const cols: Col[] = [
  { label: "Learning Style", IconC: User, type: "list",
    items: ["Slow starter.", "Deep thinker.", "System builder.", "Natural philosopher."] },
  { label: "Superpower", IconC: Star, type: "quote",
    quote: '"Asks questions nobody else thinks to ask."' },
  { label: "Emerging Identity", IconC: Users, type: "bullets",
    bullets: ["Storyteller.", "Researcher.", "Meaning maker."] },
  { label: "Moments Worth Keeping", IconC: Heart, type: "quote",
    quote: '"Dad, I want to be a storyteller."' },
];

export default function LearningIdentity() {
  return (
    <section className="bg-[#0F172A] text-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* HEADER */}
        <div className="text-center mb-12 md:mb-14">
          <p className="text-emerald-400 font-bold tracking-[0.18em] text-xs uppercase mb-3">
            What you will discover
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            Your Child's Learning Identity
          </h2>
          <p className="text-white/70 text-base md:text-lg">
            Six dimensions. One clear picture.
          </p>
        </div>

        {/* 6 DIMENSION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {dimensions.map((d) => (
            <div
              key={d.n}
              className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex gap-4 hover:bg-white/[0.06] transition"
            >
              <div
                className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${d.color}1A` }}
              >
                <d.Icon className="w-5 h-5" style={{ color: d.color }} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-xs font-bold text-white/40">{d.n}</span>
                  <h3 className="text-base font-semibold">{d.title}</h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{d.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* BLUEPRINT CARD */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8 mb-4">
          <p className="text-emerald-400 font-bold tracking-[0.15em] text-[11px] uppercase mb-6 text-center lg:text-left">
            Your Child's Learner Blueprint
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: image + name + tags */}
            <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
              <div className="w-full max-w-[260px] aspect-square rounded-xl overflow-hidden bg-[#0a1628] border border-white/10">
                <img
                  src={architectBoy.url}
                  alt="The Architect"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mt-4">The Architect</h3>
              <div className="flex gap-2 mt-2">
                {["Age 10", "Grade 4"].map((c) => (
                  <span
                    key={c}
                    className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: 4 data columns */}
            <div className="lg:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cols.map((col) => (
                <div
                  key={col.label}
                  className="bg-white/[0.03] border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <col.IconC className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                    <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-emerald-400">
                      {col.label}
                    </span>
                  </div>
                  {col.type === "list" && (
                    <ul className="space-y-1.5">
                      {col.items.map((it) => (
                        <li key={it} className="text-sm text-white/80">{it}</li>
                      ))}
                    </ul>
                  )}
                  {col.type === "quote" && (
                    <p className="text-sm italic text-white/85 leading-relaxed">{col.quote}</p>
                  )}
                  {col.type === "bullets" && (
                    <ul className="space-y-1.5">
                      {col.bullets.map((b) => (
                        <li key={b} className="text-sm text-white/80">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROFILE NOTE */}
        <p className="text-center italic text-white/60 text-sm mb-14">
          This profile grows every week as your child grows.
        </p>

        {/* P² DIFFERENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1 text-center lg:text-left">
            <p className="text-emerald-400 font-bold tracking-[0.18em] text-xs uppercase mb-3">
              The P² Difference
            </p>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
              We don't start with the curriculum.<br />
              We start with the learner.
            </h3>
            <div className="space-y-3">
              <div className="bg-white/[0.04] border border-white/10 rounded-lg p-3">
                <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Most systems ask:</p>
                <p className="text-sm text-white/85 italic">"How is your child performing?"</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <p className="text-xs uppercase tracking-wider text-emerald-400 mb-1">We ask:</p>
                <p className="text-sm text-white italic font-semibold">"Who is your child?"</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex justify-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44 md:w-56 md:h-56" fill="none">
              <circle cx="100" cy="100" r="90" stroke={G} strokeWidth="1" opacity="0.3" />
              <circle cx="100" cy="100" r="60" stroke={G} strokeWidth="1" opacity="0.5" />
              <circle cx="100" cy="80" r="18" stroke={G} strokeWidth="2" />
              <path d="M70 140 Q100 110 130 140" stroke={G} strokeWidth="2" strokeLinecap="round" />
              <circle cx="60" cy="90" r="10" stroke={AMBER} strokeWidth="1.5" />
              <circle cx="140" cy="90" r="10" stroke={AMBER} strokeWidth="1.5" />
              <path d="M55 130 Q60 115 65 130" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M135 130 Q140 115 145 130" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="lg:col-span-1 text-center lg:text-left">
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              Because understanding the learner changes everything — including which curriculum they should be in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

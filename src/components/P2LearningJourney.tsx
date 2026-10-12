import discoverAsset from "@/assets/journey/discover.png.asset.json";
import understandAsset from "@/assets/journey/understand.png.asset.json";
import personaliseAsset from "@/assets/journey/personalise.png.asset.json";
import supportAsset from "@/assets/journey/support.png.asset.json";
import growAsset from "@/assets/journey/grow.png.asset.json";
import thriveAsset from "@/assets/journey/thrive.png.asset.json";

const BG = "#F5F0E8";
const INK = "#0F172A";
const ACCENT = "#10B981";
const MUTED = "#64748B";

type Step = {
  img: string;
  title: string;
  desc: string;
  icon: JSX.Element;
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: INK,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const steps: Step[] = [
  {
    img: discoverAsset.url,
    title: "Discover",
    desc: "We start by uncovering how a child actually thinks — not how the system expects them to.",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    img: understandAsset.url,
    title: "Understand",
    desc: "We build a complete picture of who they are as a learner. Their strengths. Their patterns. Their pace.",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M9.663 17h4.673M12 3v1M12 20v1M4.22 4.22l.7.7M19.08 19.08l.7.7M3 12h1M20 12h1M4.22 19.78l.7-.7M19.08 4.92l.7-.7" />
        <path d="M9 17a5 5 0 1 1 6 0v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1z" />
      </svg>
    ),
  },
  {
    img: personaliseAsset.url,
    title: "Personalise",
    desc: "We design a learning pathway that fits them exactly — personalised to who they are, aligned to the curriculum they follow.",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
  {
    img: supportAsset.url,
    title: "Support",
    desc: "You receive guidance every step of the way. You are never doing this alone.",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    img: growAsset.url,
    title: "Grow",
    desc: "Confidence builds. Skills deepen. The child who once struggled begins to lead.",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </svg>
    ),
  },
  {
    img: thriveAsset.url,
    title: "Thrive",
    desc: "Achievement follows understanding. Futures open up. This is what education was always supposed to feel like.",
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M8 21h8M12 17v4M7 4h10l-1 8a4 4 0 0 1-8 0L7 4z" />
        <path d="M17 5h3a2 2 0 0 1-2 4M7 5H4a2 2 0 0 0 2 4" />
      </svg>
    ),
  },
];

const DashArrow = () => (
  <svg
    aria-hidden="true"
    width="80"
    height="16"
    viewBox="0 0 80 16"
    fill="none"
    className="hidden lg:block absolute top-1/2 -right-12 -translate-y-1/2 pointer-events-none"
  >
    <path
      d="M2 8 H68"
      stroke={ACCENT}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="6 6"
    />
    <path
      d="M64 3 L72 8 L64 13"
      stroke={ACCENT}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default function P2LearningJourney() {
  return (
    <section
      style={{ backgroundColor: BG, fontFamily: "'Lato', system-ui, sans-serif" }}
      className="w-full py-20 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p
            className="text-xs tracking-[0.2em] uppercase font-semibold mb-3"
            style={{ color: ACCENT }}
          >
            How it works
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: INK }}
          >
            The P² Learning Journey
          </h2>
          <p className="text-base md:text-lg" style={{ color: MUTED }}>
            A personalised journey, built around your child.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 sm:gap-y-14">
          {steps.map((s, i) => {
            const isLastInRow = (i + 1) % 3 === 0;
            const isLast = i === steps.length - 1;
            const showArrow = !isLastInRow && !isLast;
            return (
              <div key={s.title} className="relative flex flex-col items-center text-center">
                <div className="relative w-full overflow-hidden rounded-2xl aspect-[4/3]">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-bottom"
                  />
                  {showArrow && <DashArrow />}
                </div>
                <h3
                  className="mt-8 text-xl font-bold"
                  style={{ color: INK }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-sm md:text-base leading-relaxed max-w-xs"
                  style={{ color: MUTED }}
                >
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

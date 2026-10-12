import { Link } from "react-router-dom";
import bookPhatsimo from "@/assets/book-inventor.jpg.asset.json";
import bookPoet from "@/assets/book-poet.jpg.asset.json";

const GREEN = "#10B981";
const INK = "#0a1726";
const AMBER = "#e8861a";
const BODY = "#3f4a55";
const PANEL = "#0b1619";

type TrustItem = { label: string[]; icon: JSX.Element };
type Guide = { cover: string; accent: string; title: string[]; sub: string[]; desc: string; pages: string };

const iconStyle: React.CSSProperties = {
  width: 22,
  height: 22,
  strokeWidth: 1.8,
  stroke: GREEN,
  fill: "none",
};

const trust: TrustItem[] = [
  {
    label: ["Built around", "what your", "child loves"],
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M12 21s-7-4.5-9.5-9.2C.8 8.3 3 4 7 4c2 0 3.5 1 5 2.5C13.5 5 15 4 17 4c4 0 6.2 4.3 4.5 7.8C19 16.5 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: ["Aligned to their", "existing school", "curriculum"],
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M4 5h12a3 3 0 013 3v11H7a3 3 0 01-3-3V5z" />
        <path d="M4 5v11a3 3 0 003 3" />
      </svg>
    ),
  },
  {
    label: ["Sent to your", "WhatsApp", "once the waitlist opens"],
    icon: (
      <svg viewBox="0 0 24 24" style={iconStyle}>
        <path d="M20 12a8 8 0 11-3.2-6.4L20 4l-1 3.2A8 8 0 0120 12z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const guides: Guide[] = [
  {
    cover: bookPhatsimo.url,
    accent: GREEN,
    title: ["The Inventor's Method"],
    sub: ["Mathematics • Grade 4", "Compensation Method"],
    desc: "A mission-based lesson that makes numbers make sense.",
    pages: "8 PAGES • 20 MINUTES",
  },
  {
    cover: bookPoet.url,
    accent: AMBER,
    title: ["The Poet and", "the Protest"],
    sub: ["English • Grade 4", "Wild Forces of Language"],
    desc: "Explore powerful language through story, voice and real-world context.",
    pages: "7 PAGES • 25 MINUTES",
  },
];

const Clock = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: color, fill: "none", strokeWidth: 1.8 }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = ({ color = "#ffffff" }: { color?: string }) => (
  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: color, fill: "none", strokeWidth: 2.5 }}>
    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "#ffffff", fill: "none", strokeWidth: 2 }}>
    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function StudySmarter() {
  return (
    <div style={{ background: "#ffffff", color: INK, fontFamily: "Lato, system-ui, sans-serif", padding: "64px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="ss-top"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 64,
            alignItems: "start",
            padding: "0 8px",
          }}
        >
          {/* LEFT */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(16,185,129,0.08)",
                color: GREEN,
                borderRadius: 999,
                padding: "8px 14px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                border: "1px solid rgba(16,185,129,0.25)",
                marginBottom: 22,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: GREEN }} />
              BUILT AROUND YOUR CHILD. ALIGNED TO THEIR SCHOOL.
            </div>

            <h2
              style={{
                fontSize: "clamp(34px, 4.4vw, 54px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: 0,
                color: INK,
              }}
            >
              Most parents help
              <br />their child study harder.
              <br />
              <span style={{ color: GREEN, position: "relative", display: "inline-block" }}>
                We help them study smarter.
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -6,
                    height: 4,
                    background: "rgba(16,185,129,0.3)",
                    borderRadius: 2,
                  }}
                />
              </span>
            </h2>

            <div style={{ marginTop: 28, color: BODY, fontSize: 16, lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 16px" }}>
                Your child already has a school, a curriculum, and a teacher. What they don't have is learning that feels like it was built for them.
              </p>
              <p style={{ margin: 0 }}>
                In 5 minutes, tell us what your child loves and where they struggle. P² builds their first personalised digital learning guide — aligned to their school curriculum, built around the characters and worlds that light them up.
              </p>
            </div>

            <div style={{ marginTop: 28 }}>
              <p style={{ color: INK, fontWeight: 800, fontSize: 17, margin: "0 0 6px" }}>
                Not a worksheet. Not extra homework.
              </p>
              <div style={{ display: "inline-block", position: "relative" }}>
                <p style={{ color: GREEN, fontWeight: 800, fontSize: 18, margin: 0 }}>
                  A world where your child is the main character.
                </p>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -4,
                    height: 3,
                    background: "rgba(16,185,129,0.3)",
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {trust.map((t, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: "rgba(16,185,129,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {t.icon}
                  </div>
                  <div style={{ color: INK, fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
                    {t.label.map((l, j) => (
                      <div key={j}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={{
              background: PANEL,
              borderRadius: 24,
              padding: 32,
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: GREEN }} />
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 800,
                }}
              >
                THIS IS WHAT YOUR CHILD
                <br />WILL RECEIVE ONCE THE WAITLIST OPENS
              </p>
            </div>

            <div className="ss-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {guides.map((g, i) => (
                <div
                  key={i}
                  style={{
                    background: "#10222a",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: `1px solid rgba(255,255,255,0.06)`,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img src={g.cover} alt={`${g.title.join(" ")} study guide cover`} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                  <div style={{ padding: 16 }}>
                    <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>
                      Sample Digital Guide
                    </p>
                    <h3 style={{ margin: "8px 0 6px", fontSize: 18, fontWeight: 800, lineHeight: 1.2, color: g.accent }}>
                      {g.title.map((l, j) => (
                        <span key={j}>
                          {l}
                          {j < g.title.length - 1 && <br />}
                        </span>
                      ))}
                    </h3>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: 10 }}>
                      {g.sub.map((l, j) => (
                        <div key={j}>{l}</div>
                      ))}
                    </div>
                    <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{g.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, letterSpacing: "0.14em", color: g.accent, fontWeight: 800 }}>
                      <Clock color={g.accent} />
                      {g.pages}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: GREEN }} />
              <p style={{ margin: 0, fontFamily: "'Caveat', cursive", fontSize: 22, color: "rgba(255,255,255,0.9)" }}>
                Your child's name. Their hero. Their lesson.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div
          className="ss-cta"
          style={{
            marginTop: 48,
            background: INK,
            borderRadius: 24,
            padding: "32px 40px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(16,185,129,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock color={GREEN} />
            </span>
            <div>
              <p style={{ margin: 0, color: "#fff", fontWeight: 800, fontSize: 20 }}>Start in 5 minutes.</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 14 }}>See your child's world come to life.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <Link
              to="/waitlist"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: GREEN,
                color: "#fff",
                fontWeight: 800,
                padding: "14px 24px",
                borderRadius: 12,
                textDecoration: "none",
                fontSize: 16,
                border: "none",
                cursor: "pointer",
              }}
            >
              Join the Learner Blueprint Waitlist
              <Arrow />
            </Link>
            <div style={{ display: "flex", gap: 16, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700 }}>
              {[
                { t: "Safe." },
                { t: "Secure." },
                { t: "No qualifications needed." },
              ].map((a) => (
                <span key={a.t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <CheckIcon color={GREEN} />
                  {a.t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
        @media (max-width: 1100px) {
          .ss-top { grid-template-columns: 1fr !important; gap: 48px !important; }
          .ss-cta { grid-template-columns: 1fr !important; gap: 22px !important; }
        }
        @media (max-width: 768px) {
          .ss-top { padding: 0 !important; }
          .ss-cta { padding: 20px !important; }
          .ss-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

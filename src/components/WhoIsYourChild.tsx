import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import heroMotherSon from "@/assets/hero-mother-son.jpg.asset.json";
import boyWriting from "@/assets/boy-writing.jpg.asset.json";

const EMERALD = "#10B981";
const NAVY = "#0F172A";
const CREAM = "#F5F0E8";

const trust = ["Grades 4 – 7", "CAPS · IEB · Cambridge", "Join the waitlist - we open soon"];

const cardRows: { label: string; strike?: boolean }[] = [
  { label: "Not a test.", strike: true },
  { label: "Not a diagnosis.", strike: true },
  { label: "Not a label.", strike: true },
];

const responsiveCSS = `
.wiyc-hero-inner { display: flex; position: relative; overflow: hidden; min-height: 560px; background: #061525; }
@media (max-width: 768px) {
  .wiyc-hero-inner { flex-direction: column; min-height: auto !important; }
  .wiyc-hero-photo { position: relative !important; width: 100% !important; height: 260px !important; top: auto !important; right: auto !important; bottom: auto !important; left: auto !important; object-position: center top !important; }
  .wiyc-hero-overlay { display: none !important; }
  .wiyc-hero-text { width: 100% !important; padding: 28px 20px 40px !important; background: #061525 !important; }
  .wiyc-hero-text h1 { white-space: normal !important; font-size: 36px !important; }
  .wiyc-hero-cta { font-size: 16px !important; padding: 15px 20px !important; width: 100% !important; box-sizing: border-box !important; justify-content: center !important; }
  .wiyc-trust { gap: 12px !important; }
  .wiyc-sep { display: none !important; }
  .wiyc-below-grid { grid-template-columns: 1fr !important; padding: 36px 20px 48px !important; gap: 28px !important; }
  .wiyc-below-photo { height: 240px !important; width: 100% !important; }
  .wiyc-card { padding: 28px 20px !important; }
}
@media (min-width: 769px) and (max-width: 1024px) {
  .wiyc-hero-text h1 { white-space: normal !important; font-size: clamp(32px, 5vw, 52px) !important; }
  .wiyc-below-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; padding: 48px 32px !important; }
  .wiyc-below-photo { height: 300px !important; }
}
`;

export default function WhoIsYourChild() {
  return (
    <div style={{ fontFamily: "Lato, system-ui, sans-serif" }}>
      {/* HERO */}
      <section style={{ background: "#061525", color: "#fff", overflow: "hidden" }}>
        <div className="wiyc-hero-inner">
          {/* photo */}
          <img
            className="wiyc-hero-photo"
            src={heroMotherSon.url}
            alt="Mother helping her son write at a desk"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "85% center",
              zIndex: 1,
            }}
          />
          {/* gradient overlay */}
          <div
            className="wiyc-hero-overlay"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              background:
                "linear-gradient(to right, #061525 0%, #061525 30%, rgba(6,21,37,0.7) 48%, rgba(6,21,37,0.15) 65%, transparent 80%)",
            }}
          />
          {/* text */}
          <div
            className="wiyc-hero-text"
            style={{ position: "relative", zIndex: 3, width: "54%", padding: "60px 0 60px 52px" }}
          >
            <div
              style={{
                color: EMERALD,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Your Child's Learner Blueprint
            </div>
            <h1
              style={{
                fontSize: "clamp(40px, 5.2vw, 64px)",
                fontWeight: 800,
                lineHeight: 1.05,
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              Who Is Your Child?
            </h1>
            <div style={{ marginTop: 22, fontSize: 17, lineHeight: 1.7, color: "#CBD5E1", maxWidth: 480 }}>
              <p style={{ margin: 0 }}>Most parents know their child's marks.</p>
              <p style={{ margin: 0 }}>Few understand how they think, learn and grow.</p>
              <p style={{ margin: "12px 0 0", color: "#fff", fontWeight: 600 }}>This blueprint changes that.</p>
            </div>
            <Link
              to="/waitlist"
              className="wiyc-hero-cta"
              style={{
                marginTop: 30,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: EMERALD,
                color: "#fff",
                padding: "16px 28px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 17,
                textDecoration: "none",
              }}
            >
              Join the Learner Blueprint Waitlist
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div
              className="wiyc-trust"
              style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}
            >
              {trust.map((t, i) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  {i > 0 && (
                    <span
                      className="wiyc-sep"
                      style={{ width: 1, height: 16, background: "#334155", display: "inline-block" }}
                    />
                  )}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#CBD5E1", fontSize: 14 }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: EMERALD }} />
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BELOW */}
      <section style={{ background: CREAM }}>
        <div
          className="wiyc-below-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr 1fr",
            gap: 40,
            padding: "72px 48px",
            maxWidth: 1240,
            margin: "0 auto",
            alignItems: "center",
          }}
        >
          {/* left text */}
          <div>
            <div
              style={{
                color: EMERALD,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Before the marks
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.6vw, 40px)", fontWeight: 800, color: NAVY, margin: 0, lineHeight: 1.15 }}>
              There is a child.
            </h2>
            <p style={{ marginTop: 18, color: "#374151", fontSize: 16, lineHeight: 1.75 }}>
              Before there are grades, there is a child trying to make sense of the world.
            </p>
            <div style={{ marginTop: 16, color: "#374151", fontSize: 15, lineHeight: 1.8 }}>
              <p style={{ margin: "6px 0" }}>A child with strengths that haven't been named yet.</p>
              <p style={{ margin: "6px 0" }}>Questions nobody has thought to ask.</p>
              <p style={{ margin: "6px 0" }}>Frustrations that look like laziness but aren't.</p>
              <p style={{ margin: "6px 0" }}>
                A way of thinking that no report card has ever captured.
              </p>
            </div>
          </div>

          {/* middle photo */}
          <img
            className="wiyc-below-photo"
            src={boyWriting.url}
            alt="Young boy writing thoughtfully in a notebook"
            style={{ width: "100%", height: 380, objectFit: "cover", borderRadius: 16 }}
          />

          {/* right card */}
          <div
            className="wiyc-card"
            style={{
              background: "#FCFAF6",
              border: "1px solid #E7E1D4",
              borderRadius: 18,
              padding: "36px 30px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {cardRows.map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#FEE2E2",
                      color: "#DC2626",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <X className="w-4 h-4" strokeWidth={3} />
                  </span>
                  <span style={{ color: "#64748B", fontSize: 16, textDecoration: "line-through" }}>{r.label}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "#E7E1D4", margin: "22px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle2 className="w-6 h-6" style={{ color: EMERALD }} />
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: NAVY }}>It is a portrait.</h3>
            </div>
            <p style={{ marginTop: 12, color: "#374151", fontSize: 15, lineHeight: 1.7 }}>
              A snapshot of how your child currently thinks, learns and engages with the world.
            </p>
          </div>
        </div>
      </section>

      <style type="text/css">{responsiveCSS}</style>
    </div>
  );
}

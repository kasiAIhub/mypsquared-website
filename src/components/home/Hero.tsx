import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroDesktop from "@/assets/homepage-hero-desktop.webp.asset.json";
import heroMobile from "@/assets/homepage-hero-mobile.webp.asset.json";

const EMERALD = "#10B981";
const NAVY = "#0F172A";
const CREAM = "#F5F0E8";
const MUTED = "#CBD5E1";

const Hero = () => {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        background: NAVY,
        fontFamily: "Lato, system-ui, sans-serif",
      }}
      className="psq-home-hero"
    >
      <style>{`
        .psq-home-hero .psq-hero-btn-primary { background: ${EMERALD}; color: ${NAVY}; }
        .psq-home-hero .psq-hero-btn-primary:hover { background: #059669; }
        .psq-home-hero .psq-hero-btn-dbe { background: ${EMERALD}; color: ${NAVY}; }
        .psq-home-hero .psq-hero-btn-dbe:hover { background: #059669; }
        .psq-home-hero .psq-hero-btn-outline { background: transparent; color: ${CREAM}; border: 2px solid ${EMERALD}; }
        .psq-home-hero .psq-hero-btn-outline:hover { background: ${EMERALD}; color: ${NAVY}; }

      `}</style>


      <div className="psq-hero-overlay" aria-hidden="true" />
      <div className="psq-phone-image-extension" aria-hidden="true">
        <img src={heroMobile.url} alt="" decoding="async" />
      </div>
      <div className="psq-phone-hero-content">
        <h1>
          Daily lesson plans<br />
          built around your child.<br />
          <span>Sent straight to your WhatsApp.</span>
        </h1>
        <div className="psq-phone-hero-buttons">
          <Button asChild className="psq-phone-teal-button">
            <Link to="/waitlist">Join the Waitlist for Daily Lesson Plans →</Link>
          </Button>
          <Button asChild className="psq-phone-teal-button">
            <Link to="/dbe-registration">Start Your DBE Registration →</Link>
          </Button>
          <Button asChild className="psq-phone-guide-button">
            <Link to="/assessment">Get the free Readiness Guide →</Link>
          </Button>
        </div>
        <ul>
          <li><span aria-hidden="true">✓</span> Built around who your child actually is</li>
          <li><span aria-hidden="true">✓</span> Fresh daily plan on WhatsApp</li>
          <li><span aria-hidden="true">✓</span> Waitlist opens soon</li>
        </ul>
      </div>

      <div
        className="psq-hero-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          paddingTop: 120,
          paddingBottom: 80,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 580, width: "100%" }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: CREAM,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >

            Every Child Is Unique.
            <br />
            <span style={{ color: EMERALD }}>Their Learning Journey</span>
            <br />
            <span style={{ color: EMERALD }}>Should Be Too.</span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: MUTED,
              lineHeight: 1.75,
              maxWidth: 520,
              marginBottom: 32,
            }}
          >
            Whether your child is in school or learning at home, P² is building a personalised daily lesson plan around who they are, matched to their curriculum and sent to your WhatsApp. Join the waitlist to be first in. Homeschooling parents: start with the free Homeschool Readiness Guide to find your path first.
          </p>

          <div className="psq-hero-ctas" style={{ display: "flex", flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
            <Link
              to="/waitlist"
              className="psq-hero-btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 28px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.15s",
                flex: "1 1 auto",
              }}
            >
              Join the Learner Blueprint Waitlist →
            </Link>
            <Link
              to="/dbe-registration"
              className="psq-hero-btn-dbe"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 28px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.15s",
                flex: "1 1 auto",
              }}
            >
              Start Your DBE Registration →
            </Link>
          </div>

          <div className="psq-hero-row2" style={{ marginTop: 16, textAlign: "center" }}>
            <Link
              to="/assessment"
              className="psq-hero-btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "15px 28px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              Or start with the free Homeschool Readiness Guide →
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "center",
              marginTop: 24,
              fontSize: 13,
              color: "#CBD5E1",
            }}
          >
            <span><span style={{ color: EMERALD, fontWeight: 700 }}>✓</span> Built around your child</span>
            <span><span style={{ color: EMERALD, fontWeight: 700 }}>✓</span> Daily lesson plans on WhatsApp</span>
            <span><span style={{ color: EMERALD, fontWeight: 700 }}>✓</span> Join the waitlist - we open soon</span>
          </div>
        </div>
      </div>
      <picture className="psq-hero-picture">
        <source media="(max-width: 767px)" srcSet={heroMobile.url} width={1200} height={1500} />
        <img
          src={heroDesktop.url}
          alt="A young South African teenager with a P² backpack looking out over a glowing landscape toward a futuristic city at sunset."
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1280}
          className="psq-hero-bg"
        />
      </picture>
    </section>
  );
};

export default Hero;

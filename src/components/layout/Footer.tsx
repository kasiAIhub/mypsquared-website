import { MessageCircle } from "lucide-react";
import { DEFAULT_WHATSAPP_MESSAGE, getWhatsAppFallbackHref, openWhatsApp } from "@/lib/whatsapp";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=27818905861&text=Hi%20P-Squared%2C%20I%20need%20help%20with%20homeschooling";
const WHATSAPP_BARE = "https://api.whatsapp.com/send?phone=27818905861";

const linkBase: React.CSSProperties = {
  color: "rgba(255,255,255,0.65)",
  textDecoration: "none",
  fontSize: 14,
  lineHeight: 2,
  transition: "color 0.15s ease",
  display: "inline-block",
};

const headingStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#10B981",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 16,
};

function FooterLink({
  href,
  children,
  external = false,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      style={linkBase}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#10B981")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0F172A",
        color: "#FFFFFF",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        width: "100%",
      }}
    >
      <style>{`
        .psq-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 48px 32px;
        }
        .psq-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 48px;
        }
        .psq-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin-top: 40px;
        }
        .psq-footer-legal { display: flex; gap: 20px; }
        .psq-footer-center { display: flex; gap: 6px; align-items: center; }
        .psq-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 10px 16px;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          background: transparent;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .psq-wa-btn:hover {
          border-color: rgba(16,185,129,0.5);
          background: rgba(16,185,129,0.05);
        }
        .psq-legal-link {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.15s;
        }
        .psq-legal-link:hover { color: rgba(255,255,255,0.7); }
        @media (max-width: 768px) {
          .psq-footer-inner { padding: 40px 20px 24px; }
          .psq-footer-grid { grid-template-columns: 1fr; gap: 36px; }
          .psq-wa-btn { width: 100%; justify-content: center; }
          .psq-footer-bottom { flex-direction: column; text-align: center; }
          .psq-footer-legal { justify-content: center; flex-wrap: wrap; }
        }
      `}</style>

      <div className="psq-footer-inner">
        <div className="psq-footer-grid">
          {/* COLUMN 1 — BRAND */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#10B981" }}>P²</span>
              <span style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 600 }}>Education = You²</span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                maxWidth: 240,
                marginTop: 10,
              }}
            >
              The child is the universal constant. Everything else bends to fit them.
            </p>

            <a
              href={getWhatsAppFallbackHref()}
              className="psq-wa-btn"
              style={{ marginTop: 20 }}
              onClick={(e) => {
                e.preventDefault();
                openWhatsApp(DEFAULT_WHATSAPP_MESSAGE);
              }}
            >
              <MessageCircle size={16} />
              Chat with us on WhatsApp
            </a>

            <p
              style={{
                marginTop: 20,
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Powered by kasiAIhub
            </p>
          </div>

          {/* COLUMN 2 — GET STARTED */}
          <div>
            <h4 style={headingStyle}>GET STARTED</h4>
            <nav style={{ display: "flex", flexDirection: "column" }}>
              <FooterLink href="/assessment">Free Child Assessment</FooterLink>
              <FooterLink href="/learner-blueprint">Learner Blueprint</FooterLink>
              <FooterLink href="/dbe-registration">DBE Registration — R999</FooterLink>
            </nav>
            <div
              style={{
                marginTop: 12,
                display: "inline-block",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 11,
                color: "#10B981",
                fontWeight: 500,
              }}
            >
              ✓ Free assessment — takes 5 minutes
            </div>
          </div>

          {/* COLUMN 3 — LEARN MORE */}
          <div>
            <h4 style={headingStyle}>LEARN MORE</h4>
            <nav style={{ display: "flex", flexDirection: "column" }}>
              <FooterLink href="/about">Our Story</FooterLink>
              <FooterLink href="/about#how-it-started">How It Works</FooterLink>
              <FooterLink href="/learner-blueprint">Learner Blueprint</FooterLink>
              <FooterLink href="/dbe-registration">DBE Registration Guide</FooterLink>
              <FooterLink href="/blog">Resources</FooterLink>
            </nav>
          </div>

          {/* COLUMN 4 — SUPPORT */}
          <div>
            <h4 style={headingStyle}>SUPPORT</h4>
            <nav style={{ display: "flex", flexDirection: "column" }}>
              <FooterLink
                href={getWhatsAppFallbackHref()}
                onClick={(e) => {
                  e.preventDefault();
                  openWhatsApp(DEFAULT_WHATSAPP_MESSAGE);
                }}
              >
                Chat on WhatsApp
              </FooterLink>
              <FooterLink href="/dbe-registration">DBE Registration Help</FooterLink>
            </nav>
            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.8,
              }}
            >
              <div>+27 81 890 5861</div>
              <div>info@mypsquared.com</div>
              <div>mypsquared.com</div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="psq-footer-bottom">
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            © 2026 P-Squared Education. Powered by kasiAIhub. All rights reserved.
          </div>
          <div className="psq-footer-center">
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>mypsquared.com</span>
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "inline-block",
              }}
            />
          </div>
          <div className="psq-footer-legal">
            <a href="#" className="psq-legal-link">
              Privacy Policy
            </a>
            <a href="#" className="psq-legal-link">
              Terms of Use
            </a>
            <a href="#" className="psq-legal-link">
              DBE Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

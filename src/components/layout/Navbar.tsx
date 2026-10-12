import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=27818905861";

const WhatsAppIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.057 23.882l6.195-1.624A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.677.964.981-3.584-.234-.369A9.818 9.818 0 1112 21.818z"/>
  </svg>
);

type DropdownItem = { label: string; href: string };
type NavItem =
  | { label: string; type: "route"; href: string }
  | { label: string; type: "dropdown"; overviewHref?: string; items: DropdownItem[] };

const NAV_ITEMS: NavItem[] = [
  { label: "For School Parents", type: "route", href: "/for-mainstream-parents" },
  {
    label: "For Homeschoolers",
    type: "dropdown",
    overviewHref: "/for-homeschoolers",
    items: [
      { label: "Homeschool Readiness Guide", href: "/assessment" },
      { label: "DBE Registration", href: "/dbe-registration" },
    ],
  },
  { label: "Learner Blueprint", type: "route", href: "/learner-blueprint" },
  { label: "About P²", type: "route", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const onHome = location.pathname === "/";
  const onCurriculum = (location.pathname === "/curriculum" || location.pathname === "/learner-blueprint");
  const transparentOverlay = onHome || onCurriculum;

  useEffect(() => {
    if (!openDropdown) return;
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [openDropdown]);

  const wrapperClass = transparentOverlay
    ? "absolute top-0 left-0 right-0 bg-transparent z-50"
    : "fixed top-0 left-0 right-0 bg-[#0F172A] z-50 border-b border-white/5";

  const innerClass = onCurriculum
    ? "w-full pl-[52px] pr-4 sm:pr-6 lg:pr-8"
    : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

  return (
    <nav className={`${wrapperClass}${onHome ? " psq-home-nav" : ""}`}>
      <div className={innerClass}>
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-3xl md:text-5xl font-extrabold text-[#10b981] leading-none">P²</span>
            <span className="block text-[7px] sm:text-[11px] leading-tight tracking-[0.16em] sm:tracking-[0.18em] uppercase text-[#10b981] font-semibold">
              Personalised<br />Learning System
            </span>
          </Link>


          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              if (item.type === "route") {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="px-4 py-2 text-[10px] lg:text-base text-white/85 hover:text-white transition font-medium"
                  >
                    {item.label}
                  </Link>
                );
              }
              const isOpen = openDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="relative flex items-center"
                  ref={isOpen ? dropdownRef : undefined}
                >
                  {item.overviewHref ? (
                    <Link
                      to={item.overviewHref}
                      className="pl-4 pr-1 py-2 text-[10px] lg:text-base text-white/85 hover:text-white transition font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="pl-4 pr-1 py-2 text-[10px] lg:text-base text-white/85 font-medium">
                      {item.label}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label={`Toggle ${item.label} menu`}
                    className="pr-3 py-2 text-white/85 hover:text-white transition"
                  >
                    <ChevronDown className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5" />
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 top-full pt-1 min-w-[240px]">
                      <div className="bg-[#0F172A] rounded-md shadow-lg border border-white/10 py-1">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            className="block px-4 py-2.5 text-sm text-white/85 hover:bg-white/5 hover:text-white"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              to="/waitlist"
              className="ml-2 hidden lg:inline-flex items-center justify-center bg-[#10b981] hover:brightness-110 text-white font-semibold rounded-md transition"
              style={{ padding: "8px 16px", fontSize: 13 }}
            >
              Join the Waitlist
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat with us on WhatsApp"
              aria-label="Chat with us on WhatsApp"
              className="ml-2 hidden md:flex items-center justify-center"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(37, 211, 102, 0.15)",
                border: "1px solid rgba(37, 211, 102, 0.4)",
                cursor: "pointer",
              }}
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col bg-[#0F172A]">
            {NAV_ITEMS.map((item) => {
              if (item.type === "route") {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-white/85 hover:bg-white/5 rounded transition"
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.label} className="px-3 py-2" style={{ marginTop: 12, marginBottom: 16 }}>
                  {item.overviewHref ? (
                    <Link
                      to={item.overviewHref}
                      onClick={() => setOpen(false)}
                      className="block text-[11px] uppercase tracking-wider font-semibold text-white/70 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-white/50">
                      {item.label}
                    </div>
                  )}
                  <div className="mt-2 flex flex-col" style={{ paddingLeft: 16 }}>
                    {item.items.map((sub, subIdx) => (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        onClick={() => setOpen(false)}
                        className="px-2 py-2 text-white/85 hover:bg-white/5 rounded"
                        style={{ marginBottom: subIdx === item.items.length - 1 ? 0 : 8 }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            <Link
              to="/waitlist"
              onClick={() => setOpen(false)}
              className="md:hidden mt-3 bg-[#10b981] text-white text-center font-semibold px-5 py-3 rounded-md"
            >
              Join the Waitlist
            </Link>
            <Link
              to="/dbe-registration"
              onClick={() => setOpen(false)}
              className="md:hidden mt-2 border border-[#10b981] text-[#10b981] text-center font-semibold px-5 py-3 rounded-md"
            >
              DBE Registration for Homeschooling
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
              style={{
                width: "100%",
                background: "rgba(37, 211, 102, 0.15)",
                border: "1px solid rgba(37, 211, 102, 0.4)",
                borderRadius: "8px",
                padding: "13px",
                color: "#25D366",
                fontSize: "13px",
                fontWeight: 600,
                marginTop: "10px",
              }}
            >
              <WhatsAppIcon size={16} />
              Chat with us on WhatsApp
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

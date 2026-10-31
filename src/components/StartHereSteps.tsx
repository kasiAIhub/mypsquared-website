import { Link } from "react-router-dom";

interface Step {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  external: boolean;
}

const STEPS: Step[] = [
  {
    title: "Start with the free homeschool readiness check on mypsquared.",
    body: "It takes 5 minutes and gives you a report on how your child learns, so you know what will fit them.",
    href: "/assessment",
    linkLabel: "Take the free readiness check",
    external: false,
  },
  {
    title: "Once you have the report, the next step is your DBE registration so you're ready for next year.",
    body: "We prepare the full package for you, you submit it, and we help you keep track of it.",
    href: "/dbe-registration",
    linkLabel: "See DBE registration",
    external: false,
  },
  {
    title: "If you have older children in Grade 4 or higher, they can try Teacher Alex, our exam-prep buddy.",
    body: "Your little one's turn will come.",
    href: "https://alex.mypsquared.com",
    linkLabel: "Meet Teacher Alex",
    external: true,
  },
];

export default function StartHereSteps() {
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 20 }}>
      {STEPS.map((step, i) => (
        <li key={step.href} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#10B981",
              color: "#0F172A",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            {i + 1}
          </span>
          <div>
            <p style={{ margin: 0, color: "#F5F0E8", fontWeight: 600, lineHeight: 1.5 }}>{step.title}</p>
            <p style={{ margin: "6px 0 10px", color: "#94A3B8", lineHeight: 1.6 }}>{step.body}</p>
            {step.external ? (
              <a
                href={step.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#10B981", fontWeight: 600, textDecoration: "underline" }}
              >
                {step.linkLabel}
              </a>
            ) : (
              <Link to={step.href} style={{ color: "#10B981", fontWeight: 600, textDecoration: "underline" }}>
                {step.linkLabel}
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

import { Link } from "react-router-dom";
import { Home, School } from "lucide-react";

export default function TwoPaths() {
  return (
    <section className="bg-[#F5F0E8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* LEFT — dark panel */}
        <div className="bg-[#0F172A] rounded-2xl p-8 lg:p-10">
          <h3 className="font-serif text-2xl sm:text-3xl text-white">
            For Every Kind of Parent
          </h3>
          <div className="mt-1 text-[13px] text-[#FBBF24] italic">
            One system. <span className="text-[#10B981] not-italic font-semibold">Two paths.</span> The same goal.
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-8">
            <div>
              <School className="w-7 h-7 text-[#10B981]" />
              <div
                className="mt-3 text-[#10B981] uppercase font-semibold"
                style={{ fontSize: 10, letterSpacing: "0.12em" }}
              >
                FOR SCHOOL PARENTS
              </div>
              <h4
                className="text-white"
                style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, marginTop: 8 }}
              >
                Your child is in school. But something isn't adding up.
              </h4>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginTop: 8,
                  color: "rgba(245,240,232,0.6)",
                }}
              >
                Personalised learning support. Built around who your child is. Delivered to your WhatsApp.
              </p>
              <Link
                to="/for-mainstream-parents"
                className="text-[#10B981] hover:text-emerald-300"
                style={{ display: "block", fontSize: 13, fontWeight: 500, marginTop: 16 }}
              >
                Build Their Learning World →
              </Link>
            </div>

            <div>
              <Home className="w-7 h-7 text-[#10B981]" />
              <div
                className="mt-3 text-[#10B981] uppercase font-semibold"
                style={{ fontSize: 10, letterSpacing: "0.12em" }}
              >
                FOR HOMESCHOOLING PARENTS
              </div>
              <h4
                className="text-white"
                style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, marginTop: 8 }}
              >
                You've decided to put your child first.
              </h4>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginTop: 8,
                  color: "rgba(245,240,232,0.6)",
                }}
              >
                Assessment. Curriculum match. DBE registration. Daily learning coach. All in one place.
              </p>
              <Link
                to="/for-homeschoolers"
                className="text-[#10B981] hover:text-emerald-300"
                style={{ display: "block", fontSize: 13, fontWeight: 500, marginTop: 16 }}
              >
                Start Here →
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT — curricula */}
        <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-8 lg:p-10">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#0F172A]">
            Supporting Every Learning Path
          </h3>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Aligned with leading curricula.
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { emoji: "🇿🇦", title: "CAPS", sub: "Curriculum Assessment Policy Statements" },
              { emoji: "🛡️", title: "IEB", sub: "Independent Examinations Board" },
              { emoji: "🎓", title: "Cambridge", sub: "Cambridge Assessment International Education" },
            ].map((c) => (
              <div
                key={c.title}
                className="flex flex-col border border-[#0F172A]/10 rounded-lg p-4"
              >
                <div className="text-xl">{c.emoji}</div>
                <div className="mt-2 text-sm font-bold text-[#0F172A]">{c.title}</div>
                <div className="mt-1 text-[11px] text-[#64748B] leading-snug flex-1">{c.sub}</div>
                <Link
                  to="/learner-blueprint"
                  className="mt-3 text-[12px] font-semibold text-[#0F172A] hover:text-[#10B981]"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

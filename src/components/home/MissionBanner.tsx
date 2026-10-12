import { Link } from "react-router-dom";
import bg from "@/assets/mission-father-son.jpg";

export default function MissionBanner() {
  return (
    <section className="relative bg-[#0F172A] overflow-hidden">
      <img
        src={bg}
        alt="Father and son learning together at home"
        width={1920}
        height={1080}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/85 via-[#0F172A]/40 to-[#0F172A]/70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-5xl text-white leading-[1.1]">
            Your Child Is More
            <br />
            Than a Report Card.
          </h2>
          <p className="mt-5 text-[15px] text-[#F5F0E8] leading-relaxed max-w-md">
            Behind every mark is a unique learner.<br />
            A unique story. A unique future.<br />
            P² helps you discover it.
          </p>
          <Link
            to="/waitlist"
            className="mt-6 inline-flex items-center gap-2 bg-[#FBBF24] hover:bg-[#f5b011] text-[#0F172A] font-semibold px-6 py-3.5 rounded-md transition"
          >
            Join the Learner Blueprint Waitlist <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative lg:pl-12">
          <span aria-hidden className="absolute -top-6 -left-2 text-[80px] leading-none text-white/40 font-serif select-none">"</span>
          <blockquote className="text-[20px] text-white leading-relaxed max-w-sm">
            Every child deserves<br />
            to be understood<br />
            before they are<br />
            evaluated.
          </blockquote>
        </div>
      </div>
    </section>
  );
}

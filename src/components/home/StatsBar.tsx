const STATS = [
  {
    number: "1 in 2",
    label: "Children who started Grade 1 in 2013 never passed matric in 2024",
    source: "Real pass rate: 50% · DBE 2024",
  },
  {
    number: "590k",
    label: "Young people who dropped out before reaching Grade 12",
    source: "From 1.2M who started · Class of 2024",
  },
  {
    number: "<15%",
    label: "Of Grade 1 starters will ever enrol at university",
    source: "BOSA 2025 · DBE throughput data",
  },
  {
    number: "62%",
    label: "Improvement in outcomes with adaptive personalised learning",
    source: "Backed by research",
  },
];

export default function StatsBar() {
  return (
    <section className="bg-[#F9FAFB] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s) => (
          <div key={s.number}>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] leading-none">
              {s.number}
            </div>
            <div className="mt-3 text-sm text-gray-600 leading-relaxed">
              {s.label}
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#10B981]">
              {s.source}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface DBEHeroProps {
  onCtaClick: () => void;
}

export default function DBEHero({ onCtaClick }: DBEHeroProps) {
  return (
    <section className="bg-[#0F172A] text-[#F5F0E8] py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Get Officially Registered. Get it Right.
        </h1>
        <p className="text-xl text-[#F5F0E8]/80 max-w-[700px] mx-auto mb-8">
          We prepare your complete DBE home education registration package — province-ready, legally correct. R999 once-off. You submit it. We track it.
        </p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 items-center sm:justify-center mt-6 mb-8 w-full px-4 sm:w-auto sm:px-0">
          {['Documents prepared to DBE specification', 'R999 Once-Off', 'Ready within 24hrs of payment'].map((stat) => (

            <span
              key={stat}
              className="bg-[#10B981] text-white font-semibold text-sm px-4 py-2 rounded-full w-full sm:w-auto text-center"
            >
              {stat}
            </span>
          ))}
        </div>

        <button
          onClick={onCtaClick}
          className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-lg px-8 py-3 rounded-lg transition mb-4"
        >
          Start My Application
        </button>

        <p className="text-[#94A3B8] text-sm max-w-md mx-auto">
          You submit your own application directly to the DBE. This protects your rights as a parent.
        </p>
      </div>
    </section>
  );
}

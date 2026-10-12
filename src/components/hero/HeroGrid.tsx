import { useState } from "react";
import { HeroTile } from "./HeroTile";
import { ServiceModal } from "./ServiceModal";
import { heroServices, HeroService } from "@/lib/heroServices";

export const HeroGrid = () => {
  const [selectedService, setSelectedService] = useState<HeroService | null>(null);

  const handleTileClick = (service: HeroService) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const getTileClassName = (id: number) => {
    const baseClass = "hero-tile";
    if (id === 2 || id === 4 || id === 7 || id === 10) {
      return `${baseClass} row-span-2`;
    }
    return `${baseClass} row-span-1`;
  };

  return (
    <>
      <section className="relative bg-[#0F172A] py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 pt-36 sm:pt-40 md:pt-44">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
            <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#10B981] mb-5">
              Personalised Learning System
            </div>
            <h1 className="text-[32px] sm:text-[42px] md:text-[52px] font-extrabold text-white leading-[1.1] tracking-tight">
              Every Child Is Unique.
              <br />
              <span className="text-[#10B981]">Their Learning Journey Should Be Too.</span>
            </h1>
            <p className="mt-6 text-[18px] text-[#F5F0E8] font-normal max-w-2xl mx-auto leading-[1.7]">
              Whether your child learns at home or in a classroom, P² helps you
              discover how they think, learn and grow — then builds a
              personalised learning journey around them.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/waitlist"
                className="bg-[#10B981] hover:bg-[#0ea372] text-white font-semibold px-7 py-3.5 rounded-lg transition"
              >
                Join the Learner Blueprint Waitlist →
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 font-semibold px-7 py-3.5 rounded-lg transition"
              >
                <span>▶</span> See How It Works
              </a>
            </div>

            <p className="mt-6 text-sm text-white/60">
              ♡ Trusted by parents across South Africa and beyond
            </p>

            <div className="mt-5 inline-flex items-start gap-3 text-left max-w-md mx-auto">
              <div className="shrink-0 w-10 h-10 rounded-full border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                ♥
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Born from one parent's homeschooling journey.
                </div>
                <div className="text-sm text-white/60">
                  Designed to help every parent understand how their child learns.
                </div>
              </div>
            </div>
          </div>

          <div className="hero-grid-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[280px]">
            {heroServices.map((service, index) => (
              <div
                key={service.id}
                className={getTileClassName(service.id)}
              >
                <HeroTile
                  service={service}
                  onClick={() => handleTileClick(service)}
                  index={index}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-sm text-white/50 font-light">
              Click any tile to discover our services • 12 services available • Grade 1–12 support
            </p>
          </div>
        </div>
      </section>

      <ServiceModal service={selectedService} onClose={handleCloseModal} />
    </>
  );
};

import journeyImage from "@/assets/learning-journey.png";

const LearningJourney = () => {
  return (
    <section className="w-full bg-[#0F172A]">
      <img
        src={journeyImage}
        alt="The P² Learning Journey: Discover, Understand, Personalise, Support, Grow, Thrive — a personalised journey built around your child."
        className="block w-full h-auto select-none"
        draggable={false}
      />
    </section>
  );
};

export default LearningJourney;

import { Puzzle, Heart, TrendingDown, Moon, Eye, Star, LucideIcon } from "lucide-react";
import imageIDontFitIn from "@/assets/pain-i-dont-fit-in.png";
import imageImAnxious from "@/assets/pain-im-anxious.png";
import imageImFallingBehind from "@/assets/pain-im-falling-behind.png";
import imageImBored from "@/assets/pain-im-bored.png";
import imageNobodySeesHowHardImTrying from "@/assets/pain-nobody-sees-how-hard-im-trying.png";
import imageIKnowICanDoMore from "@/assets/pain-i-know-i-can-do-more.png";

type Card = {
  image: string;
  Icon: LucideIcon;
  headline: string;
  body: string;
  closing?: string;
};

const CARDS: Card[] = [
  {
    image: imageIDontFitIn,
    Icon: Puzzle,
    headline: "I don't fit in.",
    body: "I learn differently. I think differently. I wonder if something is wrong with me.",
    closing: "There isn't.",
  },
  {
    image: imageImAnxious,
    Icon: Heart,
    headline: "I'm anxious.",
    body: "The pressure to perform. The pressure to fit in. The fear of getting it wrong.",
  },
  {
    image: imageImFallingBehind,
    Icon: TrendingDown,
    headline: "I'm falling behind.",
    body: "Every new topic feels harder. Confidence gets smaller. The gap feels bigger.",
  },
  {
    image: imageImBored,
    Icon: Moon,
    headline: "I'm bored.",
    body: "The work is too easy. The pace is too slow. Potential is being wasted.",
  },
  {
    image: imageNobodySeesHowHardImTrying,
    Icon: Eye,
    headline: "Nobody sees how hard I'm trying.",
    body: "Parents see effort. Teachers see marks. Children carry the weight.",
  },
  {
    image: imageIKnowICanDoMore,
    Icon: Star,
    headline: "I know I can do more.",
    body: "The spark is there. The potential is there. The confidence isn't.",
    closing: "Yet.",
  },
];

export default function PainCards() {
  return (
    <section id="pain-cards" className="bg-[#F5F0E8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl px-6 sm:px-10 py-14 shadow-sm">
        <h2 className="text-center font-serif text-3xl sm:text-4xl text-[#0F172A] mb-10">
          Every child has a story. Every parent has a worry.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0F172A] cursor-pointer shadow-md hover:shadow-xl transition"
            >
              <img
                src={card.image}
                alt={card.headline}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent pointer-events-none" />

              <div className="absolute top-5 left-5 w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow">
                <card.Icon className="w-6 h-6 text-[#0F172A]" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight">
                  {card.headline}
                </h3>
                <p className="mt-3 text-[#F5F0E8] text-base leading-relaxed">
                  {card.body}
                </p>
                {card.closing && (
                  <p className="mt-3 text-[#FBBF24] text-lg font-bold">
                    {card.closing}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

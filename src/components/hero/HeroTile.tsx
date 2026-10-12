import { motion } from "framer-motion";
import { HeroService } from "@/lib/heroServices";

interface HeroTileProps {
  service: HeroService;
  onClick: () => void;
  index: number;
}

export const HeroTile = ({ service, onClick, index }: HeroTileProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-lg cursor-pointer group h-full min-h-full w-full"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Tile ${index + 1} of 12: ${service.hint}. Click to discover ${service.serviceName}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={service.image}
          alt={`Documentary photo showing ${service.hint}. Click to discover ${service.serviceName}`}
          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
          loading={index < 4 ? "eager" : "lazy"}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 pointer-events-none" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
          <motion.div
            initial={{ y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-white text-base sm:text-lg md:text-xl font-bold tracking-wide mb-1">
              {service.hint}
            </h3>
            <div className="w-0 h-0.5 bg-[#10B981] group-hover:w-20 sm:group-hover:w-24 transition-all duration-400 ease-out" />
          </motion.div>
        </div>

        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 opacity-30 group-hover:opacity-40 transition-opacity duration-300">
          <div className="text-white font-bold text-lg sm:text-xl">P²</div>
        </div>
      </div>

      <div className="absolute inset-0 ring-2 ring-transparent focus:ring-[#10B981] rounded-lg transition-all duration-200 pointer-events-none" />
    </motion.div>
  );
};

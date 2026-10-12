import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, MessageCircle } from "lucide-react";
import { HeroService } from "@/lib/heroServices";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { openWhatsApp } from "@/lib/whatsapp";

interface ServiceModalProps {
  service: HeroService | null;
  onClose: () => void;
}

export const ServiceModal = ({ service, onClose }: ServiceModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (service) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="relative flex-1 overflow-y-auto">
              <div className="relative h-56 sm:h-64 md:h-72 flex-shrink-0 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 focus:ring-offset-transparent"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-[#10B981] font-bold text-2xl">P²</div>
                    <div className="text-white/60 text-xs">powered by kasiAIhub</div>
                  </div>
                  <p className="text-white/80 text-sm font-light mb-2 tracking-wide">
                    {service.hint}
                  </p>
                  <h2 id="modal-title" className="text-white text-3xl sm:text-4xl font-bold mb-2">
                    {service.serviceName}
                  </h2>
                  <p className="text-white/90 text-base sm:text-lg italic font-light">
                    {service.tagline}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 md:p-12">
                <div className="max-w-2xl mx-auto">
                  <ul className="space-y-4 mb-8">
                    {service.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
                        <span className="text-gray-700 text-base leading-relaxed">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        size="lg"
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-6 text-base rounded-lg transition-colors"
                        onClick={() => {
                          onClose();
                          navigate('/assessment');
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Take the Free Assessment
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 font-semibold px-6 py-6 text-base rounded-lg transition-colors"
                        onClick={() => openWhatsApp(`Hi P-Squared! I'd like to learn more about ${service.serviceName}.`)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with P-Squared
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

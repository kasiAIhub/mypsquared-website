import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  return (
    <section className="relative min-h-screen bg-kasi-dark overflow-hidden">
      {/* Animated background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 animate-float pointer-events-none"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-kasi-dark/40 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 container-wide py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center pulse-glow">
                <span className="text-primary-foreground font-bold text-xl">P²</span>
              </div>
              <span className="text-primary-foreground text-xl font-bold">P-Squared</span>
            </div>
            <span className="text-primary-foreground/40 text-xs">
              powered by <span className="text-primary/70 font-semibold">kasiAIhub</span>
            </span>
          </motion.div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 container-narrow py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="heading-hero text-primary-foreground mb-6">
            Get Your Professional DBE Application—
            <span className="text-primary">Done in 30 Minutes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
            Stop stressing about the DBE application. Take our 3-minute assessment 
            and see exactly what you need.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <Button asChild className="btn-primary-large text-lg">
              <Link to="/assessment?new=true">
                <CheckCircle className="w-5 h-5" />
                Take Free Assessment
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Simple trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">Fair Pricing</p>
            <p className="text-sm text-primary-foreground/60">Pay what you're comfortable with</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-foreground">30min</p>
            <p className="text-sm text-primary-foreground/60">Application ready</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-foreground">85-95%</p>
            <p className="text-sm text-primary-foreground/60">Approval likelihood</p>
          </div>
        </motion.div>

        {/* Research link below trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={() => setShowGuidelinesModal(true)}
            className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary transition-colors group"
          >
            <FileText className="w-4 h-4" />
            <div className="text-left">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">
                Recent DBE Clarifications (2024-2025)
              </p>
              <p className="text-xs opacity-70">
                Teaching qualifications NOT required • CAPS NOT mandatory • Quarterly reports OPTIONAL
              </p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Guidelines Modal */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-kasi-dark">Recent DBE Clarifications (2024-2025)</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGuidelinesModal(false)}
                className="text-muted-foreground hover:text-kasi-dark"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm text-muted-foreground">
                Based on BELA Act Section 13 and recent provincial guidance
              </p>

              <p className="font-semibold text-kasi-dark">
                MAJOR CLARIFICATIONS FOR HOME EDUCATION:
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-kasi-dark">Teaching Qualifications NOT Required</p>
                    <p className="text-sm text-muted-foreground">
                      Parents do not need formal teaching credentials. BELA Act Section 13 
                      recognizes that committed, capable parents can provide quality 
                      home education.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-kasi-dark">CAPS Curriculum NOT Mandatory</p>
                    <p className="text-sm text-muted-foreground">
                      While CAPS alignment is recommended for easier approval, 
                      alternative curricula (Cambridge, IEB, International) 
                      are permissible if they meet national standards.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-kasi-dark">Quarterly Reports OPTIONAL</p>
                    <p className="text-sm text-muted-foreground">
                      Most provinces now accept annual reports. Quarterly reporting only 
                      required if specifically requested by your provincial office.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-kasi-dark">Site Visits Discretionary</p>
                    <p className="text-sm text-muted-foreground">
                      Physical verification visits are at the discretion of provincial 
                      officials, not mandatory for all applications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-kasi-dark">
                  Source: BELA Act 32 of 2024 (Section 13) and provincial DBE circulars.
                </p>
              </div>

              <Button
                onClick={() => setShowGuidelinesModal(false)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Got It, Thanks
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, AlertCircle, Lightbulb, DollarSign, HelpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopupContent } from "@/lib/assessmentData";

interface InfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: PopupContent;
}

const InfoPopup = ({ isOpen, onClose, data }: InfoPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Header */}
              <div className="flex items-center gap-4 p-6 border-b border-border sticky top-0 bg-card rounded-t-2xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground flex-1">{data.title}</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {data.content.whatYouNeed && (
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">What You Need</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{data.content.whatYouNeed}</p>
                      </div>
                    </div>
                  </div>
                )}

                {data.content.whyRequired && (
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Why It's Required</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{data.content.whyRequired}</p>
                      </div>
                    </div>
                  </div>
                )}

                {data.content.howToGet && (
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">How to Get It</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{data.content.howToGet}</p>
                      </div>
                    </div>
                  </div>
                )}

                {data.content.whatIf && (
                  <div className="p-4 bg-[#F5F0E8]0/10 rounded-xl border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">What If...</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{data.content.whatIf}</p>
                      </div>
                    </div>
                  </div>
                )}

                {data.content.cost && (
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Cost</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{data.content.cost}</p>
                      </div>
                    </div>
                  </div>
                )}

                {data.content.tip && (
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Pro Tip</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{data.content.tip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Button */}
              <div className="p-6 border-t border-border bg-card rounded-b-2xl">
                <Button 
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                >
                  Got It, Thanks!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InfoPopup;

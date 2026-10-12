import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-kasi-dark py-12">
      <div className="container-narrow">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">P²</span>
            </div>
            <span className="text-primary-foreground text-lg font-bold">P-Squared</span>
          </div>

          <p className="text-primary-foreground/60 mb-6">
            Professional DBE Home Education Applications
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/50 mb-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>|</span>
            <a href="#" className="hover:text-primary transition-colors">Refund Policy</a>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6 w-full">
            <p className="text-primary-foreground/50 text-sm mb-2">
              © 2026 P-Squared. All rights reserved.
            </p>
            <p className="text-primary-foreground/40 text-sm mb-3">
              Built by homeschooling parents who've been through the DBE process—we know what works.
            </p>
            <p className="text-primary-foreground/30 text-xs">
              Powered by <span className="text-primary/70 font-semibold">kasiAIhub</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

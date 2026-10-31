import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StartHereSteps from "@/components/StartHereSteps";
import { usePageMeta } from "@/hooks/usePageMeta";
import { MessageCircle } from "lucide-react";

const WHATSAPP_CHAT_URL =
  "https://api.whatsapp.com/send?phone=27818905861&text=Hi%2C%20I%20found%20you%20on%20mypsquared.%20I%20need%20help%20with%20homeschooling.";

export default function StartHerePage() {
  usePageMeta({
    title: "Start Here — mypsquared",
    description:
      "New to homeschooling? Start with the free readiness check, then your DBE registration, and Teacher Alex for children in Grade 4 and up.",
  });

  return (
    <>
      <Navbar />
      <main className="bg-[#0F172A] min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <p className="uppercase font-bold mb-3 text-[#10B981] text-xs tracking-[0.18em]">mypsquared</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Start here</h1>
          <p className="text-[#94A3B8] text-lg mb-10">New to homeschooling, or doing it for the first time? This is how I'd start, one step at a time.</p>

          <StartHereSteps />

          <div className="mt-12 rounded-lg border border-[#10B981]/40 bg-[#10B981]/10 p-6 md:p-8">
            <p className="text-[#F5F0E8] leading-relaxed mb-6">
              And any time you want to talk about personalised lessons, just message me. We'll walk it with you.
            </p>
            <a
              href={WHATSAPP_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg font-semibold px-6 py-4 transition hover:opacity-90"
              style={{ background: "#25D366", color: "#0F172A" }}
            >
              <MessageCircle size={20} />
              Chat to us on WhatsApp
            </a>
            <p className="mt-4 text-sm text-[#94A3B8]">
              The message is already written for you. You can change it before you send.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

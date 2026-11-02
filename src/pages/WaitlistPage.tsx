import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";

const GRADES = ["Grade 4", "Grade 5", "Grade 6", "Grade 7"];

const field =
  "w-full rounded-md bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#10b981]";

export default function WaitlistPage() {
  usePageMeta({
    title: "Meet Teacher Alex | P²",
    description: "Tell us about your child and we'll get you started with Teacher Alex, built around how your child learns.",
  });
  const [form, setForm] = useState({ grade: "", parentName: "", whatsappNumber: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.functions.invoke("submit-learner-waitlist", { body: { ...form, curriculum: "CAPS" } });
    setStatus(error ? "error" : "done");
  };

  return (
    <>
      <Navbar />
      <main className="bg-kasi-dark min-h-screen pt-28 pb-20 px-6 text-white">
        <div className="max-w-lg mx-auto">
          <p className="uppercase font-bold mb-3 text-[#10b981] text-xs tracking-[0.18em]">Teacher Alex</p>
          {status === "done" ? (
            <div className="rounded-lg border border-[#10b981]/40 bg-[#10b981]/10 p-8">
              <h1 className="text-3xl font-bold mb-3">Thank you!</h1>
              <p className="text-white/80 mb-6">Teacher Alex's Term 4 practice is ready for {form.grade}. Set up your child's private parent and learner links next. No account or password needed.</p>
              <a
                href="https://alex.mypsquared.com/?setup=1"
                className="block w-full text-center rounded-md bg-[#10b981] hover:bg-[#0ea371] font-semibold py-4 text-lg text-white"
              >
                Set up Teacher Alex →
              </a>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Meet Teacher Alex</h1>
              <p className="text-white/75 mb-2">
                Tell us about your child and we'll get you started.
              </p>
              <p className="text-white/60 text-sm mb-8">
                Teacher Alex follows the CAPS curriculum.
              </p>
              <form onSubmit={submit} className="space-y-4">
                <label className="block">
                  <span className="block text-sm mb-1 text-white/80">Child's grade</span>
                  <select required value={form.grade} onChange={set("grade")} className={field}>
                    <option value="" disabled className="text-black">Select a grade</option>
                    {GRADES.map((g) => <option key={g} className="text-black">{g}</option>)}
                  </select>
                </label>
                
                <label className="block">
                  <span className="block text-sm mb-1 text-white/80">Parent's name</span>
                  <input required maxLength={100} value={form.parentName} onChange={set("parentName")} className={field} />
                </label>
                <label className="block">
                  <span className="block text-sm mb-1 text-white/80">WhatsApp number</span>
                  <input required type="tel" maxLength={25} placeholder="e.g. 081 234 5678" value={form.whatsappNumber} onChange={set("whatsappNumber")} className={field} />
                </label>
                {status === "error" && (
                  <p className="text-sm text-red-300">Something went wrong. Please check your details and try again.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-md bg-[#10b981] hover:bg-[#0ea371] font-semibold py-3 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Get started"}
                </button>
                <p className="text-xs text-white/55 text-center">
                  We only use these details to contact you about Teacher Alex and never share them (POPIA).
                </p>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

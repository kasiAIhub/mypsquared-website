import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";

const GRADES = ["Grade R", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];
const CURRICULA = ["CAPS", "IEB", "Cambridge", "Not sure"];

const field =
  "w-full rounded-md bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#10b981]";

export default function WaitlistPage() {
  usePageMeta({
    title: "Learner Blueprint Waitlist | P²",
    description: "Join the waitlist for Learner Blueprint daily lesson plans, built around how your child learns.",
  });
  const [form, setForm] = useState({ grade: "", curriculum: "", parentName: "", whatsappNumber: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.functions.invoke("submit-learner-waitlist", { body: form });
    setStatus(error ? "error" : "done");
  };

  return (
    <>
      <Navbar />
      <main className="bg-kasi-dark min-h-screen pt-28 pb-20 px-6 text-white">
        <div className="max-w-lg mx-auto">
          <p className="uppercase font-bold mb-3 text-[#10b981] text-xs tracking-[0.18em]">Learner Blueprint</p>
          {status === "done" ? (
            <div className="rounded-lg border border-[#10b981]/40 bg-[#10b981]/10 p-8">
              <h1 className="text-3xl font-bold mb-3">Thank you, you're on the list!</h1>
              <p className="text-white/80">We'll message you on WhatsApp the day it opens.</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Join the waitlist</h1>
              <p className="text-white/75 mb-8">
                Daily lesson plans built around how your child learns. Leave your details and we'll let you know when it opens.
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
                  <span className="block text-sm mb-1 text-white/80">Curriculum</span>
                  <select required value={form.curriculum} onChange={set("curriculum")} className={field}>
                    <option value="" disabled className="text-black">Select a curriculum</option>
                    {CURRICULA.map((c) => <option key={c} className="text-black">{c}</option>)}
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
                  {status === "sending" ? "Joining…" : "Join the waitlist"}
                </button>
                <p className="text-xs text-white/55 text-center">
                  We only use these details to contact you about the Learner Blueprint waitlist and never share them (POPIA).
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

import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, FileText, Heart, BookOpen, Home, ChevronDown } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsapp';

const journeySteps = [
  { icon: Clipboard, label: "Complete the free assessment", description: "Discover how your child learns in our free 5-minute learner profile" },
  { icon: BookOpen, label: "Get your curriculum match", description: "We recommend CAPS, IEB, or Cambridge based on your child's profile" },
  { icon: FileText, label: "Get officially registered", description: "We generate your full DBE registration package — R999" },
  { icon: Home, label: "Start homeschooling", description: "You have the documents, the plan, and the curriculum" },
  { icon: Heart, label: "Join My Learning Coach", description: "Your daily guide for the first 7 critical days — coming soon" },
];

const days = [
  { day: 0, title: "Welcome (sent same day as registration)", content: "You just took the first brave step.\n\nYour child's profile is ready and your registration is complete. Tomorrow morning your My Learning Coach journey begins. Take a breath — you're not behind. You're exactly where you need to be." },
  { day: 1, title: "Create the Space", content: "Choose a consistent learning spot. Let your child help set it up. Natural light if possible. Their choice of where to sit.\n\nYour one-page setup checklist is attached.\n\nWHY THIS MATTERS:\nYour child's brain begins to associate this space with focus. Consistency here makes every other day easier." },
  { day: 2, title: "Curriculum & Online Lessons", content: "Your child's curriculum recommendation is ready. Today you set up the online school account so your child can start their daily academic lessons and lectures.\n\nYou are not the teacher of every subject. The online school handles the academic content. Your job is to oversee, support, and be present — not perform.\n\nYOUR ROLE: Facilitator. Not teacher. Big difference." },
  { day: 3, title: "Set the Daily Rhythm", content: "Three hours. That's all you need. Not six. Not eight.\n\nA simple structure that works:\n\n• 9am–10am: Core subject (online lesson)\n• 10am–10:15am: Break (go outside)\n• 10:15am–11:15am: Second subject or reading\n• 11:15am–12pm: Project, life skills, or creative work\n\nWrite this down. Put it where your child can see it. Do the routine WITH them, not TO them." },
  { day: 4, title: "Understand Your Child's Learner Profile", content: "Your child's learner profile already shows exactly how they learn best — built around their learning archetype and personalised to their learning pattern.\n\nToday you use that profile. When they get stuck — and they will — you'll know whether to give them more time (The Architect), try a different angle (The Explorer), or add movement (The Athlete).\n\nThis is the day homeschooling stops feeling like guessing and starts feeling like knowing." },
  { day: 5, title: "Records & Project-Based Learning", content: "Start a simple progress folder. One section per subject. Add one piece of evidence per week — a worksheet, a photo, a voice note. That folder IS your annual report.\n\nToday also introduce your first project. Not a school project — a real one.\n\nAsk your child: \"What's a problem in our street or our community?\"\n\nPotholes. Street lights that don't work. Litter. Elderly neighbours without support. Substance abuse. School dropout. Unemployment. These are real problems. Your child is old enough to start noticing them — and smart enough to start thinking about solutions.\n\nThat is education. That is entrepreneurship. That is the 21st century." },
  { day: 6, title: "Build Your Village & Extramurals", content: "Homeschooling doesn't mean isolation. Today you build the village.\n\nNEIGHBOURING CHILDREN: Invite children from local schools for afternoon sessions 2–3 times a week. Reading, projects, play. Your child gets social time. Other children get support. The village raises all of them.\n\nEXTRAMURALS: Contact local school sports teams about joining as an external learner (most allow this). Enrol in at least one structured activity: tennis, swimming, robotics, coding, debate, drama, art, dance.\n\nYour child doesn't need to be in a classroom to have a community. They need YOU to build it for them." },
  { day: 7, title: "Reflect, Celebrate, Plan", content: "You made it through your first week.\n\nThree questions for today:\n\n1. What worked? (Name one thing — even one.)\n2. What do you want to do differently next week?\n3. What did your child surprise you with?\n\nThen: plan your first community project. Your child will develop collaboration, communication, creativity, critical thinking, and real entrepreneurship by solving actual problems in your area. These are not skills you can teach from a textbook. They are skills learned by doing.\n\nProgress over perfection. Always.\n\nWe're proud of you. Keep going." },
];

function WaitlistForm({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const { error: dbError } = await supabase
      .from('homeschooling_coach_waitlist')
      .insert({ email, source });

    if (dbError) {
      setError('Something went wrong. Please try again or WhatsApp us: +27 81 890 5861');
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-6 text-white text-center max-w-lg mx-auto">
        <p className="text-lg font-semibold">✓ You're on the list. We'll be in touch before we launch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="Your email address"
          className={`flex-1 px-5 h-[52px] rounded-lg text-gray-900 text-base focus:ring-2 focus:ring-emerald-300 focus:outline-none bg-white ${error ? 'border-2 border-red-500' : 'border-none'}`}
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-[52px] px-6 rounded-lg transition whitespace-nowrap"
        >
          Join the waitlist — it's free
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      <p className="text-gray-500 text-sm mt-3 text-center">No spam. Just daily support when it matters most.</p>
    </form>
  );
}

export default function MyHomeschoolingCoachPage() {
  const [openDay, setOpenDay] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section ref={topRef} className="bg-kasi-dark text-white pt-28 pb-14 md:pt-36 md:pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">My Learning Coach is coming.</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-[800px] mx-auto">
            Your calm daily guide through homeschooling. Not just the start. The whole journey.
          </p>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-[700px] mx-auto mb-10">
            Starting homeschooling is brave. It's also overwhelming. My Learning Coach walks you through the critical first 7 days — then stays. It learns how your child learns. It adapts to what's working. It improves alongside you. Every morning, you get your next step. Clear, calm, exactly what you need.
          </p>
          <WaitlistForm source="hero" />
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Your path from decision to confidence
          </h2>
          <div className="relative">
            {/* Desktop: horizontal line */}
            <div className="hidden md:block absolute top-[30px] left-[60px] right-[60px] h-[3px] bg-emerald-300" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
              {journeySteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex md:flex-col items-start md:items-center text-center gap-4 md:gap-2 relative">
                    {/* Mobile vertical line */}
                    {i < journeySteps.length - 1 && (
                      <div className="md:hidden absolute left-[30px] top-[60px] bottom-[-32px] w-[3px] border-l-[3px] border-dashed border-emerald-300" />
                    )}
                    <div className="w-[60px] h-[60px] rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 z-10">
                      {i + 1}
                    </div>
                    <div className="md:mt-4">
                      <p className="text-lg font-bold text-gray-900">{step.label}</p>
                      <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={scrollToTop}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg transition"
            >
              Already registered? Join the waitlist →
            </button>
          </div>
        </div>
      </section>

      {/* 7-DAY PLAN */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Your first 7 days, mapped out
          </h2>
          <p className="text-xl text-gray-600 text-center mb-14">
            This is what My Learning Coach walks you through — one morning at a time.
          </p>
          <div className="space-y-4">
            {days.map((d) => (
              <div
                key={d.day}
                className={`bg-white border-2 rounded-xl overflow-hidden cursor-pointer transition-colors ${openDay === d.day ? 'border-emerald-400' : 'border-gray-200 hover:border-emerald-300'}`}
              >
                <button
                  onClick={() => setOpenDay(openDay === d.day ? null : d.day)}
                  className="w-full flex items-center gap-4 p-6 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    Day {d.day}
                  </div>
                  <span className="text-xl font-bold text-gray-900 flex-1">{d.title}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openDay === d.day ? 'rotate-180' : ''}`} />
                </button>
                {openDay === d.day && (
                  <div className="px-6 pb-6 pt-0 border-t border-gray-200 mt-0">
                    <div className="pt-6 text-gray-700 leading-relaxed whitespace-pre-line">
                      {d.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF PLACEHOLDER */}
      <section className="py-12 md:py-16 bg-emerald-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What families are saying</h2>
          <p className="text-gray-600 mb-12">First families start soon</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 opacity-60 text-center">
                <p className="text-gray-500 italic mb-4">"7 days in, I finally feel like I know what I'm doing."</p>
                <p className="text-gray-400 text-sm">— First families start soon</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-12 md:py-16 bg-kasi-dark text-white px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-3xl md:text-[42px] font-bold leading-tight mb-4">You don't have to figure this out alone.</h2>
          <p className="text-xl mb-10">Join the My Learning Coach waitlist. Be the first family supported when we launch.</p>
          <WaitlistForm source="bottom-cta" />
        </div>
      </section>

      <Footer />
    </>
  );
}

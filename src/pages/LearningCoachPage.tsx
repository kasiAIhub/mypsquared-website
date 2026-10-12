import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function LearningCoachPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('waitlist_signups')
      .insert({ email, source: 'learning-coach-page' });

    if (error) {
      toast({ title: 'Error', description: 'Failed to join waitlist. Please try again.', variant: 'destructive' });
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <section className="bg-gray-900 text-white py-20 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-full mb-6">
            🚀 COMING SOON
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            AI Learning Coach
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Your child's personal AI tutor. Patient, adaptive, available 24/7.
            Designed for South African homeschoolers.
          </p>

          {!submitted ? (
            <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  Join Waitlist
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white text-gray-900 rounded-lg p-6 max-w-md mx-auto">
              <Mail className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <p className="font-semibold">You're on the list!</p>
              <p className="text-sm text-gray-600 mt-2">
                We'll notify you when the AI Learning Coach launches.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What to Expect
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Adaptive to Your Child's Learning Pattern
              </h3>
              <p className="text-gray-700">
                The AI coach adapts to your child's learning profile from the assessment.
                Visual learner? It shows diagrams. Kinesthetic? It suggests hands-on activities.
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Voice-First, Socratic Method
              </h3>
              <p className="text-gray-700">
                Your child talks to the coach like a real tutor. It asks questions,
                guides thinking, and never just gives answers — it teaches how to think.
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Available 24/7
              </h3>
              <p className="text-gray-700">
                Homework question at 10pm? No problem. The coach is always ready,
                patient, and never gets frustrated — no matter how many times your child asks.
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Aligned to SA Curricula
              </h3>
              <p className="text-gray-700">
                Whether your child is doing CAPS, Cambridge, or IEB, the coach knows
                the curriculum and can help with homework, projects, and exam prep.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Will Work
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-500">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Your child asks a question
                  </h3>
                  <p className="text-gray-700">
                    "I don't understand how photosynthesis works" — by voice or text
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-500">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Coach asks guiding questions
                  </h3>
                  <p className="text-gray-700">
                    "What do plants need to grow? Have you noticed anything about leaves?"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-500">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Child discovers the answer
                  </h3>
                  <p className="text-gray-700">
                    Through conversation, visuals (if visual learner), or hands-on suggestions (if kinesthetic)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-500">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Parents get insights
                  </h3>
                  <p className="text-gray-700">
                    Weekly reports on what your child is learning, where they're struggling, and what they've mastered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-emerald-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Be the First to Know When It Launches
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join the waitlist and get early access pricing when we launch.
          </p>
          {!submitted && (
            <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-gray-100 text-emerald-600 font-semibold px-8 py-3 rounded-lg transition"
                >
                  Join Waitlist
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

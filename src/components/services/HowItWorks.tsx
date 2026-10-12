import { Brain, Target, Rocket } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Brain,
      title: "ASSESS",
      subtitle: "Discover How Your Child Learns",
      description: "Free 5-minute learner profile reveals learning patterns, strengths, and best curriculum fit"
    },
    {
      icon: Target,
      title: "MATCH",
      subtitle: "Match to Perfect Curriculum",
      description: "We recommend CAPS, Cambridge, or IEB based on your child's unique learning profile"
    },
    {
      icon: Rocket,
      title: "SUPPORT",
      subtitle: "Choose Your Path",
      description: "Add DBE registration (R999) and/or My Learning Coach (R200/month)"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Three Steps to Transform Your Child's Education
          </h2>
          <p className="text-xl text-gray-600">
            Simple. Personal. Powerful.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative flex flex-col">

                <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10">
                  {index + 1}
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition flex-1 flex flex-col">

                  <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 flex-shrink-0">
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-emerald-600 font-semibold mb-3">
                      {step.subtitle}
                    </p>
                    <p className="text-gray-600 flex-1">
                      {step.description}
                    </p>
                  </div>

                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        <div className="text-center">
          <a
            href="/waitlist"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg transition transform hover:scale-105 shadow-lg text-lg"
          >
            Join the Learner Blueprint Waitlist →
          </a>
        </div>

      </div>
    </section>
  );
}

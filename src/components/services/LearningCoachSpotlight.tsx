import { Calendar, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LearningCoachSpotlight() {
  const features = [
    {
      icon: Calendar,
      title: "7-Day Daily Guide",
      description: "Every morning, a clear step. Built around your child's profile."
    },
    {
      icon: Heart,
      title: "For You, the Parent",
      description: "Calm, structured guidance so you know exactly what to do each day."
    },
    {
      icon: Zap,
      title: "Confidence from Day 1",
      description: "Replace guessing with knowing. Progress over perfection."
    }
  ];

  return (
    <section id="homeschooling-coach" className="py-20 bg-gradient-to-br from-emerald-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <h2 className="text-4xl font-bold">My Learning Coach</h2>
              <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">🚀 COMING SOON</span>
            </div>
            <p className="text-xl text-emerald-100 mb-8">
              Your calm daily guide for the first 7 days of homeschooling. Built around your child. Designed for you.
            </p>

            <div className="space-y-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                      <p className="text-emerald-100">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/my-learning-coach"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg transition transform hover:scale-105"
            >
              Join the Waitlist →
            </Link>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="aspect-video bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-emerald-200 text-lg">Your First 7 Days</p>
                <p className="text-emerald-300 text-sm mt-2">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

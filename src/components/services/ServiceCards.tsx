import { CircleCheck as CheckCircle, ArrowRight } from 'lucide-react';

export default function ServiceCards() {
  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Path, Your Choice</h2>
          <p className="text-xl text-gray-600">Flexible. You decide what you need. We adapt.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-xl p-8 hover:shadow-xl transition">
            <div className="mb-6">
              <span className="inline-block bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">MOST POPULAR</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Full Homeschool Setup</h3>
              <p className="text-gray-600">Complete support from registration to daily learning</p>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Free Child Assessment</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Personalized Curriculum Match</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">DBE Registration Bundle (R999)</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <span className="text-gray-700">My Learning Coach (7-day guide)</span>
                  <span className="ml-2 inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">COMING SOON</span>
                </div>
              </div>
            </div>
            <a href="/assessment" className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-4 rounded-lg transition w-full">
              <span>Go Full Homeschool</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition">
            <div className="mb-6">
              <span className="inline-block bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">FLEXIBLE OPTION</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">School Support Only</h3>
              <p className="text-gray-600">Child stays in current school, add daily guidance</p>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Free Child Assessment</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1 opacity-40" />
                <span className="text-gray-400 line-through">Skip DBE Registration</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <span className="text-gray-700">My Learning Coach (7-day guide)</span>
                  <span className="ml-2 inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">COMING SOON</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Personalised daily guidance</span>
              </div>
            </div>
            <a href="/assessment" className="flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-4 rounded-lg transition w-full">
              <span>Just Add Learning Coach</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

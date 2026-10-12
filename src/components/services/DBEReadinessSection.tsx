import { FileText, Users, Award, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function DBEReadinessSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Take Our Free DBE Readiness Assessment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exactly where you stand—and what you need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Document Readiness Score
            </h3>

            <p className="text-gray-600 mb-6">
              Find out which of the required documents you have, which you're missing, and exactly where to get them.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Birth certificate requirements</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Transfer certificate workaround</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Proof of residence options</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Certification guide (free!)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Parent Readiness Analysis
            </h3>

            <p className="text-gray-600 mb-6">
              Discover how to frame YOUR qualifications and experience to satisfy DBE requirements.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Recent DBE Clarifications (teaching quals NOT required!)</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">How to position ANY background</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Evidence-based approach</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Qualification myths debunked</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Motivation Strength Rating
            </h3>

            <p className="text-gray-600 mb-6">
              Learn how to articulate YOUR specific reason in language that satisfies DBE approval criteria.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Transform "my child learns differently" into professional evidence</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Address provincial evidence requirements</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Proven framing techniques</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Rejection pattern insights</span>
              </div>
            </div>
          </div>

        </div>

        <div className="text-center">
          <a
            href="/assessment"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-10 py-4 rounded-lg transition text-lg inline-block shadow-lg"
          >
            Start Your Free Assessment Now →
          </a>
          <p className="text-gray-500 mt-4">2 minutes • No registration required • Instant results</p>
        </div>

      </div>
    </section>
  );
}

import { CircleCheck as CheckCircle } from 'lucide-react';

export default function PackageIncludes() {
  const packages = [
    {
      number: "1",
      title: "OFFICIAL DBE APPLICATION FORM",
      subtitle: "All 103 fields completed with YOUR information:",
      items: [
        "Child's details (as on birth certificate)",
        "Your qualifications and experience",
        "Your reason for home education",
        "Province-specific requirements"
      ],
      footer: "Ready to sign and submit.",
      bgColor: "bg-white",
      textColor: "text-gray-900"
    },
    {
      number: "2",
      title: "PROFESSIONAL MOTIVATION LETTER (3 pages)",
      subtitle: "YOUR story told in DBE-approved language:",
      items: [
        "Your qualifications framed professionally",
        "Your reason backed by evidence",
        "Your teaching capability demonstrated",
        "BELA Act & 2025 Guidelines cited"
      ],
      footer: "Sounds like you, but professionally polished.",
      bgColor: "bg-white",
      textColor: "text-gray-900"
    },
    {
      number: "3",
      title: "COMPREHENSIVE EDUCATIONAL PLAN (6-8 pages)",
      subtitle: "Tailored to YOUR child's grade:",
      items: [
        "Daily schedule matching your availability",
        "CAPS-aligned subject breakdown",
        "Assessment strategy and methods",
        "Resources (free and affordable options)"
      ],
      footer: "Shows DBE you understand requirements.",
      bgColor: "bg-white",
      textColor: "text-gray-900"
    },
    {
      number: "4",
      title: "DIAGNOSTIC ASSESSMENT REPORT (5 pages)",
      subtitle: "Evidence-based readiness analysis:",
      items: [
        "Grade performance data (if school report available)",
        "Learning profile scientifically described",
        "Readiness for next grade evaluated",
        "Instructional strategies recommended"
      ],
      footer: 'This satisfies the "empirical evidence" requirement!',
      bgColor: "bg-white",
      textColor: "text-gray-900"
    }
  ];

  return (
    <section id="registration" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 uppercase">
            Your Personalized Package Will Include:
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`${pkg.bgColor} rounded-xl p-8 shadow-lg`}
            >

              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-emerald-600">{pkg.number}</span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${pkg.textColor} mb-1`}>
                    {pkg.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {pkg.subtitle}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {pkg.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-emerald-600 font-semibold">
                {pkg.footer}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

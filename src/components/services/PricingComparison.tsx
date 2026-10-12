import { Check, X } from 'lucide-react';

export default function PricingComparison() {
  const plans = [
    {
      name: "Just Exploring",
      price: "FREE",
      period: "",
      description: "Discover how your child learns",
      features: [
        { text: "Child Learning Profile Assessment", included: true },
        { text: "Personalized curriculum recommendation", included: true },
        { text: "DBE Registration documents", included: false },
        { text: "My Learning Coach access", included: false }
      ],
      cta: "Start Assessment",
      ctaLink: "/assessment",
      highlighted: false
    },
    {
      name: "Full Homeschool",
      price: "R999",
      period: "one-time",
      priceNote: "+ R200-600/month",
      description: "Complete setup + ongoing support",
      features: [
        { text: "Everything in Free, plus:", included: true },
        { text: "DBE Registration Bundle", included: true },
        { text: "Curriculum matching & advisory", included: true },
        { text: "My Learning Coach (7-day guide)", included: true },
        { text: "WhatsApp support", included: true }
      ],
      cta: "Go Full Homeschool",
      ctaLink: "/assessment",
      highlighted: true
    },
    {
      name: "School Support",
      price: "R200-600",
      period: "/month",
      description: "Homework help while in school",
      features: [
        { text: "Free Child Assessment", included: true },
        { text: "Skip registration (stay in school)", included: true },
        { text: "My Learning Coach (7-day guide)", included: true },
        { text: "Personalised daily guidance", included: true },
        { text: "Progress support", included: true }
      ],
      cta: "Just Add Coach",
      ctaLink: "/assessment",
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Honest Pricing. No Hidden Fees.
          </h2>
          <p className="text-xl text-gray-600">
            Choose what you need. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl transform scale-105'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >

              {plan.highlighted && (
                <div className="text-center mb-4">
                  <span className="inline-block bg-white text-emerald-600 px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-lg ml-1 ${plan.highlighted ? 'text-emerald-100' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                {plan.priceNote && (
                  <p className="text-emerald-100 text-sm">{plan.priceNote}</p>
                )}
                <p className={`text-sm ${plan.highlighted ? 'text-emerald-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start space-x-3">
                    {feature.included ? (
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-emerald-500'}`} />
                    ) : (
                      <X className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-emerald-200' : 'text-gray-300'}`} />
                    )}
                    <span className={`text-sm ${
                      plan.highlighted
                        ? (feature.included ? 'text-white' : 'text-emerald-100')
                        : (feature.included ? 'text-gray-700' : 'text-gray-400')
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={plan.ctaLink}
                className={`block text-center font-semibold px-6 py-3 rounded-lg transition ${
                  plan.highlighted
                    ? 'bg-white text-emerald-600 hover:bg-gray-100'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {plan.cta}
              </a>

            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-600 space-y-1">
          <p>✓ No contracts. Cancel anytime.</p>
          <p>✓ 7-day money-back guarantee on My Learning Coach</p>
          <p>✓ Registration fee (R999) non-refundable after document generation</p>
        </div>

      </div>
    </section>
  );
}

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Do I need teaching qualifications to homeschool in South Africa?",
      answer: "No. The 2024 BELA Act and DBE clarifications confirm that teaching qualifications are NOT required. You just need to demonstrate your capability to facilitate your child's learning—which we help you articulate in your application."
    },
    {
      question: "Is CAPS curriculum mandatory for homeschooling?",
      answer: "No. While CAPS is an option, you can also use Cambridge, IEB, or any other curriculum. The DBE requires you to have a structured educational plan—not necessarily CAPS. We help you choose the best fit for your child and document it properly."
    },
    {
      question: "How long does DBE approval take?",
      answer: "Provincial timelines vary. Gauteng typically responds within 3-4 weeks. Western Cape can take 6-8 weeks. Some provinces respond faster. We provide provincial-specific guidance and submission instructions to maximize your chances of quick approval."
    },
    {
      question: "What if my application gets rejected?",
      answer: "Our process is built from analyzing 200+ applications (2021-2025). We know exactly what causes rejections: incomplete documents (35%), weak motivation letters (28%), missing educational plans (22%), and unclear qualifications (15%). We address all of these in your package. If you follow our guidance, rejection is highly unlikely."
    },
    {
      question: "Can I homeschool if I work full-time?",
      answer: "Yes! Many working parents successfully homeschool by: (1) using online schools for structured lessons during work hours, (2) scheduling learning time in evenings/weekends, (3) involving grandparents or caregivers, (4) using flexible curricula. We help you design a realistic schedule that fits YOUR life."
    },
    {
      question: "What's the difference between the Free Assessment and the R999 Registration Bundle?",
      answer: "The Free Assessment tells you WHERE you are (readiness score, missing documents, strengths/gaps). The R999 Registration Bundle GIVES you everything you need: completed DBE forms, professional motivation letter, comprehensive educational plan, diagnostic report—all personalized to your situation and ready to submit."
    },
    {
      question: "What is My Learning Coach?",
      answer: "My Learning Coach is your calm daily guide for the first 7 days of homeschooling. It walks you through setting up your learning space, understanding your curriculum, building a daily rhythm, and connecting with other families — step by step, every morning, personalised to your child's learner profile. It's designed for YOU, the parent. Coming soon — join the waitlist at /my-learning-coach."
    },
    {
      question: "What if I have multiple children of different grades?",
      answer: "Perfect! We generate separate educational plans for each child (tailored to their grade level). My Learning Coach supports guidance for all your children — the same step-by-step daily approach, personalised to each child's profile."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about P-Squared and homeschooling in South Africa</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</span>
                <ChevronDown className={`w-6 h-6 text-emerald-500 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

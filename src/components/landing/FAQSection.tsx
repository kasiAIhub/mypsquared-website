import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly is this assessment?",
    answer: "A quick evaluation that measures your readiness across three areas: documents, qualifications, and motivation. You get an immediate score and detailed breakdown showing exactly what you have and what you need.",
  },
  {
    question: "Is the assessment really free?",
    answer: "Yes, 100% free. No credit card required. You get your results immediately with a downloadable DBE Preparation Guide.",
  },
  {
    question: "What happens after I take the assessment?",
    answer: "You'll see your readiness score with a detailed breakdown, get access to download the free DBE Preparation Guide, and see personalized previews of what your documents would look like. You can then contact us via WhatsApp to discuss pricing and next steps.",
  },
  {
    question: "How accurate is the readiness score?",
    answer: "The assessment is based on 200+ successful DBE applications and the requirements from all 9 provincial DBE offices. It evaluates exactly what officials look for: document readiness, parent capability, and motivation strength.",
  },
  {
    question: "What if I'm not ready to apply yet?",
    answer: "Perfect! The assessment shows you exactly what to prepare. You can gather documents at your own pace, then use P-Squared when you're ready—whether that's next month or next year.",
  },
  {
    question: "Which provinces do you support?",
    answer: "We support all 9 South African provinces. We've researched each provincial process to ensure your application meets your specific DBE office requirements.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-light py-20 md:py-28">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-kasi-dark mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-body max-w-xl mx-auto">
            Get answers to common questions about the assessment and P-Squared
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl px-6 border-none shadow-card"
              >
                <AccordionTrigger className="text-left font-semibold text-kasi-dark hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-kasi-gray pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;

import { motion } from "framer-motion";
import { FileText, Briefcase, PenTool, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: FileText,
    title: "DOCUMENT READINESS SCORE",
    description: "Find out which of the required documents you have, which you're missing, and exactly where to get them.",
    points: [
      "Birth certificate requirements",
      "Transfer certificate workaround",
      "Proof of residence options",
      "Certification guide (free!)",
    ],
  },
  {
    icon: Briefcase,
    title: "PARENT READINESS ANALYSIS",
    description: "Discover how to frame YOUR qualifications and experience to satisfy DBE requirements.",
    points: [
      "Recent DBE Clarifications (teaching quals NOT required!)",
      "How to position ANY background",
      "Evidence-based approach",
      "Qualification myths debunked",
    ],
  },
  {
    icon: PenTool,
    title: "MOTIVATION STRENGTH RATING",
    description: "Learn how to articulate YOUR specific reason in language that satisfies DBE requirements.",
    points: [
      'Transform "my child learns differently" into professional evidence',
      "Address provincial evidence requirements",
      "Proven framing techniques",
      "Rejection pattern insights",
    ],
  },
];

const AssessmentSection = () => {
  return (
    <section className="section-white py-20 md:py-28">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-kasi-dark mb-4">
            TAKE OUR FREE DBE READINESS ASSESSMENT
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Discover exactly where you stand—and what you need to succeed.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            <img
              src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Parent teaching child"
              className="rounded-xl object-cover object-top h-64 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
              alt="Professional parent planning education"
              className="rounded-xl object-cover object-top h-64 w-full"
            />
            <img
              src="https://images.pexels.com/photos/5905492/pexels-photo-5905492.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Parent guiding child with homework"
              className="rounded-xl object-cover object-top h-64 w-full"
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-feature group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="heading-card text-kasi-dark mb-3">{benefit.title}</h3>
              <p className="text-kasi-gray mb-4">{benefit.description}</p>
              <ul className="space-y-2">
                {benefit.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-kasi-dark">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button asChild className="btn-primary-large">
            <Link to="/assessment?new=true">Start My Free Assessment</Link>
          </Button>
          <p className="text-kasi-gray text-sm mt-4">
            Takes 3 minutes • Immediate results • Free guide download
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AssessmentSection;

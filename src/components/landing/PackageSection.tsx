import { motion } from "framer-motion";
import { FileText, Mail, PenTool, ClipboardCheck, CheckCircle } from "lucide-react";

const documents = [
  {
    icon: FileText,
    number: "1",
    title: "OFFICIAL DBE APPLICATION FORM",
    description: "All 103 fields completed with YOUR information:",
    points: [
      "Child's details (as on birth certificate)",
      "Your qualifications and experience",
      "Your reason for home education",
      "Province-specific requirements",
    ],
    footer: "Ready to sign and submit.",
  },
  {
    icon: Mail,
    number: "2",
    title: "PROFESSIONAL MOTIVATION LETTER (3 pages)",
    description: "YOUR story told in DBE-approved language:",
    points: [
      "Your qualifications framed professionally",
      "Your reason backed by evidence",
      "Your teaching capability demonstrated",
      "BELA Act & 2025 Guidelines cited",
    ],
    footer: "Sounds like you, but professionally polished.",
  },
  {
    icon: PenTool,
    number: "3",
    title: "COMPREHENSIVE EDUCATIONAL PLAN (6-8 pages)",
    description: "Tailored to YOUR child's grade:",
    points: [
      "Daily schedule matching your availability",
      "CAPS-aligned subject breakdown",
      "Assessment strategy and methods",
      "Resources (free and affordable options)",
    ],
    footer: "Shows DBE you understand requirements.",
  },
  {
    icon: ClipboardCheck,
    number: "4",
    title: "DIAGNOSTIC ASSESSMENT REPORT (5 pages)",
    description: "Evidence-based readiness analysis:",
    points: [
      "Grade performance data (if school report available)",
      "Learning profile scientifically described",
      "Readiness for next grade evaluated",
      "Instructional strategies recommended",
    ],
    footer: 'This satisfies the "empirical evidence" requirement!',
  },
];

const PackageSection = () => {
  return (
    <section className="section-dark py-20 md:py-28">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="badge-green mb-4">🚀 P-SQUARED LAUNCHING SOON</p>
          <h2 className="heading-section text-primary-foreground mb-4">
            JOIN THE PRIORITY LIST—HERE'S WHAT YOU'RE GETTING
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            When we launch, you'll get instant access to a system that generates your
            complete DBE application package in 30 minutes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <img
              src="https://images.pexels.com/photos/6120205/pexels-photo-6120205.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Organized documents"
              className="rounded-xl object-cover object-center h-56 w-40"
            />
            <img
              src="https://images.pexels.com/photos/4145356/pexels-photo-4145356.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Professional paperwork"
              className="rounded-xl object-cover object-top h-56 w-40"
            />
            <img
              src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Education planning"
              className="rounded-xl object-cover object-top h-56 w-40"
            />
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-primary-foreground text-center mt-16 mb-8"
        >
          YOUR PERSONALIZED PACKAGE WILL INCLUDE:
        </motion.h3>

        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 lg:p-8 relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="font-bold">{doc.number}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-kasi-dark">{doc.title}</h4>
                    <p className="text-kasi-gray text-sm mt-1">{doc.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {doc.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-kasi-dark">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-primary font-medium text-sm">{doc.footer}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-8 bg-white/10 rounded-2xl px-8 py-6">
            <div className="text-center">
              <p className="text-primary-foreground/60 text-sm">TOTAL VALUE</p>
              <p className="text-2xl font-bold text-primary-foreground">25+ pages</p>
            </div>
            <div className="hidden sm:block w-px bg-white/20" />
            <div className="text-center">
              <p className="text-primary-foreground/60 text-sm">GENERATION TIME</p>
              <p className="text-2xl font-bold text-primary">30 minutes</p>
            </div>
            <div className="hidden sm:block w-px bg-white/20" />
            <div className="text-center">
              <p className="text-primary-foreground/60 text-sm">APPROVAL LIKELIHOOD</p>
              <p className="text-2xl font-bold text-primary-foreground">85-95%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PackageSection;

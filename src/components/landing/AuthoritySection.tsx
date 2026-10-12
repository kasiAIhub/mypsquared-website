import { motion } from "framer-motion";
import { Briefcase, Users, Award } from "lucide-react";
import tsholoPhoto from "@/assets/Tsholo_Monyausi_latest_photo.jpg";

const credentials = [
  { icon: Briefcase, text: "15+ years SMME development & programme design" },
  { icon: Users, text: "Successfully navigated the DBE process (2023)" },
  { icon: Award, text: "Mother of Grade 4 twin homeschoolers" },
];

const AuthoritySection = () => {
  return (
    <section className="section-dark py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -ml-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mb-48 blur-3xl" />
      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="heading-section text-primary-foreground mb-4">
            BUILT BY SOMEONE WHO'S BEEN THERE
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="relative w-80 mx-auto lg:mx-0 mb-6">
              <div className="w-full overflow-hidden rounded-xl">
                <img
                  src={tsholoPhoto}
                  alt="Tsholo Monyausi - Founder of P-Squared"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-primary-foreground mb-2">
              Hi, I'm Tsholo Monyausi
            </h3>
            <p className="text-primary-foreground/60">
              Programme Designer & Homeschool Parent
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              In 2023, I successfully registered my twin sons for home education with the DBE.
            </p>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              <span className="text-primary font-semibold">Both applications were approved.</span>
              {" "}They're now thriving in Grade 4 (2026 academic year) with strong academic performance maintained.
            </p>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              I know exactly what the DBE wants to see, because I gave it to them—and they said yes.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 card-dark"
        >
          <h4 className="text-xl font-bold text-primary-foreground mb-4">MY STORY:</h4>
          <p className="text-primary-foreground/80 leading-relaxed mb-6">
            Like you, I was overwhelmed at first. The forms looked simple, but I knew the 
            motivation letter and educational plan had to be perfect. I spent 40+ hours researching:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-primary-foreground/70">
            <li>• The BELA Act (2024)</li>
            <li>• Policy on Home Education (2018)</li>
            <li>• Recent DBE Clarifications (2024-2025)</li>
            <li>• Provincial rejection patterns (2021-2025)</li>
            <li className="sm:col-span-2">• What actually gets approved vs rejected</li>
          </ul>
          <p className="text-primary font-semibold mt-6">
            Then I wrote applications that worked.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h4 className="text-xl font-bold text-primary-foreground mb-4 text-center">
            NOW I'M BUILDING P-SQUARED:
          </h4>
          <p className="text-primary-foreground/80 text-center text-lg max-w-2xl mx-auto">
            A system that does in 30 minutes what took me 40+ hours—generating professional, 
            personalized DBE application documents based on proven approvals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {credentials.map((cred, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3"
            >
              <cred.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm text-primary-foreground/80">{cred.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AuthoritySection;

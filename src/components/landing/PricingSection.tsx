import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            What You SHOULDN'T Pay
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            See how P-Squared compares to your other options
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* DIY Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Do It Yourself</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-400 mb-4">
                  Free
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  But costs you:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">⏰</span>
                    <span>40-60 hours of research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">😰</span>
                    <span>Stress and uncertainty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">❌</span>
                    <span>Risk of rejection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Consultant Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-red-500">
              <CardHeader>
                <CardTitle className="text-xl">Education Consultant</CardTitle>
                <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                  OVERPRICED
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-4">
                  Over R5,000
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  You pay for:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span>💼</span>
                    <span>Office overheads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>👔</span>
                    <span>Multiple meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>⏱️</span>
                    <span>3-4 weeks timeline</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* P-Squared Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-[#10B981] bg-gradient-to-br from-[#10B981]/5 to-[#10B981]/10">
              <CardHeader>
                <CardTitle className="text-xl">P-Squared</CardTitle>
                <div className="inline-block bg-[#10B981] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  FAIR VALUE
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#10B981] mb-4">
                  Your Price
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  We'll ask you what's fair
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#10B981]">✅</span>
                    <span>All documents ready in 24hrs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#10B981]">✅</span>
                    <span>Based on 200+ applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#10B981]">✅</span>
                    <span>BELA Act compliant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#10B981]">✅</span>
                    <span>Zero guesswork</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 mb-6">
            Take the assessment to see what makes sense for YOUR situation
          </p>
          <Button asChild className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-6 text-lg">
            <Link to="/waitlist">Join the Learner Blueprint Waitlist</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;

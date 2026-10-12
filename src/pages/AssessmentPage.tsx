import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import LearningProfileAssessment from '../components/assessment/LearningProfileAssessment';
import Footer from '../components/layout/Footer';

export default function AssessmentPage() {
  const [showResults, setShowResults] = useState(false);

  const handleAssessmentComplete = () => {
    setShowResults(true);
  };

  return (
    <>
      <Navbar />

      <div className="bg-[#0F172A]">
        <div
          className="text-center hidden md:block"
          style={{
            color: '#10B981',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            paddingTop: 100,
            paddingBottom: 12,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          Homeschool Readiness Guide — for parents beginning their homeschool journey.
        </div>


        {!showResults && (
          <section className="text-white pt-12 pb-12 md:pt-16 md:pb-14">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Build your child's learner profile
              </h1>
              <p className="text-xl text-[#94A3B8] max-w-3xl mx-auto mb-8">
                Free 5-minute learner profile. 14 questions. Get personalised curriculum and school recommendations.
              </p>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('start');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold px-8 py-4 rounded-lg transition inline-block"
              >
                Start Your Free Homeschool Readiness Guide
              </button>
            </div>
          </section>
        )}
      </div>


      <div id="start" className={`py-12 bg-[#F5F0E8] ${showResults ? 'pt-24' : ''}`}>

        <LearningProfileAssessment onComplete={handleAssessmentComplete} />

        {showResults && (
          <div className="max-w-3xl mx-auto px-6 mt-12 text-center">
            <Link
              to="/waitlist"
              className="block w-full sm:inline-block bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition"
              style={{ padding: '16px 32px', fontSize: 18 }}
            >
              Join the Learner Blueprint Waitlist
            </Link>
            <p className="mt-4 text-center" style={{ fontSize: 13, color: '#64748B' }}>
              Join the waitlist - we open soon
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

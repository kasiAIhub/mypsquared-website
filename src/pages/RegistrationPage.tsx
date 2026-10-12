import Navbar from '../components/layout/Navbar';
import PackageIncludes from '../components/services/PackageIncludes';
import ResearchBacked from '../components/about/ResearchBacked';
import Footer from '../components/layout/Footer';

export default function RegistrationPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20">

        <section className="bg-gray-900 py-20 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              DBE Home Education Registration
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8">
              Everything you need for DBE approval. Personalized. Professional. R999 one-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/assessment"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg transition text-lg inline-block"
              >
                Start Free DBE Registration Assessment →
              </a>
              <a
                href="#what-you-get"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition text-lg inline-block border border-white/30"
              >
                See What's Included
              </a>
            </div>
          </div>
        </section>

        <div id="what-you-get">
          <PackageIncludes />
        </div>

        <ResearchBacked />

        <section className="bg-emerald-500 py-16 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Register Your Child?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Start with the free assessment. Get your personalized registration bundle in 2 minutes.
            </p>
            <a
              href="/assessment"
              className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-10 py-4 rounded-lg transition text-lg inline-block shadow-lg"
            >
              Start Free DBE Registration Assessment Now →
            </a>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

export default function FounderStory() {
  return (
    <section id="about" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Built by Someone Who's Been There
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          <div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl inline-block mb-6">
              <div className="rounded-lg overflow-hidden w-full max-w-md">
                <img
                  src="/src/assets/Tsholo_Monyausi_latest_photo.jpg"
                  alt="Tsholo Monyausi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold mb-2">Hi, I'm Tsholo Monyausi</h3>
            <p className="text-gray-400 text-lg mb-6">Programme Designer & Homeschool Parent</p>
          </div>

          <div>
            <div className="space-y-6">

              <p className="text-base lg:text-lg leading-relaxed">
                In 2023, I successfully registered my twin sons for home education with the DBE.
              </p>

              <p className="text-base lg:text-lg leading-relaxed">
                <span className="text-emerald-400 font-semibold">Both applications were approved.</span> They're now thriving in Grade 4 (2026 academic year) with strong academic performance maintained.
              </p>

              <p className="text-base lg:text-lg leading-relaxed">
                I know exactly what the DBE wants to see, because I gave it to them—and they said yes.
              </p>

              <div className="bg-gray-800 rounded-xl p-6 mt-8">
                <h4 className="text-xl font-bold mb-4 uppercase">My Story:</h4>
                <p className="text-gray-300 leading-relaxed">
                  Like you, I was overwhelmed at first. The forms looked simple, but I knew the motivation letter and educational plan had to be perfect. I spent 40+ hours researching:
                </p>
                <ul className="mt-4 space-y-2 text-gray-300">
                  <li>• BELA Act requirements (what's actually mandatory)</li>
                  <li>• Provincial variations (Gauteng vs Western Cape vs KZN)</li>
                  <li>• Successful vs rejected applications (patterns in DBE decisions)</li>
                  <li>• Language that satisfies bureaucratic approval criteria</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  I built P-Squared so you don't have to spend 40 hours. You get the system I wish I'd had—backed by real research, tested with real approvals.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

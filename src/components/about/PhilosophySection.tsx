export default function PhilosophySection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Education = You²
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Einstein made light (<em>c</em>) the universal constant—everything in physics bends around it.
          </p>
          <p className="text-xl text-gray-300 leading-relaxed mt-4">
            It's time that <strong>You</strong> (the learner) became the universal constant—and for everything in education to bend around you.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">The Problem with Traditional Education:</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            Traditional schools say: <em>"Here's the system. Fit yourself into it."</em>
          </p>
          <p className="text-gray-300 leading-relaxed">
            One curriculum. One pace. One teaching style. 30+ children in a room, all expected to learn the same way, at the same speed.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">The P-Squared Approach:</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            We say: <em>"Here's who you are. We'll build the system around you."</em>
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start space-x-3">
              <span className="text-emerald-400 font-bold">•</span>
              <span>The <strong>curriculum</strong> adapts to your child's learning pattern (visual, auditory, kinesthetic)</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>My Learning Coach</strong> guides you through your first 7 days with calm, clear steps</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-400 font-bold">•</span>
              <span>The <strong>pace</strong> matches your child's processing speed—no rushing, no boredom</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-400 font-bold">•</span>
              <span>The <strong>content</strong> connects to your child's interests and real-world context</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400 mb-4">
            Education doesn't mold you. Education amplifies you.
          </p>
          <p className="text-lg text-gray-300">
            In the age of AI, adaptive solutions are finally possible. Your child is the constant. Everything else adapts.
          </p>
        </div>

      </div>
    </section>
  );
}

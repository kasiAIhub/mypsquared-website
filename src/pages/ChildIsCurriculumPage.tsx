import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const EMERALD = "#10B981";
const NAVY = "#0F172A";
const CREAM = "#F5F0E8";
const URL = "https://mypsquared.com/blog/what-to-teach-children-age-of-ai";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Should children still learn to code?",
    a: "As a way of understanding how systems work and how to think in steps, yes. As a career guarantee, no — writing code is checkable work, which is exactly why AI improved at it so quickly. Teach it as a tool for thinking rather than as a destination.",
  },
  {
    q: "Why teach mathematics if AI can solve advanced problems?",
    a: "Because maths was never taught for computation alone. It builds structured reasoning and the judgement to sense when an answer is implausible. The gap between quiz scores and fully written answers — recognising a correct answer versus producing one from nothing — is exactly what still needs deliberate practice.",
  },
  {
    q: "What skills are least likely to be automated?",
    a: "Judgement about people and situations: knowing what question is worth asking, reading someone accurately, deciding what is worth doing, and being trustworthy. These have no checkable right answer, which is why no system has been able to practise them.",
  },
  {
    q: "Is personalised AI-assisted homeschooling realistic for an ordinary family?",
    a: "The main historical barrier was the cost of one adult per small group of children preparing everything by hand. That barrier has not disappeared, but lesson planning, differentiation, tracking curriculum gaps, and generating revision material are now substantially cheaper to produce. A parent, a child, and access to the right tools is a lower bar than it was two years ago.",
  },
  {
    q: "Should children be allowed to use AI for schoolwork?",
    a: "Banning it prepares them for a world that no longer exists. The more useful approach is supervised use with a strict habit of verification — nothing is accepted because a machine produced it, and every AI-assisted answer gets checked, explained back, or argued with before it counts as learned.",
  },
  {
    q: "How do I know if my child actually understands something or just recognises the right answer?",
    a: "Test the same knowledge across more than one format — a quiz, a full written explanation, and an answer said aloud before it is written down. If the written or spoken version is noticeably weaker than the quiz score, that gap is the real thing to work on.",
  },
];

export default function ChildIsCurriculumPage() {
  usePageMeta({
    title:
      "The Child Is the Curriculum — What Should We Teach Our Children in the Age of AI? | P-Squared",
    description:
      "A homeschooling mother and founder on what still holds its value now that AI can solve research-level problems — tested, in real time, on her own two ten-year-olds.",
    ogTitle: "The Child Is the Curriculum — What Should We Teach Our Children in the Age of AI?",
    ogDescription:
      "A homeschooling mother and founder on what still holds its value now that AI can solve research-level problems — tested, in real time, on her own two ten-year-olds.",
    ogUrl: URL,
  });

  useEffect(() => {
    const added: (HTMLElement | null)[] = [];

    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href =
      "https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&display=swap";
    document.head.appendChild(font);
    added.push(font);

    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = URL;
    document.head.appendChild(canonical);
    added.push(canonical);

    const keywords = document.createElement("meta");
    keywords.name = "keywords";
    keywords.content =
      "what to teach children about AI, how to prepare children for AI future, personalised learning South Africa, homeschooling with AI, education in the age of AI, what should my child study";
    document.head.appendChild(keywords);
    added.push(keywords);

    const article = document.createElement("script");
    article.type = "application/ld+json";
    article.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The Child Is the Curriculum",
      description:
        "A homeschooling mother and founder on what still holds its value now that AI can solve research-level problems — tested, in real time, on her own two ten-year-olds.",
      author: { "@type": "Person", name: "Tsholo Monyausi" },
      publisher: { "@type": "Organization", name: "P-Squared" },
      datePublished: "2026-08-07",
      dateModified: "2026-08-07",
      url: URL,
    });
    document.head.appendChild(article);
    added.push(article);

    const faq = document.createElement("script");
    faq.type = "application/ld+json";
    faq.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(faq);
    added.push(faq);

    const breadcrumb = document.createElement("script");
    breadcrumb.type = "application/ld+json";
    breadcrumb.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mypsquared.com/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://mypsquared.com/blog" },
        { "@type": "ListItem", position: 3, name: "The Child Is the Curriculum", item: URL },
      ],
    });
    document.head.appendChild(breadcrumb);
    added.push(breadcrumb);

    return () => {
      added.forEach((el) => el && el.parentNode && el.parentNode.removeChild(el));
    };
  }, []);

  return (
    <>
      <style>{`
        .cic-body p { color: rgba(245,240,232,0.86); font-size: 17px; line-height: 1.7; margin-bottom: 1.35rem; }
        .cic-body h2 { color: #fff; font-weight: 700; font-size: 28px; line-height: 1.3; margin: 2.75rem 0 1rem; }
        .cic-body strong { color: #fff; }
        .cic-sig { font-family: 'Nothing You Could Do', cursive; font-size: 34px; line-height: 1.55; color: ${EMERALD}; }
        @media (max-width: 640px) {
          .cic-body p { font-size: 16px; }
          .cic-body h2 { font-size: 24px; }
          .cic-sig { font-size: 30px; }
          .cic-deck { font-size: 18px !important; }
          .cic-cta { display: flex !important; width: 100%; justify-content: center; }
        }
      `}</style>
      <Navbar />
      <main style={{ background: NAVY }} className="pt-24 pb-20 text-white">
        <article className="max-w-3xl mx-auto px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-6">
            <Link to="/" className="hover:text-emerald-400">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link to="/blog" className="hover:text-emerald-400">
              Blog
            </Link>
            <span className="mx-2">›</span>
            <span className="text-white/70">The Child Is the Curriculum</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            The Child Is the Curriculum
          </h1>

          <p className="cic-deck text-white/80 mb-6" style={{ fontSize: 20, lineHeight: 1.65 }}>
            What should we teach our children in the age of AI? A homeschooling mother on what still
            holds its value, why personalised learning is coming for every family, and what she is
            actually teaching her two sons — tested, this term, in real time.
          </p>

          <p className="font-semibold" style={{ color: CREAM }}>
            By Tsholo Monyausi · Founder, P-Squared and kasiAIhub
          </p>
          <p className="text-sm text-white/50 mt-1">7 August 2026</p>

          <hr className="border-t border-white/10 my-8" />

          <div className="cic-body">
            <p>
              I have two boys. They are ten, both in Grade 4, and I teach them at home, every day,
              using AI to build and personalise every lesson.
            </p>
            <p>
              That last part matters for this piece. I am not writing about what AI might mean for
              education in theory. I have spent a full term watching it happen, in real time, on two
              specific children whose results I track weekly. So when I talk about what still holds
              its value, I am not guessing. I am reporting.
            </p>
            <p>
              For a long time I answered the "what should I teach my child" question the way most
              parents do. Get the basics right. Push maths. Steer them toward something technical,
              because that is where the work is going.
            </p>
            <p>
              I have had to revise that. This is what changed my mind — and what a term of actually
              testing the revised version on my own sons confirmed.
            </p>

            <h2>The advice I was giving was already out of date</h2>
            <p>
              In July 2026, the mathematician Terence Tao described an experiment in which four AI
              systems were given ten genuinely new research-level mathematics problems. Seven of the
              ten were solved to publication standard by at least one of them, checked by expert
              referees.
            </p>
            <p>Not exam questions. Not problems with answers in the back of a book. New ones.</p>
            <p>
              Around the same time, Jensen Huang — chief executive of Nvidia, the company whose chips
              most of this technology runs on — was asked in a podcast interview who the smartest
              person he had ever met was. He said he could not answer, and explained why. What most
              people call intelligence — technical problem-solving — is becoming a commodity, and it
              is the part AI handles most easily. Software engineering, he pointed out, was supposed
              to be the ultimate proof of a sharp mind. It was among the first things to fall.
            </p>
            <p>
              "Learn to code" was good advice for about fifteen years. It is now advice to compete
              directly with the thing that does it faster, cheaper, and without getting tired.
            </p>
            <p>That does not mean do not teach it. It means stop treating it as the destination.</p>

            <h2>What Huang says holds its value instead</h2>
            <p>
              His own definition of smart is someone technically capable who also carries real
              empathy, and who can read what has not been said out loud. People who are able to see
              around corners — someone who senses a problem before it arrives, because they can feel
              the vibe in a room.
            </p>
            <p>
              That instinct, he said, comes from a combination of analysis, first principles, life
              experience, wisdom, and reading other people.
            </p>
            <p>
              And then the line that stopped me: a person like that might score badly on a
              standardised test.
            </p>
            <p>
              I have now watched this play out directly in my own homeschool. My twin sons are on the
              same curriculum, in the same house, taught by the same person, and they are almost
              opposites in exactly the way Huang was describing.
            </p>
            <p>
              One of them — I have come to call him The Storyteller in our lesson notes, because that
              is simply what he is — needs time before a topic lands, and when it does, it lands
              completely. Without being asked to, he wove the emotional register of a novel we had
              been reading for weeks into an unrelated writing assignment. He consistently finds the
              human meaning inside a fact before anyone points it out to him. None of that shows up
              as a number on a quiz.
            </p>
            <p>
              The other — The Inventor — is fast and systems-minded. He invented his own shortcut for
              the eight-times table before I taught him one, and then independently extended the same
              logic to the sevens and nines. That kind of instinct does not show up cleanly on a
              standardised test either, but it is exactly the pattern-recognition intelligence that
              will matter for the rest of his life.
            </p>
            <p>
              Both would score well on a normal test. But the test would tell you almost nothing
              about which of my sons is which, or what either of them is actually good at. I only
              know because I watch closely enough to see it.
            </p>

            <h2>So why am I still teaching maths?</h2>
            <p>
              This is the question I get asked most, and I want to answer it properly, because the
              obvious conclusion is wrong.
            </p>
            <p>
              If AI can solve research-level mathematics, why should a ten-year-old grind through
              long division?
            </p>
            <p>
              Because we never taught maths so that children could compute. Calculators removed that
              reason forty years ago and nobody stopped teaching it. We teach it because of what it
              builds underneath: the ability to hold a structure in your head, to follow a chain of
              reasoning without losing the thread, to work in steps, and — this is the part that
              matters most now — <strong>to know when an answer smells wrong.</strong>
            </p>
            <p>That last one used to be a nice extra. It has become essential.</p>
            <p>
              I saw exactly why this term. My boys' quiz scores — the recognition-based kind,
              pick-the-right-answer — were consistently strong. Their fully written answers, the ones
              requiring them to construct an explanation from nothing, were noticeably weaker. Not
              because they did not know the material. Recognising a correct answer and producing one
              from a blank page are different skills, and AI-generated practice is extremely good at
              testing the first one while quietly letting the second one go soft.
            </p>
            <p>
              These tools also produce wrong answers with total confidence. They do not hesitate, do
              not hedge, and do not tell you when they are guessing. A child with no feel for whether
              an answer is plausible will simply accept whatever appears on the screen. A child who
              has built that feel — through exactly the kind of grinding, step-by-step maths I am
              describing — will stop and say: that cannot be right.
            </p>
            <p>
              So we still do maths. But I have changed what I am listening for. I am less interested
              in whether the final answer is correct and more interested in whether my sons can tell
              me why they believe it, whether they would notice if it were wrong — and now,
              practically, whether they can say the full explanation out loud before they are allowed
              to write it down. That last habit came directly out of watching the gap between their
              quiz scores and their written work. It has done more for the quality of what they
              produce than any amount of extra content.
            </p>
            <p>
              The same principle applies to reading. Not "can you read this," but "does this make
              sense, and what is this person actually trying to do to you?"
            </p>

            <h2>I have started observing my two the way a scientist studies a market</h2>
            <p>Here is where being an entrepreneur genuinely changes how I do this.</p>
            <p>
              When you build a business, you do not decide in advance what the market wants and then
              insist on it. You watch. You test. You pay attention to what people actually do rather
              than what you assumed they would do, and you revise.
            </p>
            <p>
              Most of us do the opposite with our children. We decide early what they should become,
              then spend twelve years pushing them toward it and calling the resistance a discipline
              problem.
            </p>
            <p>
              So I observe my two the way a scientist would study a market - deliberately, in writing, every
              week. Four questions I keep returning to.
            </p>
            <p>
              <strong>What does this child actually love?</strong> Not what he says when asked. What
              he returns to when nobody is watching and there is no reward attached.
            </p>
            <p>
              <strong>What is he genuinely good at?</strong> Not what I wish he were good at. This
              one requires more honesty than it sounds like it does.
            </p>
            <p>
              <strong>What will the world need — that AI cannot do?</strong> This is the question
              that has changed, and it is the reason I am writing any of this. The old version was
              "what jobs will exist." That is no longer answerable with confidence. But "what will
              still require a human" is answerable, and the test I use is simple: work where a
              machine can check its own answer is work that gets absorbed. Work that requires
              judgement about people, trust, and what matters does not.
            </p>
            <p>
              <strong>And how does that become a living?</strong> This is the entrepreneur's
              question, and I do not apologise for asking it. Loving something and being good at it
              is not enough. There has to be a path where somebody will pay for it.
            </p>
            <p>
              There is a warning worth stating plainly, because this term taught it to me directly. A
              child is not a startup. A business begins with an intention of what it will become, and
              this approach goes badly wrong the moment you impose that intention on a child - forcing
              them into your own idea of what success looks like. I keep a discipline for exactly this
              reason: before I record anything from a lesson, I ask myself what happened today that I
              would not have predicted. That is what keeps the observation scientific rather than
              confirmatory: the experiment has no predetermined outcome - I am finding out who they
              are, not proving who they should be. If the honest answer is "nothing," that itself is a
              signal — a run of days with no real surprises usually means I have stopped genuinely
              looking and started confirming a story I have already decided is true about my son. I
              revisit my read of each boy monthly, because a child who is developing can quietly
              outgrow a description that was accurate six weeks ago. The point of close observation is
              the opposite of a fixed plan. It is noticing who is actually in front of you today.
            </p>

            <h2>What we actually do differently now</h2>
            <p>
              Some of this is small and unglamorous, and all of it came directly out of watching what
              actually worked and what did not.
            </p>
            <p>
              <strong>They use the tools, and they argue with them.</strong> Not banned, not treated
              as cheating. But nothing gets accepted because a machine said it. The habit I want is
              checking, not asking.
            </p>
            <p>
              <strong>Everything gets tested more than once, in more than one way.</strong> A fact
              learned once and tested once in one format is a fact that will be gone by exam time. We
              test the same core knowledge across a quiz, a full written case study, and an oral
              explanation said aloud before writing — because each format catches a different kind of
              gap, and the gap between quiz confidence and written production is exactly where real
              understanding either holds up or falls apart.
            </p>
            <p>
              <strong>One subject, properly, for the whole day.</strong> I used to split each school
              day across two subjects, the way most schools do. I changed it after noticing both boys
              disengaged every time we switched. One of our subjects — values and character — covers
              several topics: a physical activity component, a creative expression component, and
              others. Taught across a full day instead of split into separate lessons, my sons made a
              connection neither had made before: that courage looks the same whether you're playing
              fair in a game you could win by cheating, or being honest in front of an audience when
              perfect would be easier. That only surfaced because the day stayed inside one subject
              long enough. I'd assumed variety would help concentration. For my two, depth beat
              variety every time.
            </p>
            <p>
              <strong>Real work with real consequences.</strong> Case studies with an actual
              character in an actual situation who has to make a real decision. Content without a
              story attached simply does not stick — not for either of my sons, and I suspect not for
              most children.
            </p>
            <p>
              <strong>People, deliberately.</strong> Time with grandparents, with neighbours, with
              people who are not like us and who require some effort to understand. Reading a person
              is a skill, it is learned by practice, and it is close to the top of the list of things
              that will still matter in twenty years.
            </p>
            <p>
              And I have stopped pretending I know what they will do for a living. Nobody does. What
              I can do is send them into it as people who notice things, who can tell when something
              is off, who can be trusted, and who are not frightened of the tools.
            </p>

            <h2>Why I think personalised learning is about to become the norm, not the exception</h2>
            <p>
              This is a prediction, and I am making it as someone who has now run the experiment on
              two children for a full term.
            </p>
            <p>
              I think we are about to see a flood of small, personalised learning setups — micro
              schools, structured homeschool pods, families combining resources around exactly the
              kind of close, individualised attention I am describing.
            </p>
            <p>
              The reason is not that mass schooling was badly designed. It is that it was well
              designed for a different economy. Standardised schooling was built to produce people
              who could follow instructions accurately and reliably at scale — because that is what
              factories, and later offices, needed. It did that job properly for a century.
            </p>
            <p>
              That economy is the one being absorbed fastest. Following instructions accurately is
              precisely the checkable work machines now do without tiring. A system optimised to
              produce reliable instruction-followers is optimising for the wrong thing, at exactly
              the wrong moment.
            </p>
            <p>
              What replaces it, I think, looks less like a smaller classroom and more like an
              inversion: <strong>the child as the curriculum, rather than the child fitted to one.</strong>{" "}
              Instead of pulling a child into a fixed box and measuring how well they fit, you start
              with who they actually are — the way I had to start with the real, specific differences
              between my two sons — and build outward.
            </p>
            <p>
              I want to say this part plainly, because it is easy to assume otherwise: this does not
              have to be an expensive, elite thing. What it requires is a room, a child, an adult who
              pays close attention, and access to tools that generate the content, track the gaps,
              and catch the curriculum before an exam does. Those tools are now genuinely
              inexpensive. The barrier to personalised education used to be the cost of one adult per
              handful of children preparing everything by hand — the lesson plans, the
              differentiation, the revision materials, the tracking. AI does not remove that adult.
              It removes a great deal of what used to make that adult's job impossible to sustain at
              small scale.
            </p>

            <h2>What I actually tell them</h2>
            <p>Not much, honestly. Ten-year-olds do not need a lecture about labour markets.</p>
            <p>
              But when it comes up, it is roughly this: the machine is very good at the parts that
              can be marked right or wrong. It is not good at people, and it does not know what
              matters. Get good at those, stay curious, learn to use the tools without being
              impressed by them.
            </p>
            <p>
              And be someone others can rely on. That has never once gone out of date, and after a
              full term of watching what actually holds up in two real ten-year-olds, I do not think
              it is about to start.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6" style={{ marginTop: 40 }}>
            <div className="cic-sig">Tsholo Monyausi</div>
            <div className="font-bold mt-2" style={{ color: CREAM }}>
              Tsholo Monyausi
            </div>
            <div className="text-sm text-white/50">
              Founder, P-Squared · Founder, kasiAIhub
            </div>
            <div className="text-sm text-white/50">Homeschooling mother of two</div>
          </div>

          <div
            className="mt-8 text-sm italic text-white/70"
            style={{
              borderLeft: `3px solid ${EMERALD}`,
              background: "rgba(255,255,255,0.04)",
              padding: "16px 20px",
            }}
          >
            I do two things with my days. I build P-Squared, a personalised, AI-assisted learning
            approach that began as something I made for my own sons and is now what I offer other
            South African families. I also build kasiAIhub, which helps entrepreneurs put real
            AI-powered systems into their businesses. This piece sits where those two things meet,
            which is where I actually live.
          </div>

          <div className="mt-10">
            <Link
              to="/assessment"
              className="cic-cta inline-flex items-center gap-2 font-bold px-6 py-4 rounded-md"
              style={{ background: EMERALD, color: NAVY }}
            >
              Take the free Homeschool Readiness Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <section className="mt-14" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Questions this piece keeps getting asked
            </h2>
            <div className="space-y-5">
              {FAQS.map((f) => (
                <div
                  key={f.q}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="font-bold text-white mb-2" itemProp="name">
                    {f.q}
                  </h3>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p className="text-white/80 leading-relaxed text-[15px]" itemProp="text">
                      {f.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <p className="mt-12 pt-8 border-t border-white/10 text-xs text-white/45 leading-relaxed">
            Sources: Terence Tao, 'Mathematics in the Age of AI,' International Congress of
            Mathematicians, 24 July 2026. Jensen Huang, interviewed on the A Bit Personal podcast
            with Jodi Shelton, reported January 2026. Direct observations drawn from a full Term 2
            2026 of building the P-Squared Thematic Learning Journey with two Grade 4 learners.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}

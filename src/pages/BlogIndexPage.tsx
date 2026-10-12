import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { blogPosts } from "@/lib/blogPosts";

const EMERALD = "#10B981";
const NAVY = "#0F172A";

export default function BlogIndexPage() {
  usePageMeta({
    title: "P² Blog — Homeschooling & DBE Registration Guides for South African Parents",
    description:
      "Guides on DBE homeschool registration, the BELA Act, curriculum choice, and personalised learning for South African families.",
    ogTitle: "P² Blog — Homeschooling Guides for South African Parents",
    ogDescription:
      "DBE registration, BELA Act, curriculum choice, and personalised lesson plans — written for South African families.",
    ogUrl: "https://mypsquared.com/blog",
  });

  const newSlugs = new Set(NEW_ARTICLES.map((p) => p.slug));
  const dbePosts = blogPosts.filter(
    (p) => p.category === "DBE Registration" && !newSlugs.has(p.slug)
  );
  const dailyPosts = blogPosts.filter(
    (p) => p.category === "Daily Lesson Plans" && !newSlugs.has(p.slug)
  );

  return (
    <>
      <Navbar />
      <main style={{ background: NAVY }} className="pt-24 pb-20 text-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="uppercase font-bold mb-4"
            style={{ color: EMERALD, fontSize: 13, letterSpacing: "0.18em" }}
          >
            P² Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Homeschooling & DBE Registration Guides
          </h1>
          <p className="text-lg text-white/80 mb-14 max-w-2xl">
            Practical guides for South African parents navigating home education, DBE registration,
            and personalised learning.
          </p>

          <section className="mb-14">
            <h2
              className="uppercase font-bold mb-6"
              style={{ color: EMERALD, fontSize: 12, letterSpacing: "0.2em" }}
            >
              Featured
            </h2>
            <Link
              to="/blog/what-to-teach-children-age-of-ai"
              className="group block rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-500/60 hover:bg-white/[0.06]"
            >
              <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-emerald-400">
                The Child Is the Curriculum
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                What should we teach our children in the age of AI? A homeschooling mother on what
                still holds its value — tested, this term, on her own two ten-year-olds.
              </p>
              <p className="text-xs text-white/50 mb-4">
                7 August 2026 · Tsholo Monyausi
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                Read guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </section>

          <PostSection title="DBE Registration" posts={dbePosts} />
          <PostSection title="Daily Lesson Plans" posts={dailyPosts} />
          <NewArticlesSection />
        </div>
      </main>
      <Footer />
    </>
  );
}

function PostSection({
  title,
  posts,
}: {
  title: string;
  posts: typeof blogPosts;
}) {
  return (
    <section className="mb-14">
      <h2
        className="uppercase font-bold mb-6"
        style={{ color: EMERALD, fontSize: 12, letterSpacing: "0.2em" }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-500/60 hover:bg-white/[0.06]"
          >
            <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-emerald-400">
              {post.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">{post.cardExcerpt ?? post.description}</p>
            {post.author && post.date && (
              <p className="text-xs text-primary-foreground/50 mb-4">
                {post.author} · October 2026
              </p>
            )}
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
              Read guide <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const NEW_ARTICLES = [
  {
    slug: "best-online-homeschooling-platforms-south-africa",
    title: "Best Online Homeschooling Platforms in South Africa",
    description:
      "A practical comparison of online homeschooling platforms for South African families. What to look for in CAPS, IEB and Cambridge-aligned options.",
  },
  {
    slug: "how-to-start-homeschooling-grade-r-south-africa",
    title: "How to Start Homeschooling Grade R in South Africa",
    description:
      "A step-by-step guide to starting Grade R homeschooling in South Africa. Registration, curriculum choices, daily rhythm and socialisation tips.",
  },
  {
    slug: "distance-learning-providers-grade-7-south-africa",
    title: "Distance Learning Providers for Grade 7 in South Africa",
    description:
      "Compare the best distance learning providers for Grade 7 in South Africa. CAPS, IEB, Cambridge and flexible homeschool support options.",
  },
  {
    slug: "best-homeschooling-apps-primary-school-south-africa",
    title: "Best Homeschooling Apps for Primary School South Africa",
    description:
      "The best homeschooling apps for South African primary school learners in Grades R to 7, organised by subject.",
  },
  {
    slug: "where-to-buy-homeschooling-textbooks-south-africa",
    title: "Where to Buy Accredited Homeschooling Textbooks in South Africa",
    description:
      "Where to find CAPS, IEB and Cambridge materials. New, second-hand, free government workbooks, and what accredited actually means.",
  },
];

function NewArticlesSection() {
  return (
    <section className="mb-14">
      <h2
        className="uppercase font-bold mb-6"
        style={{ color: EMERALD, fontSize: 12, letterSpacing: "0.2em" }}
      >
        New Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {NEW_ARTICLES.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-500/60 hover:bg-white/[0.06]"
          >
            <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-emerald-400">
              {post.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">{post.description}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
              Read guide <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

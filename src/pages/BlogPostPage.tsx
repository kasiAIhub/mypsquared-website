import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getBlogPost, getReadingTime } from "@/lib/blogPosts";
import { Button } from "@/components/ui/button";
import { SEO_OVERRIDES } from "@/lib/seoMeta";

const EMERALD = "#10B981";
const NAVY = "#0F172A";

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const post = getBlogPost(slug);

  const seo = SEO_OVERRIDES[slug] ?? {};
  usePageMeta({
    title: post?.seoTitle ?? seo.title ?? (post ? `${post.title} | P²` : "Article | P²"),
    description: seo.description ?? post?.description ?? "P² homeschooling guides for South African families.",
    ogTitle: post?.seoTitle ?? seo.title ?? post?.title,
    ogDescription: seo.description ?? post?.description,
    ogUrl: `https://mypsquared.com/blog/${slug}`,
  });

  useEffect(() => {
    if (!post) return;
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = `https://mypsquared.com/blog/${post.slug}`;
    document.head.appendChild(canonical);

    const editorialMeta: HTMLMetaElement[] = [];
    const previousMeta: { tag: Element; parent: Node }[] = [];
    if (post.seoTitle) {
      for (const [name, content] of [
        ["keywords", post.keywords],
        ["twitter:title", post.seoTitle],
        ["twitter:description", post.description],
      ]) {
        const tag = document.createElement("meta");
        tag.name = name;
        tag.content = content;
        const previous = document.head.querySelector(`meta[name="${name}"]`);
        if (previous?.parentNode) {
          previousMeta.push({ tag: previous, parent: previous.parentNode });
          previous.remove();
        }
        document.head.appendChild(tag);
        editorialMeta.push(tag);
      }
    }

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      keywords: post.keywords,
      publisher: { "@type": "Organization", name: "P² Personalised Learning System" },
      mainEntityOfPage: `https://mypsquared.com/blog/${post.slug}`,
      ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
      ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
    });
    document.head.appendChild(ld);
    const faqLd = post.faqs?.length ? document.createElement("script") : undefined;
    if (faqLd) {
      faqLd.type = "application/ld+json";
      faqLd.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs?.map(({ question, answer }) => ({
          "@type": "Question", name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      });
      document.head.appendChild(faqLd);
    }

    return () => {
      document.head.removeChild(canonical);
      document.head.removeChild(ld);
      faqLd?.remove();
      editorialMeta.forEach((tag) => tag.remove());
      previousMeta.forEach(({ tag, parent }) => parent.appendChild(tag));
    };
  }, [post]);

  if (!post) return <Navigate to="/" replace />;

  return (
    <>
      <Navbar />
      <main style={{ background: NAVY }} className="pt-24 pb-20 text-white">
        <article className="max-w-3xl mx-auto px-6">
          <div
            className="uppercase font-bold mb-4"
            style={{ color: EMERALD, fontSize: 13, letterSpacing: "0.18em" }}
          >
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
          {post.byline ? (
            <p className="text-sm text-primary-foreground/70 mb-10">
              {post.byline} · <time dateTime={post.date}>{post.date && new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time> · {getReadingTime(post.content)} min read
            </p>
          ) : (
            <p className="text-lg text-white/80 mb-10">{post.description}</p>
          )}

          <div className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-white/85 prose-p:leading-relaxed
              prose-strong:text-white
              prose-a:text-emerald-400 hover:prose-a:text-emerald-300
              prose-li:text-white/85
              prose-blockquote:border-l-4 prose-blockquote:border-emerald-500
              prose-blockquote:bg-emerald-500/10 prose-blockquote:py-3 prose-blockquote:px-4
              prose-blockquote:rounded prose-blockquote:not-italic prose-blockquote:text-white/90">
            <ReactMarkdown>{post.content}</ReactMarkdown>
            {post.faqs?.length ? (
              <ReactMarkdown>{`## Frequently Asked Questions\n\n${post.faqs.map(({ question, answer }) => `**${question}** ${answer}`).join("\n\n")}`}</ReactMarkdown>
            ) : null}
          </div>

          {post.ctaDescription ? (
            <div className="rounded-lg p-8 text-center mt-12 bg-primary text-primary-foreground">
              <p className="text-lg font-semibold mb-4">{post.ctaDescription}</p>
              <Button asChild variant="secondary" className="max-w-full h-auto whitespace-normal font-semibold">
                <Link to={post.ctaHref}>{post.ctaLabel}</Link>
              </Button>
              <p className="text-lg font-semibold mt-8 mb-4">{post.secondaryCtaDescription}</p>
              {post.secondaryCtaHref && post.secondaryCtaLabel && (
                <Button asChild variant="secondary" className="max-w-full h-auto whitespace-normal font-semibold">
                  <Link to={post.secondaryCtaHref}>{post.secondaryCtaLabel}</Link>
                </Button>
              )}
            </div>
          ) : (
          <div
            className="rounded-lg p-8 text-center mt-12"
            style={{ background: EMERALD }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">{post.ctaLabel}</h3>
            <Link
              to={post.ctaHref}
              className="inline-flex items-center gap-2 bg-white font-semibold px-6 py-3 rounded-md"
              style={{ color: EMERALD }}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          )}

          {!post.ctaDescription && (
          <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/60">
            <p>
              Related:{" "}
              <Link to="/assessment" className="underline hover:text-white">
                Free Homeschool Readiness Assessment
              </Link>
              {" · "}
              <Link to="/dbe-registration" className="underline hover:text-white">
                DBE Registration
              </Link>
              {" · "}
              <Link to="/waitlist" className="underline hover:text-white">
                Start with P²
              </Link>
            </p>
          </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}

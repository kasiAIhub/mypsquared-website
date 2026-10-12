// Runs after `vite build`: renders every sitemap route to static HTML in dist/
// so search engines receive full page content, a unique title, description and canonical.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { pathToFileURL } from "url";

const BASE = "https://mypsquared.com";

// ---- minimal browser shims so modules can be evaluated in Node ----
const mem = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
  };
};
globalThis.localStorage = mem();
globalThis.sessionStorage = mem();

const PAGE_META = {
  "/": ["P² — Personalised Learning for South African Children", "Personalised daily lesson plans built around how your child learns. CAPS, IEB and Cambridge aligned. Join the waitlist - we open soon."],
  "/about": ["About P² — Built by a South African Mother", "P² started at a kitchen table, built by a South African mother for families the school system was never designed for. Read our story."],
  "/for-homeschoolers": ["Homeschooling in South Africa — Start With P²", "Starting to homeschool? Understand your child, choose the right curriculum and get DBE registered with the P² Homeschool Readiness Guide."],
  "/for-mainstream-parents": ["Help Your School Child Learn Better — P²", "Your child is in school but struggling or bored? P² shows how they learn and gives personalised study support aligned to their curriculum."],
  "/learner-blueprint": ["Learner Blueprint — How Your Child Learns | P²", "Discover how your child thinks, learns and grows, match them to the right curriculum and build their learning around who they are."],
  "/assessment": ["Free Homeschool Readiness Assessment | P²", "Take the free P² assessment to see if homeschooling suits your family and get a personalised learning profile for your child."],
  "/start": ["Your Child's Daily Lesson Plans — P²", "Personalised daily lesson plans for your child, aligned to CAPS, IEB or Cambridge and sent to WhatsApp. First 7 days free."],
  "/dbe-registration": ["DBE Home Education Registration Help | P²", "Register your child for home education with the DBE. P² prepares your forms, learning plan and motivational letter, done for you."],
  "/registration": ["DBE Homeschool Registration Package — R999 | P²", "Everything you need for DBE home education approval: personalised, professional documents for a once-off R999."],
  "/my-learning-coach": ["Learning Coach for Homeschool Parents | P²", "Guidance and support for South African homeschooling parents, so you never have to plan your child's learning alone."],
  "/blog": ["P² Blog — Homeschooling Guides for SA Parents", "Guides on DBE homeschool registration, the BELA Act, curriculum choice and personalised learning for South African families."],
  "/blog/dbe-registration-motivational-letter": ["DBE Motivational Letter: Help With Your Submission", "How to write the motivational letter for your DBE home education submission in South Africa, with structure, tips and examples."],
  "/blog/what-to-teach-children-age-of-ai": ["The Child Is the Curriculum: Teaching in the AI Age", "What should we teach our children in the age of AI? A homeschooling mother on what still holds its value, tested on her own kids."],
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const clip = (s, n) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]\s*$/, "") + "…";
};

const dist = resolve("dist");
const template = readFileSync(resolve(dist, "index.html"), "utf8");
const { render, blogPosts, SEO_OVERRIDES } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);

const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/mypsquared\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");

const seen = new Set();
let ok = 0;
for (const route of routes) {
  let title, desc, schema = null;
  const slug = route.startsWith("/blog/") ? route.slice(6) : null;
  const post = slug && blogPosts.find((p) => p.slug === slug);
  if (PAGE_META[route]) [title, desc] = PAGE_META[route];
  else if (post) {
    title = post.title.length <= 60 ? post.title : clip(post.title, 60);
    desc = post.description;
    const o = SEO_OVERRIDES[slug];
    if (o?.title) title = o.title;
    if (o?.description) desc = o.description;
    if (post.seoTitle) title = post.seoTitle;
  } else { console.warn("no meta for", route); continue; }
  if (route === "/") {
    schema = [
      { "@context": "https://schema.org", "@type": "Organization", name: "P²", url: BASE, logo: BASE + "/favicon.ico" },
      { "@context": "https://schema.org", "@type": "WebSite", name: "P²", url: BASE },
    ];
  } else if (route === "/blog/what-to-teach-children-age-of-ai") {
    schema = {
      "@context": "https://schema.org", "@type": "Article",
      headline: "The Child Is the Curriculum", description: desc,
      author: { "@type": "Person", name: "Tsholo Monyausi" },
      publisher: { "@type": "Organization", name: "P²" },
      datePublished: "2026-08-07", dateModified: "2026-08-07",
      url: BASE + route, mainEntityOfPage: BASE + route,
    };
  } else if (post || route === "/blog/dbe-registration-motivational-letter") {
    schema = {
      "@context": "https://schema.org", "@type": "Article",
      headline: title, description: desc,
      publisher: { "@type": "Organization", name: "P²" },
      url: BASE + route, mainEntityOfPage: BASE + route,
      ...(post?.author ? { author: { "@type": "Person", name: post.author } } : {}),
      ...(post?.date ? { datePublished: post.date, dateModified: post.date } : {}),
    };
  }
  if (!post?.seoTitle) { title = clip(title, 60); desc = clip(desc, 155); }
  if (post?.faqs?.length) {
    schema = [].concat(schema ?? [], {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: post.faqs.map(({ question, answer }) => ({
        "@type": "Question", name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }
  if (seen.has(title)) console.warn("duplicate title", title);
  seen.add(title);

  let body;
  try { body = render(route); } catch (e) { console.warn("render failed", route, e.message); continue; }
  const url = BASE + (route === "/" ? "/" : route);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}">`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(desc)}">`)
    .replace("</head>", `<link rel="canonical" href="${url}" data-prerender>\n<meta property="og:url" content="${url}">\n${
      schema ? [].concat(schema).map((x) => `<script type="application/ld+json" data-prerender>${JSON.stringify(x).replace(/</g, "\\u003c")}</script>\n`).join("") : ""
    }</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  if (post?.seoTitle) {
    html = html.replace(/<meta name="keywords"[^>]*>/g, "")
      .replace("</head>", `<meta name="keywords" content="${esc(post.keywords)}">\n</head>`);
  }
  const out = route === "/" ? resolve(dist, "index.html") : resolve(dist, "." + route, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  ok++;
}
// /curriculum is a duplicate of /learner-blueprint: static stub with canonical + redirect.
{
  const target = BASE + "/learner-blueprint";
  const stub = template
    .replace("</head>", `<link rel="canonical" href="${target}" data-prerender>\n<meta http-equiv="refresh" content="0; url=/learner-blueprint">\n</head>`);
  mkdirSync(resolve(dist, "curriculum"), { recursive: true });
  writeFileSync(resolve(dist, "curriculum", "index.html"), stub);
}
console.log(`prerendered ${ok}/${routes.length} routes`);

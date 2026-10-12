// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://mypsquared.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/for-homeschoolers", changefreq: "weekly", priority: "0.9" },
  { path: "/for-mainstream-parents", changefreq: "weekly", priority: "0.9" },
  { path: "/learner-blueprint", changefreq: "monthly", priority: "0.8" },
  { path: "/assessment", changefreq: "monthly", priority: "0.8" },
  { path: "/start", changefreq: "monthly", priority: "0.8" },
  { path: "/dbe-registration", changefreq: "monthly", priority: "0.8" },
  { path: "/registration", changefreq: "monthly", priority: "0.7" },
  { path: "/my-learning-coach", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/blog/dbe-registration-motivational-letter", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/how-to-register-homeschooling-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/dbe-homeschool-registration-documents", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/bela-act-homeschooling-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-laws-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/how-long-does-dbe-registration-take", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-johannesburg", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-cape-town", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-durban", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-limpopo", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-mpumalanga", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-free-state", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-north-west", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-northern-cape", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/personalised-learning-grade-4-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/daily-lesson-plans-homeschoolers-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/personalised-homeschool-curriculum-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/ai-personalised-learning-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschool-lesson-plans-whatsapp", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/signs-child-not-learning-effectively", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/why-some-children-hate-school", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/best-homeschool-curriculum-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/what-is-personalised-learning", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/homeschooling-pretoria", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/is-homeschooling-right-for-my-child", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/how-we-build-personalised-lesson-plans", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/best-online-homeschooling-platforms-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/how-to-start-homeschooling-grade-r-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/distance-learning-providers-grade-7-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/best-homeschooling-apps-primary-school-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/where-to-buy-homeschooling-textbooks-south-africa", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/what-to-teach-children-age-of-ai", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/how-we-finished-entire-term-maths-five-days", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-12" },
  { path: "/blog/we-built-an-app-scrapped-it-best-decision", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-12" },
  { path: "/blog/two-boys-one-lesson-two-starting-points", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-12" },
  { path: "/blog/real-cost-of-ieb-homeschooling-south-africa", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-12" },
  { path: "/blog/narrow-access-to-ieb-homeschooling-providers", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-12" },
  { path: "/blog/sba-portfolio-load-homeschooling-south-africa", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-12" },
  { path: "/blog/can-you-homeschool-with-ieb-in-south-africa", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-12" },
  { path: "/blog/ieb-exam-logistics-homeschooling-south-africa", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-12" },
];

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${e.lastmod ?? "2026-10-10"}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);

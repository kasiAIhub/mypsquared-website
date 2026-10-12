import { describe, expect, it } from "vitest";
import { getBlogPost, getReadingTime } from "../lib/blogPosts";

const slugs = [
  "how-we-finished-entire-term-maths-five-days",
  "we-built-an-app-scrapped-it-best-decision",
  "two-boys-one-lesson-two-starting-points",
];

describe.each(slugs)("October article %s", (slug) => {
  it("uses the supplied publication date", () => {
    expect(getBlogPost(slug)?.date).toBe("2026-10-12");
  });

  it("links the requested offer to the waitlist", () => {
    expect(getBlogPost(slug)?.ctaHref).toBe("/waitlist");
  });

  it("links the free guide to assessment", () => {
    expect(getBlogPost(slug)?.secondaryCtaHref).toBe("/assessment");
  });
});

describe("article reading time", () => {
  it("rounds 201 words up to two minutes at 200 words per minute", () => {
    expect(getReadingTime(Array(201).fill("learning").join(" "))).toBe(2);
  });
});

const newSlugs = [
  "real-cost-of-ieb-homeschooling-south-africa",
  "narrow-access-to-ieb-homeschooling-providers",
  "sba-portfolio-load-homeschooling-south-africa",
  "can-you-homeschool-with-ieb-in-south-africa",
  "ieb-exam-logistics-homeschooling-south-africa",
];

describe.each(newSlugs)("IEB/SBA founder article %s", (slug) => {
  it("uses the supplied publication date", () => {
    expect(getBlogPost(slug)?.date).toBe("2026-10-12");
  });
  it("links the offer to the waitlist", () => {
    expect(getBlogPost(slug)?.ctaHref).toBe("/waitlist");
  });
  it("links the free guide to assessment", () => {
    expect(getBlogPost(slug)?.secondaryCtaHref).toBe("/assessment");
  });
});
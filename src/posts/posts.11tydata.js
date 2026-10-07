const summarize = (raw = "") =>
  raw
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

const slugOf = (d) => d.page.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");

export default {
  layout: "post.njk",
  eleventyComputed: {
    slug: slugOf,
    permalink: (d) => (d.status === "ready" ? `/posts/${slugOf(d)}/` : false),
    ogType: () => "article",
    summary: (d) => d.description || summarize(d.page.rawInput),
    jsonLd: (d) => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: d.title,
      description: d.description || summarize(d.page.rawInput),
      datePublished: d.page.date.toISOString().slice(0, 10),
      inLanguage: "en",
      mainEntityOfPage: `${d.site.url}/posts/${slugOf(d)}/`,
      author: { "@type": "Person", "@id": `${d.site.mainUrl}/#person`, name: d.site.author, url: d.site.mainUrl },
      publisher: { "@id": `${d.site.mainUrl}/#person` },
    }),
  },
};

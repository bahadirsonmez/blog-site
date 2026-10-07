export default {
  eleventyComputed: {
    jsonLd: (d) => ({
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${d.site.url}/#blog`,
      url: `${d.site.url}/`,
      name: d.site.blogName,
      inLanguage: "en",
      publisher: { "@id": `${d.site.mainUrl}/#person` },
    }),
  },
};

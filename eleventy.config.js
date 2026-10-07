import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  // Input is only `src`; the test harness builds from git-ignored temp dirs.
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism.css": "assets/prism.css",
  });
  eleventyConfig.addFilter("jsonScript", (obj) =>
    JSON.stringify(obj)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026"),
  );

  eleventyConfig.addFilter("readingTime", (html = "") => {
    const words = String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
  });
  eleventyConfig.addFilter("humanDate", (d) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
  );
  eleventyConfig.addFilter("isoDate", (d) => d.toISOString().slice(0, 10));
  eleventyConfig.addCollection("posts", (api) =>
    api
      .getAll()
      .filter((p) => p.data.status === "ready" && /[\\/]posts[\\/][^\\/]+\.md$/.test(p.inputPath))
      .sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addPassthroughCopy({ CNAME: "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}

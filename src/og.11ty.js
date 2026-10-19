// One social card per published post, written next to the post as /posts/<slug>/og.png.
// base.njk points og:image / twitter:image at it via the `ogImage` computed in posts.11tydata.js.
import { renderOgImage } from "./_og/render.js";

export default class {
  data() {
    return {
      pagination: { data: "collections.posts", size: 1, alias: "post" },
      permalink: (d) => d.post.data.ogImage,
      eleventyExcludeFromCollections: true,
    };
  }

  render({ post }) {
    return renderOgImage({
      title: post.data.title,
      explainer: (post.data.tags ?? []).includes("how-it-works"),
    });
  }
}

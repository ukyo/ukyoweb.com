import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPostExcerpt, getPostUrl, sortPosts } from "../lib/posts";
import { SITE } from "../site.config";

export async function GET(context: { site?: URL }) {
  const posts = sortPosts(
    await getCollection("blog", ({ data }) => data.draft !== true)
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description ?? getPostExcerpt(post.body),
      link: getPostUrl(post)
    }))
  });
}

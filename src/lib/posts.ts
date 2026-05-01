import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Tokyo"
});

export function sortPosts(posts: BlogPost[]) {
  return posts.toSorted(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export function getPostUrl(post: BlogPost) {
  return `/blog/${post.data.slug ?? post.id}/`;
}

export function getPostExcerpt(body = "", maxLength = 140) {
  const plainText = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trim()}...`;
}

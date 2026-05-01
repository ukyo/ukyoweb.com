import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;
export type Report = CollectionEntry<"reports">;

type DatedEntry = {
  data: {
    pubDate: Date;
  };
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Tokyo"
});

export function sortByPubDate<T extends DatedEntry>(entries: T[]) {
  return entries.toSorted(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

export function sortPosts(posts: BlogPost[]) {
  return sortByPubDate(posts);
}

export function sortReports(reports: Report[]) {
  return sortByPubDate(reports);
}

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export function formatDateRange(start: Date, end: Date) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function getPostUrl(post: BlogPost) {
  return `/blog/${post.data.slug ?? post.id}/`;
}

export function getReportUrl(report: Report) {
  return `/reports/${report.data.slug ?? report.id}/`;
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

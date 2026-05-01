import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPostExcerpt, getReportUrl, sortReports } from "../../lib/posts";
import { SITE } from "../../site.config";

export async function GET(context: { site?: URL }) {
  const reports = sortReports(
    await getCollection("reports", ({ data }) => data.draft !== true)
  );
  const siteUrl = context.site ?? new URL(SITE.url);
  const reportsUrl = new URL("/reports/", siteUrl);

  return rss({
    title: `${SITE.title} Reports`,
    description: "AI-generated weekly research reports on llama.cpp updates.",
    site: reportsUrl,
    items: reports.map((report) => ({
      title: report.data.title,
      pubDate: report.data.pubDate,
      description: report.data.description ?? getPostExcerpt(report.body),
      link: getReportUrl(report)
    }))
  });
}

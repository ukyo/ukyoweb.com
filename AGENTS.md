# AGENTS.md

## Project Overview

This repository is the Astro static site for `ukyo.dev`.

- Astro 6 with TypeScript and content collections.
- Blog posts live in Markdown under `src/content/blog`.
- Netlify builds the site with Node.js 22 and publishes `dist`.

## Common Commands

Run commands from the repository root.

```sh
npm install
npm run dev
npm run build
npm run preview
```

- `npm run dev` starts the Astro dev server.
- `npm run build` is the primary validation command.
- There are no separate lint or test scripts at the moment.

## Project Structure

- `src/pages/` contains Astro routes, including the blog detail page and RSS endpoint.
- `src/layouts/BaseLayout.astro` defines shared page chrome, metadata, and global CSS import.
- `src/styles/global.css` contains the site-wide design system and responsive styles.
- `src/lib/posts.ts` contains blog sorting, URL, date, and excerpt helpers.
- `src/content.config.ts` defines the blog content collection schema.
- `src/site.config.ts` stores site metadata and social links.
- `astro.config.mjs` configures Astro, sitemap integration, and Markdown highlighting.

## Coding Guidelines

- Prefer the existing Astro and TypeScript patterns; keep changes small and static-first.
- Use two-space indentation, double quotes, and ESM imports to match the current code.
- Keep shared metadata and links in `src/site.config.ts` instead of duplicating literals.
- Put reusable blog logic in `src/lib/posts.ts`.
- Keep global styling in `src/styles/global.css`; use the existing CSS custom properties for color and spacing.
- Avoid adding client-side JavaScript or new dependencies unless the feature genuinely needs them.
- Do not edit generated output such as `dist`.

## Blog Content Guidelines

Blog posts are Markdown files in `src/content/blog` with frontmatter validated by `src/content.config.ts`.

```md
---
title: "Post Title"
slug: post-slug
pubDate: 2026-05-02T12:00:00+09:00
description: "Optional summary"
draft: false
---
```

- `title` and `pubDate` are required.
- `slug`, `description`, and `draft` are optional.
- Posts with `draft: true` are excluded from the index, RSS feed, and static paths.
- URLs are generated as `/blog/{slug}/` when `slug` exists, otherwise `/blog/{file id}/`.
- Dates are formatted for `ja-JP` in the `Asia/Tokyo` timezone.

## Validation

Before finishing code or content changes, run:

```sh
npm run build
```

For visual or layout changes, also run the dev server and inspect the affected pages at desktop and mobile widths.

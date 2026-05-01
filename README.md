# ukyo.dev

Astro 6 で作っている `ukyo.dev` の静的サイトです。ブログ記事は Markdown で管理し、Astro の content collection として読み込まれます。Netlify では Node.js 22 で build し、生成された `dist` を公開します。

## 初回セットアップ

リポジトリのルートで依存関係をインストールします。

```sh
npm install
```

## ローカルで確認する

開発サーバーを起動します。

```sh
npm run dev
```

表示確認が終わったら、公開前の検証として build を実行します。

```sh
npm run build
```

build 済みの内容をローカルで確認したい場合は preview を使います。

```sh
npm run preview
```

## ブログ記事を作成する

ブログ記事は `src/content/blog/` に Markdown ファイルとして作成します。

例:

```text
src/content/blog/my-new-post.md
```

Markdown の先頭には frontmatter を書きます。

```md
---
title: "Post Title"
slug: post-slug
pubDate: 2026-05-02T12:00:00+09:00
description: "Optional summary"
draft: true
---

本文を書きます。
```

必須項目は `title` と `pubDate` です。`slug`、`description`、`draft` は任意です。

- `title`: 記事タイトル。
- `slug`: 公開 URL に使う文字列。
- `pubDate`: 公開日。日本時間の場合は `+09:00` を付けます。
- `description`: 記事一覧や RSS で使う短い説明。
- `draft`: `true` の間は公開対象から外れます。

## URL の決まり

`slug` がある場合、記事 URL は次の形になります。

```text
/blog/{slug}/
```

`slug` がない場合は、Markdown ファイルの id が使われます。通常は拡張子を除いたファイル名です。

```text
src/content/blog/my-new-post.md -> /blog/my-new-post/
```

URL を後から変えると既存リンクに影響するため、公開後の `slug` 変更はできるだけ避けます。

## 下書きと公開

下書きにしたい記事は frontmatter に `draft: true` を入れます。

```md
draft: true
```

`draft: true` の記事はトップページ、RSS、静的ページ生成の対象から除外されます。

公開するときは `draft: false` にするか、`draft` 行を削除します。

```md
draft: false
```

## 公開前チェックリスト

記事を公開する前に、次を確認します。

- frontmatter に `title` と `pubDate` が入っている。
- `draft: true` が残っていない。
- `slug` が意図した URL になっている。
- `description` が必要なら入っている。
- `npm run dev` で本文、見出し、コードブロック、画像、リンクが正しく表示される。
- 公開対象の記事がトップページと `/rss.xml` に出る状態になっている。
- 外部リンク、内部リンク、画像パスが切れていない。
- `npm run build` が成功する。

## Netlify で公開する

変更を deploy 対象ブランチに push すると、Netlify が build を実行します。Netlify は生成された `dist` を公開します。

公開前にローカルで必ず次を実行します。

```sh
npm run build
```

## よくある確認ポイント

記事が表示されない場合は、まず次を見ます。

- `draft: true` が残っていないか。
- `slug` とアクセスしている URL が一致しているか。
- Markdown ファイルが `src/content/blog/` に置かれているか。
- `pubDate` が frontmatter として正しく書けているか。
- `npm run build` で content collection のエラーが出ていないか。

build が失敗する場合は、エラーメッセージに出ている Markdown ファイルと frontmatter を確認します。特に `pubDate` の形式、必須の `title`、リンクや Markdown 記法の崩れを見直します。

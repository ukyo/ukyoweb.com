---
title: "Zed 1.0とACP"
slug: zed1-acp
pubDate: 2026-05-04T01:30:00+09:00
draft: false
---

[Zed is 1.0](https://zed.dev/blog/zed-1-0)

ということでZedが1.0になった。Zedは直近で個人的に触ってたのでどうなんだいってところみていく。

## Zedのファーストインプレッション

Zedとよく比較されるのはVSCodeなんだけど、どっちかというとAntigravity+cmuxみたいな印象かな。複数タブでマルチプロジェクトを運用していく感じ。タブ内でエディタ、git連携、AIエージェント、ターミナル等々全部完結できるのでZedでいいんじゃね?と思わせてくれる。

## VSCode使いは乗り換えるべき?

軽くてメモリ食わないVSCodeと言ってもいいかな。VSCodeにそんなに拡張を入れてない人や個人利用なら全然乗り換えても違和感はないと思う。AIエージェントもClaude code or Codex CLI使いならスムーズに移行できる。
逆にVSCode拡張もりもり入れてて備え付けのGithub Copilotを一番利用してますって人は一旦待ちかなぁ。

## Agent Client Protocol

Zedの目玉機能として[Agent Client Protocol](https://agentclientprotocol.com/get-started/introduction)(以下ACP)で色々なAIエージェント連携できますよ！みたいなのがあるんだけど、いかんせんACPの仕様が普段使っているAIエージェントの機能水準まで到達してないという印象(rewind、forkが欲しいです)。

なんで、しばらくはClaude code or Codex CLI or Zed備え付けのAIエージェント(明らかにACPではない実装)を使うことになりそう。まぁ、ローカルLLMのエージェントとして自由度は高い(KVキャッシュ最適化とかプロンプトのハック)上に実装は割と簡単なので個人的にはACPがどんなもんかかじっておいて損はないと思う。今だったらclaude or codexで雑に一日で作れちゃうしね。

個人的には文章作成用の軽量AIエージェントを作成して(別に公開する予定はない)一通り楽しんだうえで上のような結論に至ったのでACPについては一旦おあずけ状態ということで。

## まとめ

シンプルに書き物するだけの人やAIエージェントで編集したものをちょいみるだけみたいな人は最適まであるんで触ってほしいかな。あとAIは無効化できる。

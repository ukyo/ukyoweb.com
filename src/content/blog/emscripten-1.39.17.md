---
title: "最近のEmscriptenとかGithub Actionsとかの話"
slug: emscripten-1.39.17
pubDate: 2020-06-17T04:52:04+09:00
---

もう自分が作ったかどうかも忘れていた[lz4.js](https://github.com/ukyo/lz4.js)というレポジトリにPRがきた。
なんかgulpにしてwasmにしてモダンにしたぞっていう内容でありがてーという感じなのですが、コードレビューしたら動かねーのでこれとこれとこれを修正してくださいというやりとりをしてなんとかマージした。最近のemscriptenこんなかんじなんだとおもった。そのあと、どうせだからGithub ActionsでCIとnpmへのpublishを自動化しちゃったりもした。

## 最近のEmscriptenはけっこう便利

昔のemscriptenだとランタイムが準備できました、みたいなのはコールバック置いてごにょってた記憶なのだが、最近のemscriptenで

```
$ emcc 色々 -s 'EXPORT_NAME="lz4init"' -s WASM=1 -s WASM_ASYNC_COMPILATION=1
```

というかんじでコンパイルしてやると、`lz4init`関数が初期化されたemscriptenの`Promise<Module>`を返すようになる。これ便利。

あとは、node.jsの環境なら使う側がnpm installするだけでwasm使われているかどうかは気にすることなくライブラリとして使えるようになってたのも地味に便利。ブラウザ環境だけちょっとは要検証かなー(どっちかというとWebpackの対応具合なのかな?)。

## Github Actions Marketplaceにわりとなんでもある

emscriptenが絡んでくるとなるとビルドが面倒そうだな、Dockerでごにょごにょしてみたいなことしなきゃいけない?と思ったのですが、Github Marketplaceを探せば同じ問題を解決するためのActionが大抵はあるっぽい。

今回は https://github.com/marketplace/actions/setup-emscripten-toolchain を使ってみた。特に問題なくemscriptenが使えるようになったのでヨシ!

これに限らず、定期的にlighthouseの結果をslackに投稿したかったら`lighthouse`、`slack`で検索してちょっと組み合わせればそれっぽいのがすぐできちゃうでしょう。

## 世の中は色々良くなってきてる

久しぶりにemscriptenに触ってすごい進化してた。Github Actionsもエコシステムがすごく充実してたことを実感できた。なんというか、楽な世の中になったよ。

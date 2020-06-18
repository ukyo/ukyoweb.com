---
title: "Emscriptenで生成したwasmを含むライブラリをWebpackするには?"
date: 2020-06-19T04:57:26+09:00
---

[lz4.js](https://github.com/ukyo/lz4.js)をブラウザで動かす検証。`yarn add lz4-asm`などでライブラリを準備して次のようなコードを書く。

```js
import lz4init from "lz4-asm";

(async () => {
  const { lz4js: lz4 } = await lz4init();
  const x = lz4.compress(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
  console.log(lz4.decompress(x));
})();
```

これをWebpackするだけなら問題なくできる。多少の設定は必要ですが。

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  node: {
    fs: "empty", // node.jsではfs使うがブラウザでは使わないのでemptyにしておく
  },
};
```

ただ、これだと動作しない。この`bundle.js`がwasmを読み込むとき`fetch`してくるだけなので404になる。単純に要求されたパスにwasmを置くば直る。この場合、`dist/_lz4.wasm`に置けばok。

## ライブラリとしては微妙じゃない?

ただライブラリとして使いたいだけなのにnode_modulesに潜ってwasm引っ張ってくるというのはめんどくさいね。動かないんですけどーっていうIssueが投げられそう。まぁ、これは`import("hoge.wasm")`みたいな書き方ができるようになったら解決できるかな。
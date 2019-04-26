---
title: "AssemblyScript 最適化tips"
date: 2019-04-25T14:55:54+09:00
---

ちょっとだけ触りました。AssemblyScriptはTypeScriptの記法で書いたものがwasmに変換できるというもので、
書き味はTypeScriptユーザーならば問題ないです。ただし、結構素直に変換されるので書き方によっては露骨に速度が変わります。
ちょっと試した感じだと、以下の3点を意識して書くとわりと良いパフォーマンスを得られました。

## @inline の検討

以下のように関数に `@inline` デコレータをつけるとインライン展開されます。関数呼び出しのコストが減ります。逆にwasmコードが肥大化するのでそこはトレードオフです。

```ts
@inline
function square (x: i32): i32 {
  return x * x;
}
```

## load, storeの最適化

[公式wikiのMemory access セクション](https://github.com/AssemblyScript/assemblyscript/wiki/Built-ins#memory-access)に書いてあるのですが、第2引数(`store` は第3引数)に `constantOffset` を指定できます。あるポインタから定数分だけずらしてメモリアクセスしたい場合は使うと速くなります(`i32.const x`、`i32.add`分お得)。ちなみに、コンパイル時解決なので変数はだめです。

```ts
let r = load<u8>(p, 0);
let g = load<u8>(p, 1);
let b = load<u8>(p, 2);
let a = load<u8>(p, 3);
```

## なるべく型キャストしない

当然ですが型キャストしないほうが速いです。例えば、

```ts
let x = load<u32>(p1) as f32;
let y = load<u32>(p2) as f32;
if (x === y) return; // ここに結構ひっかかるとする
// ... なにか
```

よりも

```ts
let _x = load<u32>(p1);
let _y = load<u32>(p2);
if (x === y) return; // ここに結構ひっかかるとする
let x = _x as f32;
let y = _y as f32;
// ... なにか
```

としたほうが速い場合があります。

## まとめ

AssemblyScriptは、クリティカルな部分でパフォーマンスを追求したい場合、選択肢になりますね。ただし、生成されるwasmを意識する必要があるので、WebAssemblyの基本的な命令を確認しておいたほうが良いかな、と思いました。
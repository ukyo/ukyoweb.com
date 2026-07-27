---
title: "llama.cpp 週報 2026-07-20"
slug: llama-cpp-weekly-2026-07-20
pubDate: 2026-07-27T09:02:21+09:00
periodStart: 2026-07-20T00:00:00+09:00
periodEnd: 2026-07-26T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b10069"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10069"
  - title: "llama.cpp release b10075"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10075"
  - title: "llama.cpp release b10076"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10076"
  - title: "llama.cpp release b10077"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10077"
  - title: "llama.cpp release b10078"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10078"
  - title: "llama.cpp release b10079"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10079"
  - title: "llama.cpp release b10080"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10080"
  - title: "llama.cpp release b10081"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10081"
  - title: "llama.cpp release b10085"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10085"
  - title: "llama.cpp release b10089"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10089"
  - title: "llama.cpp release b10090"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10090"
  - title: "llama.cpp release b10091"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10091"
  - title: "llama.cpp release b10092"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10092"
  - title: "llama.cpp release b10093"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10093"
  - title: "llama.cpp release b10094"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10094"
  - title: "llama.cpp release b10098"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10098"
  - title: "llama.cpp release b10099"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10099"
  - title: "llama.cpp release b10103"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10103"
  - title: "llama.cpp release b10105"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10105"
  - title: "llama.cpp release b10106"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10106"
  - title: "llama.cpp release b10107"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10107"
description: "2026-07-20 週の llama.cpp 更新まとめ。load-mode、server、speculative sidecar、Qwen3-VL/DeepSeek4、CUDA/OpenCL/Vulkan/WebGPU/Hexagon などを中心に整理。"
draft: false
---

## 概要

2026-07-20 週の llama.cpp は、公式 GitHub Releases API と各 release page で確認できる範囲では b10069 から b10107 までの 26 件が対象になる。b10069 は 2026-07-20 15:29 JST の公開、b10107 は 2026-07-24 23:01 JST の公開で、この週の JST 期間内に確認できた最後の対象 release だった。b10141 は 2026-07-27 08:03 JST 公開のため、今回の集計からは外している。

今週は、起動時の memory/file loading flags を `load-mode` にまとめる引数整理、server/API の 400/500 error handling、speculative decoding 用 sidecar model の解決、Qwen3-VL と DeepSeek4 の互換性修正が目立った。backend 側では OpenCL/Adreno、CUDA、Vulkan、WebGPU、Hexagon、Metal、OpenVINO、AIX/PowerPC、SYCL package まわりに広く手が入っている。

## 主な変更

- CLI/argument では b10105 で `mlock`、`mmap`、`directio` 系の指定が `load-mode` に整理された。旧 flags の互換 warning、`llama-bench` 側の parsing、document sync、`mlock` が有効化されない問題の修正も含まれるため、起動 script や benchmark automation の引数を確認したい。
- server/API では b10079 が null `llama_context` を正しく扱うようにし、b10080 が `X-Conversation-Id` 付き request の validation error で 500 ではなく 400 を返すよう修正した。同じ b10080 では UI から空の `backend_sampling` placeholder を送らない修正も入っている。
- speculative decoding では b10081 が `-hfd` で指定した draft repository から要求された sidecar を draft として解決するようにし、b10094 が draft repo 内の `mtp-`、`dflash-`、`eagle3-` sidecar から speculative type を推定するようにした。sidecar 付き GGUF repository を server から直接使う運用では、余分な flag なしで意図した draft path に入りやすくなる。
- multimodal/model compatibility では b10085 が Qwen3-VL vision position embedding interpolation を reference 実装に合わせ、画像サイズや非正方形画像で grounding coordinates がずれる問題を抑えている。b10093 は DeepSeek4 crafted template、`drop_reasoning` flag、DS4 parser、tool result reordering を修正し、b10088 は DeepSeek4 の APE tensor op、b10083 は DeepSeek V4 向け top-k MoE の `sqrt_softplus` を CUDA に追加した。
- OpenCL/Adreno では b10069 が Adreno の `MUL_MAT` broadcast と Q8_0 `MUL_MAT` の `view_offs` を扱うようにした。release note では llama-server multi-stream に関わる修正として説明されており、Adreno backend で複数 stream や view offset を使う経路の correctness に効く。
- CUDA では b10076 が same-type `get_rows` を int4 copy で vectorize し、b10089 が q2_K から q6_K、i-quants、mxfp4 まで `GET_ROWS` の quantized type coverage を広げた。b10099 は NVFP4 W4A4 activation quantization を改善し、b10106 は q1_0 MMQ の external compilation を修正している。
- Vulkan では b10078 が queue 管理を per-instance mutex と unique handle に整理し、`VK_KHR_internally_synchronized_queues` が使える driver では host-side mutex locking を避ける方向に refactor した。queue lifetime、alias transfer queue、device creation feature query まで触る変更なので、Vulkan backend の concurrency と stability の確認対象になる。
- WebGPU/Metal/OpenVINO/SYCL では b10090 が WebGPU に depthwise `CONV_2D_DW` kernel を追加し、b10103 が Metal の leaky ReLU で f16 type support を追加した。b10077 は OpenVINO backend に不足していた `GGML_BACKEND_DL_IMPL` invocation を追加し、b10091 は SYCL package の shared library lookup を直している。
- Hexagon と platform support では b10075 が CLAMP op、b10084 が descriptor reuse 時の tensor type check、b10098 が activation ops update、b10107 が Windows で `op_poll` 有効時に crash する問題を修正した。b10092 は AIX で PowerPC backend variants を build できるようにし、PowerPC Q0 matmul 実装の semicolon 欠落も直している。

## 影響

`llama-server` を OpenAI compatible API、conversation ID、UI default settings、speculative sidecar repository と組み合わせて使う環境では、今週の更新は直接確認したい。特に `X-Conversation-Id` 付き validation error、draft repo sidecar 自動解決、`--spec-type` 省略時の挙動は、障害時の HTTP status や model selection に見える変更になる。

運用 script では `load-mode` への移行準備が必要になる。旧 `mlock`/`mmap`/`directio` flags はすぐ消えるわけではないが、deprecated flags と新しい指定を混ぜたときの warning や `llama-bench` の表示差も含め、automation の snapshot test や benchmark parser がある場合は更新後に確認した方がよい。

backend 別では、Adreno/OpenCL は multi-stream や broadcast、CUDA は quantized embedding lookup と NVFP4、Vulkan は queue synchronization、WebGPU は vision/convolution 系、Hexagon は activation/CLAMP/Windows crash、OpenVINO/SYCL は package/backend loading が焦点になる。該当 hardware を持つ環境では、単純な `llama-bench` だけでなく、server multi-stream、speculative decoding、vision input、quantized model、long prompt を分けて smoke test したい。

Qwen3-VL と DeepSeek4 を使う場合は、model load が通るかだけでは足りない。Qwen3-VL は画像サイズと grounding、DeepSeek4 は crafted template、reasoning drop、tool result order、APE tensor、top-k MoE といった実際の request pattern に近い確認が必要になる。

## 参考リンク

- [llama.cpp release b10069](https://github.com/ggml-org/llama.cpp/releases/tag/b10069)
- [llama.cpp release b10075](https://github.com/ggml-org/llama.cpp/releases/tag/b10075)
- [llama.cpp release b10076](https://github.com/ggml-org/llama.cpp/releases/tag/b10076)
- [llama.cpp release b10077](https://github.com/ggml-org/llama.cpp/releases/tag/b10077)
- [llama.cpp release b10078](https://github.com/ggml-org/llama.cpp/releases/tag/b10078)
- [llama.cpp release b10079](https://github.com/ggml-org/llama.cpp/releases/tag/b10079)
- [llama.cpp release b10080](https://github.com/ggml-org/llama.cpp/releases/tag/b10080)
- [llama.cpp release b10081](https://github.com/ggml-org/llama.cpp/releases/tag/b10081)
- [llama.cpp release b10085](https://github.com/ggml-org/llama.cpp/releases/tag/b10085)
- [llama.cpp release b10089](https://github.com/ggml-org/llama.cpp/releases/tag/b10089)
- [llama.cpp release b10090](https://github.com/ggml-org/llama.cpp/releases/tag/b10090)
- [llama.cpp release b10091](https://github.com/ggml-org/llama.cpp/releases/tag/b10091)
- [llama.cpp release b10092](https://github.com/ggml-org/llama.cpp/releases/tag/b10092)
- [llama.cpp release b10093](https://github.com/ggml-org/llama.cpp/releases/tag/b10093)
- [llama.cpp release b10094](https://github.com/ggml-org/llama.cpp/releases/tag/b10094)
- [llama.cpp release b10098](https://github.com/ggml-org/llama.cpp/releases/tag/b10098)
- [llama.cpp release b10099](https://github.com/ggml-org/llama.cpp/releases/tag/b10099)
- [llama.cpp release b10103](https://github.com/ggml-org/llama.cpp/releases/tag/b10103)
- [llama.cpp release b10105](https://github.com/ggml-org/llama.cpp/releases/tag/b10105)
- [llama.cpp release b10106](https://github.com/ggml-org/llama.cpp/releases/tag/b10106)
- [llama.cpp release b10107](https://github.com/ggml-org/llama.cpp/releases/tag/b10107)

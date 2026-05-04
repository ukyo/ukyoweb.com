---
title: "llama.cpp 週報 2026-04-27"
slug: llama-cpp-weekly-2026-04-27
pubDate: 2026-05-04T09:06:30+09:00
periodStart: 2026-04-27T00:00:00+09:00
periodEnd: 2026-05-03T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b8967"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b8967"
  - title: "llama.cpp release b8992"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b8992"
  - title: "llama.cpp release b9000"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9000"
  - title: "ggml-cuda: Blackwell native NVFP4 support"
    url: "https://github.com/ggml-org/llama.cpp/pull/22196"
  - title: "ggml-webgpu: add fast mat-mat path for i-quants"
    url: "https://github.com/ggml-org/llama.cpp/pull/22504"
  - title: "Update llama-mmap to work with 32-bit emscripten"
    url: "https://github.com/ggml-org/llama.cpp/pull/22497"
description: "2026-04-27 週の llama.cpp 更新まとめ。CUDA、WebGPU/Vulkan、Hexagon、speculative decoding、WASM 対応を中心に整理。"
draft: false
---

## 概要

2026-04-27 週の llama.cpp は、GPU/アクセラレータ別の性能改善と、ブラウザ・サーバー利用時の安定化が中心だった。公式リリースは b8960 台から b9000 まで進み、Blackwell 向け CUDA、WebGPU、Vulkan、Hexagon、speculative decoding、reasoning budget、WASM ファイル処理にまたがる変更が入った。

特に目立つのは、Blackwell の NVFP4 対応、Mistral Small 4 向け CUDA FlashAttention、WebGPU の i-quant mat-mat 高速化、Hexagon HMX FlashAttention で、ローカル推論の実行環境をより広く、より細かく最適化する週だった。

## 主な変更

- CUDA では、Blackwell ネイティブ NVFP4 サポートが取り込まれた。あわせて DKQ=320/DV=256、GQA=32 の FlashAttention カーネルが追加され、Mistral Small 4 系の大きなヘッド寸法で CPU フォールバックを避ける狙いが明確になった。
- CUDA の SSM 系では `SSM_CONV + ADD(bias) + SILU` の融合が追加され、Mamba/Nemotron/Granite/Jamba などのハイブリッド構成で使われるパターンを拾えるようになった。
- WebGPU では i-quant の mat-mat 高速パスが追加された。従来は i-quant が mat-vec では高速化されていても、prefill 側の mat-mat は古い経路に落ちるケースがあり、これを埋める変更になっている。
- Vulkan では Q4_K/Q5_K の scale 読み込みを coalesce する最適化と、tensor parallel 対応で必要になる 2D tensor copy API 実装が入った。Intel/Mesa 系で命令数や SEND 数を減らす意図が説明されている。
- Hexagon では VMEM とバッファサイズを設定可能にする変更に続き、HMX FlashAttention が追加された。prefill の FlashAttention、Q/O 変換のマルチスレッド化、mask/ALiBi/softcap まわりのテストが含まれる。
- speculative decoding では、draft model checkpoint の保持ロジックが修正され、大きな agentic session で毎回 draft model を再計算する無駄を減らす方向に進んだ。低確率の drafted token 処理や引数 typo 修正も周辺で入っている。
- reasoning budget では、複数の `<think>` ブロックや prompt token の扱いに関する修正が続いた。multi-turn の思考保存や assistant prefill を使う構成で、budget の状態機械が意図せず外れる問題への対処が進んだ。
- ブラウザ実行では、32-bit Emscripten/WASM で 2GB 超のモデルを扱うため、`llama-mmap` が `fseeko`/`ftello` を使うよう更新された。OPFS と組み合わせた WebGPU バックエンドでの大型モデル読み込みが主な文脈になっている。
- `llama-quant` では `--tensor-type` が既定の `qtype` と同じ型を指定した場合でも手動指定として扱われるよう修正され、量子化時の明示的な tensor type override が尊重されるようになった。

## 影響

NVIDIA Blackwell ユーザーは、NVFP4 と FlashAttention 周辺の改善で新しい GPU と大きなモデルの組み合わせを試しやすくなった。Mistral Small 4 のような特殊な head size/GQA 構成では、CPU フォールバックを避けられるかが性能に直結するため、該当モデルを使う環境では更新の価値が高い。

WebGPU/Vulkan/Hexagon の変更は、サーバーだけでなくブラウザ、Intel GPU、Snapdragon/Hexagon 系デバイスでの実用性を押し上げる。特に WebGPU の i-quant mat-mat 高速化と WASM の 2GB 超対応は、ブラウザ内ローカル推論の制約を少しずつ減らしている。

運用面では、speculative decoding と reasoning budget の修正により、長い agentic session、draft model 併用、思考トークン制御を組み合わせる構成での再計算や budget 管理の落とし穴が減る。ただし変更範囲が広いため、CUDA FlashAttention、WebGPU i-quant、Hexagon HMX、量子化 override を使っている環境では、既存モデルで短い回帰確認をしてから更新するのがよい。

## 参考リンク

- [llama.cpp release b8967](https://github.com/ggml-org/llama.cpp/releases/tag/b8967)
- [llama.cpp release b8992](https://github.com/ggml-org/llama.cpp/releases/tag/b8992)
- [llama.cpp release b9000](https://github.com/ggml-org/llama.cpp/releases/tag/b9000)
- [ggml-cuda: Blackwell native NVFP4 support](https://github.com/ggml-org/llama.cpp/pull/22196)
- [ggml-cuda: add FlashAttention support for DKQ=320/DV=256](https://github.com/ggml-org/llama.cpp/pull/22286)
- [CUDA: fuse SSM_CONV + ADD(bias) + SILU](https://github.com/ggml-org/llama.cpp/pull/22478)
- [ggml-webgpu: add fast mat-mat path for i-quants](https://github.com/ggml-org/llama.cpp/pull/22504)
- [vulkan: Coalesce Q4_K/Q5_K scale loads](https://github.com/ggml-org/llama.cpp/pull/21751)
- [Update llama-mmap to work with 32-bit emscripten](https://github.com/ggml-org/llama.cpp/pull/22497)
- [llama.cpp release b9000: hexagon HMX FlashAttention](https://github.com/ggml-org/llama.cpp/releases/tag/b9000)

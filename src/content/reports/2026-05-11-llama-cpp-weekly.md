---
title: "llama.cpp 週報 2026-05-11"
slug: llama-cpp-weekly-2026-05-11
pubDate: 2026-05-18T09:06:15+09:00
periodStart: 2026-05-11T00:00:00+09:00
periodEnd: 2026-05-17T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9097"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9097"
  - title: "llama.cpp release b9109"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9109"
  - title: "llama.cpp release b9112"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9112"
  - title: "llama.cpp release b9122"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9122"
  - title: "llama.cpp release b9124"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9124"
  - title: "llama.cpp release b9145"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9145"
  - title: "llama.cpp release b9148"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9148"
  - title: "llama.cpp release b9193"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9193"
description: "2026-05-11 週の llama.cpp 更新まとめ。parallel drafting、WebGPU/マルチモーダル、SYCL Level Zero、server/API 互換性を中心に整理。"
draft: false
---

## 概要

2026-05-11 週の llama.cpp は、JST 基準で b9097 から b9193 までが対象になる。GitHub Releases 上では b9194 以降も 5 月 17 日 UTC に出ているが、JST では 2026-05-18 に入るため次週扱いとした。

今週は、server と speculative decoding の実装整理、WebGPU のマルチモーダル/`gpt-oss-20b` 対応、SYCL の Level Zero メモリ割り当て、Adreno/OpenCL・Hexagon・Vulkan・Metal・CUDA など各バックエンドの修正が目立った。モデル対応では MiMo v2.5 vision と Qwen3.5 tokenizer の堅牢化も入っている。

## 主な変更

- speculative decoding では、parallel drafting support が追加された。server 側の draft context、prompt cache、checkpoint、複数 speculator の選択ロジックが整理され、複数の draft 経路から期待 accepted tokens が高いものを選ぶ方向に進んだ。
- WebGPU では、マルチモーダル向けの精度問題修正と `gpt-oss-20b` 実行対応が入った。GELU、FlashAttention tile、mixed type、shared memory 計算などが調整され、WebGPU backend の適用範囲が広がっている。
- `mtmd`/server では、`/v1/models` に modalities を出す変更と MiMo v2.5 vision support が追加された。クライアントがモデルの入力能力を判定しやすくなり、MiMo 系の vision 経路も前進した。
- SYCL backend では `im2col_3d` が追加され、さらに Level Zero allocation path が導入された。後者は Intel Arc Pro B70 の dual-GPU 構成で、`sycl::malloc_device` による system RAM 消費を抑える目的の大きな変更で、build/runtime flag と CI 対応も含む。
- CUDA では長い音声系列で `im2col` の grid Y 上限を超える問題が修正された。SEANet encoder など raw 16 kHz audio の長めの入力で `invalid configuration argument` になり得るケースを、kernel 内の stride loop で回避している。
- Adreno/OpenCL では opt-in の xmem F16xF32 GEMM for prefill、q4_1/q5_0/q5_1 MoE support、warmup crash 修正が進んだ。モバイル GPU 上の MoE/Prefill 系 workload を広げる更新である。
- Hexagon では HVX splat helper による VTCM scalar load 削減、HMX matmul/FlashAttention 周辺の最適化が入った。Qualcomm 系アクセラレータ向けの低レベル最適化が続いている。
- Vulkan/Metal では、asymmetric FlashAttention、Intel GPU BF16 workload の Windows performance regression、MMQ shader shared memory check、Metal の function constants 化などが入った。特定 GPU/形状での性能低下や build/runtime edge case を潰す内容が中心だった。
- server/API 互換では、vLLM/transformers 互換の `continue_final_message`、reasoning model の continue generation、router mode の CUDA primary context 回避、`--embd-normalize` の server 反映、metrics README 修正などが追加された。
- Qwen3.5 tokenizer では非 backtracking handler と regression test が追加され、長い入力での `std::regex` stack overflow を避けるようになった。

## 影響

推論サーバーを運用している環境では、parallel drafting と reasoning/continue generation まわりの変更が最も確認価値が高い。draft model、reasoning model、WebUI の Continue 操作、OpenAI/vLLM 互換 API を使っている場合は、更新後に短い会話継続と streaming 応答を確認しておきたい。

WebGPU と `mtmd` の更新は、ブラウザ/軽量環境でのマルチモーダル利用に効く。特に `/v1/models` の modalities は、クライアント側で vision/audio/text 能力を分岐する実装に使いやすい。

Intel GPU の SYCL backend では Level Zero 経路が大きなメモリ挙動の変更になる。dual-GPU や大きめのモデルで system RAM pressure に悩んでいた環境では改善が期待できる一方、`GGML_SYCL_SUPPORT_LEVEL_ZERO` や `GGML_SYCL_ENABLE_LEVEL_ZERO` の扱いを含めて、既存運用の build option と環境変数を確認する必要がある。

CUDA、Vulkan、Metal、OpenCL/Adreno、Hexagon の変更は、特定ハードウェアやモデル形状での不具合回避・性能改善が中心である。該当 backend を使っている場合は、単純な load test だけでなく、長い音声、MoE、FlashAttention、router mode など実際に使う経路の smoke test を行うのがよい。

## 参考リンク

- [llama.cpp release b9097](https://github.com/ggml-org/llama.cpp/releases/tag/b9097)
- [llama.cpp release b9109](https://github.com/ggml-org/llama.cpp/releases/tag/b9109)
- [llama.cpp release b9112](https://github.com/ggml-org/llama.cpp/releases/tag/b9112)
- [llama.cpp release b9122](https://github.com/ggml-org/llama.cpp/releases/tag/b9122)
- [llama.cpp release b9124](https://github.com/ggml-org/llama.cpp/releases/tag/b9124)
- [llama.cpp release b9145](https://github.com/ggml-org/llama.cpp/releases/tag/b9145)
- [llama.cpp release b9148](https://github.com/ggml-org/llama.cpp/releases/tag/b9148)
- [llama.cpp release b9193](https://github.com/ggml-org/llama.cpp/releases/tag/b9193)

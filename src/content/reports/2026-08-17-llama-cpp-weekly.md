---
title: "llama.cpp 週報 2026-08-17"
slug: llama-cpp-weekly-2026-08-17
pubDate: 2026-08-24T09:03:32+09:00
periodStart: 2026-08-17T00:00:00+09:00
periodEnd: 2026-08-23T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b10470"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10470"
  - title: "llama.cpp release v0.1.2"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/v0.1.2"
  - title: "llama.cpp release b10488"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10488"
  - title: "llama.cpp release b10509"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10509"
  - title: "llama.cpp release b10517"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10517"
  - title: "llama.cpp release b10519"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10519"
  - title: "llama.cpp release b10532"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10532"
  - title: "llama.cpp release b10533"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10533"
  - title: "llama.cpp release b10541"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10541"
  - title: "llama.cpp release v0.2.0"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/v0.2.0"
  - title: "llama.cpp release b10576"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10576"
  - title: "llama.cpp release b10577"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10577"
  - title: "llama.cpp release b10580"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10580"
  - title: "llama.cpp release b10587"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10587"
  - title: "llama.cpp release b10589"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10589"
  - title: "llama.cpp release b10593"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10593"
  - title: "llama.cpp release b10594"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10594"
  - title: "llama.cpp release b10595"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10595"
description: "2026-08-17 週の llama.cpp 更新まとめ。v0.2.0 と semver 移行、ggml_rope_set_offset、multimodal/server 改善、DeepSeek V4、Metal/Vulkan/SYCL/OpenCL/CUDA backend などを中心に整理。"
draft: false
---

## 概要

2026-08-17 週の llama.cpp は、公式 GitHub Releases で確認できる範囲では b10470 から b10595 までを対象にした。b10470 は 2026-08-17 22:59 JST の公開、b10595 は 2026-08-23 22:44 JST の公開で、この週内に確認した最後の対象 release だった。b10454 は 2026-08-16 21:53 JST 相当で前週、b10598 以降は 2026-08-24 JST に入るため除外している。

最大のトピックは release cadence の整理だ。v0.1.2 では semantic versioning がまだ作業中であることが明記され、v0.2.0 では `vX.Y.Z` を stable、従来の `b[NUM]` を nightly/dev と位置づける説明が追加された。下流配布や固定運用では、従来の高頻度 `b` tag だけでなく stable tag を見る判断軸ができた。

実装面では、`ggml_rope_set_offset` が CPU/Metal/CUDA/Vulkan に加えて OpenCL、SYCL、WebGPU、Hexagon 側にも広がり、DeepSeek 系など offset を明示する model 実装で backend 間の挙動を揃えやすくなった。multimodal では `--mmproj-device`、WebP、dots3-note の vision+audio、LFM2 image tiling 閾値修正が入り、画像・音声入力まわりの対応範囲が広がっている。

backend では Metal の quantized KV cache dequant、Vulkan の quantized KV/FlashAttention と PAD_REFLECT_1D、SYCL の Q2_K/Q5_K ESIMD、OpenCL の Adreno workaround と SSM_SCAN、CUDA の POOL_1D が目立つ。server では sleep 中の `/metrics` access、cache dedup preset、slot 差分出力用の設定が加わり、運用・観測面にも変更が入った。

## 主な変更

- Release/配布では b10470 が nightly release tag の明示的 push を release workflow に追加し、v0.1.2 が semver 作業中の pre-release として出た。v0.2.0 は stable tag と nightly/dev tag の使い分けを明文化し、nightly build として b10566 を紐づけている。今後は「安定版として固定するタグ」と「最新機能を追うタグ」を分けて確認しやすくなる。
- Model/runtime では b10568 が model 側で `ggml_rope_set_offset()` を使う変更を入れ、b10593 が DeepSeek V4 の multi-seq rollback と model loading を修正した。b10577 は embeddings と draft-MTP の組み合わせを直し、MTP/speculative decoding と embeddings API を併用するケースの落とし穴を減らしている。
- Multimodal では b10486 が LFM2 image tiling threshold を修正し、b10541 が `--mmproj-device` と `MTMD_BACKEND_DEVICE` 互換の指定を追加した。b10573 は WebP を ffmpeg 経由で扱えるようにし、b10580 は dots3-note の vision+audio support を入れた。入力 media の型や処理先 device を明示したい利用者には直接効く変更になる。
- Server/API では b10505 が cache model dedup preset、b10519 が sleep 中でも `/metrics` を見られるようにする refactor、b10595 が `LLAMA_SERVER_SLOTS_N_DIFF` を追加した。負荷時・sleep 時の監視、slot 状態の差分把握、複数 model preset のメモリ効率化が今週の server 側の焦点になっている。
- Correctness/safety では b10533 が JSON schema の unsupported regex pattern を graceful fallback にし、b10594 が trace log を出さない通常運用では device info loop を skip して不要な GPU context 作成を避けるようにした。b10502 では signed release artifact の attestation も追加され、配布物の検証情報が前進した。
- Backend では b10488 が OpenVINO 2026.3 へ更新し、Nemotron-H rollback test の扱いも調整した。b10509 は `ggml_rope_set_offset` を Metal/CUDA/Vulkan まで含めて広げ、v0.2.0 の changelog では OpenCL/SYCL/WebGPU/Hexagon 側の対応も確認できる。Metal は b10532 で quantized KV を F16 に dequant して FlashAttention に渡す経路、b10545 で tensor API mat-mat の K tail clamp、b10506 で q8_0 dequant packed type を追加した。
- Vulkan/SYCL/OpenCL/CUDA では b10517 が q8_0 KV の dequant を coopmat1 で一度だけ行う経路を入れ、b10587 が PAD_REFLECT_1D operation を Vulkan backend に追加した。SYCL は b10576 の Q2_K reordered MMVQ/ESIMD kernel、v0.2.0 changelog 内の Q5_K ESIMD と Alchemist gate logic 更新が目立つ。OpenCL は Adreno 向け workaround と fused SSM_SCAN、CUDA は b10589 の POOL_1D support が追加された。

## 影響

下流配布や社内固定 build を持つ場合は、v0.2.0 の stable tag 方針を優先的に確認したい。従来どおり `b` tag は最新機能を追う用途に向く一方、配布・再現性・サポート対象の説明では `vX.Y.Z` を基準にする流れが強まっている。installer や package manager、source build の運用ルールもこの区別に合わせて見直す価値がある。

Multimodal と MTP/speculative decoding を組み合わせる環境では、`--mmproj-device`、WebP、dots3-note、LFM2 tiling、draft-MTP with embeddings、DeepSeek V4 rollback を重点的に smoke test したい。入力 media の preprocessing、mmproj の配置先 device、multi-seq rollback、embedding endpoint の組み合わせは、単体では通っても実運用で差が出やすい。

Server 運用では、sleep 中の `/metrics`、slot 差分、cache model dedup preset が監視・メモリ効率・UI/API の見え方に影響する。既存 dashboard が `/metrics` を polling している場合や、slot 状態を使って scheduler/queue を見ている場合は、b10519 と b10595 以降でレスポンス内容と負荷を確認した方がよい。

Backend 別では、Apple Silicon は Metal の quantized KV/FlashAttention と mat-mat tail handling、Intel GPU は SYCL ESIMD と OpenVINO 2026.3、Vulkan は quantized KV dequant と PAD_REFLECT_1D、Adreno/OpenCL は compiler workaround と SSM_SCAN、CUDA は POOL_1D をそれぞれ確認対象にしたい。b10594 の device_info skip は、GPU を使わない起動や trace log を出さない通常実行で余計な VRAM 確保を避けるため、軽量運用にも効く可能性がある。

## 参考リンク

- [llama.cpp release b10470](https://github.com/ggml-org/llama.cpp/releases/tag/b10470)
- [llama.cpp release v0.1.2](https://github.com/ggml-org/llama.cpp/releases/tag/v0.1.2)
- [llama.cpp release b10488](https://github.com/ggml-org/llama.cpp/releases/tag/b10488)
- [llama.cpp release b10509](https://github.com/ggml-org/llama.cpp/releases/tag/b10509)
- [llama.cpp release b10517](https://github.com/ggml-org/llama.cpp/releases/tag/b10517)
- [llama.cpp release b10519](https://github.com/ggml-org/llama.cpp/releases/tag/b10519)
- [llama.cpp release b10532](https://github.com/ggml-org/llama.cpp/releases/tag/b10532)
- [llama.cpp release b10533](https://github.com/ggml-org/llama.cpp/releases/tag/b10533)
- [llama.cpp release b10541](https://github.com/ggml-org/llama.cpp/releases/tag/b10541)
- [llama.cpp release v0.2.0](https://github.com/ggml-org/llama.cpp/releases/tag/v0.2.0)
- [llama.cpp release b10576](https://github.com/ggml-org/llama.cpp/releases/tag/b10576)
- [llama.cpp release b10577](https://github.com/ggml-org/llama.cpp/releases/tag/b10577)
- [llama.cpp release b10580](https://github.com/ggml-org/llama.cpp/releases/tag/b10580)
- [llama.cpp release b10587](https://github.com/ggml-org/llama.cpp/releases/tag/b10587)
- [llama.cpp release b10589](https://github.com/ggml-org/llama.cpp/releases/tag/b10589)
- [llama.cpp release b10593](https://github.com/ggml-org/llama.cpp/releases/tag/b10593)
- [llama.cpp release b10594](https://github.com/ggml-org/llama.cpp/releases/tag/b10594)
- [llama.cpp release b10595](https://github.com/ggml-org/llama.cpp/releases/tag/b10595)

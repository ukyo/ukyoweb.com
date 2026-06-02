---
title: "llama.cpp 週報 2026-05-25"
slug: llama-cpp-weekly-2026-05-25
pubDate: 2026-06-02T21:44:48+09:00
periodStart: 2026-05-25T00:00:00+09:00
periodEnd: 2026-05-31T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9311"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9311"
  - title: "llama.cpp release b9320"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9320"
  - title: "llama.cpp release b9330"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9330"
  - title: "llama.cpp release b9360"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9360"
  - title: "llama.cpp release b9384"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9384"
  - title: "llama.cpp release b9387"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9387"
  - title: "llama.cpp release b9402"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9402"
  - title: "llama.cpp release b9411"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9411"
  - title: "llama.cpp release b9414"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9414"
  - title: "llama.cpp release b9434"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9434"
  - title: "llama.cpp release b9439"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9439"
description: "2026-05-25 週の llama.cpp 更新まとめ。DeepSeek V3.2/DeepSeekOCR 2、AMD MFMA、Vulkan/Hexagon/OpenCL/Metal、Gemma 4 系 mtmd 修正を中心に整理。"
draft: false
---

## 概要

2026-05-25 週の llama.cpp は、JST 基準で b9311 から b9439 までが対象になる。GitHub Releases の表示は UTC で、b9311 は 2026-05-25 15:55 UTC、b9439 は 2026-05-31 06:57 UTC の公開なので、どちらも Asia/Tokyo の週次範囲に入る。

今週の中心は、DeepSeek V3.2 と DeepSeekOCR 2 のモデル対応、GPU/backend ごとの性能・安定性改善、mtmd の Gemma 4 系修正だった。前週までの MTP/speculative decoding 整理に比べると、今週はモデルアーキテクチャ、multimodal、backend probe、CI/配布の細部を詰める更新が多い。

## 主な変更

- b9411 で DeepseekV32ForCausalLM と generic DeepSeek Sparse Attention が追加された。変換処理、KV cache と lightning indexer 用の DSA memory、`LLM_ARCH_DEEPSEEK32`、DeepSeek V3.2 向け NVFP4 support まで含むため、DeepSeek V3.2 系を GGUF で扱うための土台になる。
- b9414 で mtmd に DeepSeekOCR 2 support が入った。multi-tile dynamic resolution、view separator、DeepSeekOCR 1/2 の build graph 整理、image token 数の assert などが含まれ、OCR/vision 系の multimodal path が広がった。
- b9330 では Nemotron-H 系で `ffn_latent_down/up` が backend probe によって CPU 側へ落ちる問題を修正した。`ffn_latent` を `MUL_MAT` として扱うことで、GPU 上に残すべき matmul weight を正しく判定する変更で、リリースノートでは Nemotron 3 Super 120B Q5_K_M の throughput 回復も示されている。
- b9387 では AMD MFMA hardware 向けに quantized matmul の MMVQ/MMQ 切り替え閾値が調整された。K-quants などで batch size 4/6 以降を MMQ に寄せる内容で、MI250X での測定結果もリリースノートに掲載されている。
- Vulkan では b9382 で inner loop の index variable 修正、b9384 で Walsh-Hadamard transform の fast path が入った。Intel では segfault 回避のため fast path を無効化する扱いも明記されており、backend ごとの差分を踏まえた最適化になっている。
- Hexagon では b9402 で generic op fusion infrastructure と RMS_NORM+MUL fusion が追加された。Qualcomm/Hexagon 系で最新モデルの fused op を増やしていく前段の整備と見てよい。
- mtmd では b9393/b9394/b9400/b9401 で Gemma 4 audio/projector/debug 周辺の修正が続いた。audio RMS norm eps、`n_head_kv` default、projector pre_norm、debug の color/rainbow mode など、multimodal model を検証しやすくする細かい更新がまとまっている。
- b9434 では Qwen 3.5/3.6 と 3 GPU 構成の tensor parallel granularity が修正され、AF-MoE TP も調整された。複数 GPU に分割する大型・MoE 系モデルでは確認対象になる。
- b9439 では iGPU device を既定で 1 つだけ使うようになった。b9389 では CUDA/HIP の integrated device に iGPU flag を自動適用する変更もあり、iGPU/dGPU 混在環境での backend 選択を整理する流れが続いている。
- 配布・運用面では b9311 の cpp-httplib 0.45.1 更新、b9320 の tensor parallel context size/memory leak 修正、b9360 の `LLAMA_ARG_` 環境変数名統一、b9412 の server timeout 3600 秒化、b9437 の `llama-bench -fa auto` support などが入った。

## 影響

DeepSeek V3.2 を試す場合は b9411 以降を基準にしたい。モデル変換、DSA 用 memory、NVFP4、architecture 判定がまとまって入っているため、古い build では conversion か runtime のどちらかで差分が出やすい。DeepSeekOCR 2 を扱う場合も b9414 以降で mtmd の multi-tile dynamic resolution と view separator 周辺を確認する必要がある。

AMD CDNA/ROCm 環境では b9387 の quantized matmul routing が性能に効く可能性が高い。一方で、閾値変更は quant family と batch size に依存するため、実運用の `ubatch`、量子化形式、GPU 世代で `llama-bench` を取り直すのが安全である。

Vulkan、Hexagon、Metal、OpenCL を使う環境では、今週の変更は小さな修正に見えても backend 固有の correctness に触れている。Vulkan allreduce fallback、Walsh-Hadamard fast path、Metal large-kernel im2col、OpenCL bf16 conversion、Hexagon fused op を使うモデルでは、更新後に短い生成だけでなく perplexity や既知 prompt での再現性も確認したい。

サーバー運用では、timeout 既定値の延長と `LLAMA_ARG_` 環境変数名の統一に注意する。環境変数で起動パラメータを管理している場合、旧名が残っていないかを確認し、長時間 request を許容する構成では reverse proxy 側の timeout との整合も見ておくとよい。

## 参考リンク

- [llama.cpp release b9311](https://github.com/ggml-org/llama.cpp/releases/tag/b9311)
- [llama.cpp release b9320](https://github.com/ggml-org/llama.cpp/releases/tag/b9320)
- [llama.cpp release b9330](https://github.com/ggml-org/llama.cpp/releases/tag/b9330)
- [llama.cpp release b9360](https://github.com/ggml-org/llama.cpp/releases/tag/b9360)
- [llama.cpp release b9384](https://github.com/ggml-org/llama.cpp/releases/tag/b9384)
- [llama.cpp release b9387](https://github.com/ggml-org/llama.cpp/releases/tag/b9387)
- [llama.cpp release b9402](https://github.com/ggml-org/llama.cpp/releases/tag/b9402)
- [llama.cpp release b9411](https://github.com/ggml-org/llama.cpp/releases/tag/b9411)
- [llama.cpp release b9414](https://github.com/ggml-org/llama.cpp/releases/tag/b9414)
- [llama.cpp release b9434](https://github.com/ggml-org/llama.cpp/releases/tag/b9434)
- [llama.cpp release b9439](https://github.com/ggml-org/llama.cpp/releases/tag/b9439)

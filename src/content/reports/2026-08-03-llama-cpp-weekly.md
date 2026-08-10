---
title: "llama.cpp 週報 2026-08-03"
slug: llama-cpp-weekly-2026-08-03
pubDate: 2026-08-10T09:03:28+09:00
periodStart: 2026-08-03T00:00:00+09:00
periodEnd: 2026-08-09T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b10231"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10231"
  - title: "llama.cpp release b10236"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10236"
  - title: "llama.cpp release b10237"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10237"
  - title: "llama.cpp release b10238"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10238"
  - title: "llama.cpp release b10242"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10242"
  - title: "llama.cpp release b10249"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10249"
  - title: "llama.cpp release b10254"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10254"
  - title: "llama.cpp release b10255"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10255"
  - title: "llama.cpp release b10262"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10262"
  - title: "llama.cpp release b10270"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10270"
  - title: "llama.cpp release b10285"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10285"
  - title: "llama.cpp release b10289"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10289"
  - title: "llama.cpp release b10291"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10291"
  - title: "llama.cpp release b10293"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10293"
  - title: "llama.cpp release b10295"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10295"
  - title: "llama.cpp release b10305"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10305"
  - title: "llama.cpp release b10313"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10313"
  - title: "llama.cpp release b10322"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10322"
  - title: "llama.cpp release b10328"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10328"
  - title: "llama.cpp release b10329"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10329"
  - title: "llama.cpp release b10330"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10330"
  - title: "llama.cpp release b10333"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10333"
description: "2026-08-03 週の llama.cpp 更新まとめ。Qwen3-TTS、DeepSeek-OCR、DSpark/MTP、server tools/isolation、SYCL/Vulkan/Metal/CUDA/ROCm/OpenCL backend などを中心に整理。"
draft: false
---

## 概要

2026-08-03 週の llama.cpp は、公式 GitHub Releases API と各 release page で確認できる範囲では b10231 から b10333 までの 77 件が対象になる。b10231 は 2026-08-03 03:14 JST の公開、b10333 は 2026-08-09 20:21 JST の公開で、この週の JST 期間内に確認できた最後の対象 release だった。

今週は、Qwen3-TTS、DeepSeek-OCR、Unlimited-OCR、DeepSeek V4 Flash 0731、DeepSeek V3.2 MTP、Qwen3-Next MTP、DSpark sidecar resolution など、model/multimodal/speculative decoding の対応が広がった。特に b10270 の Qwen3-TTS は `llama-tts` binary の破壊的変更を伴うため、音声系 workflow では移行確認が必要になる。

server 側では built-in tools の実行環境と WebUI の制御が目立つ。`get_info` tool、`file_glob_search` の directory walk hardening、router LRU scheduler、Docker 経由の初期 tool isolation、working directory chip の表示条件見直しが入っており、agent/tool 利用を前提にした server 運用の安全性と観測性が強化されている。

backend では SYCL、Vulkan、Metal、CUDA、ROCm/HIP、OpenCL、CPU/SpaceMiT に広く修正が入った。SYCL は quantized KV cache 対応の oneDNN SDPA、DSv4 ops、SSM_CONV の load coalescing、UE4M3 parsing 修正が中心で、Vulkan は GATED_LINEAR_ATTN と DeviceLost 診断、Metal は DSv4 Lightning Indexer と NORM/RMS_NORM correctness、CUDA は penalties sampler と RMS_NORM/MUL/ROPE fusion が焦点になっている。

## 主な変更

- Model/speculative decoding では b10231 が DSpark sidecar resolution を追加し、`-hfd` tag、手動 sidecar 指定、明示 `-md` 指定時の discovery 抑制を他の speculative sidecar と揃えた。b10237 は DeepSeek V3.2 の MTP、b10238 は Qwen3-Next の MTP support を追加している。b10251 は GLM-4.7-Flash の MTP、b10254 は DeepSeek V4 Flash 0731 template と structured output/reasoning effort まわりの template test を追加した。
- Multimodal/audio/OCR では b10270 が Qwen3-TTS support を追加した。text model、speaker encoder、code predictor、code2wav、voice clone demo、`mtmd_helper_gen_audio` API、`llama-tts` の再設計を含む大きな変更で、release note は `llama-tts` binary の breaking change を明記している。OCR 周辺では b10285 が DeepSeek-OCR multi-row batching、b10287 が Unlimited-OCR の `max_tiles` と converter setting、b10319 が `longest_edge` の min/max pixels 無視を修正した。
- Server/tools/WebUI では b10249 が `get_info` tool を追加し、OS/working directory probe の失敗時 handling も固めた。b10289 は `file_glob_search` の directory walk を強化し、Windows junction や unreadable directory、deadline、invalid limit の扱いを見直した。b10297 は `/cors-proxy` の empty response 修正、b10313 は router LRU scheduler、b10328 は Docker 経由の初期 tool isolation、b10329 は working directory を読む tool が有効な時だけ WebUI が working directory control を出す変更になる。b10331 は isolated tool の working directory を `get_info` から報告する。
- Memory/model loading/graph では b10247 が split graph inputs を dynamic allocation にし、b10259 が load 時の tensor reshape を許可した。b10269 は DFlash の `wo_a` reshape loading、b10284 は MTP layers の memory allocation、b10295 は quantized reshaped tensor strides を修正している。b10290 は mtmd/ggml に `ggml_build_forward_order`、b10298 は mtmd chunk save/load function を追加した。
- SYCL では b10255 が oneDNN SDPA path を Q4_0-Q8_0 と F32 KV cache に拡張し、prefill 条件では on-device dequantize/convert から fused systolic kernel に流せるようにした。b10256 は non-contiguous concat kernel の parallelization、b10303 は Arc770 の `FLASH_ATTN_EXT` error、b10305 は DSv4 の `LIGHTNING_INDEXER` と hyper-connection 系 ops、b10306 は GLU flat path、b10307 は unsigned UE4M3 parsing、b10322 は SSM_CONV window loads の coalescing を入れている。b10322 の release note では Arc Pro B70 の backend op microbenchmark で約 1.85-1.87x の改善例も示されている。
- Vulkan/Metal/OpenCL では b10262 が Vulkan backend に `GATED_LINEAR_ATTN` op を追加し、b10291 が submission batching threshold と DeviceLost 診断 tooling を修正した。Metal は b10234 の F16 binary ops、b10235 の SILU_BACK、b10236 の DSv4 Lightning Indexer、b10299 の Lightning Indexer kernel memory 回避、b10321 の NORM/RMS_NORM partial simdgroup correctness が中心になる。OpenCL は b10233 が GLU local workgroup size、b10246 が large Q6_K `lm_head` の flat GEMV routing を調整した。
- CUDA/ROCm/CPU では b10241 が CUDA block_reduce の shared memory data race、b10242 が penalties sampler の backend sampler、b10293 が ROCm CI と gfx1151 fixes、b10327 が quantized copy kernel launches の thread/block count、b10330 が RMS_NORM + MUL + ROPE fusion を追加した。b10333 は SpaceMiT backend の Q5_0 dispatch 漏れを修正している。CI/vendor 側では b10252 の BoringSSL 0.20260803.0、b10253 の cpp-httplib 0.52.0、b10276 の `npm ci` preference も入った。

## 影響

Qwen3-TTS を試している環境では、b10270 以降の `llama-tts` binary と mtmd audio generation API の変更を前提に script を見直す必要がある。既存の TTS invocation、speaker encoder/code2wav model の配置、timings 出力、language code、voice clone demo 由来の設定は、古い手順のままだと動かない可能性が高い。

DeepSeek/Qwen/GLM 系で speculative decoding を使う場合は、DSpark、DeepSeek V3.2 MTP、Qwen3-Next MTP、GLM-4.7-Flash MTP の追加により対象 model が増える。一方で sidecar 自動解決、`-hfd` tag、明示 `-md` の優先順位、MTP layer memory allocation、quantized reshaped tensor stride 修正が重なっているため、実際に選ばれる draft/sidecar path と token acceptance をログで確認した方がよい。

`llama-server` を built-in tools や WebUI agent workflow と組み合わせている場合は、b10249、b10289、b10328、b10329 を優先して確認したい。filesystem を読む tool がある時だけ working directory UI を出す変更、Docker tool isolation、directory walk hardening は安全側の変更だが、既存の automation が working directory command や glob search の結果に依存している場合は挙動差が出る。

backend 別では、Intel GPU/SYCL は quantized KV cache の SDPA、Arc770 `FLASH_ATTN_EXT`、SSM_CONV、DSv4 ops、UE4M3 parsing を分けて smoke test したい。Apple Silicon/Metal は DSv4 Lightning Indexer と NORM/RMS_NORM の非典型 row length、Vulkan は DeviceLost 再現条件と GATED_LINEAR_ATTN、CUDA は penalties sampler と RMS_NORM/MUL/ROPE fusion、ROCm は gfx1151 integrated GPU、OpenCL は large Q6_K `lm_head` と GLU が確認対象になる。

## 参考リンク

- [llama.cpp release b10231](https://github.com/ggml-org/llama.cpp/releases/tag/b10231)
- [llama.cpp release b10236](https://github.com/ggml-org/llama.cpp/releases/tag/b10236)
- [llama.cpp release b10237](https://github.com/ggml-org/llama.cpp/releases/tag/b10237)
- [llama.cpp release b10238](https://github.com/ggml-org/llama.cpp/releases/tag/b10238)
- [llama.cpp release b10242](https://github.com/ggml-org/llama.cpp/releases/tag/b10242)
- [llama.cpp release b10249](https://github.com/ggml-org/llama.cpp/releases/tag/b10249)
- [llama.cpp release b10254](https://github.com/ggml-org/llama.cpp/releases/tag/b10254)
- [llama.cpp release b10255](https://github.com/ggml-org/llama.cpp/releases/tag/b10255)
- [llama.cpp release b10262](https://github.com/ggml-org/llama.cpp/releases/tag/b10262)
- [llama.cpp release b10270](https://github.com/ggml-org/llama.cpp/releases/tag/b10270)
- [llama.cpp release b10285](https://github.com/ggml-org/llama.cpp/releases/tag/b10285)
- [llama.cpp release b10289](https://github.com/ggml-org/llama.cpp/releases/tag/b10289)
- [llama.cpp release b10291](https://github.com/ggml-org/llama.cpp/releases/tag/b10291)
- [llama.cpp release b10293](https://github.com/ggml-org/llama.cpp/releases/tag/b10293)
- [llama.cpp release b10295](https://github.com/ggml-org/llama.cpp/releases/tag/b10295)
- [llama.cpp release b10305](https://github.com/ggml-org/llama.cpp/releases/tag/b10305)
- [llama.cpp release b10313](https://github.com/ggml-org/llama.cpp/releases/tag/b10313)
- [llama.cpp release b10322](https://github.com/ggml-org/llama.cpp/releases/tag/b10322)
- [llama.cpp release b10328](https://github.com/ggml-org/llama.cpp/releases/tag/b10328)
- [llama.cpp release b10329](https://github.com/ggml-org/llama.cpp/releases/tag/b10329)
- [llama.cpp release b10330](https://github.com/ggml-org/llama.cpp/releases/tag/b10330)
- [llama.cpp release b10333](https://github.com/ggml-org/llama.cpp/releases/tag/b10333)

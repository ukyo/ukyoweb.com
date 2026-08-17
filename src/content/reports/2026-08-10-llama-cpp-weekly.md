---
title: "llama.cpp 週報 2026-08-10"
slug: llama-cpp-weekly-2026-08-10
pubDate: 2026-08-17T09:03:08+09:00
periodStart: 2026-08-10T00:00:00+09:00
periodEnd: 2026-08-16T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b10336"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10336"
  - title: "llama.cpp release b10342"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10342"
  - title: "llama.cpp release b10344"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10344"
  - title: "llama.cpp release b10353"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10353"
  - title: "llama.cpp release b10355"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10355"
  - title: "llama.cpp release b10356"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10356"
  - title: "llama.cpp release b10357"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10357"
  - title: "llama.cpp release b10369"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10369"
  - title: "llama.cpp release b10375"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10375"
  - title: "llama.cpp release b10413"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10413"
  - title: "llama.cpp release b10414"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10414"
  - title: "llama.cpp release b10416"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10416"
  - title: "llama.cpp release b10419"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10419"
  - title: "llama.cpp release b10425"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10425"
  - title: "llama.cpp release b10427"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10427"
  - title: "llama.cpp release b10429"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10429"
  - title: "llama.cpp release b10431"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10431"
  - title: "llama.cpp release b10434"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10434"
  - title: "llama.cpp release b10437"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10437"
  - title: "llama.cpp release b10441"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10441"
  - title: "llama.cpp release b10442"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10442"
  - title: "llama.cpp release b10444"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10444"
  - title: "llama.cpp release b10447"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10447"
  - title: "llama.cpp release b10448"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10448"
  - title: "llama.cpp release b10451"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10451"
  - title: "llama.cpp release b10452"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10452"
  - title: "llama.cpp release b10453"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10453"
description: "2026-08-10 週の llama.cpp 更新まとめ。Granite-Switch、Kimi-K3、MiniMax、MTP/speculative decoding、server 応答性、安全性修正、SYCL/Vulkan/OpenVINO/Metal/ROCm/OpenCL/WebGPU backend などを中心に整理。"
draft: false
---

## 概要

2026-08-10 週の llama.cpp は、公式 GitHub Releases API と release page で確認できる範囲では b10336 から b10453 までの 55 件が対象になる。b10336 は 2026-08-10 17:18 JST の公開、b10453 は 2026-08-16 21:54 JST の公開で、この週の JST 期間内に確認できた最後の対象 release だった。

今週は model 対応と speculative decoding まわりが大きく進んだ。Granite-Switch、Nemotron MTP、Pocket-TTS、MiniMax Text/M1、Kimi-K3 text model が追加され、draft model の GGUF metadata から spec type を推定する変更や、`--models-dir` から MTP assistant model を探す変更も入った。

server と chat runtime では、decode 中でも `/metrics` と `/slots` にアクセスできるようにする変更、`yield_to_queue` thread model の再設計、`index.html` の no-cache 配信、`reasoning_effort` の template 受け渡し、Qwen/LFM2 の tool-call parser 修正がまとまって入った。運用中の server で観測性と UI 更新の確実性を上げる方向の変更が目立つ。

backend では SYCL、Vulkan、OpenVINO、Metal、ROCm/HIP、OpenCL、WebGPU、CPU/Android/WASI に広く修正が入った。特に ROCm 7.14 への release target 移行、OpenVINO の Qwen3.5/mxfp4/各 op 対応、SYCL の ESIMD/host pinned memory/FFN fusion、Vulkan Intel Xe coopmat 最適化、Metal TQ2_0、OpenCL FA prefill、WebGPU WGSL 整理が確認できる。

## 主な変更

- Model support では b10342 が Granite-Switch architecture を追加し、Granite-4.1 系の dense all-attention model に per-token で選択される LoRA adapter を組み込む POC backend を導入した。b10437 は MiniMaxText01ForCausalLM と MiniMaxM1ForCausalLM、b10448 は Kimi-K3 text model を追加している。b10369 は Pocket-TTS 対応で、transposed convolution を GEMM と col2im に寄せる実装も含む。
- Speculative decoding/MTP では b10344 が Nemotron Nano の MTP support、b10355 が multi-output backend sampling、b10412 が DFlash/DSpark 両方の backend sampling、b10413 と b10415 が draft GGUF metadata からの spec type/MTP draft type auto-detect、b10444 が `--models-dir` による MTP assistant model loading を追加した。local draft model と sidecar の自動解決が、以前より運用しやすい形に寄っている。
- Chat/template/server では b10375 が Qwen model 向け bare function parsing を厳格化し、b10417 が LFM2 tool call argument name の prefix ambiguity を修正した。b10434 は OpenAI Chat Completions 互換の `reasoning_effort` を template に渡す変更、b10452 は `supports_string_content` と `supports_typed_content` の扱いを整理する変更になる。server 側では b10416 が stable name の `index.html` を no-cache にし、b10429 が decode 中の `/metrics` と `/slots` access を許可し、b10447 が `yield_to_queue` の thread model を再設計した。
- Safety/correctness では b10338 が MoE model save/load で shared/chunk FFN length key が clobber される問題を直し、b10353 が CUDA/Metal の `ROLL` に contiguous source requirement を付けて silent wrong result を避けるようにした。b10435 は Jinja `gather_string_parts` の quadratic cost、b10443 は GGUF array type read 前の check、b10451 は LoRA tensor data が file bounds 内にあるかの check を追加している。
- SYCL/OpenVINO/Vulkan では b10408 が DMMV ESIMD kernel、b10418 が host pinned memory、b10425 が gated-delta-net state writeback copy fusion、b10427 が q4_K dense FFN の `mul_mat(gate) + mul_mat(up) + GLU` fusion を入れた。b10419 は OpenVINO backend で Qwen3.5、mxfp4、FILL、multi-dim SET_ROWS、SIGMOID、SQR/SQRT などを広げ、b10442 は Intel Xe coopmat 向けの shared memory stride padding と SLM reshape を追加している。
- Metal/ROCm/OpenCL/WebGPU/CPU では b10414 が Metal backend に TQ2_0 support を追加し、b10356 が release target を ROCm 7.14 に切り替え、b10405 が HIP build から `-funsafe-math-optimizations` を外して RDNA3.5 の greedy argmax divergence を避ける方向にした。b10357 は OpenCL FA prefill kernel の K tile local-memory transpose、b10336 と b10359 は WebGPU WGSL/CI 周辺の修正、b10354 は Android の CPU affinity mask、b10426 は WASI の single-thread 強制、b10430 は virtual iGPU device を許可する変更になる。

## 影響

Granite-Switch、MiniMax、Kimi-K3、Pocket-TTS を試す環境では、converter、GGUF metadata、model architecture 判定、audio/multimodal graph のいずれも新しい前提が増えている。特に Granite-Switch は POC CPU backend として入っているため、性能評価よりも convert/load/生成の smoke test を先に分けて確認した方がよい。

Speculative decoding を使う運用では、Nemotron MTP、DFlash/DSpark backend sampling、local draft GGUF metadata からの spec type 推定、`--models-dir` の MTP assistant discovery が一気に重なった。既存の `-md` 指定、sidecar naming、draft model の配置、backend sampling の token 分布が変わりうるので、b10444 以降で実際に選ばれた draft model と acceptance/log を確認したい。

`llama-server` を常時運用している場合は、b10416、b10429、b10447 を優先的に見る価値がある。UI が古い `index.html` に固定される問題の回避、decode 中の `/metrics` と `/slots` の取得、queue/thread model の再設計は、監視と負荷時の挙動に直接効く可能性がある。

Backend 別では、Intel GPU/SYCL は ESIMD、host pinned memory、gated-delta-net、q4_K dense FFN fusion、Intel Xe coopmat の組み合わせで性能と correctness を測る必要がある。ROCm/HIP は 7.14 package と unsafe math removal、OpenVINO は Qwen3.5/mxfp4 と追加 op、Metal は TQ2_0 と ROLL fallback、OpenCL は FA prefill、WebGPU は flash_attn WGSL refactor 後の CI/ブラウザ実行をそれぞれ smoke test 対象にしたい。

## 参考リンク

- [llama.cpp release b10336](https://github.com/ggml-org/llama.cpp/releases/tag/b10336)
- [llama.cpp release b10342](https://github.com/ggml-org/llama.cpp/releases/tag/b10342)
- [llama.cpp release b10344](https://github.com/ggml-org/llama.cpp/releases/tag/b10344)
- [llama.cpp release b10353](https://github.com/ggml-org/llama.cpp/releases/tag/b10353)
- [llama.cpp release b10355](https://github.com/ggml-org/llama.cpp/releases/tag/b10355)
- [llama.cpp release b10356](https://github.com/ggml-org/llama.cpp/releases/tag/b10356)
- [llama.cpp release b10357](https://github.com/ggml-org/llama.cpp/releases/tag/b10357)
- [llama.cpp release b10369](https://github.com/ggml-org/llama.cpp/releases/tag/b10369)
- [llama.cpp release b10375](https://github.com/ggml-org/llama.cpp/releases/tag/b10375)
- [llama.cpp release b10413](https://github.com/ggml-org/llama.cpp/releases/tag/b10413)
- [llama.cpp release b10414](https://github.com/ggml-org/llama.cpp/releases/tag/b10414)
- [llama.cpp release b10416](https://github.com/ggml-org/llama.cpp/releases/tag/b10416)
- [llama.cpp release b10419](https://github.com/ggml-org/llama.cpp/releases/tag/b10419)
- [llama.cpp release b10425](https://github.com/ggml-org/llama.cpp/releases/tag/b10425)
- [llama.cpp release b10427](https://github.com/ggml-org/llama.cpp/releases/tag/b10427)
- [llama.cpp release b10429](https://github.com/ggml-org/llama.cpp/releases/tag/b10429)
- [llama.cpp release b10431](https://github.com/ggml-org/llama.cpp/releases/tag/b10431)
- [llama.cpp release b10434](https://github.com/ggml-org/llama.cpp/releases/tag/b10434)
- [llama.cpp release b10437](https://github.com/ggml-org/llama.cpp/releases/tag/b10437)
- [llama.cpp release b10441](https://github.com/ggml-org/llama.cpp/releases/tag/b10441)
- [llama.cpp release b10442](https://github.com/ggml-org/llama.cpp/releases/tag/b10442)
- [llama.cpp release b10444](https://github.com/ggml-org/llama.cpp/releases/tag/b10444)
- [llama.cpp release b10447](https://github.com/ggml-org/llama.cpp/releases/tag/b10447)
- [llama.cpp release b10448](https://github.com/ggml-org/llama.cpp/releases/tag/b10448)
- [llama.cpp release b10451](https://github.com/ggml-org/llama.cpp/releases/tag/b10451)
- [llama.cpp release b10452](https://github.com/ggml-org/llama.cpp/releases/tag/b10452)
- [llama.cpp release b10453](https://github.com/ggml-org/llama.cpp/releases/tag/b10453)

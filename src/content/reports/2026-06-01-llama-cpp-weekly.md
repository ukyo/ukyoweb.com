---
title: "llama.cpp 週報 2026-06-01"
slug: llama-cpp-weekly-2026-06-01
pubDate: 2026-06-08T09:03:41+09:00
periodStart: 2026-06-01T00:00:00+09:00
periodEnd: 2026-06-07T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9458"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9458"
  - title: "llama.cpp release b9460"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9460"
  - title: "llama.cpp release b9464"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9464"
  - title: "llama.cpp release b9468"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9468"
  - title: "llama.cpp release b9470"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9470"
  - title: "llama.cpp release b9474"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9474"
  - title: "llama.cpp release b9479"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9479"
  - title: "llama.cpp release b9481"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9481"
  - title: "llama.cpp release b9482"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9482"
  - title: "llama.cpp release b9488"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9488"
  - title: "llama.cpp release b9495"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9495"
  - title: "llama.cpp release b9499"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9499"
  - title: "llama.cpp release b9509"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9509"
  - title: "llama.cpp release b9510"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9510"
  - title: "llama.cpp release b9519"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9519"
  - title: "llama.cpp release b9521"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9521"
  - title: "llama.cpp release b9523"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9523"
  - title: "llama.cpp release b9534"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9534"
  - title: "llama.cpp release b9535"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9535"
  - title: "llama.cpp release b9536"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9536"
  - title: "llama.cpp release b9542"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9542"
description: "2026-06-01 週の llama.cpp 更新まとめ。reasoning control、speculative/MTP、Hexagon/OpenCL/SYCL/Vulkan/Metal、Gemma 4/Granite/Mellum 対応を中心に整理。"
draft: false
---

## 概要

2026-06-01 週の llama.cpp は、推論中の reasoning 制御、speculative/MTP のメモリ・性能調整、複数 backend の最適化、multimodal と埋め込みモデル対応が主な焦点だった。公式 GitHub Releases で確認できる範囲では、b9458 から b9542 までにこの流れがまとまっている。

特に目立つのは、server/WebUI 側で reasoning を途中終了する制御 endpoint が入ったこと、`llama_context` の最大 output 予約が見直されたこと、Hexagon と CUDA/SYCL/OpenCL/WebGPU/Vulkan/Metal で MTP や quantized path に関わる更新が続いたことだ。モデル面では Granite multilingual embeddings R2、Mellum、Qwen3 SSM、Gemma 4 unified/audio、StepFun 3.5 MTP などが追加・修正された。

## 主な変更

- b9468 で server に reasoning control endpoint が追加された。streaming 中の completion id を使って live slot を特定し、reasoning phase を途中終了するための `reasoning_end` action と WebUI 側の状態管理が入っている。reasoning budget を手動で扱う運用では、生成を止めずに思考部分だけを切り上げる経路になる。
- b9460 と b9464 では speculative/MTP 周辺の output 数と VRAM 予約が整理された。`llama_context` の最大 output 予約を `n_seqs` に合わせられる場合は小さくし、server 側の `n_outputs_max` と draft context の扱いを見直している。draft-simple の自動有効化も外された。
- b9470 で Hexagon backend に MUL_MAT、MUL_MAT_ID、FLASH_ATTN、GATED_DELTA_NET の cleanup と最適化が入った。F32 matmul、HMX の matmul/FlashAttention pipeline、MXFP4 handling、GDN 最適化、fusion logic の修正など、Qwen3.5 系を含む最新モデル向けの backend 整備が続いている。
- b9521 では CUDA の `mul_mat_vec_q_moe` が PDL に組み込まれ、Blackwell 環境で MTP performance を押し上げる変更として benchmark が示された。b9491 では PDL 使用時の restrict による race condition を避ける修正も入っており、PDL path は性能と安定性の両面で調整が進んだ。
- b9519 で SYCL backend に CUDA 由来の multi-column MMVQ 最適化が移植された。speculative/MTP verify が使う小さな multi-column batch でも reorder path を起動できるようになり、SYCL 環境の MTP/verify 系 workload で効きやすい更新になっている。
- b9536 では OpenCL の get_rows、cpy、concat、Q6_K flat GEMV が改善された。b9484 の Q4_K/Q6_K very large M 向け flat variant と合わせて、OpenCL backend は大きな行数や小さな copy/concat の処理を詰めている。
- b9499 では WebGPU の FlashAttention refactor と quantization support の標準化が入った。flash_attn と mul_mat の quantization logic を抽象化し、tile path に quantization support を追加している。
- b9534 では Vulkan の FWHT support が Intel 向けに拡張され、shared memory reduction、MoltenVK AMD での subgroup shuffle 無効化、Intel Windows driver bug 回避など backend/driver 差を踏まえた条件分岐が追加された。b9458 では pipeline compile 中に device mutex を保持しないようにする変更も入った。
- b9459 と b9500 では Metal backend が更新された。GLU kernel は f16/f32 の template 化で native tensor type の load/store を使えるようになり、rset heartbeat は 500ms から 5ms に短縮された。
- モデル対応では、b9481 で IBM Granite multilingual embeddings R2、b9482 で Mellum architecture、b9488 で Qwen3 SSM arch test support、b9480 で StepFun 3.5 MTP、b9495 で Qwen3.5 MTP の hidden state handling、b9493/b9494/b9496/b9503 で Gemma 4 unified/audio projector 周辺の mtmd 修正が入った。
- server/UI では b9474 で Thinking mode toggle と reasoning effort selector が追加され、b9478 で SSE ping interval、b9509 で checkpoint restore の不要な発火回避、b9530 で CLI の model params propagation、b9535 で LFM2/LFM2.5 tool parser 修正、b9542 で completion の不要な static 削除が入った。

## 影響

server を OpenAI compatible API や WebUI として使っている場合、b9468 と b9474 は確認対象になる。reasoning 対応モデルを使う環境では、UI の thinking toggle、reasoning effort、reasoning control endpoint が入ったことで、長い thinking phase を途中で切り上げる運用を設計しやすくなる。一方で、新しい control endpoint は completion id を基準にするため、reverse proxy や独自 client が streaming id を保持しているかを確認したい。

MTP/speculative decoding を使う環境では、b9460、b9464、b9495、b9519、b9521 の影響が大きい。output 予約と draft context の見直しは VRAM 使用量に効く可能性があるが、draft-simple の自動有効化が外れたため、従来の起動オプションに暗黙の speculative behavior を期待していた場合は明示設定を見直す必要がある。

accelerator/backend 別では、Hexagon、CUDA Blackwell、SYCL、OpenCL、WebGPU、Vulkan、Metal のいずれも更新が入っている。特に Hexagon の fused op と HMX path、CUDA PDL、SYCL multi-column MMVQ、OpenCL flat GEMV、WebGPU FlashAttention quantization、Vulkan FWHT は correctness と性能の両方に関わるため、アップデート後は `llama-bench` だけでなく既知 prompt、長い context、MTP verify、multimodal 入力で短い smoke test を回したい。

モデル追加では Granite multilingual embeddings R2 と Mellum が新規の変換・実行対象になる。Gemma 4 unified/audio、StepFun 3.5 MTP、Qwen3/Qwen3.5 系は複数の修正が連続しているため、これらのモデルを試す場合は週前半の build ではなく b9503 以降、できれば b9542 近辺を基準にする方が差分を減らせる。

## 参考リンク

- [llama.cpp release b9458](https://github.com/ggml-org/llama.cpp/releases/tag/b9458)
- [llama.cpp release b9460](https://github.com/ggml-org/llama.cpp/releases/tag/b9460)
- [llama.cpp release b9464](https://github.com/ggml-org/llama.cpp/releases/tag/b9464)
- [llama.cpp release b9468](https://github.com/ggml-org/llama.cpp/releases/tag/b9468)
- [llama.cpp release b9470](https://github.com/ggml-org/llama.cpp/releases/tag/b9470)
- [llama.cpp release b9474](https://github.com/ggml-org/llama.cpp/releases/tag/b9474)
- [llama.cpp release b9479](https://github.com/ggml-org/llama.cpp/releases/tag/b9479)
- [llama.cpp release b9481](https://github.com/ggml-org/llama.cpp/releases/tag/b9481)
- [llama.cpp release b9482](https://github.com/ggml-org/llama.cpp/releases/tag/b9482)
- [llama.cpp release b9488](https://github.com/ggml-org/llama.cpp/releases/tag/b9488)
- [llama.cpp release b9495](https://github.com/ggml-org/llama.cpp/releases/tag/b9495)
- [llama.cpp release b9499](https://github.com/ggml-org/llama.cpp/releases/tag/b9499)
- [llama.cpp release b9509](https://github.com/ggml-org/llama.cpp/releases/tag/b9509)
- [llama.cpp release b9510](https://github.com/ggml-org/llama.cpp/releases/tag/b9510)
- [llama.cpp release b9519](https://github.com/ggml-org/llama.cpp/releases/tag/b9519)
- [llama.cpp release b9521](https://github.com/ggml-org/llama.cpp/releases/tag/b9521)
- [llama.cpp release b9523](https://github.com/ggml-org/llama.cpp/releases/tag/b9523)
- [llama.cpp release b9534](https://github.com/ggml-org/llama.cpp/releases/tag/b9534)
- [llama.cpp release b9535](https://github.com/ggml-org/llama.cpp/releases/tag/b9535)
- [llama.cpp release b9536](https://github.com/ggml-org/llama.cpp/releases/tag/b9536)
- [llama.cpp release b9542](https://github.com/ggml-org/llama.cpp/releases/tag/b9542)

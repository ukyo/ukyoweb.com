---
title: "llama.cpp 週報 2026-07-13"
slug: llama-cpp-weekly-2026-07-13
pubDate: 2026-07-20T09:01:51+09:00
periodStart: 2026-07-13T00:00:00+09:00
periodEnd: 2026-07-19T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9976"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9976"
  - title: "llama.cpp release b9977"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9977"
  - title: "llama.cpp release b9979"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9979"
  - title: "llama.cpp release b9982"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9982"
  - title: "llama.cpp release b9985"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9985"
  - title: "llama.cpp release b9986"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9986"
  - title: "llama.cpp release b9990"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9990"
  - title: "llama.cpp release b9993"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9993"
  - title: "llama.cpp release b9994"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9994"
  - title: "llama.cpp release b10004"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10004"
  - title: "llama.cpp release b10005"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10005"
  - title: "llama.cpp release b10010"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10010"
  - title: "llama.cpp release b10011"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10011"
  - title: "llama.cpp release b10016"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10016"
  - title: "llama.cpp release b10017"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10017"
  - title: "llama.cpp release b10021"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10021"
  - title: "llama.cpp release b10025"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10025"
  - title: "llama.cpp release b10032"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10032"
  - title: "llama.cpp release b10034"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10034"
  - title: "llama.cpp release b10036"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10036"
  - title: "llama.cpp release b10042"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10042"
  - title: "llama.cpp release b10043"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10043"
  - title: "llama.cpp release b10045"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10045"
  - title: "llama.cpp release b10048"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10048"
  - title: "llama.cpp release b10050"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10050"
  - title: "llama.cpp release b10052"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10052"
  - title: "llama.cpp release b10058"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10058"
  - title: "llama.cpp release b10067"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10067"
  - title: "llama.cpp release b10068"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10068"
description: "2026-07-13 週の llama.cpp 更新まとめ。server/API、reasoning、Hy3/MTP、DeepSeek V4、SYCL/CUDA/OpenCL/Hexagon/Vulkan/Metal などを中心に整理。"
draft: false
---

## 概要

2026-07-13 週の llama.cpp は、公式 GitHub Releases で確認できる範囲では b9976 から b10068 までの 66 件が対象になる。b9976 は 2026-07-13 00:22 JST の公開なので今回の週に含め、b10068 は 2026-07-18 22:36 JST の公開で、2026-07-19 23:59:59 JST までに確認できた最後の対象リリースだった。

今週は、server/API の互換性と運用設定、reasoning と multimodal tool result の修正、Hy3 と Minimax2 の speculative/MTP 対応、DeepSeek V4 の cache/graph/quantization 修正、そして SYCL/CUDA/OpenCL/Adreno/Hexagon/Vulkan/Metal/KleidiAI など複数 backend の最適化が集中した。b10000 到達を挟みつつ、派手な単一機能というより、実運用で踏みやすい edge case と hardware 別 performance path を詰めた週だった。

## 主な変更

- server/API では b9977 で Anthropic から OpenAI 互換形式へ変換する際に `tool_result` 内の画像 block が落ちる問題が修正され、b9980 では `--no-mmproj-auto` 指定時に model を multimodal と見なさないようになった。b9982 は per-request の `reasoning_budget_tokens` を chat completions で尊重する修正で、b9986 は force-open template まわりの reasoning leak を直している。
- server の運用面では、b10010 で `--cors-*` options が追加され、b10011 で prompt cache state の ownership が整理された。b10041 は空または存在しない `Origin` header の扱いを調整し、b10045 は mtmd 使用時にも text-only slot save/restore を許可している。
- multimodal と入力安全性では b9979 が mtmd の embedded NUL による silent prompt truncation を修正した。画像や tool output を経由する運用では、prompt や tool result が途中で欠落しないかという観点で重要な修正になる。
- speculative/MTP と model 対応では、b9990 で Minimax2 EAGLE3 support が追加され、b9993 で Tencent Hunyuan 3 の `hy_v3` architecture と MTP speculative decoding support が入った。b10048 では tensor parallel の対象として Phi3、Bert、Plamo2/3、ChatGLM などの修正も行われている。
- DeepSeek V4 では b10005 が `seq_rm` と `seq_cp` の扱いを修正し、b10021 が graph split を削減した。b10032 は CUDA 版 `GGML_OP_LIGHTNING_INDEXER` を実装し、b10067 は DeepSeek-V4 の `ffn_gate_tid2eid` i32 routing table を quantization 対象から外す修正を入れている。
- DFlash では b10068 が K/V quantization 使用時に injected K/V cache を rotate する修正を入れた。KV cache や quantized cache を組み合わせる推論経路では、正しさに直結する変更として見る必要がある。
- SYCL は b9984 で Q2_K の DMMV reorder path、b9985 で fused top-k MoE、b9995 で Battlemage 向け FlashAttention thread 設定、b10016 で oneDNN graph API を使う XMX Flash Attention path が追加された。b10017 は USM system allocation の最小 buffer size を 1 GiB から 4 GiB へ上げ、VRAM を超える model weight の扱いを改善する方向の変更になっている。
- CUDA/HIP では b9992 が MMQ kernel configuration を refactor し、b10025 が quantized concat の contiguity 要件を緩和した。b10035 は Q1_0 element extraction の改善、b10040 は HIP build で `prop.integrated` を復元、b10042 は Volta/Turing でも CUDA graphs を有効化し、b10043 は CUDA virtual devices を support した。
- OpenCL/Adreno は b10007 で `cl_khr_integer_dot_product` がない device の初期化と dp4 kernel 呼び出しを修正し、b10034 と b10036 で Adreno A7x/A850 系の compiler issue を避けるため MoE/FA/repack 経路を調整した。b10056 は ABS op、b10064 は q4_K noshuffle scales の転置、b10066 は Q6_K MoE kernel の bin kernel lib 利用を追加している。
- Vulkan/Metal/Q2_0 では b9994 が Metal の Q2_0 support を追加し、b10004 が Vulkan/CPU の f16 `SET_ROWS` support を拡張した。b10050 は Vulkan async copy の transfer queue race を避ける同期修正で、b10058 は Vulkan backend に Q2_0 support を追加している。
- Hexagon と CPU/KleidiAI では b10012 が hmx-queue signal enum narrowing 問題を修正し、b10052 が L2 cache handling と MUL_MAT 周辺を更新した。b9999 と b10051 では KleidiAI の SME/SME2 kernel dispatch が進み、ARM SME2 環境での dispatch correctness と performance path が整理されている。
- tooling/testing では b10003 が tokenize tool を common args へ寄せ、b10031 が `--stdin` の mutual-exclusion check を落とした。b10001 は `test-export-graph-ops` の引数なし実行時 segfault、b10046 は recurrent state rollback test の実行不足、b10061 は DeepSeek V4 HC test の NaN sentinel 問題を修正している。

## 影響

server を OpenAI/Anthropic 互換 API、tool call、CORS、prompt cache、slot save/restore と組み合わせて使っている環境では、今週の変更は直接確認対象になる。特に multimodal tool result、per-request reasoning budget、`Origin` header、prompt cache clear/save の挙動は、互換 API の表面には小さく見えても利用者からは挙動差として見えやすい。

model 側では Hy3、Minimax2 EAGLE3、DeepSeek V4、DFlash、tensor parallel 対象 model を使う場合に更新価値が高い。MTP/speculative decoding、KV cache、routing table quantization、sequence 操作、graph split が絡むため、単純な model load だけでなく、long context、cache reuse、speculative path、quantized KV cache を含む smoke test を行いたい。

backend 別では、SYCL は XMX/oneDNN Flash Attention と MoE、CUDA は virtual devices/CUDA graphs/lightning indexer、OpenCL/Adreno は compiler workaround と MoE/FA 経路、Vulkan/Metal は Q2_0 と f16 `SET_ROWS`、Hexagon は L2 cache と MUL_MAT が焦点になる。該当 hardware を使う運用では、`llama-bench` の平均値だけでなく、prefill/decode、MoE、vision/multimodal、long prompt、slot restore を分けて確認する方が安全だ。

## 参考リンク

- [llama.cpp release b9976](https://github.com/ggml-org/llama.cpp/releases/tag/b9976)
- [llama.cpp release b9977](https://github.com/ggml-org/llama.cpp/releases/tag/b9977)
- [llama.cpp release b9979](https://github.com/ggml-org/llama.cpp/releases/tag/b9979)
- [llama.cpp release b9982](https://github.com/ggml-org/llama.cpp/releases/tag/b9982)
- [llama.cpp release b9985](https://github.com/ggml-org/llama.cpp/releases/tag/b9985)
- [llama.cpp release b9986](https://github.com/ggml-org/llama.cpp/releases/tag/b9986)
- [llama.cpp release b9990](https://github.com/ggml-org/llama.cpp/releases/tag/b9990)
- [llama.cpp release b9993](https://github.com/ggml-org/llama.cpp/releases/tag/b9993)
- [llama.cpp release b9994](https://github.com/ggml-org/llama.cpp/releases/tag/b9994)
- [llama.cpp release b10004](https://github.com/ggml-org/llama.cpp/releases/tag/b10004)
- [llama.cpp release b10005](https://github.com/ggml-org/llama.cpp/releases/tag/b10005)
- [llama.cpp release b10010](https://github.com/ggml-org/llama.cpp/releases/tag/b10010)
- [llama.cpp release b10011](https://github.com/ggml-org/llama.cpp/releases/tag/b10011)
- [llama.cpp release b10016](https://github.com/ggml-org/llama.cpp/releases/tag/b10016)
- [llama.cpp release b10017](https://github.com/ggml-org/llama.cpp/releases/tag/b10017)
- [llama.cpp release b10021](https://github.com/ggml-org/llama.cpp/releases/tag/b10021)
- [llama.cpp release b10025](https://github.com/ggml-org/llama.cpp/releases/tag/b10025)
- [llama.cpp release b10032](https://github.com/ggml-org/llama.cpp/releases/tag/b10032)
- [llama.cpp release b10034](https://github.com/ggml-org/llama.cpp/releases/tag/b10034)
- [llama.cpp release b10036](https://github.com/ggml-org/llama.cpp/releases/tag/b10036)
- [llama.cpp release b10042](https://github.com/ggml-org/llama.cpp/releases/tag/b10042)
- [llama.cpp release b10043](https://github.com/ggml-org/llama.cpp/releases/tag/b10043)
- [llama.cpp release b10045](https://github.com/ggml-org/llama.cpp/releases/tag/b10045)
- [llama.cpp release b10048](https://github.com/ggml-org/llama.cpp/releases/tag/b10048)
- [llama.cpp release b10050](https://github.com/ggml-org/llama.cpp/releases/tag/b10050)
- [llama.cpp release b10052](https://github.com/ggml-org/llama.cpp/releases/tag/b10052)
- [llama.cpp release b10058](https://github.com/ggml-org/llama.cpp/releases/tag/b10058)
- [llama.cpp release b10067](https://github.com/ggml-org/llama.cpp/releases/tag/b10067)
- [llama.cpp release b10068](https://github.com/ggml-org/llama.cpp/releases/tag/b10068)

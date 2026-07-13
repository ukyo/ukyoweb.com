---
title: "llama.cpp 週報 2026-07-06"
slug: llama-cpp-weekly-2026-07-06
pubDate: 2026-07-13T09:03:50+09:00
periodStart: 2026-07-06T00:00:00+09:00
periodEnd: 2026-07-12T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9874"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9874"
  - title: "llama.cpp release b9876"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9876"
  - title: "llama.cpp release b9878"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9878"
  - title: "llama.cpp release b9890"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9890"
  - title: "llama.cpp release b9893"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9893"
  - title: "llama.cpp release b9895"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9895"
  - title: "llama.cpp release b9908"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9908"
  - title: "llama.cpp release b9911"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9911"
  - title: "llama.cpp release b9913"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9913"
  - title: "llama.cpp release b9917"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9917"
  - title: "llama.cpp release b9927"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9927"
  - title: "llama.cpp release b9928"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9928"
  - title: "llama.cpp release b9935"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9935"
  - title: "llama.cpp release b9939"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9939"
  - title: "llama.cpp release b9951"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9951"
  - title: "llama.cpp release b9952"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9952"
  - title: "llama.cpp release b9957"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9957"
  - title: "llama.cpp release b9963"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9963"
  - title: "llama.cpp release b9968"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9968"
  - title: "llama.cpp release b9969"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9969"
  - title: "llama.cpp release b9970"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9970"
  - title: "llama.cpp release b9972"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9972"
  - title: "llama.cpp release b9974"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9974"
  - title: "llama.cpp release b9975"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9975"
description: "2026-07-06 週の llama.cpp 更新まとめ。DeepSeek V4、server/tooling、tokenizer/cache、Q2_0、ET backend、CUDA/OpenCL/Hexagon/Vulkan/Metal/SYCL などを中心に整理。"
draft: false
---

## 概要

2026-07-06 週の llama.cpp は、公式 GitHub Releases で確認できる範囲では b9874 から b9975 までが対象になる。b9874 は 2026-07-06 00:53 JST の公開なので今回の週に含め、b9979 は 2026-07-13 JST の公開なので除外した。

今週は、DeepSeek V4 関連の correctness と性能改善、server と CLI の HTTP/streaming/tooling 整理、tokenizer と prompt cache の安全性修正、Q2_0 quantization と ET backend の追加、そして CUDA/OpenCL/Adreno/Hexagon/Vulkan/Metal/WebGPU/SYCL/HIP/CPU backend の広範な更新が目立った。特定モデルや特定 accelerator だけで発火する問題を潰しつつ、新しい backend と quantization の土台も入った週だった。

## 主な変更

- DeepSeek V4 周辺では b9905 で quantized KV cache、b9952 で FlashAttention 使用時の KQ mask と raw_k の扱い、b9970 で DeepSeek V3.2/V4 の lightning indexer を実装する `GGML_OP_LIGHTNING_INDEXER` が入った。b9973 では cache clear の範囲が full ではなく sequence 単位に修正されている。
- speculative/draft model では b9878 で draft model の stale tensor-split params が修正され、b9910 で draft model の fit 判定と load の不整合が直された。b9895 では prompt shrink 時の ngram-map out-of-bounds read も修正されている。
- server/API は b9908 で prompt cache の RAM limit が実質的な上限として扱われるようになり、b9909 で `/responses` API stream に timings と progress が追加された。b9923 では SSE replay buffer 周辺が整理され、b9972 では `exec_shell_command` の streaming が可能になった。
- CLI と tool 実装では b9927 で CLI が HTTP ベースの実装へ移行し、router mode も扱う方向に進んだ。b9947 では `--output` option が追加され、b9957 では server tools が改善され、`apply_diff` の削除と edit/tool I/O abstraction の整理が行われた。
- tokenizer/metadata の安全性では b9917 で T5/UGM GGUF の precompiled charsmap 処理における out-of-bounds read が修正された。b9975 では GGUF metadata の空 key を拒否するようになり、壊れた入力や悪意あるファイルに対する防御が強くなっている。
- quantization と core op では b9913 で Q2_0 quantization の type definition と CPU backend が追加された。b9915、b9918、b9925 では CPU/Metal/CUDA の `GGML_OP_SET_ROWS` f16 対応が進み、b9924 では fused ops の整理も行われた。
- 新 backend では b9951 で初期 ET backend が入り、MUL_MAT、ROPE、RMS_NORM、GLU、SOFT_MAX、GET_ROWS、SET_ROWS、MUL_MAT_ID などの kernel と build/doc が追加された。まだ初期段階だが、ET-Soc 系の実験経路として注目したい変更になる。
- CUDA/HIP は b9874 で quantized type の concat、b9888 で FlashAttention の K/V type validation、b9890 で cuBLAS refactor、b9911 で NVFP4 の MMVQ post-scale fusion、b9948 で `ggml_top_k()` と `ggml_argsort()` の一時 buffer 削減が入った。b9974 では空き memory がない CUDA device を列挙したときの hard crash が回避される。
- OpenCL/Adreno は b9893 で FlashAttention decode の一般的な最適化、b9931 で ragged-tile MoE prefill FP16 GEMM、b9949 で cluster-parallel decode FA、b9968 で int8 dp4 dense と MoE prefill optimization が追加された。Adreno で MoE や long prompt を試す環境では影響が大きい。
- Hexagon は b9928 で MUL_MAT、MUL_MAT_ID、FLASH_ATTN_EXT の VTCM layout と pipeline が改善され、b9935 で VISION RoPE、b9946 で unary ops の tiling/tracing/optimization、b9965 で small tensor の ARGSORT performance が改善された。
- Vulkan/Metal/WebGPU は b9884 で Vulkan の 32-bit integer overflow、b9929 で small AMD GPU の submission threshold、b9932 で GCN の FlashAttention mask optimization、b9969 で Adreno の large matmul routing が調整された。Metal は b9891 で COL2IM_1D、b9939 で depthwise CONV_2D_DW に対応し、WebGPU は b9934 で FlashAttention vector path の subgroup split が調整された。
- SYCL は b9897 で environment variable 名が disable から enable 系に整理され、b9899 で ARGSORT、b9902 で cross entropy loss/backward、b9904 で CONT/CPY の unsupported unit test case が修正された。b9881 と b9906 では HIP build の math option も調整されている。
- model/multimodal では b9963 で DeepSeek-OCR v1 の multi-tile dynamic resolution と image preprocessor 統合が入った。b9935 の VISION RoPE や Metal の convolution 系 op と合わせて、vision/multimodal 経路の backend coverage が広がっている。

## 影響

DeepSeek V4、DeepSeek-OCR、MoE model、speculative decoding、draft/MTP model を使っている場合、今週の更新は直接影響する。KV cache、lightning indexer、tensor split、draft model load、FlashAttention mask、tool streaming が絡むため、model load だけでなく長い prompt、cache reuse、streaming response、speculative decode を含めて確認したい。

server や Web UI を運用している場合は、prompt cache の RAM limit、`/responses` stream の progress/timings、SSE replay、HTTP ベース CLI、server tools の変更を見る必要がある。特に cache 上限を前提に memory sizing している環境では、b9908 以降で eviction と保存スキップの挙動が変わる。

backend 別では、CUDA は NVFP4、FlashAttention、top-k/argsort、device memory query、OpenCL/Adreno は FA decode と MoE prefill、Hexagon は VTCM layout と VISION RoPE、Vulkan は AMD/Adreno、Metal は COL2IM_1D と depthwise convolution、SYCL は unit test coverage と env var 名が焦点になる。該当 hardware では `llama-bench` に加え、代表モデルの prefill/decode、long context、MoE、vision path を分けて smoke test するのが安全だ。

## 参考リンク

- [llama.cpp release b9874](https://github.com/ggml-org/llama.cpp/releases/tag/b9874)
- [llama.cpp release b9876](https://github.com/ggml-org/llama.cpp/releases/tag/b9876)
- [llama.cpp release b9878](https://github.com/ggml-org/llama.cpp/releases/tag/b9878)
- [llama.cpp release b9890](https://github.com/ggml-org/llama.cpp/releases/tag/b9890)
- [llama.cpp release b9893](https://github.com/ggml-org/llama.cpp/releases/tag/b9893)
- [llama.cpp release b9895](https://github.com/ggml-org/llama.cpp/releases/tag/b9895)
- [llama.cpp release b9908](https://github.com/ggml-org/llama.cpp/releases/tag/b9908)
- [llama.cpp release b9911](https://github.com/ggml-org/llama.cpp/releases/tag/b9911)
- [llama.cpp release b9913](https://github.com/ggml-org/llama.cpp/releases/tag/b9913)
- [llama.cpp release b9917](https://github.com/ggml-org/llama.cpp/releases/tag/b9917)
- [llama.cpp release b9927](https://github.com/ggml-org/llama.cpp/releases/tag/b9927)
- [llama.cpp release b9928](https://github.com/ggml-org/llama.cpp/releases/tag/b9928)
- [llama.cpp release b9935](https://github.com/ggml-org/llama.cpp/releases/tag/b9935)
- [llama.cpp release b9939](https://github.com/ggml-org/llama.cpp/releases/tag/b9939)
- [llama.cpp release b9951](https://github.com/ggml-org/llama.cpp/releases/tag/b9951)
- [llama.cpp release b9952](https://github.com/ggml-org/llama.cpp/releases/tag/b9952)
- [llama.cpp release b9957](https://github.com/ggml-org/llama.cpp/releases/tag/b9957)
- [llama.cpp release b9963](https://github.com/ggml-org/llama.cpp/releases/tag/b9963)
- [llama.cpp release b9968](https://github.com/ggml-org/llama.cpp/releases/tag/b9968)
- [llama.cpp release b9969](https://github.com/ggml-org/llama.cpp/releases/tag/b9969)
- [llama.cpp release b9970](https://github.com/ggml-org/llama.cpp/releases/tag/b9970)
- [llama.cpp release b9972](https://github.com/ggml-org/llama.cpp/releases/tag/b9972)
- [llama.cpp release b9974](https://github.com/ggml-org/llama.cpp/releases/tag/b9974)
- [llama.cpp release b9975](https://github.com/ggml-org/llama.cpp/releases/tag/b9975)

---
title: "llama.cpp 週報 2026-06-29"
slug: llama-cpp-weekly-2026-06-29
pubDate: 2026-07-06T09:03:33+09:00
periodStart: 2026-06-29T00:00:00+09:00
periodEnd: 2026-07-05T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9833"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9833"
  - title: "llama.cpp release b9837"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9837"
  - title: "llama.cpp release b9840"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9840"
  - title: "llama.cpp release b9844"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9844"
  - title: "llama.cpp release b9846"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9846"
  - title: "llama.cpp release b9849"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9849"
  - title: "llama.cpp release b9850"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9850"
  - title: "llama.cpp release b9852"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9852"
  - title: "llama.cpp release b9855"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9855"
  - title: "llama.cpp release b9857"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9857"
  - title: "llama.cpp release b9859"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9859"
  - title: "llama.cpp release b9860"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9860"
  - title: "llama.cpp release b9864"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9864"
  - title: "llama.cpp release b9866"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9866"
  - title: "llama.cpp release b9867"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9867"
  - title: "llama.cpp release b9870"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9870"
  - title: "llama.cpp release b9871"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9871"
  - title: "llama.cpp release b9873"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9873"
description: "2026-06-29 週の llama.cpp 更新まとめ。MiniCPM5、DeepSeek V4、DFlash、server/UI、CUDA/OpenCL/Hexagon/Vulkan/WebGPU などを中心に整理。"
draft: false
---

## 概要

2026-06-29 週の llama.cpp は、公式 GitHub Releases で確認できる範囲では b9833 から b9873 までが対象になる。b9833 は 2026-06-29 00:32 JST の公開なので今回の週に含め、b9874 以降は 2026-07-06 JST の公開なので除外した。

今週は、MiniCPM5 と DeepSeek V4 の対応、reasoning/tool call 周辺の調整、DFlash と StepFun 系の修正、server/UI の SSE・IPv6・モデル一覧改善、そして CUDA/OpenCL/Hexagon/Vulkan/WebGPU/CPU backend の性能・correctness 改善が目立った。特に backend 側は小さな修正が多く、特定モデルや特定 GPU でだけ表面化する問題を潰す週だった。

## 主な変更

- chat/template 周辺では b9833 で MiniCPM5 tool call parser が入り、XML tool call と grammar preserved-token trigger の扱いが整理された。b9837 では `--reasoning-preserve` が追加され、reasoning content を保持したい client や検証用途で出力制御の選択肢が増えている。
- model 対応では b9840 で DeepSeek V4 の conversion、graph input、state save/load、chat template などが追加された。b9850 では Qwen3Next 向けの layer input tensor 登録が入り、Qwen Coder Next の DFlash 利用時の入力割り当て問題も修正されている。
- server/API では b9842 で `/v1/models` の preset と cached model entry の重複が取り除かれ、b9849 で `[host]:port` 形式の IPv6 literal を URL authority として扱えるようになった。b9864 では Web UI の silent SSE stream に 1 秒 ping と 3 秒 visibility kick の仕組みが入り、長い prefill 中に健全な接続を落としにくくしている。
- DFlash/speculative decoding では b9867 で `spec-draft-p-min` が DFlash に対応し、`n_min` と `n_max` の guard も追加された。b9873 では DFlash の KV injection pass のように K/V を保存するだけの graph で、未割り当て buffer に対して K/V rotation input を設定しようとして abort する問題が修正された。
- chat/parser では b9870 で StepFun parser に渡す message が trim され、長い reasoning loop を起こすケースへの regression test も追加された。StepFun 系 template や typed content parts を使う環境では確認したい修正になる。
- public API では b9860 で model file type 名を返す `llama_model_ftype_name()` が追加され、その後 `llama_ftype_name()` として整理された。quantization 名を UI、logging、adapter から表示する用途で使いやすい API になっている。
- CUDA/HIP 周辺では b9847 で Gemma E4B MTP FlashAttention、b9848 で 65535 行を超える table の `get_rows_back`、b9851 で FlashAttention mask kernel の stride 計算に関する integer truncation/overflow が修正された。b9856 では FlashAttention で `__restrict__` と PDL の使い方が揃えられ、b9862 では gated_delta_net 後の redundant CUDA copy が削減された。
- CUDA の MoE では b9866 で 288 experts の topk-moe fusion が有効化された。Step-3.7-Flash のような 288 expert model で、batch size 1 の token decode 時に多数の小さな routing node へ落ちる状況を避ける狙いがある。
- OpenCL は b9852 で q1_0 の初期対応と Adreno GEMM/GEMV が入り、b9859 で precompiled binary kernel を library から読み込めるようになった。MXFP4 や q8_0、q4 系 MoE GEMM kernel を事前コンパイルして使う方向の下地が整っている。
- Hexagon は b9857 で FlashAttention が大きく rework され、VTCM allocation、FA_SELECT、instrumentation、matmul task folding、FP kernel 分離、ADD fusion などがまとめて更新された。Qualcomm 系 backend で FlashAttention を使う場合は重点的に見たい変更だ。
- Vulkan/WebGPU/CPU では b9846 で Asahi Linux 向け matmul shader の BK loop 調整、b9844 で WebGPU の NVFP4 対応、b9855 で CPU の NVFP4 dot product に AVX2 最適化と UE4M3 LUT が入った。NVFP4 や Apple/Asahi Linux 環境を触る場合に影響しやすい。
- core ggml では b9843 で split compute 中の同期削減変更が revert され、b9871 で quantized type の CPU concat 実装が修正され、quantized concat test も追加された。scheduler と quantized tensor 操作の correctness を優先した調整と見てよい。
- dependency/配布面では b9861 で cpp-httplib が 0.49.0 に更新された。HTTP server/client 経路を使う環境では、server 側変更とあわせて簡単な接続確認をしておきたい。

## 影響

MiniCPM5、DeepSeek V4、Qwen3Next、StepFun、Step-3.7-Flash、Gemma E4B MTP を試している場合、今週の更新は直接影響する。parser、chat template、DFlash、MTP FlashAttention、MoE routing が絡むため、単に model load が通るかではなく、tool call、reasoning 出力、speculative decoding、長い prompt の decode を含めた smoke test が必要になる。

server/router を使う環境では、`/v1/models` の表示、IPv6 literal、SSE ping interval の挙動を確認したい。特に Web UI 経由で長い prefill を走らせる場合、b9864 の ping/kick 変更により接続維持の挙動が変わる可能性がある。

backend 別では、CUDA は FlashAttention、GDN、MoE、large table の `get_rows_back` に関する修正が多い。OpenCL は q1_0 と precompiled kernel、Hexagon は FlashAttention rework、WebGPU/CPU は NVFP4 が焦点になる。該当 hardware では `llama-bench` だけでなく、代表モデルで prefill、decode、MTP/speculative、長めの context を分けて確認するのが安全だ。

## 参考リンク

- [llama.cpp release b9833](https://github.com/ggml-org/llama.cpp/releases/tag/b9833)
- [llama.cpp release b9837](https://github.com/ggml-org/llama.cpp/releases/tag/b9837)
- [llama.cpp release b9840](https://github.com/ggml-org/llama.cpp/releases/tag/b9840)
- [llama.cpp release b9844](https://github.com/ggml-org/llama.cpp/releases/tag/b9844)
- [llama.cpp release b9846](https://github.com/ggml-org/llama.cpp/releases/tag/b9846)
- [llama.cpp release b9849](https://github.com/ggml-org/llama.cpp/releases/tag/b9849)
- [llama.cpp release b9850](https://github.com/ggml-org/llama.cpp/releases/tag/b9850)
- [llama.cpp release b9852](https://github.com/ggml-org/llama.cpp/releases/tag/b9852)
- [llama.cpp release b9855](https://github.com/ggml-org/llama.cpp/releases/tag/b9855)
- [llama.cpp release b9857](https://github.com/ggml-org/llama.cpp/releases/tag/b9857)
- [llama.cpp release b9859](https://github.com/ggml-org/llama.cpp/releases/tag/b9859)
- [llama.cpp release b9860](https://github.com/ggml-org/llama.cpp/releases/tag/b9860)
- [llama.cpp release b9864](https://github.com/ggml-org/llama.cpp/releases/tag/b9864)
- [llama.cpp release b9866](https://github.com/ggml-org/llama.cpp/releases/tag/b9866)
- [llama.cpp release b9867](https://github.com/ggml-org/llama.cpp/releases/tag/b9867)
- [llama.cpp release b9870](https://github.com/ggml-org/llama.cpp/releases/tag/b9870)
- [llama.cpp release b9871](https://github.com/ggml-org/llama.cpp/releases/tag/b9871)
- [llama.cpp release b9873](https://github.com/ggml-org/llama.cpp/releases/tag/b9873)

---
title: "llama.cpp 週報 2026-07-27"
slug: llama-cpp-weekly-2026-07-27
pubDate: 2026-08-03T09:02:08+09:00
periodStart: 2026-07-27T00:00:00+09:00
periodEnd: 2026-08-02T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b10141"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10141"
  - title: "llama.cpp release b10142"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10142"
  - title: "llama.cpp release b10144"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10144"
  - title: "llama.cpp release b10148"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10148"
  - title: "llama.cpp release b10155"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10155"
  - title: "llama.cpp release b10158"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10158"
  - title: "llama.cpp release b10164"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10164"
  - title: "llama.cpp release b10171"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10171"
  - title: "llama.cpp release b10174"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10174"
  - title: "llama.cpp release b10180"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10180"
  - title: "llama.cpp release b10181"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10181"
  - title: "llama.cpp release b10188"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10188"
  - title: "llama.cpp release b10201"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10201"
  - title: "llama.cpp release b10203"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10203"
  - title: "llama.cpp release b10205"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10205"
  - title: "llama.cpp release b10208"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10208"
  - title: "llama.cpp release b10210"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10210"
  - title: "llama.cpp release b10213"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10213"
  - title: "llama.cpp release b10216"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10216"
  - title: "llama.cpp release b10218"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10218"
  - title: "llama.cpp release b10219"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10219"
  - title: "llama.cpp release b10224"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10224"
  - title: "llama.cpp release b10227"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10227"
  - title: "llama.cpp release b10228"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10228"
  - title: "llama.cpp release b10229"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b10229"
description: "2026-07-27 週の llama.cpp 更新まとめ。MiniMax-M3、MiMo/MiniCPM、Qwen3/DeepSeek/GLM、speculative decoding、SYCL/Vulkan/WebGPU/OpenCL/CUDA/Metal などを中心に整理。"
draft: false
---

## 概要

2026-07-27 週の llama.cpp は、公式 GitHub Releases API と各 release page で確認できる範囲では b10141 から b10229 までの 69 件が対象になる。b10141 は 2026-07-27 08:03 JST の公開、b10229 は 2026-08-02 23:31 JST の公開で、この週の JST 期間内に確認できた最後の対象 release だった。b10231 以降は 2026-08-03 JST 公開のため、今回の集計からは外している。

今週は、MiniMax-M3 の vision support、MiMo-V2.5 audio、MiniCPM-V 4.6 downsample など multimodal 周辺が大きく進んだ。加えて Qwen3 specialized parser、DeepSeekV4 MTP + DSpark、GLM-5.2 NextN/MTP、gpt-oss 向け Eagle3-v3 といった chat/parser/speculative decoding の対応が広がっている。

backend 側では SYCL、Vulkan、WebGPU、OpenCL/Adreno、CUDA、Metal、ZenDNN に広く手が入った。特に SYCL oneMKL GEMM flash attention、Vulkan POOL_1D、WebGPU quantized KV long-context flash attention、OpenCL/Adreno multi-stream 修正、CUDA Mamba-2 SSD prefill acceleration は、対象 hardware では性能や correctness に直接効く可能性がある。

## 主な変更

- Multimodal では b10142 が MiniMax-M3 vision support を追加した。MiniMax-M3 の vision tower、mmproj/clip graph、MSA、CUDA native indexer、sparse attention、prompt caching、multi-stream handling まで含む大きな変更で、release note では一部の GGUF は再生成が必要と明記されている。b10141 はその周辺の Android build 修正、b10155 は MiMo-V2.5 の RVQ-based audio input、b10218 は MiniCPM-V 4.6 の downsample mode と converter/preprocessor 対応を追加している。
- Chat/parser/model compatibility では b10227 が Qwen3 specialized parser を追加し、thinking 内 tool call、`<tool_call>` omission、tool delimiter まわりを扱う。DeepSeek 系では b10217 が DS4 の thinking 内 tool call を有効化し、b10228 が DeepSeekV4 MTP + DSpark を追加した。b10153 は Nanbeige4.2、b10173 は Laguna-S-2.1 の model type、b10184/b10225 は MiMo V2/MTP tensor loading の見直しを進めている。
- Speculative decoding では b10174 が GLM_DSA、つまり GLM-5.2 の NextN/MTP を `--spec-type draft-mtp` の対象にした。b10158 は gpt-oss model 向け Eagle3-v3 support、b10148 は `-hfd` と明示 `-md` を併用したときに draft sidecar 自動解決が手動指定を上書きしないよう修正した。b10210 は draft token replay が必要な場合の accepted tokens 計算を正している。
- Server/WebUI では b10144 が slash を含む model name の stream stop/resume route を query string ベースに直し、model load 中の stop、page reload、resume polling の扱いを改善した。b10178 は prompt cache slot selection の similarity checking に trace logging を追加し、b10199 は server で input embedding から次 token を生成する経路を補強した。CLI では b10219 が `--reasoning-preserve` の後続 turn に効くよう、chat history に `reasoning_content` を保存する。
- Memory/cache/graph では b10145 が `-lm mlock` を追加し、mmap せずに mlock する load mode を扱えるようにした。b10152 は NextN/MTP block を `n_gpu_layers` に数え、front layers が GPU に残るようにした。b10206 は DeepSeek V4/MLA models で K/V cache type を揃え、V cache が quantized の場合に flash attention を有効化する。b10213 は rotated KV cache quantization をサポートした。
- SYCL では b10208 が XMX-accelerated prompt processing 向けに oneMKL GEMM flash attention を追加し、F16/BF16/F32/quantized KV cache、multi-turn corruption、dispatch gate、scratch size を含む広い調整を入れた。b10180 は unary elementwise ops の contiguous fast path と 32-bit index math、b10202 は RMS_NORM + MUL fusion、b10203 は q2_0 `mul_mat`、b10204 は dev2dev memcpy、b10207 は copy の未対応 type、b10226 は iGPU classification を修正している。
- Vulkan/WebGPU では b10216 が Vulkan backend に `GGML_OP_POOL_1D` を追加し、boundary crash と test coverage も直した。b10215 は Windows Intel GPU driver version check を入れ、既知 crash を driver version に応じて緩和する。b10198 は Vulkan quantized concat、b10165 は Vulkan FA の iq4_nl support を戻した。WebGPU では b10172 が binding alias と 4GB 超 buffer offset/view offset の問題、b10201 が quantized KV の long-context `flash_attn_vec`、b10224 が f16 repeat support を追加している。
- OpenCL/CUDA/Metal/ZenDNN では b10171 が Adreno KQ/KQV image kernels を multi-stream batch では general path に逃がし、perplexity が大きく壊れる問題を修正した。b10229 は OpenCL backend init の `ref_count` を直し、profiling data flush に関わる終了処理を安定させている。CUDA では b10164 が Mamba-2 prefill 向け chunked SSD matmul、b10181 が shared memory 48 KiB 未満の device で MMQ を避ける fallback、b10209 が Q2_0 extraction の `__byte_perm` 化、b10194 が transpose-free GEMV を追加した。Metal は b10159 の FWHT kernel と b10188 の memory unwire 修正、ZenDNN は b10205 の group matmul direct API が中心になる。
- 周辺更新として b10176 は RPC tensor memset、b10179 と b10221 は BoringSSL vendor update、b10195 と b10223 は test/CI 修正、b10186 は KleidiAI CI と stringop overflow warning 修正を入れている。大きな機能追加の直後に backend と CI の細かい修正が続いており、週内の後半は stabilizing work も多い。

## 影響

`llama-server` を router mode、Hugging Face repository 名、stream stop/resume、autoload、WebUI reload と組み合わせて使っている環境では、b10144 の変更を優先して確認したい。model name に slash が入る構成、model load 中のキャンセル、page reload 後の resume は、ユーザーに見える挙動が変わる。

speculative decoding を使う場合は、GLM-5.2、gpt-oss、DeepSeekV4、MiMo V2 で対象範囲が広がる一方、draft sidecar の自動解決、`-md` の優先順位、draft token replay、MTP tensor loading の条件も変わっている。手動で draft model を指定する script は、ログと実際に読まれる file path を確認した方がよい。

multimodal は MiniMax-M3、MiMo-V2.5 audio、MiniCPM-V 4.6 の利用者にとって重要な週になった。MiniMax-M3 は GGUF 再生成が必要な変更を含むため、古い変換済み file をそのまま使う検証では原因切り分けが難しくなる。vision/audio input、prompt caching、multi-stream、long context を分けて smoke test したい。

backend 別では、Intel GPU/SYCL は oneMKL FA と iGPU classification、Vulkan は POOL_1D と Windows Intel driver gate、WebGPU は long context quantized KV と f16 repeat、Adreno/OpenCL は multi-stream correctness、CUDA は Mamba-2 と低 shared-memory device fallback、Metal は model free 時の wired memory が焦点になる。該当 hardware では単純な `llama-bench` だけでなく、server multi-stream、long prompt、quantized KV、vision/audio、speculative decoding を分けて確認するのがよい。

`--reasoning-preserve` を使う CLI workflow では、b10219 以降で prior reasoning の保存と再注入が期待通りになるかを会話の複数 turn で見る必要がある。Qwen3/DeepSeek 系の tool call parser も更新されているため、thinking と tool call が混在する template では regression test を残しておきたい。

## 参考リンク

- [llama.cpp release b10141](https://github.com/ggml-org/llama.cpp/releases/tag/b10141)
- [llama.cpp release b10142](https://github.com/ggml-org/llama.cpp/releases/tag/b10142)
- [llama.cpp release b10144](https://github.com/ggml-org/llama.cpp/releases/tag/b10144)
- [llama.cpp release b10148](https://github.com/ggml-org/llama.cpp/releases/tag/b10148)
- [llama.cpp release b10155](https://github.com/ggml-org/llama.cpp/releases/tag/b10155)
- [llama.cpp release b10158](https://github.com/ggml-org/llama.cpp/releases/tag/b10158)
- [llama.cpp release b10164](https://github.com/ggml-org/llama.cpp/releases/tag/b10164)
- [llama.cpp release b10171](https://github.com/ggml-org/llama.cpp/releases/tag/b10171)
- [llama.cpp release b10174](https://github.com/ggml-org/llama.cpp/releases/tag/b10174)
- [llama.cpp release b10180](https://github.com/ggml-org/llama.cpp/releases/tag/b10180)
- [llama.cpp release b10181](https://github.com/ggml-org/llama.cpp/releases/tag/b10181)
- [llama.cpp release b10188](https://github.com/ggml-org/llama.cpp/releases/tag/b10188)
- [llama.cpp release b10201](https://github.com/ggml-org/llama.cpp/releases/tag/b10201)
- [llama.cpp release b10203](https://github.com/ggml-org/llama.cpp/releases/tag/b10203)
- [llama.cpp release b10205](https://github.com/ggml-org/llama.cpp/releases/tag/b10205)
- [llama.cpp release b10208](https://github.com/ggml-org/llama.cpp/releases/tag/b10208)
- [llama.cpp release b10210](https://github.com/ggml-org/llama.cpp/releases/tag/b10210)
- [llama.cpp release b10213](https://github.com/ggml-org/llama.cpp/releases/tag/b10213)
- [llama.cpp release b10216](https://github.com/ggml-org/llama.cpp/releases/tag/b10216)
- [llama.cpp release b10218](https://github.com/ggml-org/llama.cpp/releases/tag/b10218)
- [llama.cpp release b10219](https://github.com/ggml-org/llama.cpp/releases/tag/b10219)
- [llama.cpp release b10224](https://github.com/ggml-org/llama.cpp/releases/tag/b10224)
- [llama.cpp release b10227](https://github.com/ggml-org/llama.cpp/releases/tag/b10227)
- [llama.cpp release b10228](https://github.com/ggml-org/llama.cpp/releases/tag/b10228)
- [llama.cpp release b10229](https://github.com/ggml-org/llama.cpp/releases/tag/b10229)

---
title: "llama.cpp 週報 2026-06-22"
slug: llama-cpp-weekly-2026-06-22
pubDate: 2026-06-29T09:04:05+09:00
periodStart: 2026-06-22T00:00:00+09:00
periodEnd: 2026-06-28T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9748"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9748"
  - title: "llama.cpp release b9754"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9754"
  - title: "llama.cpp release b9760"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9760"
  - title: "llama.cpp release b9761"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9761"
  - title: "llama.cpp release b9767"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9767"
  - title: "llama.cpp release b9768"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9768"
  - title: "llama.cpp release b9774"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9774"
  - title: "llama.cpp release b9784"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9784"
  - title: "llama.cpp release b9788"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9788"
  - title: "llama.cpp release b9817"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9817"
  - title: "llama.cpp release b9827"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9827"
  - title: "llama.cpp release b9828"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9828"
  - title: "llama.cpp release b9830"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9830"
  - title: "llama.cpp release b9831"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9831"
  - title: "llama.cpp release b9832"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9832"
description: "2026-06-22 週の llama.cpp 更新まとめ。server/router、grammar/Jinja、Vulkan/SYCL/OpenCL/CUDA/WebGPU/Hexagon/OpenVINO、DFlash とモデル対応を中心に整理。"
draft: false
---

## 概要

2026-06-22 週の llama.cpp は、公式 GitHub Releases で確認できる範囲では b9748 から b9832 までが対象になる。b9833 は 2026-06-29 00:32 JST の公開なので、今回の集計からは除外した。

大きな流れは、server/router と tool/API 周辺の整備、grammar/Jinja の表現力とデバッグ性の改善、各 backend の correctness/性能調整、OpenVINO パッケージ更新、そして Granite Speech Plus、LFM2.5、Mamba2、DFlash などのモデル・方式対応だった。特に Vulkan は週を通して変更が多く、shader build の失敗検出、debug/test build、FlashAttention、Intel/MI50 向け path、graph submission timeout など複数の観点で手が入っている。

## 主な変更

- server/API では b9748 で schema に verbose field が追加され、b9752 で batch construction が整理された。b9753 では speculative model loading の進捗報告に stages が加わり、b9761 では router の model download が専用 process に分離された。大きなモデルを server/router 経由で扱うときの状態管理と進捗可視化が改善している。
- b9760 では input file schema が一般化され、raw base64 や video input を扱うための整理が進んだ。b9763 では tool call response API に id が追加され、OpenAI compatible client や tool use を扱う adapter で応答追跡をしやすくしている。
- grammar/template 周辺では、b9750 で Jinja の call statement が実装され、b9754 で stricter grammar generation 向けの PEG parser が入った。b9832 では Jinja に program dump 用 option が追加され、chat template の問題調査や複雑な template の検証がやりやすくなっている。
- sampling では b9757 で top-n-sigma sampler の無条件 softmax/sort が取り除かれた。b9831 では DFlash support が追加され、sliding window attention を layer type ごとに扱う実装が入っている。
- model 対応では b9768 で Granite Speech Plus、b9777 で LFM2.5 ColBERT/Embedding、b9804 で Mamba2 の expansion factor と state 次元 check が更新された。音声、embedding、state space 系モデルを試す環境では、今週の build が基準候補になる。
- Vulkan backend は b9769 で result-check/test debug build 時の link 問題が修正され、b9771 で shader variant 数を減らす調整、b9773/b9774 で GET_ROWS_BACK と unary/norm 系 test coverage、b9776 で FlashAttention の softmax overflow 回避、b9780 で shader compile failure を build failure として扱う変更が入った。さらに b9781 で graph submission batch を減らして timeout を避ける option、b9811 で coopmat2 conv path の compiler bug workaround、b9813 で Intel Xe-LPG Plus 向け coopmat1、b9814 で MI50 向け mul_mat_vecq 最適化、b9825 で step operator 修正が続いた。
- SYCL は b9758 で bf16 対応が bin_bcast/unary op に広がり、b9787 で conv_3d の unit test failure が修正された。b9788 では `--split-mode tensor` による tensor parallelism が入り、dual-GPU での split 運用に向けた重要な更新になっている。b9826 では norm の unit test failure も修正された。
- OpenCL は b9786 で non-contiguous row の norm をサポートし、b9803 で profiling batch の shutdown flush、b9828 で FlashAttention kernel の改善が入った。f16/f32 向け kernel と prefill prepass が整理され、OpenCL backend で長い prompt や FA を使う workload の確認対象になる。
- CUDA/HIP/MUSA 周辺では b9810 で vendor header 向けの batched SGEMM mapping が追加され、b9827 で同型・同形状の strided copy に `cudaMemcpy2DAsync` fast path が入った。b9820 の scheduler 更新では split compute 中の同期を減らす変更も戻されている。
- WebGPU は b9767 で small batch の MTP inference に mat-vec path を使う改善が入った。MTP verify や小さい batch の decoding をブラウザ/WebGPU backend で試す場合、性能差を確認したい変更だ。
- Hexagon は b9784 で MUL_MAT/MUL_MAT_ID の rework が入り、32x32 tiled weight repack、kernel params、cached graph などがまとめて更新された。Qualcomm 系端末での matmul path と graph reuse に関わる変更として扱いたい。
- OpenVINO は b9817 で 2026.2.1 への更新、self-contained release package、operator 改善が入った。b9823 では Windows OpenVINO が release check に追加され、配布物の検証範囲も広がっている。
- CLI/配布面では b9821 で app に `--version`、`--licenses`、`--help` が追加され、b9824 で rpc-server と export-graph-ops の binary 名が整理された。b9830 では `llama download` で offline flag を扱えるようになり、cache 済み model を network access なしで確認する automation を作りやすくなった。

## 影響

server/router を本番寄りに使っている場合、b9752、b9753、b9760、b9761、b9763 は重点的に見る価値がある。batch construction、input schema、model download process、tool call response id が変わっているため、独自 UI、reverse proxy、OpenAI compatible client、tool calling adapter がある環境では、streaming、file/video input、model load progress、tool response の紐付けを短い smoke test で確認したい。

backend 別では、Vulkan の変更量が最も大きい。debug/test build の link、shader compile failure、FA overflow、Intel Xe-LPG Plus、MI50、coopmat2 workaround、timeout 回避などが混在しているため、Vulkan を使う環境では build が通るかだけでなく、`llama-bench`、長い context、FlashAttention、対象 GPU ごとの representative prompt を回すのが安全だ。

SYCL の tensor parallelism、OpenVINO 2026.2.1、OpenCL FlashAttention、CUDA copy fast path、WebGPU MTP、Hexagon matmul rework は、それぞれ対象 hardware を持つユーザーには直接影響する。特に `--split-mode tensor`、OpenVINO の self-contained package、`llama download --offline` は運用や配布手順にも関わるので、CI/CD や offline cache を前提にした環境では option と artifact 名の確認が必要になる。

モデル面では Granite Speech Plus、LFM2.5、Mamba2、DFlash が今週の目立つ追加・修正だった。これらを試す場合は、週前半の b9748 近辺ではなく、少なくとも関連修正が入った b9804 以降、DFlash なら b9831 以降を基準にすると差分を減らせる。

## 参考リンク

- [llama.cpp release b9748](https://github.com/ggml-org/llama.cpp/releases/tag/b9748)
- [llama.cpp release b9754](https://github.com/ggml-org/llama.cpp/releases/tag/b9754)
- [llama.cpp release b9760](https://github.com/ggml-org/llama.cpp/releases/tag/b9760)
- [llama.cpp release b9761](https://github.com/ggml-org/llama.cpp/releases/tag/b9761)
- [llama.cpp release b9767](https://github.com/ggml-org/llama.cpp/releases/tag/b9767)
- [llama.cpp release b9768](https://github.com/ggml-org/llama.cpp/releases/tag/b9768)
- [llama.cpp release b9774](https://github.com/ggml-org/llama.cpp/releases/tag/b9774)
- [llama.cpp release b9784](https://github.com/ggml-org/llama.cpp/releases/tag/b9784)
- [llama.cpp release b9788](https://github.com/ggml-org/llama.cpp/releases/tag/b9788)
- [llama.cpp release b9817](https://github.com/ggml-org/llama.cpp/releases/tag/b9817)
- [llama.cpp release b9827](https://github.com/ggml-org/llama.cpp/releases/tag/b9827)
- [llama.cpp release b9828](https://github.com/ggml-org/llama.cpp/releases/tag/b9828)
- [llama.cpp release b9830](https://github.com/ggml-org/llama.cpp/releases/tag/b9830)
- [llama.cpp release b9831](https://github.com/ggml-org/llama.cpp/releases/tag/b9831)
- [llama.cpp release b9832](https://github.com/ggml-org/llama.cpp/releases/tag/b9832)

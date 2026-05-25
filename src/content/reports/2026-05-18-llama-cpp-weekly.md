---
title: "llama.cpp 週報 2026-05-18"
slug: llama-cpp-weekly-2026-05-18
pubDate: 2026-05-25T09:03:52+09:00
periodStart: 2026-05-18T00:00:00+09:00
periodEnd: 2026-05-24T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9194"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9194"
  - title: "llama.cpp release b9200"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9200"
  - title: "llama.cpp release b9235"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9235"
  - title: "llama.cpp release b9265"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9265"
  - title: "llama.cpp release b9272"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9272"
  - title: "llama.cpp release b9286"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9286"
  - title: "llama.cpp release b9289"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9289"
  - title: "llama.cpp release b9290"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9290"
  - title: "llama.cpp release b9297"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9297"
  - title: "llama.cpp release b9305"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9305"
description: "2026-05-18 週の llama.cpp 更新まとめ。MTP/speculative decoding、SYCL/Hexagon/ZenDNN、統合バイナリと UI build 修正を中心に整理。"
draft: false
---

## 概要

2026-05-18 週の llama.cpp は、JST 基準で b9194 から b9305 までが対象になる。b9194 は GitHub Releases 上では 2026-05-17 UTC の公開だが、Asia/Tokyo では 2026-05-18 01:06 になるため今週に含めた。

今週は MTP/speculative decoding の実用化に向けた整理が最も目立った。あわせて、Vulkan/SYCL/Hexagon/ZenDNN など backend ごとの性能・安定性改善、統合バイナリで公開されるツール群の拡張、UI build の修正が続いた。大きな単発機能というより、前週までに入った MTP・router・WebUI・各 backend 対応を運用しやすくする週だった。

## 主な変更

- MTP では prompt decode 時に不要な logits copy を避ける変更が入り、後続の b9235 では MTP clean-up として speculative decoding の CLI/環境変数/既定値/ログが整理された。`--spec-type` の候補、draft model の CPU scheduling、tensor override、`n_max=3` など実装とドキュメントの差分を詰める内容である。
- speculative decoding では、MTP drafts の `p-min`、ngram speculative decoding との併用、combined ngram + draft config の acceptance logic、`token` + `embd` batch の graph reuse が修正された。複数の speculator を組み合わせる経路がより安全に使えるようになっている。
- モデル対応では b9297 で NVFP4 MTP scale tensors が追加され、Qwen3.5 MTP tensors も紐づけられた。NVFP4 量子化と MTP を組み合わせるモデルを試す環境では、今週の重要な更新になる。
- backend では、b9194 の Vulkan SSM_CONV + BIAS + SILU fusion、b9265 の Hexagon SSM_CONV large prompt 修正、b9289 の SYCL gated_delta_net K>1、b9290 の SYCL Level Zero detection centralization が入った。Mamba/SSM 系や gated_delta_net 系の model path を複数 backend で固める流れが続いている。
- CPU 系では b9286 で ZenDNN backend に Q8_0 quantization support が追加され、最新 ZenDNN との同期も行われた。ZenDNN を使う x86 環境では、8-bit 量子化モデルの実行経路が広がる。
- アプリ/配布面では b9272 で統合バイナリ側に `batched-bench`、`fit-params`、`quantize`、`perplexity` が追加された。従来の個別 tool を使っていた利用者にとって、配布物から呼べるコマンドの範囲が広がる変更である。
- server/router では、router が unified binary の子プロセスを起動するときに subcommand を再注入する修正が入った。統合バイナリ化に伴う router mode の実行パスを安定させるための修正と見てよい。
- UI では b9305 で static lib の `-fPIC` 追加と host compiled embed helper の rename が行われ、UI build の問題が修正された。配布 asset には UI も含まれ、release asset 数も b9305 で 31 に増えている。
- そのほか、`--fit` と verbosity 4 の組み合わせ、speculative device name 取得時の nullptr crash、ggml fallback 2D get の iface check など、実運用で踏みやすい小さな edge case も修正されている。

## 影響

MTP や speculative decoding を使う場合は、今週の更新で CLI option と既定値が変わっている点を確認したい。特に `--spec-default`、`--spec-type`、draft model の CPU/offload 指定、ngram 併用、MTP drafts の acceptance/p-min 周辺は、既存の起動スクリプトで明示指定している値と衝突しないかを見る必要がある。

Qwen3.5 MTP や NVFP4 MTP 系の GGUF を試している環境では、b9297 以降を基準にする価値がある。前週の MTP support だけでなく、scale tensor と model tensor linking まで含めて追従しているかが重要になる。

backend ごとの影響は限定的だが、対象者には大きい。Vulkan/Hexagon/SYCL で SSM・gated_delta_net・large prompt を使う場合、今週の build は性能と安定性の両方で確認対象になる。ZenDNN backend を使う CPU 環境では Q8_0 の smoke test を追加しておくとよい。

配布物をそのまま使う運用では、統合バイナリと UI build の修正が効く。`llama-batched-bench`、`llama-quantize`、`llama-perplexity` 相当の操作を release binary から呼ぶワークフローや、router mode で複数子プロセスを起動する構成は、更新後にコマンド名・subcommand・作業ディレクトリを含めて確認しておきたい。

## 参考リンク

- [llama.cpp release b9194](https://github.com/ggml-org/llama.cpp/releases/tag/b9194)
- [llama.cpp release b9200](https://github.com/ggml-org/llama.cpp/releases/tag/b9200)
- [llama.cpp release b9235](https://github.com/ggml-org/llama.cpp/releases/tag/b9235)
- [llama.cpp release b9265](https://github.com/ggml-org/llama.cpp/releases/tag/b9265)
- [llama.cpp release b9272](https://github.com/ggml-org/llama.cpp/releases/tag/b9272)
- [llama.cpp release b9286](https://github.com/ggml-org/llama.cpp/releases/tag/b9286)
- [llama.cpp release b9289](https://github.com/ggml-org/llama.cpp/releases/tag/b9289)
- [llama.cpp release b9290](https://github.com/ggml-org/llama.cpp/releases/tag/b9290)
- [llama.cpp release b9297](https://github.com/ggml-org/llama.cpp/releases/tag/b9297)
- [llama.cpp release b9305](https://github.com/ggml-org/llama.cpp/releases/tag/b9305)

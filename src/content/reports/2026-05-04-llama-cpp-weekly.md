---
title: "llama.cpp 週報 2026-05-04"
slug: llama-cpp-weekly-2026-05-04
pubDate: 2026-05-13T09:00:00+09:00
periodStart: 2026-05-04T00:00:00+09:00
periodEnd: 2026-05-10T23:59:59+09:00
topic: "llama.cpp"
sources:
  - title: "llama.cpp release b9045"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9045"
  - title: "llama.cpp release b9060"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9060"
  - title: "llama.cpp release b9077"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9077"
  - title: "llama.cpp release b9084"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9084"
  - title: "llama.cpp release b9085"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9085"
  - title: "llama.cpp release b9093"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9093"
  - title: "llama.cpp release b9094"
    url: "https://github.com/ggml-org/llama.cpp/releases/tag/b9094"
description: "2026-05-04 週の llama.cpp 更新まとめ。Granite Speech、SYCL/CUDA/Hexagon、Vertex AI 互換 API、モデル対応を中心に整理。"
draft: false
---

## 概要

2026-05-04 週の llama.cpp は、音声・マルチモーダル対応、アクセラレータ別の演算追加、サーバー API 互換性、モデルアーキテクチャ対応が並行して進んだ週だった。公式リリースは b9010 台から b9094 まで進み、週末時点では Granite/Llama 3、DeepSeek2/GLM 4.7 lite まわりのモデル種別チェック修正まで入っている。

特に大きい変更は、Granite Speech の `mtmd` 対応、SYCL の追加演算群、Vertex AI 互換 API、Hexagon の Gated Delta Net カーネル、MiMo-V2.5 向け FlashAttention、Sarvam-MoE 対応である。高速化だけでなく、音声入力、企業向け API 互換、MoE/新アーキテクチャの受け皿を広げる内容が目立った。

## 主な変更

- `mtmd` では Granite Speech (`ibm-granite/granite-4.0-1b-speech`) 対応が追加された。Conformer encoder、QFormer projector、log-mel spectrogram、GGUF 変換時の batch norm folding などが含まれ、30 秒/60 秒音声クリップで HF transformers 参照との token-for-token 一致が確認されたと説明されている。
- SYCL バックエンドでは、`FILL`、`CUMSUM`、`DIAG`、`SOLVE_TRI`、`SSM_SCAN`、`GATED_DELTA_NET` が追加された。Intel GPU/oneAPI 系で、SSM や Gated Delta Net を含むモデルの実行経路を広げる更新になっている。
- server には Vertex AI compatible API 対応が入った。`AIP_MODE` や `AIP_*` 環境変数を使う構成で、Vertex AI 互換の運用面に寄せやすくする変更で、テストと Windows build 修正も含まれる。
- Hexagon では `GGML_OP_GATED_DELTA_NET` の HTP カーネルが追加された。prompt processing と token generation の経路を分け、VTCM scratchpad や DMA を使うなど、Snapdragon/Hexagon 系で Gated Delta Net を実行しやすくする狙いが見える。
- MiMo-V2.5 向けには FlashAttention MMA/Tiles が追加され、`d_kq=192`、`d_v=128` の構成をカバーするようになった。GQA 処理や backend ops test も更新され、特殊な attention 形状への対応が進んだ。
- モデル対応では、Sarvam-MoE architecture support が追加され、Granite/Llama 3、DeepSeek2/GLM 4.7 lite の model type check 修正も入った。新しいモデル定義や派生モデルで、誤判定や読み込み失敗を減らす方向の変更である。
- 周辺では CUDA の snake activation fusion、SYCL の FlashAttention allocation overhead 削減や BF16 `GET_ROWS` 対応、OpenCL Adreno の MoE GEMM/デバッグ改善、Whisper audio tail truncation 修正なども進んだ。

## 影響

音声モデルを llama.cpp の `mtmd` 経路で試すユーザーにとって、Granite Speech 対応は重要な前進になる。GGUF 変換、音声前処理、encoder/projector 実装まで含むため、単なるモデル ID の追加ではなく、音声入力付きローカル推論の対象範囲が広がった。

Intel GPU、Qualcomm Hexagon、Adreno/OpenCL、CUDA を使う環境では、モデルごとの未対応演算や非標準 attention 形状が少しずつ埋まっている。特に SYCL の SSM/Gated Delta Net 系演算と Hexagon の HTP カーネルは、Mamba 系・DeltaNet 系を含む新しい構成をアクセラレータ上で動かすための基盤更新として見ておきたい。

サーバー運用では Vertex AI compatible API 対応により、既存の Google Cloud/Vertex AI 前提の周辺ツールと llama-server をつなぐ選択肢が増える。ただし互換 API、音声、MoE、特殊 attention はいずれも変更範囲が広いため、該当モデルやバックエンドを使っている環境では、更新後に短いロード・推論・API 応答確認を行うのがよい。

## 参考リンク

- [llama.cpp release b9045](https://github.com/ggml-org/llama.cpp/releases/tag/b9045)
- [llama.cpp release b9060](https://github.com/ggml-org/llama.cpp/releases/tag/b9060)
- [llama.cpp release b9077](https://github.com/ggml-org/llama.cpp/releases/tag/b9077)
- [llama.cpp release b9084](https://github.com/ggml-org/llama.cpp/releases/tag/b9084)
- [llama.cpp release b9085](https://github.com/ggml-org/llama.cpp/releases/tag/b9085)
- [llama.cpp release b9093](https://github.com/ggml-org/llama.cpp/releases/tag/b9093)
- [llama.cpp release b9094](https://github.com/ggml-org/llama.cpp/releases/tag/b9094)

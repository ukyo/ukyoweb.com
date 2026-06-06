---
title: "Pixel 3a / sargo LineageOS 導入作業ログ"
slug: pixel-3a-lineageos
pubDate: 2026-06-06T12:00:00+09:00
---

codex(ChatGPT)で相談しながら発掘したPixel 3aにLineageOSをインストールしてみた。
特に頭を使うことなくAIにしたがうだけで動作完了までできた。
これ系の作業はごくごくたまにしか発生しないので思考停止でできるのは脳の負荷が減っていいね。

ポイントとしてはわからないことは端末の状態そのままを写真を撮って都度相談すること。
ほぼすべてのことに応用できるのでこれは覚えておくと良い。

以下はcodexにまとめさせた作業ログにちょっと手を加えたものなので参考までに。

---


## 対象端末
- 機種: Google Pixel 3a
- LineageOSデバイス名: `sargo`
- モデル番号: `G020H`

## 目的
Pixel 3a に LineageOS を導入し、Google Play を使えるように GApps も追加する。

## 事前確認
- LineageOS公式対応モデルに `G020H` が含まれることを確認
- Google Playを使う予定があるため、GAppsも導入する方針に決定
- 消えて困るデータは特になし
- Googleアカウントを端末から削除済み

## Mac側の準備
[Google公式の SDK Platform-Tools](https://developer.android.com/tools/releases/platform-tools) を使用。

使用コマンド:

```bash
cd ~/Downloads/platform-tools
./adb version
./fastboot --version
```

## 端末側の準備
Pixel 3aで以下を有効化。

- 開発者向けオプション
- OEMロック解除
- USBデバッグ

## ブートローダー解除
MacからADB/Fastbootで実行。

```bash
./adb devices
./adb -d reboot bootloader
./fastboot devices
./fastboot flashing unlock
```

端末側で `Unlock the bootloader` を選択。  
この時点で端末は初期化された。

## Lineage Recovery導入
[LineageOS公式ページ](https://download.lineageos.org/devices/sargo/builds)から `boot.img` を取得し、fastbootで書き込み。

```bash
./fastboot flash boot ~/Downloads/boot.img
```

その後、端末のブートローダー画面から `Recovery Mode` を選択。

## データ初期化
Lineage Recoveryで以下を実行。

- `Factory reset`
- `Format data / factory reset`

ログ上では以下の表示を確認。

```text
Data wipe complete.
```

途中で以下のエラー表示が出たが、wipe完了済みのため致命的ではないと判断。

```text
ERROR: libnos_datagram: can't send GSA mbox command: Invalid argument
```

## LineageOS本体のインストール
使用ファイル:

```text
lineage-22.2-20260530-nightly-sargo-signed.zip
```

実行コマンド:

```bash
./adb -d sideload ~/Downloads/lineage-22.2-20260530-nightly-sargo-signed.zip
```

Mac側では以下の表示で終了。

```text
serving: ... (~47%)
adb: failed to read command: Undefined error: 0
```

ただし端末側で追加パッケージ導入のためRecovery再起動を求める画面が出たため、LineageOS本体のインストールは成功と判断。

## GApps導入
Google Playを使うため、LineageOS初回起動前に[GApps](https://github.com/MindTheGapps/15.0.0-arm64/releases)を導入。

使用ファイル:

```text
MindTheGapps-15.0.0-arm64-20250812_214357.zip
```

Lineage Recoveryを再起動後、再度:

- `Apply update`
- `Apply from ADB`

を選択。

実行コマンド:

```bash
./adb -d sideload ~/Downloads/MindTheGapps-15.0.0-arm64-20250812_214357.zip
```

Mac側では `~47%` 表示まで進行。  
端末側の完了表示を確認して成功と判断。

## 最終状態
- LineageOS 22.2 を Pixel 3a `sargo` に導入完了
- MindTheGapps 15.0.0 arm64 を導入完了
- 初回起動へ進める状態

## 最終確認
- [x] LineageOSが正常起動するか
- [x] Google Playストアが表示されるか
- [x] Wi-Fi接続
- [ ] SIM認識（今回はWi-Fi専用機なので不要）
- [ ] 通話（今回はWi-Fi専用機なので不要）
- [ ] SMS（今回はWi-Fi専用機なので不要）
- [ ] モバイルデータ通信（今回はWi-Fi専用機なので不要）
- [ ] APN設定（今回はWi-Fi専用機なので不要）
- [x] Googleアカウントログイン

## 付録: 参考リンク

### LineageOS公式
- [Pixel 3a / sargo - LineageOS Wiki](https://wiki.lineageos.org/devices/sargo/)
- [Install LineageOS on sargo](https://wiki.lineageos.org/devices/sargo/install/)
- [LineageOS sargo ダウンロード](https://download.lineageos.org/devices/sargo/builds)
- [LineageOS Google Apps 案内](https://wiki.lineageos.org/gapps/)

### GApps
- [MindTheGapps 15.0.0 arm64 Releases](https://github.com/MindTheGapps/15.0.0-arm64/releases)

### Mac / ADB / Fastboot
- [Android SDK Platform-Tools 公式ダウンロード](https://developer.android.com/tools/releases/platform-tools)
- [Android Debug Bridge / adb 公式ドキュメント](https://developer.android.com/tools/adb)

### Google / Android関連
- [Google Pixel ヘルプ](https://support.google.com/pixelphone/)
- [Android ヘルプ](https://support.google.com/android/)

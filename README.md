# Card Studio

Card Studio は、社内利用向けの無料名刺作成Webアプリです。

ブラウザ上で名刺を編集し、PNG / SVG / PDF を即ダウンロードできます。サーバー側に画像・PDF・編集データを保存しません。

## 方針

```txt
GitHub
↓
社内PCにclone
↓
Node.js / Express起動
↓
ブラウザで編集
↓
PNG / SVG / PDFを即ダウンロード
↓
サーバー保存なし
```

## 主な機能

- 名刺キャンバス表示
- 表面 / 裏面切り替え
- 白紙テンプレート
- シンプルテンプレート
- テキスト追加
- 画像追加
- 図形追加
- QRコード追加
- 背景色変更
- フォント変更
- 文字サイズ変更
- 文字色変更
- 太字 / 斜体 / 下線
- ドラッグ移動
- 拡大縮小
- 回転
- スナップ
- グリッド表示
- 整列
- レイヤー順変更
- 複製
- 削除
- Undo / Redo
- ブラウザ保存 localStorage
- JSONエクスポート / インポート
- PNG即ダウンロード
- SVG即ダウンロード
- PDF即ダウンロード

## 使っている技術

- Node.js
- Express
- HTML
- CSS
- JavaScript
- Bootstrap 5.3
- Fabric.js
- qrcode-generator
- pdf-lib

## 使わないもの

このMVPでは以下を使いません。

- Firebase
- MongoDB
- Cloudinary
- AWS S3
- Google Apps Script
- 外部DB
- サーバー保存用フォルダ

## 必要環境

- Node.js 18 以上
- Chrome 推奨
- Git

## セットアップ

```bash
git clone https://github.com/officialwork-design/Card-Studio.git
cd Card-Studio
npm install
npm start
```

ブラウザで開きます。

```txt
http://localhost:3000
```

## 社内LANで使う場合

起動しているPCのIPアドレスを確認します。

macOS例:

```bash
ipconfig getifaddr en0
```

同じネットワーク内のPCまたはスマホから以下でアクセスします。

```txt
http://社内PCのIPアドレス:3000
```

例:

```txt
http://192.168.1.20:3000
```

## 操作方法

### 基本操作

1. 左パネルからテンプレート、テキスト、画像、図形、QRコードを追加します。
2. 中央のキャンバスでドラッグ移動、拡大縮小、回転を行います。
3. 右パネルでフォント、色、サイズ、透明度、整列、レイヤー順を編集します。
4. 表面 / 裏面を切り替えて両面を作成します。
5. PNG / SVG / PDF でダウンロードします。

### ショートカット

| 操作 | キー |
|---|---|
| ブラウザ保存 | Cmd / Ctrl + S |
| 戻す | Cmd / Ctrl + Z |
| 進む | Cmd / Ctrl + Y |
| 複製 | Cmd / Ctrl + D |
| 削除 | Delete / Backspace |

## 保存仕様

### ブラウザ保存

`localStorage` に保存します。サーバーには保存しません。

### JSON保存

編集データをJSONファイルとしてダウンロードします。別PCで再編集したい場合は、このJSONを読み込んでください。

### 画像保存

画像はブラウザ内で読み込みます。サーバーの `uploads` フォルダには保存しません。

### PDF生成

PDF生成時のみ、ブラウザからPNGデータをExpressへ送信します。ExpressはPDFを生成してレスポンスとして返します。PDFファイルはサーバーに保存しません。

## 出力仕様

| 形式 | 用途 | 備考 |
|---|---|---|
| PNG | 確認用 / 共有用 | 即ダウンロード |
| SVG | Illustrator編集用 | テキスト・図形の編集可能性あり |
| PDF | 印刷確認用 | 表面・裏面を2ページで出力 |
| JSON | 再編集用 | Card Studio専用データ |

## PSD / AIについて

MVPではPSD / AIのネイティブ出力は実装していません。

社内利用では、まず以下の運用を採用します。

```txt
SVG または PDF を出力
↓
Illustratorで開く
↓
必要に応じて .ai 保存
```

PSDが必要な場合は、PNG / PDF / SVGをPhotoshopで開いて編集します。

完全なPSD / AIレイヤー出力は将来対応とします。

## 動作確認手順

1. `npm start` を実行する。
2. `http://localhost:3000` を開く。
3. テキスト追加を押す。
4. テキストを移動、拡大縮小、回転する。
5. 右パネルでフォント、色、サイズを変更する。
6. 画像を追加する。
7. 表面 / 裏面を切り替える。
8. ブラウザ保存を押す。
9. ページを再読み込みして保存状態を確認する。
10. JSON保存、JSON読込を確認する。
11. PNG、SVG、PDFをダウンロードする。

## トラブルシュート

### `npm start` が動かない

Node.js のバージョンを確認してください。

```bash
node -v
```

18未満の場合は、Node.js 18以上へ更新してください。

### PDFが出力できない

サーバーが起動しているか確認してください。

```txt
http://localhost:3000/api/health
```

以下が返れば正常です。

```json
{
  "ok": true,
  "service": "Card Studio",
  "storage": "none"
}
```

### 画像が読み込めない

対応形式は以下です。

- PNG
- JPG / JPEG
- WEBP
- SVG

画像サイズは8MB以下にしてください。

### 別PCで開くと保存データがない

ブラウザ保存はPCごとのlocalStorageです。別PCで再編集する場合はJSON保存とJSON読込を使ってください。

## 今後の追加候補

- テンプレート追加
- アイコンライブラリ
- レイヤー一覧パネル
- ガイド線
- 塗り足し表示
- トンボ表示
- PDFベクター出力強化
- フォント管理
- 社内テンプレートプリセット
- ロゴプリセット
- 名刺以外のショップカード対応

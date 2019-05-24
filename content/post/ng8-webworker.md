---
title: "Angular8でWebWorker"
date: 2019-05-24T19:06:23+09:00
---

Angular8のCLIのgenerateコマンドからWebWorkerを作成することができるようになりました。
`ng generate webWorker` で、Workerのコードとビルド用の設定を吐き出してくれます。

```
$ ng new worker-app 
...
$ cd worker-app
$ ng g webWorker hello
CREATE tsconfig.worker.json (212 bytes)
CREATE src/app/hello.worker.ts (157 bytes)
UPDATE tsconfig.app.json (236 bytes)
UPDATE angular.json (3614 bytes)
```

生成されたコードの中身は次のようになります。

```typescript
/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  postMessage(response);
});
```

これをAppComponentから使ってみます。

```
import { Component, OnInit } from "@angular/core";
const worker = new Worker("./hello.worker", { type: "module" });

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "";

  ngOnInit() {
    worker.onmessage = res => {
      this.title = res.data;
    };
    worker.postMessage("hello");
  }
}
```

Worker作成時に`{ type: "module" }`を設定することだけ注意が必要ですが、それだけです。
ビルドはCLI側でよしなにやってくれるので快適なWorker生活が実現できそうです。
# NestJS 프로젝트 연결 팁

- TypeORM이나 Prisma 같은 데이터베이스(DB) 연결 구조가 포함되어 있다면, 앱이 켜지는 도중(DB 연결 세션 수립 중)에 트래픽이 유입되어 간헐적으로 요청이 터지거나 부팅이 늦어지는 문제가 생길 수 있다.
- 이를 방지하기 위해, NestJS가 DB 연결을 완벽히 마친 뒤 pm2에게 "나 이제 준비됐으니 손님(트래픽) 보내줘!"라고 신호를 보내는 Zero-Downtime(무중단 배포) 연동 코드를 적용하시는 것이 좋다.

---

## 1단계: NestJS main.ts 파일 수정하기

각 NestJS 프로젝트의 **src/main.ts** 파일을 열고, **app.listen()**이 성공적으로 완료된 직후 **process.send('ready')** 코드를 추가해 준다.

```js
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  // [pm2 무중단 핵심] DB 연결 및 앱 부팅이 완료되면 pm2에게 신호를 보낸다.
  if (process.send) {
    process.send("ready");
    console.log(`Application is running on: ${port} (Sent ready signal to pm2)`);
  }
}
bootstrap();
```

> 코드를 수정했다면 반드시 각 폴더에서 **npm run build** 를 다시 실행 해 주어야 한다.

## 2단계: **ecosystem.config.js** 에 대기 옵션 추가하기

이제 pm2 설정 파일에 **wait_ready** 와 **listen_timeout** 옵션을 명시해 줍니다. (이전 답변 코드에 이미 포함되어 있지만, 한 번 더 확인해 보자!!)

```js
module.exports = {
  apps: [
    {
      name: "nest-app-lotto",
      cwd: "C:\\projects\\nest-lotto",
      script: "dist/main.js",
      instances: "max",
      exec_mode: "cluster",

      // DB 연결 대기를 위한 핵심 옵션
      wait_ready: true, // 'ready' 신호가 올 때까지 트래픽 투입을 대기.
      listen_timeout: 10000, // DB 상태가 느려도 최대 10초까지는 'ready' 신호를 기다리기.
      kill_timeout: 5000, // 기존 앱을 종료할 때 안전한 연결 정리를 위해 5초의 유예를 주기.

      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
```

---

## 3단계: pm2 다시 반영하고 확인하기

수정된 설정을 적용하기 위해 pm2를 리로드(Reload)하고 저장한다

```shell
# 관리자 권한 터미널에서 실행
# 1. 무중단으로 새 설정을 반영한다 (릴로드)
pm2 reload ecosystem.config.js
```

```shell
# 2. 현재 상태를 부팅 리스트에 저장합니다
pm2 save
```

## 실행 후 DB 에러가 날 때 확인 방법

- 만약 pm2를 시작했는데 DB 연결 오류(예: Can't reach database server, Connection timeout) 등이 발생한다면, 프로덕션 환경변수(.env)를 점검한다.

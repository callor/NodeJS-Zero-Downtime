# NestJS 프로젝트 등록하기

- **NestJS** 프로젝트 역시 여러 개를 분산된 임의의 폴더에서 관리할 때 **ecosystem.config.js** 를 사용하면 매우 편리하다.
- **NestJS** 는 **Next.js** 와 달리 빌드 시 일반 순수 자바스크립트 파일(**dist/main.js**)이 생성되므로, pm2의 핵심 기능인 클러스터 모드(**cluster**)를 복잡한 우회 없이 완벽하게 지원한다.
- 멀티 프로젝트 환경을 위한 NestJS 전용 **ecosystem.config.js** 설정법을 알아보자.

---

## 1단계: 프로젝트 빌드 (필수)

pm2로 구동하기 전, 각 NestJS 프로젝트 폴더에서 먼저 프로덕션 빌드를 완료해야 한다. (dist 폴더 생성)

```shell
# 각 NestJS 프로젝트 폴더에서 실행
npm run build
```

## 2단계: NestJS용 **ecosystem.config.js** 작성하기

중앙 관리 폴더에 설정 파일을 만들고 아래와 같이 구성합니다. script 경로를 빌드 결과물인 dist/main.js로 지정하는 것이 핵심입니다.

```js
module.exports = {
  apps: [
    {
      name: "nest-app-lotto",
      cwd: "C:\\projects\\nest-lotto", // 1번 NestJS 프로젝트 절대 경로
      script: "dist/main.js", // 빌드된 진입점 파일 (cwd 기준 상대 경로)
      instances: "max", // CPU 코어 수만큼 프로세스 실행 (무중단)
      exec_mode: "cluster", // 클러스터 모드 활성화
      wait_ready: true, // 앱이 준비되었을 때 신호를 보낼지 여부
      listen_timeout: 5000,
      env: {
        NODE_ENV: "production",
        PORT: 4000, // 1번 앱 포트 번호
      },
    },
    {
      name: "nest-app-api",
      cwd: "D:\\anywhere\\nest-api", // 2번 NestJS 프로젝트 절대 경로
      script: "dist/main.js",
      instances: 2, // 특정 개수의 코어만 할당할 때 (예: 2개)
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 4001, // 2번 앱 포트 번호 (중복 금지)
      },
    },
  ],
};
```

---

## 3단계: pm2 실행 및 저장

관리자 권한 터미널을 열고 설정 파일이 있는 경로로 이동하여 서비스를 가동합니다.

# 1. 기존에 잘못 등록된 nest 프로세스가 있다면 먼저 삭제

```shell
pm2 delete all
```

# 2. 설정 파일 실행

```shell
pm2 start ecosystem.config.js
```

# 3. 윈도우 재부팅 시 자동 실행을 위해 저장

```shell
pm2 save
```

---

## NestJS + pm2 유용한 팁

- **NestJS** 는 내부 부팅 및 데이터베이스 연결 등으로 인해 실제 요청을 받을 준비가 되기까지 수 초의 시간이 걸릴 수 있다.
- 만약 완벽한 Zero-Downtime(무중단 배포)을 구현하고 싶다면, NestJS 내부 main.ts 최신 코드에 **process.send('ready')** 구문을 추가하여 pm2와 연동할 수 있다.

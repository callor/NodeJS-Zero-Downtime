# pm2 에 nodeJS 프로젝트 등록하기

Next.js 프로젝트는 빌드(next build) 과정이 필요하기 때문에, PM2에 등록할 때 **npm run start** 명령어를 연동하거나 **ecosystem.config.js** 설정 파일을 사용하는 것이 가장 안전하고 깔끔하다.
Next.js 프로젝트를 pm2에 등록하는 2가지 방법을 살펴보자.

---

## 1단계: 프로젝트 빌드 (공통 필수)

pm2 서비스를 켜기 전에 먼저 Next.js 프로젝트를 최신 상태로 빌드해야 합니다. 프로젝트 폴더에서 아래 명령어를 실행한다.

```shell
npm run build
```

---

## 2단계: PM2에 등록하기 (방법 선택)## 방법 A: 한 줄 명령어로 간단하게 등록하기

가장 직관적인 방법입니다. **npm run start** 명령어를 pm2 프로세스로 등록한다.

```shell
pm2 start npm --name "my-next-app" -- run start
```

- **--name "my-next-app"** : PM2 list에 표시될 프로세스 이름이다. 원하는 이름으로 변경한다.
- **-- run start** : **npm run start**를 실행하겠다는 의미이다. **(하이픈 -- 필수)**

## 방법 B: 설정 파일(ecosystem.config.js)로 우아하게 등록하기 (추천)

프로젝트 루트 폴더에 ecosystem.config.js 파일을 만들고 아래 내용을 붙여넣으면 환경 변수 관리나 클러스터 모드 설정이 훨씬 편리하다

```js
module.exports = {
  apps: [
    {
      name: "my-next-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max", // CPU 코어 수만큼 프로세스를 늘려 무중단 서비스를 구축 ('max' 또는 숫자) 단,nginx proxy 사용중에는 설정 금지!!
      exec_mode: "cluster", // instances가 2 이상이거나 max일 때 필수 설정 (클러스터 모드)
      env: {
        NODE_ENV: "production",
        PORT: 3000, // 원하는 포트 번호 지정
      },
    },
  ],
};
```

설정 파일을 만든 후, 터미널에서 다음 명령어로 실행한다.

```shell
pm2 start ecosystem.config.js
```

---

## 3단계: 컴퓨터 재부팅 시 자동 실행 저장

- **pm2-windows-service** 가 동작하고 있다면, 현재 켠 **Next.js** 프로세스 상태를 반드시 저장해 주어야 컴퓨터가 껐다 켜져도 자동으로 실행된다.

```shell
pm2 save
```

---

## 등록 후 확인 명령어

- 실행 확인: **pm2 list** 를 입력하여 상태(status)가 online인지 확인한다.
- 로그 확인: 만약 서버가 켜지지 않거나 에러가 난다면 **pm2 logs** 를 입력해 Next.js의 에러 콘솔을 확인할 수 있다.

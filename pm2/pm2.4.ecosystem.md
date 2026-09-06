# ecosystem 사용하기

- 여러 개의 프로젝트가 각각 임의의 폴더(서로 다른 경로)에 흩어져 있을 때는 중앙 관리용 **ecosystem.config.js** 파일을 하나 만들어서 관리하는 것이 가장 깔끔하다.
- pm2 설정 파일 안에서 각 프로젝트의 절대 경로(cwd)를 지정해 주면, 어느 폴더에서 pm2를 실행하든 모든 프로젝트를 한 번에 제어할 수 있다.

---

## 1단계: 모든 프로젝트 먼저 빌드하기

pm2에 등록하기 전에, 임의의 폴더들에 있는 Next.js 프로젝트들을 각각의 폴더로 이동하여 미리 빌드해 두어야 합니다.

```shell
# 각 프로젝트 폴더로 이동 후 실행
npm run build
```

## 2단계: 중앙 관리용 ecosystem.config.js 작성하기

- 원하는 아무 폴더(예: **C:\pm2-config**)에 **ecosystem.config.js** 파일을 만들고, 아래와 같이 cwd 속성에 각 프로젝트의 절대 경로를 적어준다.
- 포트(PORT)가 겹치지 않게 설정하는 것이 핵심이다.

```js
module.exports = {
  apps: [
    {
      name: "next-project-A",
      cwd: "C:\\Users\\USER-NAME\\Desktop\\project-a", // A 프로젝트의 실제 절대 경로
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000, // A 프로젝트 포트
      },
    },
    {
      name: "next-project-B",
      cwd: "D:\\anywhere\\folder\\project-b", // B 프로젝트의 실제 절대 경로 (다른 드라이브도 가능)
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3001, // B 프로젝트 포트 (중복 금지)
      },
    },
  ],
};
```

주의: 윈도우 경로를 적을 때는 백슬래시를 **두 번(\\)**씩 쓰거나 **슬래시(/)**로 작성해야 경로 오류가 나지 않는다.

---

## 3단계: 중앙 설정 파일로 pm2 실행 및 저장

관리자 권한 터미널을 열고, 방금 만든 설정 파일이 있는 폴더로 이동하여 실행합니다.

# 1. 설정 파일이 있는 곳으로 이동 (예시)

```sehll
cd C:\pm2-config
```

# 2. 전체 프로젝트 한 번에 실행

```shell
pm2 start ecosystem.config.js
```

# 3. 윈도우 재부팅 시 자동 실행되도록 상태 저장 (필수)

```shell
pm2 save
```

---

## 다중 프로젝트 관리 팁

이렇게 등록해 두면 프로젝트 폴더가 어디에 있든 상관없이 아래 명령어로 개별 제어가 가능하다.

- 전체 상태 확인: pm2 list (등록된 A, B 프로젝트가 한눈에 보임)
- 특정 프로젝트만 재시작: pm2 restart next-project-A
- 특정 프로젝트 로그만 보기: pm2 logs next-project-B

- 만약 새 프로젝트를 추가하고 싶다면 **ecosystem.config.js** 파일에 배열 항목을 하나 더 추가한 뒤, **pm2 start ecosystem.config.js --update-env** 명령어를 입력하고 다시 **pm2 save** 를 해준다

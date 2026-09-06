# windows 에서 **pm2** system 사용하기

- pm2는 Node.js 애플리케이션을 무중단으로 관리하고, 서버가 죽었을 때 자동으로 재시작해 주는 강력한 프로세스 매니저이다.
- 윈도우에서 **npm run start** 나 일반 **Node.js** 앱을 PM2를 사용해 배경(Background)에서 실행하고 윈도우 서비스로 등록하는 방법을 알아보자.

---

## 1. PM2 및 윈도우 서비스 등록 도구 설치

명령 프롬프트(CMD) 또는 "PowerShell"을 관리자 권한으로 실행한 후, PM2와 윈도우 부팅 시 자동 실행을 도와줄 패키지를 글로벌(-g)로 설치한다.

# PM2 설치

```shell
npm install pm2 -g
```

# 윈도우 서비스 등록용 패키지 설치

```shell
npm install pm2-windows-service -g
```

## 2. PM2를 윈도우 서비스로 등록 (최초 1회)

컴퓨터가 켜질 때 pm2 자체가 자동으로 실행되도록 윈도우 서비스에 등록한다
(주의: 반드시 관리자 권한으로 cmd 를 실행 후 명령을 실행한다.)

```shell
pm2-service-install
```

- 명령어를 치면 몇 가지 질문이 나온다
- **Perform environment setup?** 문구가 나오면 Y를 입력한다.
- 나머지 질문(경로 설정 등)은 그냥 엔터(Enter)를 눌러 기본값으로 넘어가면 된다.

## 3. pm2로 **Node.js** 앱 실행하기

프로젝트 폴더로 이동한 뒤, 상황에 맞춰 아래 명령어 중 하나를 선택해 실행한다.

- 방법 A: **npm run start** 스크립트를 그대로 실행할 때

```shell
pm2 start npm --name "내앱이름" -- run start
```

- 방법 B: 특정 JS 파일(예: app.js)을 직접 실행할 때 (권장)

```shell
pm2 start app.js --name "내앱이름"
```

## 4. 현재 상태 저장하기 (가장 중요)

서버가 재부팅되었을 때 PM2가 방금 실행한 프로세스들을 기억하고 자동으로 다시 켜도록 현재 리스트를 저장해야 한다

```shell
pm2 save
```

---

## 자주 쓰는 PM2 필수 명령어

- 상태 확인: pm2 list (실행 중인 앱 목록과 CPU/메모리 사용량 확인)
- 로그 확인: pm2 logs (실시간 콘솔 에러 및 로그 확인)
- 서버 중지: pm2 stop 내앱이름
- 서버 재시작: pm2 restart 내앱이름
- 목록에서 삭제: pm2 delete 내앱이름

---

# pm2 서비스 시작 시 권한 오류 발생

```shell
connect EPERM \\.\pipe\rpc.sock
[pm2] Spawning pm2 daemon with pm2_home=C:\Users\USER-NAME\.pm2
node:events:496
      throw er; // Unhandled 'error' event
      ^

Error: connect EPERM \\.\pipe\rpc.sock
    at PipeConnectWrap.afterConnect [as oncomplete] (node:net:1636:16)
Emitted 'error' event on ReqSocket instance at:
    at Socket.<anonymous> (C:\Users\USER-NAME\AppData\Roaming\npm\node_modules\pm2\modules\pm2-axon\lib\sockets\sock.js:216:49)
    at Socket.emit (node:events:518:28)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'connect',
  address: '\\\\.\\pipe\\rpc.sock'
}

Node.js v22.16.0
```

## 오류의 이유

pm2 백그라운드 프로세스(데몬)가 시스템 파이프에 접근할 때 권한이 없거나, 기존에 다른 권한(일반 사용자/관리자)으로 꼬인 프로세스가 남아있을 때 발생한다.
Node.js v22 환경과 윈도우에서 자주 발생하는 권한 문제이다. 이 문제를 해결하는 가장 확실한 3단계 방법이 있다.

---

## 1단계: 모든 pm2 및 Node 프로세스 강제 종료

가장 먼저 권한이 꼬여 있는 백그라운드 프로세스들을 완전히 종료해야 한다.

1.  명령 프롬프트(CMD) 또는 PowerShell을 반드시 관리자 권한으로 실행한다.
2.  아래 명령어를 실행하여 남아있는 Node 및 pm2 프로세스를 강제로 완전히 Kill 한다.

```shell
taskkill /f /im node.exe
```

## 2단계: pm2 임시 파일(덤프 및 파이프) 삭제

기존에 생성되었던 소켓 파이프 파일이나 설정에 잠금이 걸려있을 수 있으므로, pm2 홈 디렉토리 내부를 정리한다.

1.  키보드의 **Win + R** 을 누르고 **%USERPROFILE%\.pm2** 를 입력 후 엔터를 쳐서 폴더로 이동한다. (또는 C:\Users\USER-NAME\.pm2 경로로 직접 이동)
2.  폴더 내부에 있는 **pm2.log**, **pm2.pid**, **rpc.sock**, **pub.sock** 등의 파일이 있다면 모두 삭제한다. (폴더 전체를 지워도 pm2가 실행될 때 자동으로 다시 생성된다.)

## 3단계: 관리자 권한 터미널에서 pm2 다시 실행

이제 깨끗해진 상태에서 다시 pm2를 구동한다. (반드시 관리자 권한 터미널 유지)

1.  Next.js 프로젝트 폴더로 이동한다.
2.  아래 명령어를 통해 pm2를 다시 구동한다.

### **ecosystem.config.js** 를 사용하는 경우

```shell
pm2 start ecosystem.config.js
```

### 한 줄 명령어를 사용하는 경우

```shell
pm2 start npm --name "my-next-app" -- run start
```

3.  정상적으로 실행된다면 목록을 다시 저장한다.

```shell
pm2 save
```

---

## 그래도 안 된다면? (Node v22 호환성 체크)

- 만약 위 방법으로도 동일한 EPERM 에러가 반복된다면, 현재 설치된 pm2 패키지가 낡았거나 Node.js v22의 최신 내부 엔진(V8/네트워크)과 마찰을 빚는 상태일 수 있다.
- 글로벌 pm2를 최신 버전으로 업데이트해 준다

```shell
# 관리자 권한 터미널에서 실행

npm install pm2@latest -g
pm2 update
```

이 단계를 거치면 대부분 rpc.sock 권한 에러가 해결된다.

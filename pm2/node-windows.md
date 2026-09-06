# pm2 service

```
npm run start 명령어로 실행되는 Node.js 앱을 윈도우 서비스(Windows Service)로 등록하려면
node-windows 라이브러리를 사용하거나 PM2 프로세스 매니저를 사용하는 것이 가장 편리합니다.
여기서는 가장 보편적인 node-windows 모듈을 이용해 서비스로 등록하는 방법을 안내해 드립니다.
```

## 1. node-windows 설치하기

프로젝트 폴더에서 관리자 권한으로 터미널을 열고 node-windows 패키지를 설치합니다.

```bash
npm install node-windows --save
```

## 2. 서비스 등록 스크립트 작성하기

프로젝트 루트 폴더에 service.js (또는 원하는 이름) 파일을 만들고 아래 코드를 입력합니다. script 경로에는 npm run start가 실행하는 실제 진입점(예: index.js 또는 app.js)의 절대 경로를 적어주어야 합니다.

```js
var Service = require('node-windows').Service;
// 서비스 구성 정보 입력var svc = new Service({
name: 'MyNodeApp', // 윈도우에 표시될 서비스 이름
description: 'Node.js Express Server',
script: 'C:\\path\\to\\your\\project\\index.js' // 실행할 JS 파일의 절대 경로
});
// 서비스 설치 이벤트 리스너
svc.on('install', function(){
svc.start();
console.log('서비스 등록 및 실행 완료!');
});

svc.install();
```

## 3. 스크립트 실행하여 윈도우 서비스 등록하기

명령 프롬프트(CMD)나 PowerShell을 관리자 권한으로 실행한 뒤, 작성한 파일을 노드로 실행합니다.

```shell
node service.js
```

## 4. 서비스 확인 및 관리

- 윈도우 검색창에 '서비스(Services)'를 검색하여 실행합니다.
- 지정한 이름(MyNodeApp)의 서비스가 정상적으로 등록되었는지 확인하고, 시작 유형을 '자동(Automatic)'으로 설정하면 컴퓨터가 켜질 때 자동으로 서버가 실행됩니다.

만약 node-windows 대신 PM2를 사용해 등록하고 싶거나, 특정 npm run start 내부 스크립트(예: 빌드나 환경 변수 포함)를 그대로 연동하는 방법이 필요하신가요?

[1] [https://www.youtube.com](https://www.youtube.com/watch?v=q_vH3H2_wWI&t=439)
[2] [https://yunzema.tistory.com](https://yunzema.tistory.com/50)
[3] [https://blog.naver.com](https://blog.naver.com/jungsangun/221935146625)

---

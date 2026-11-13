# 개발 PC(.170) PM2 설정

여섯 Next.js 앱을 PM2로 실행합니다. 앱이 시작하거나 재시작할 때마다 `npm run build` 후 `npm run start`를 합니다. cqmethod는 `start` 안에 `next build`가 있어서 `npm run start`만 합니다.

| 파일                          | 내용                                                                 |
| ----------------------------- | -------------------------------------------------------------------- |
| `callor.ecosystem.config.cjs` | 앱 목록                                                              |
| `npm-run.cjs`                 | npm 스크립트를 차례로 실행합니다. 콘솔 창이 뜨지 않게 숨겨서 실행합니다 |

| 앱       | 폴더                                                     | 주소                  |
| -------- | -------------------------------------------------------- | --------------------- |
| cqmethod | `Dissertations/NextJS-CallorQ-v1.2`                      | :12300                |
| word     | `Callor-Project/Callor-Word-Master/Callor-Word-Master-v1` | :12330                |
| erp      | `Callor-Project/Callor-ERP-2026/order-management`        | :12350                |
| cms      | `Callor-Project/Callor-CMS-2026/CMS-2026`                | :13000                |
| charnel  | `Callor-Project/Callor-Charnel/Charnel-2027`             | 192.168.0.170:15000   |
| subtitle | `Callor-Project/Callor-Subtitle/callor-subtitle-studio`  | :12320                |

포트는 각 프로젝트 `package.json`의 `start`에 있고, subtitle만 설정에서 `PORT`를 넘깁니다.

## 실행

관리자 PowerShell에서 이 폴더로 이동해 실행합니다(기존 PM2를 띄운 권한과 같아야 합니다).

```powershell
cd C:\Users\callor\Documents\workspace\Callor-Project\NodeJS-Zero-Downtime\Pm2.170.EcoSystem
```

처음 등록하거나 이 설정을 바꾼 뒤에는 앱을 지우고 다시 등록합니다. `pm2 restart`는 등록할 때의 실행 파일을 그대로 씁니다.

```powershell
pm2 delete callor.ecosystem.config.cjs
pm2 start callor.ecosystem.config.cjs
pm2 save
```

평소에는 아래 명령만 씁니다.

```powershell
pm2 restart cms     # 코드를 고친 뒤: 서버를 끄고 빌드한 뒤 다시 시작
pm2 logs cms
pm2 list
```

## 주의

- 빌드하는 동안(약 1분) 그 앱은 열리지 않습니다. PM2는 빌드 중에도 online으로 보이므로 로그로 확인합니다.
- 빌드가 실패하면 서버가 뜨지 않습니다. 3분 안에 끝나는 실행이 3번 이어지면 PM2가 더 띄우지 않습니다(errored). 로그를 보고 고친 뒤 `pm2 restart`를 실행합니다.
- DB 구조가 바뀐 버전은 재시작 전에 그 프로젝트에서 마이그레이션을 먼저 실행합니다. 예: CMS는 `npm run db:deploy`.
- 실행 중인 앱의 폴더에서 따로 `npm run build`를 하지 않습니다. 돌고 있는 서버의 `.next`를 덮어씁니다. `pm2 restart`가 서버를 끈 뒤 빌드합니다.
- 개발 서버라서 부팅 때 PM2를 자동으로 띄우지 않습니다. 재부팅하면 관리자 PowerShell에서 `pm2 resurrect`로 `pm2 save`해 둔 목록을 다시 띄웁니다. 저장한 적이 없으면 이 폴더에서 `pm2 start callor.ecosystem.config.cjs`를 실행합니다.

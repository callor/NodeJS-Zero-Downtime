// .170 개발 PC의 PM2 설정. 여섯 Next.js 앱이 시작·재시작할 때마다 npm run build 후 npm run start를 합니다.
// 이 폴더에서 실행합니다. 사용법은 REAME.md에 있습니다.
//   전체 시작  pm2 start callor.ecosystem.config.cjs
//   하나 재시작 pm2 restart cms     (서버를 끄고 빌드한 뒤 다시 시작)
//   로그       pm2 logs cms
const WORKSPACE = "C:/Users/callor/Documents/workspace";

// scripts: 차례로 실행할 npm 스크립트. 포트는 각 프로젝트 package.json의 start에 있습니다.
const nextApp = (name, folder, scripts = ["build", "start"], env = {}) => ({
  name,
  cwd: `${WORKSPACE}/${folder}`,
  script: `${__dirname}/npm-run.cjs`,
  args: scripts,
  env: { NODE_ENV: "production", ...env },
  // 빌드가 실패하면 서버가 뜨지 않습니다. 3분 안에 끝나는 실행이 3번 이어지면 다시 띄우지 않습니다.
  min_uptime: "3m",
  max_restarts: 3,
  restart_delay: 10000,
  log_date_format: "YYYY-MM-DD HH:mm:ss",
});

module.exports = {
  apps: [
    nextApp("cqmethod", "Dissertations/NextJS-CallorQ-v1.2", ["start"]), // start 안에 next build가 있습니다.
    nextApp("word", "Callor-Project/Callor-Word-Master/Callor-Word-Master-v1"),
    nextApp("erp", "Callor-Project/Callor-ERP-2026/order-management"),
    nextApp("cms", "Callor-Project/Callor-CMS-2026/CMS-2026"),
    nextApp("charnel", "Callor-Project/Callor-Charnel/Charnel-2027"),
    nextApp("subtitle", "Callor-Project/Callor-Subtitle/callor-subtitle-studio", ["build", "start"], { PORT: 12320 }),
  ],
};

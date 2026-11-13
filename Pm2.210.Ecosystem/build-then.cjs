// PM2용 실행 스크립트. 프로젝트 폴더(cwd)에서 npm run build를 한 뒤 다음 중 하나를 합니다.
//   args: ["run", "<서버 파일>", ...인자]  → 그 파일을 node로 실행합니다(fork 앱). 서버가 끝나면 같은 종료 코드로 끝납니다.
//   args: ["reload", "<PM2 앱 이름>"]      → 그 앱을 pm2 reload로 무중단 재시작합니다(클러스터 앱).
// 빌드가 실패하면 run은 서버를 띄우지 않고, reload는 돌고 있는 서버를 그대로 둡니다.
// PM2는 Windows에서 앱을 콘솔 없이 실행하므로, npm과 pm2를 숨긴 창으로 띄워야 콘솔 창이 새로 뜨지 않습니다.
"use strict";
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

// 터미널과 같은 npm, pm2를 씁니다. 전역으로 설치한 것을 먼저 찾고, 없으면 Node.js 옆에서 찾습니다.
const findCli = (...parts) =>
  [process.env.APPDATA && path.join(process.env.APPDATA, "npm", "node_modules", ...parts), path.join(path.dirname(process.execPath), "node_modules", ...parts)].find(
    (file) => file && fs.existsSync(file),
  );
const node = (args) => [process.execPath, args, { stdio: "inherit", windowsHide: true }];

const [mode, target, ...rest] = process.argv.slice(2);
const npm = findCli("npm", "bin", "npm-cli.js");
if (!npm || !["run", "reload"].includes(mode) || !target) {
  console.error(npm ? "args 예: [\"run\", \"dist/main.js\"] 또는 [\"reload\", \"PM2 앱 이름\"]" : "npm을 찾지 못했습니다.");
  process.exit(1);
}

const build = spawnSync(...node([npm, "run", "build"]));
if (build.status !== 0) {
  console.error(mode === "run" ? "빌드 실패: 서버를 시작하지 않습니다." : "빌드 실패: 돌고 있는 서버를 그대로 둡니다.");
  process.exit(build.status ?? 1);
}

if (mode === "run") {
  spawn(...node([target, ...rest]))
    .on("error", () => process.exit(1))
    .on("exit", (code) => process.exit(code ?? 1));
} else {
  const pm2 = findCli("pm2", "bin", "pm2");
  if (!pm2) {
    console.error("pm2를 찾지 못했습니다. 빌드는 끝났으니 pm2 reload를 직접 실행하세요.");
    process.exit(1);
  }
  process.exit(spawnSync(...node([pm2, "reload", target])).status ?? 1);
}
